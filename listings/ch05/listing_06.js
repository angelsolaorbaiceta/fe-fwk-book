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

    if (isAdded) {
      // TODO: implement me
    } else if (isPossiblyMoved && !hasOppositeMove(sequence, from, index)) {
      // TODO: implement me
    } else {
      // TODO: implement me
    }
  }

  return sequence
}