class ArrayWithOriginalIndices {
  // --snip-- //
  
  isNoop(index, newArray) {
    // --snip-- //
  }

  // --add--
  originalIndexAt(index) {
    return this.#originalIndices[index] // --1--
  }

  noopItem(index) {
    return { // --2--
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(index), // --3--
      index,
      item: this.#array[index], // --4--
    }
  }
  // --add--
}