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
    added: newArray.filter(
      (newItem) => !oldArray.some((oldItem) => newItem === oldItem)
    ),
    removed: oldArray.filter(
      (oldItem) => !newArray.some((newItem) => newItem === oldItem)
    ),
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
  const { sequence: removals, movedPositions } = findRemovals(
    oldArray,
    newArray,
    equalsFn
  )
  const additionsAndMoves = findAdditionsAndMoves(
    oldArray,
    newArray,
    equalsFn,
    movedPositions
  )

  // If there is a removal and addition for the same index, the removal should
  // take precedence.
  const sequence = [...removals, ...additionsAndMoves]
  sequence.sort((a, b) => a.index - b.index)

  return sequence
}

function findRemovals(oldArray, newArray, equalsFn) {
  // The indices in the new array for items that are in the old array
  const foundIndices = new Set()
  // Keeps track of how many items have been removed from the old array, which
  // are the items that have been moved to the left
  let movedPositions = 0
  const sequence = []

  for (let index = 0; index < oldArray.length; index++) {
    const item = oldArray[index]
    const indexInNewArray = newArray.findIndex(
      (newItem, newIndex) =>
        equalsFn(item, newItem) && !foundIndices.has(newIndex)
    )
    const wasRemoved = indexInNewArray === -1

    if (wasRemoved) {
      sequence.push({
        op: ARRAY_DIFF_OP.REMOVE,
        index,
        item,
      })
      movedPositions -= 1
    } else {
      foundIndices.add(indexInNewArray)
    }
  }

  return { sequence, movedPositions }
}

function findAdditionsAndMoves(
  oldArray,
  newArray,
  equalsFn,
  movedPositions
) {
  // The indices in the old array for items that are in the new array
  const foundIndices = new Set()
  const sequence = []

  for (let index = 0; index < newArray.length; index++) {
    const item = newArray[index]
    const from = oldArray.findIndex(
      (oldItem, oldIndex) =>
        equalsFn(item, oldItem) && !foundIndices.has(oldIndex)
    )

    const isAdded = from === -1
    const isMoved = !isAdded && from !== index

    if (isAdded) {
      sequence.push({
        op: ARRAY_DIFF_OP.ADD,
        index,
        item,
      })
      movedPositions += 1
    } else if (isMoved && !hasOppositeMove(sequence, from, index)) {
      const positions = index - from

      if (positions !== movedPositions) {
        sequence.push({ op: ARRAY_DIFF_OP.MOVE, from, index, item })
      } else {
        sequence.push({ op: ARRAY_DIFF_OP.NOOP, from, index })
      }

      foundIndices.add(from)
    } else {
      sequence.push({ op: ARRAY_DIFF_OP.NOOP, from, index })
      foundIndices.add(from)
    }
  }

  return sequence
}

function hasOppositeMove(sequence, from, to) {
  return sequence.some(
    ({ op, from: _from, index: _to }) =>
      op === ARRAY_DIFF_OP.MOVE && _from === to && _to === from
  )
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
