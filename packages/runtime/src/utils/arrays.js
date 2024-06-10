import { makeCountMap, mapsDiff } from './maps'

/**
 * If the given value is an array, it returns it. Otherwise, it returns an array
 * containing the given value.
 *
 * @param {any|any[]} maybeArray something that might be an array
 * @returns {any[]} an array
 */
export function toArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray]
}

/**
 * It filters out the nulls and undefined values from the given array.
 *
 * @param {any[]} arr the array to filter
 * @returns {any[]} the array without nulls and undefined values
 */
export function withoutNulls(arr) {
  return arr.filter((item) => item != null)
}

/**
 * Given two arrays, it returns the items that have been added to the new array
 * and the items that have been removed from the old array.
 *
 * NOTE TO READERS: your implementation of this function if you followed along
 * with the book's chapter 7 listing is different from what's here. The version
 * I wrote in the book has a bug, as it doesn't deal with duplicated items.
 *
 * @see https://github.com/angelsolaorbaiceta/fe-fwk-book/wiki/Errata#bug-in-the-arraysdiff-function check the errata for more information
 *
 * @param {any[]} oldArray the old array
 * @param {any[]} newArray the new array
 * @returns {{added: any[], removed: any[]}}
 */
export function arraysDiff(oldArray, newArray) {
  const oldsCount = makeCountMap(oldArray)
  const newsCount = makeCountMap(newArray)
  const diff = mapsDiff(oldsCount, newsCount)

  // Added items repeated as many times as they appear in the new array
  const added = diff.added.flatMap((key) =>
    Array(newsCount.get(key)).fill(key)
  )

  // Removed items repeated as many times as they appeared in the old array
  const removed = diff.removed.flatMap((key) =>
    Array(oldsCount.get(key)).fill(key)
  )

  // Updated items have to check the difference in counts
  for (const key of diff.updated) {
    const oldCount = oldsCount.get(key)
    const newCount = newsCount.get(key)
    const delta = newCount - oldCount

    if (delta > 0) {
      added.push(...Array(delta).fill(key))
    } else {
      removed.push(...Array(-delta).fill(key))
    }
  }

  return {
    added,
    removed,
  }
}

export const ARRAY_DIFF_OP = {
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop',
}

/**
 * @typedef ArraysDiffSequenceOp
 * @type {object}
 * @property {string} op the operation to perform
 * @property {number} from the index of the item in the old array
 * @property {number} index the index of the item in the new array
 * @property {(any|undefined)} [item] the item to add or remove
 */

/**
 * Compare two arrays and return a sequence of operations to transform the old
 * array into the new one. The sequence is so that, if the operations are applied
 * in order, the old array is transformed into the new one.
 *
 * If an item moves around as a side effect to other operations taking place,
 * such as adding something before it, the move operation will be included in
 * the sequence as a NOOP operation. We call these, natural movements.
 *
 * The sequence produced by this function can be applied to an array using the
 * `applyArraysDiffSequence` function.
 *
 * @param {any[]} oldArray the old array
 * @param {any[]} newArray the new array
 * @param {(a: any, b: any) => boolean} equalsFn the function to use to compar two items
 * @returns {ArraysDiffSequenceOp[]} the sequence of operations
 */
export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b
) {
  const sequence = []
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn)

  for (let index = 0; index < newArray.length; index++) {
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index))
      // Removals shouldn't advance the index. Removing the item shifts the
      // remaining items to the left, so the next item is now at the same index.
      index--
      continue
    }

    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index))
      continue
    }

    const item = newArray[index]

    if (array.isAddition(item, index)) {
      sequence.push(array.addItem(item, index))
      continue
    }

    sequence.push(array.moveItem(item, index))
  }

  sequence.push(...array.removeItemsAfter(newArray.length))

  return sequence
}

/**
 * Given an array and a sequence of operations to apply to it, it returns the
 * result of applying the operations to the array, in order.
 *
 * @param {any[]} oldArray The original array
 * @param {ArraysDiffSequenceOp[]} diffSeq The sequence of operations to apply
 * @returns {any[]} The array after applying the operations
 */
export function applyArraysDiffSequence(oldArray, diffSeq) {
  return diffSeq.reduce(
    (array, { op, item, index, from }) => {
      switch (op) {
        case ARRAY_DIFF_OP.ADD:
          array.splice(index, 0, item)
          break

        case ARRAY_DIFF_OP.REMOVE:
          array.splice(index, 1)
          break

        case ARRAY_DIFF_OP.MOVE:
          array.splice(index, 0, array.splice(from, 1)[0])
          break
      }

      return array
    },
    [...oldArray]
  )
}

/**
 * Wrapper around an array that keeps track of the original indices of the items
 * as they are moved around.
 */
class ArrayWithOriginalIndices {
  /** @type {any[]} */
  #array = []
  /** @type {number[]} */
  #originalIndices = []
  /** @type {(a: any, b: any) => boolean} */
  #equalsFn

