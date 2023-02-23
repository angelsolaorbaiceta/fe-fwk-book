export class Dispatcher {
  #subs = new Map()
  // --add--
  #afterHandlers = []
  // --add--
  
  // --snip-- //

  // --add--
  afterEveryCommand(handler) {
    this.#afterHandlers.push(handler) // --1--

    return () => { // --2--
      const idx = this.#afterHandlers.indexOf(handler)
      this.#afterHandlers.splice(idx, 1)
    }
  }
  // --add--
}