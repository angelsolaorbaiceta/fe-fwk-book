function findAdditionsAndMoves(
  oldArray,
  newArray,
  equalsFn,
  movedPositions
) {
  const foundIndicesInOldArray = new Set() // --1--
  const sequence = []

  for (let index = 0; index < newArray.length; index++) { // --2--
    const item = newArray[index]
    const from = oldArray.findIndex(
      (oldItem, oldIndex) =>
        equalsFn(item, oldItem) && !foundIndicesInOldArray.has(oldIndex) // --3--
    )

    const isAdded = from === -1 // --4--
    const isPossiblyMoved = !isAdded && from !== index // --5--
    const isMoved =
      isPossiblyMoved && !hasOppositeMove(sequence, from, index) // --6--
 
    if (isAdded) {
      // TODO: implement me
    } else if (isMoved) {
      // TODO: implement me
    } else {
      // TODO: implement me
    }
  }

  return sequence
}

// TODO: implement hasOppositeMove()