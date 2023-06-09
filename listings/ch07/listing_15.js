export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b
) {
  const sequence = []
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn)

  for (let index = 0; index < newArray.length; index++) {
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index))
      index--
      continue 
    }

    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index))
      continue
    }

    // --add--
    const item = newArray[index] // --1--

    if (array.isAddition(item, index)) { // --2--
      sequence.push(array.addItem(item, index)) // --3--
      continue // --4--
    }
    // --add--

    // TODO: move case
  }

  // TODO: remove extra items

  return sequence
}