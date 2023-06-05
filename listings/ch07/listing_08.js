class ArrayWithOriginalIndices {
  // --snip-- //
  
  isRemoval(index, newArray) {
    // --snip-- //
  }
  
  // --add--
  removeItem(index) {
    const operation = { // --1--
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index], // --2--
    }

    this.#array.splice(index, 1) // --3--
    this.#originalIndices.splice(index, 1) // --4--

    return operation // --5--
  }
  // --add--
}