export class Dispatcher {
  #subs = {}
  // --add--
  #afterHandlers = []
  // --add--
  
  // --snip-- //

  // --add--
  afterEveryEvent(handler) {
    this.#afterHandlers.push(handler) // --1--

    return () => { // --2--
      const idx = this.#afterHandlers.indexOf(handler)
      this.#afterHandlers.splice(idx, 1)
    }
  }
  // --add--
}