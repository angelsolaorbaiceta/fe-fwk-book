class ArrayWithOriginalIndices {
  // --snip-- //

  isAddition(item, fromIdx) {
    return this.findIndexFrom(item, fromIdx) === -1
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) {
        return i
      }
    }

    return -1
  }
  
  // --add--
  addItem(item, index) {
    const operation = { // --1--
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    }

    this.#array.splice(index, 0, item) // --2--
    this.#originalIndices.splice(index, 0, -1) // --3--

    return operation // --4--
  }
  // --add--
}