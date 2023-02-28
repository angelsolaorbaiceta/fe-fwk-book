function findRemovals(oldArray, newArray, equalsFn) {
  const foundIndicesInNewArray = new Set()
  // Keeps track of how many items have been removed from the old array,
  // which are the items that have been moved to the left
  let movedPositions = Array(oldArray.length).fill(0)
  const sequence = []

  for (let index = 0; index < oldArray.length; index++) {
    const item = oldArray[index]
    const indexInNewArray = newArray.findIndex(
      (newItem, newIndex) =>
        equalsFn(item, newItem) && !foundIndicesInNewArray.has(newIndex)
    )
    const wasRemoved = indexInNewArray === -1

    if (wasRemoved) {
      sequence.push({
        op: ARRAY_DIFF_OP.REMOVE,
        index,
        item,
      })

      // Removing one item, naturally shifts all the items to the right of
      // it a position to the left.
      for (let i = index + 1; i < movedPositions.length; i++) {
        movedPositions[i] -= 1
      }
    } else {
      foundIndicesInNewArray.add(indexInNewArray)
    }
  }

  return { sequence, movedPositions }
}