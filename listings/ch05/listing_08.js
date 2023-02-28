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
      sequence.push({
        op: ARRAY_DIFF_OP.ADD,
        index,
        item,
      })

      // Adding one item, naturally shifts all the items to the right of it
      // a position to the right.
      for (let i = index; i < movedPositions.length; i++) {
        movedPositions[i] += 1
      }
    } else if (isPossiblyMoved && !hasOppositeMove(sequence, from, index)) {
      // --add--
      const positions = index - from

      if (positions !== movedPositions[from]) {
        sequence.push({ op: ARRAY_DIFF_OP.MOVE, from, index, item })

        if (positions < 0) {
          // Moving the item to the left causes the items to the right of it
          // to shift a position to the right.
          for (let i = 0; i < from; i++) {
            movedPositions[i] += 1
          }
        } else {
          // Moving the item to the right causes the items to the left of it
          // to shift a position to the left.
          for (let i = from + 1; i < index; i++) {
            movedPositions[i] -= 1
          }
        }
      } else {
        sequence.push({ op: ARRAY_DIFF_OP.NOOP, from, index })
      }

      foundIndicesInOldArray.add(from)
      // --add--
    } else {
      // TODO: implement me
    }
  }

  return sequence
}