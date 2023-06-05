class ArrayWithOriginalIndices {
  // --snip-- //

  // --add--
  moveItem(item, toIndex) {
    const fromIndex = this.findIndexFrom(item, toIndex) // --1--

    const operation = { // --2--
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex), // --3--
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex],
    }

    const [_item] = this.#array.splice(fromIndex, 1) // --4--
    this.#array.splice(toIndex, 0, _item) // --5--

    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1) // --6--
    this.#originalIndices.splice(toIndex, 0, originalIndex) // --7--

    return operation // --8--
  }
  // --add--
}