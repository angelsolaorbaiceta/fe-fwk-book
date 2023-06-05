class ArrayWithOriginalIndices {
  // --snip-- //

  // --add--
  isAddition(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1 // --1--
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) { // --2--
      if (this.#equalsFn(item, this.#array[i])) { // --3--
        return i
      }
    }

    return -1 // --4--
  }
  // --add--
}