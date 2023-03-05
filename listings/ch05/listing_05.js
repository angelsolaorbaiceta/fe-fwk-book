function findRemovals(oldArray, newArray, equalsFn) {
  const foundIndicesInNewArray = new Set() // --1--
  // Keeps track of the positions that each item in the new array moves due
  // to items being removed from their left.
  const movedPositions = Array(oldArray.length).fill(0) // --2--
  const sequence = []

  for (let index = 0; index < oldArray.length; index++) { // --3--
    const item = oldArray[index]
    const indexInNewArray = newArray.findIndex(
      (newItem, newIndex) =>
        equalsFn(item, newItem) && !foundIndicesInNewArray.has(newIndex) // --4--
    )
    const wasRemoved = indexInNewArray === -1 // --5--

    if (wasRemoved) {
      sequence.push({ // --6--
        op: ARRAY_DIFF_OP.REMOVE,
        index,
        item,
      })

      // Removing one item, naturally shifts all the items to the right of
      // it a position to the left.
      for (let i = index + 1; i < movedPositions.length; i++) { // --7--
        movedPositions[i] -= 1
      }
    } else {
      foundIndicesInNewArray.add(indexInNewArray) // --8--
    }
  }

  return { removals: sequence, movedPositions } // --9--
}