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

class ArrayWithOriginalIndices {
  constructor(array, equalsFn) {
    this.array = [...array]
    this.originalIndices = array.map((_, i) => i)
    this.equalsFn = equalsFn
  }

  get length() {
    return this.array.length
  }

  originalIndexAt(index) {
    return this.originalIndices[index]
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.equalsFn(item, this.array[i])) {
        return i
      }
    }

    return -1
  }

  isRemoval(index, newArray) {
    if (index >= this.length) {
      return false
    }

    const item = this.array[index]
    const indexInNewArray = newArray.findIndex((newItem) =>
      this.equalsFn(item, newItem)
    )

    return indexInNewArray === -1
  }

  removeItem(index) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.array[index],
    }

    this.array.splice(index, 1)
    this.originalIndices.splice(index, 1)

    return operation
  }

  isNoop(index, newArray) {
    if (index >= this.length) {
      return false
    }

    const item = this.array[index]
    const newItem = newArray[index]

    return this.equalsFn(item, newItem)
  }

  noopItem(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      from: this.originalIndexAt(index),
      index,
      item: this.array[index],
    }
  }

  isAddition(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1
  }

  addItem(item, index) {
    const operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    }

    this.array.splice(index, 0, item)
    this.originalIndices.splice(index, 0, -1)

    return operation
  }

  moveItem(item, toIndex) {
    const fromIndex = this.findIndexFrom(item, toIndex)

    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      from: fromIndex,
      index: toIndex,
      item: this.array[fromIndex],
    }

    const [_item] = this.array.splice(fromIndex, 1)
    this.array.splice(toIndex, 0, _item)

    const [originalIndex] = this.originalIndices.splice(fromIndex, 1)
    this.originalIndices.splice(toIndex, 0, originalIndex)

    return operation
  }

  removeItemsAfter(index) {
    const operations = []

    while (this.length > index) {
      operations.push(this.removeItem(index))
    }

    return operations
  }
}
