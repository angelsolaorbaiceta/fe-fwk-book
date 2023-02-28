export const ARRAY_DIFF_OP = {
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop',
}

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

  // If there is a removal and addition for the same index, the removal
  // should take precedence.
  const sequence = [...removals, ...additionsAndMoves]
  sequence.sort((a, b) => a.index - b.index)

  return sequence
}

// TODO: implement findRemovals()

// TODO: implement findAdditionsAndMoves()