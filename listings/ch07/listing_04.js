export const ARRAY_DIFF_OP = { // --1--
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop',
}

export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b // --2--
) {
  const { removals, movedPositions } = findRemovals( // --3--
    oldArray,
    newArray,
    equalsFn
  )
  const additionsAndMoves = findAdditionsAndMoves( // --4--
    oldArray,
    newArray,
    equalsFn,
    movedPositions
  )

  // If there is a removal and addition for the same index, the removal
  // should take precedence.
  const sequence = [...removals, ...additionsAndMoves] // --5--
  sequence.sort((a, b) => a.index - b.index) // --6--

  return sequence
}

// TODO: implement findRemovals()

// TODO: implement findAdditionsAndMoves()