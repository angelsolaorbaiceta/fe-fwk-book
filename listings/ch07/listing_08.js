function findAdditionsAndMoves(
  oldArray,
  newArray,
  equalsFn,
  movedPositions
) {
  const foundIndicesInOldArray = new Set()
  const sequence = []

  for (let index = 0; index < newArray.length; index++) {
    const item = newArray[index]
    const from = oldArray.findIndex(
      (oldItem, oldIndex) =>
        equalsFn(item, oldItem) && !foundIndicesInOldArray.has(oldIndex)
    )

    const isAdded = from === -1
    const isPossiblyMoved = !isAdded && from !== index
    const isMoved =
      isPossiblyMoved && !hasOppositeMove(sequence, from, index)

    if (isAdded) {
      // --add--
      sequence.push({ // --1--
        op: ARRAY_DIFF_OP.ADD,
        index,
        item,
      })

      // Adding one item, naturally shifts all the items to the right of it
      // a position to the right.
      for (let i = index; i < movedPositions.length; i++) { // --2--
        movedPositions[i] += 1
      }
      // --add--
    } else if (isMoved) {
      // TODO: implement me
    } else {
      // TODO: implement me
    }
  }

  return sequence
}