  /**
   * @param {any[]} array the array to wrap
   * @param {(a: any, b: any) => boolean} equalsFn the function to use to compare two items
   * @returns {ArrayWithOriginalIndices}
   */
  constructor(array, equalsFn) {
    this.#array = [...array]
    this.#originalIndices = array.map((_, i) => i)
    this.#equalsFn = equalsFn
  }

  /**
   * The length of the array at its current state.
   *
   * @type {number}
   */
  get length() {
    return this.#array.length
  }

  /**
   * Returns the original index of the item at the given index.
   * If the item was added, it returns -1.
   *
   * @param {number} index the index of the item to check
   * @returns {number} the original index of the item at the given index
   */
  originalIndexAt(index) {
    return this.#originalIndices[index]
  }

  /**
   * Returns the index of the item in the array, searched starting from the
   * given index.
   * If the item isn't found, it returns -1.
   *
   * @param {any} item the item to look for
   * @param {number} fromIndex the index to start looking from (inclusive)
   * @returns {number} the index of the item in the array, or -1 if not found
   */
  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i
      }
    }

    return -1
  }

  /**
   * Checks if the item at the given index in this array doesn't appear in the
   * passed in `newArray`. This means the item was removed from this array with
   * respect to the `newArray`.
   *
   * @param {number} index the index of the item in this array
   * @param {any[]} newArray the new array to compare against
   * @returns {boolean} whether the item at the given index is a removal
   */
  isRemoval(index, newArray) {
    // If the index is beyond the length of the array, it can't be a removal.
    if (index >= this.length) {
      return false
    }

    const item = this.#array[index]
    const indexInNewArray = newArray.findIndex((newItem) =>
      this.#equalsFn(item, newItem)
    )

    return indexInNewArray === -1
  }

  /**
   * Removes the item at the given index from the array and returns the removal
   * operation.
   *
   * @param {number} index the index of the item to remove in this array
   * @returns {ArraysDiffSequenceOp} removal operation
   */
  removeItem(index) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index],
    }

    this.#array.splice(index, 1)
    this.#originalIndices.splice(index, 1)

    return operation
  }

  /**
   * Checks if the item at the given index in this array is a noop with respect to
   * the given passed in `newArray`. A noop operation happens when the item at the
   * given index is the same in both arrays.
   *
   * @param {number} index the index of the item in this array
   * @param {any[]} newArray the new array to compare against
   * @returns {boolean} whether the item at the given index is a noop
   */
  isNoop(index, newArray) {
    // If the index is beyond the length of the array, it can't be a noop.
    if (index >= this.length) {
      return false
    }

    const item = this.#array[index]
    const newItem = newArray[index]

    return this.#equalsFn(item, newItem)
  }

  /**
   * Returns a noop operation for the item at the given index.
   * The `from` index is the original index of the item.
   *
   * @param {number} index the index in this array
   * @returns {ArraysDiffSequenceOp} noop operation
   */
  noopItem(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      index,
      originalIndex: this.originalIndexAt(index),
      item: this.#array[index],
    }
  }

  /**
   * Checks if the item is an addition. An addition happens when the item is
   * not found in the array, starting from the given index (inclusive).
   *
   * @param {any} item the item to check
   * @param {number} fromIdx the index to start looking from (inclusive)
   * @returns {boolean} whether the item is an addition
   */
  isAddition(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1
  }

  /**
   * Adds the item at the given index to the array and returns the addition
   * operation.
   *
   * @param {any} item the item to be added in this array
   * @param {number} index the index to add the item at
   * @returns {ArraysDiffSequenceOp} addition operation
   */
  addItem(item, index) {
    const operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    }

    this.#array.splice(index, 0, item)
    this.#originalIndices.splice(index, 0, -1)

    return operation
  }

  /**
   * Moves the passed in item to the given index and returns the move operation.
   * The item is searched in this array starting from the given index (inclusive).
   * This means that the items are always moved from right to left (conventionally).
   *
   * @param {any} item the item to move
   * @param {number} toIndex the index to move the item to
   * @returns {ArraysDiffSequenceOp} move operation
   */
  moveItem(item, toIndex) {
    const fromIndex = this.findIndexFrom(item, toIndex)

    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex],
    }

    const [_item] = this.#array.splice(fromIndex, 1)
    this.#array.splice(toIndex, 0, _item)

    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1)
    this.#originalIndices.splice(toIndex, 0, originalIndex)

    return operation
  }

  /**
   * Removes all items after the given index and returns the removal operations.
   *
   * @param {number} index the index to start removing items from
   * @returns {ArraysDiffSequenceOp[]} the removal operations
   */
  removeItemsAfter(index) {
    const operations = []

    while (this.length > index) {
      operations.push(this.removeItem(index))
    }

    return operations
  }
}
