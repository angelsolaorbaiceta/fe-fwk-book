class ArrayWithOriginalIndices { // --1--
  #array = []
  #originalIndices = []
  #equalsFn

  constructor(array, equalsFn) {
    this.#array = [...array] // --2--
    this.#originalIndices = array.map((_, i) => i) // --3--
    this.#equalsFn = equalsFn // --4--
  }
  
  get length() { // --5--
    return this.#array.length
  }
}