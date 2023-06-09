class ArrayWithOriginalIndices {
  // --snip-- //

  // --add--
  isNoop(index, newArray) {
    if (index >= this.length) { // --1--
      return false
    }

    const item = this.#array[index] // --2--
    const newItem = newArray[index] // --3--

    return this.#equalsFn(item, newItem) // --4--
  }
  // --add--
}