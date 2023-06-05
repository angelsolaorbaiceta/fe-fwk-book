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

    // --add--
    if (array.isNoop(index, newArray)) { // --1--
      sequence.push(array.noopItem(index)) // --2--
      continue // --3--
    }
    // --add--

    // TODO: addition case

    // TODO: move case
  }

  // TODO: remove extra items

  return sequence
}