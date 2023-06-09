class ArrayWithOriginalIndices {
  #array = []
  #originalIndices = []
  #equalsFn

  constructor(array, equalsFn) {
    this.#array = [...array]
    this.#originalIndices = array.map((_, i) => i)
    this.#equalsFn = equalsFn
  }
  
  get length() {
    return this.#array.length
  }
  
  // --add--
  isRemoval(index, newArray) {
    if (index >= this.length) { // --1--
      return false
    }

    const item = this.#array[index] // --2--
    const indexInNewArray = newArray.findIndex((newItem) => // --3--
      this.#equalsFn(item, newItem) // --4--
    )

    return indexInNewArray === -1 // --5--
  }
  // --add--
}