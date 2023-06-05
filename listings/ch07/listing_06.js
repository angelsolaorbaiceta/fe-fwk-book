export function arraysDiffSequence(
  oldArray,
  newArray,
  equalsFn = (a, b) => a === b // --1--
) {
  const sequence = []
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn) // --2--

  for (let index = 0; index < newArray.length; index++) { // --3--
    // TODO: removal case

    // TODO: noop case

    // TODO: addition case

    // TODO: move case
  }

  // TODO: remove extra items

  return sequence // --4--
}