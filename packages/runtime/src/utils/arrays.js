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
 * @param {any[]} oldArray the old array
 * @param {any[]} newArray the new array
 * @returns {{added: any[], removed: any[]}}}
 */
export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter((newItem) => !oldArray.includes(newItem)),
    removed: oldArray.filter((oldItem) => !newArray.includes(oldItem)),
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
   * Checks if the item at the given index is an addition with respect to the
   * given array.
   *
   * @param {number} index
   * @param {any[]} newArray
   * @returns {boolean} whether the item at the given index is a removal
   */
  isRemoval(index, newArray) {
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
   * @param {number} index
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
   * Checks if the item at the given index is a noop with respect to the given
   * array. A noop operation happens when the item at the given index is the
   * same in both arrays.
   *
   * @param {number} index
   * @param {any[]} newArray
   * @returns {boolean} whether the item at the given index is a noop
   */
  isNoop(index, newArray) {
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
   * @param {number} index
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
   * Checks if the item is an addition with respect to the given array.
   * An addition happens when the item is not found in the array, starting
   * from the given index.
   *
   * @param {any} item
   * @param {number} fromIdx
   * @returns {boolean} whether the item is an addition
   */
  isAddition(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1
  }

  /**
   * Adds the item at the given index to the array and returns the addition
   * operation.
   *
   * @param {any} item
   * @param {number} index
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
   * Moves the item at the given index to the given index and returns the move
   * operation.
   *
   * @param {any} item
   * @param {number} toIndex
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
   * @param {number} index
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
