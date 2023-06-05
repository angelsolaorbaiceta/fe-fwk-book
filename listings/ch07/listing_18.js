class ArrayWithOriginalIndices {
  // --snip-- //

  // --add--
  removeItemsAfter(index) {
    const operations = []

    while (this.length > index) { // --1--
      operations.push(this.removeItem(index)) // --2--
    }

    return operations // --3--
  }
  // --add--
}