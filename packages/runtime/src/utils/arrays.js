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
 * the sequence as a NOOP operation.
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
  const withOriginalIndices = oldArray.map((item, index) => ({
    item,
    index,
  }))

  function findFrom(item, index) {
    for (let i = index; i < withOriginalIndices.length; i++) {
      const oldItem = withOriginalIndices[i].item

      if (equalsFn(item, oldItem)) {
        return i
      }
    }

    return -1
  }

  for (let index = 0; index < newArray.length; index++) {
    // Check if the old item at index is removal
    if (index < withOriginalIndices.length) {
      const { item: oldItem, index: originalIdx } =
        withOriginalIndices[index]
      const indexInNewArray = newArray.findIndex((newItem) =>
        equalsFn(oldItem, newItem)
      )

      const isRemoved = indexInNewArray === -1

      if (isRemoved) {
        sequence.push({
          op: ARRAY_DIFF_OP.REMOVE,
          index,
          item: oldItem,
        })

        withOriginalIndices.splice(index, 1)
        index--

        continue
      }

      const isNoop = equalsFn(oldItem, newArray[index])
      if (isNoop) {
        sequence.push({
          op: ARRAY_DIFF_OP.NOOP,
          from: originalIdx,
          index,
        })

        continue
      }
    }

    const item = newArray[index]
    const from = findFrom(item, index)
    const isAdded = from === -1

    if (isAdded) {
      sequence.push({
        op: ARRAY_DIFF_OP.ADD,
        index,
        item,
      })

      withOriginalIndices.splice(index, 0, { item, index: -1 })

      continue
    }

    // Move
    sequence.push({
      op: ARRAY_DIFF_OP.MOVE,
      from,
      index,
      item,
    })

    const [moved] = withOriginalIndices.splice(from, 1)
    withOriginalIndices.splice(index, 0, moved)
  }

  // Items in the old array that are past the last index of the new array are
  // removed
  for (
    let index = newArray.length;
    index < withOriginalIndices.length;
    index++
  ) {
    const { item } = withOriginalIndices[index]

    sequence.push({
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item,
    })
  }

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
  return diffSeq.reduce((array, { op, item, index, from }) => {
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
  }, oldArray)
}
