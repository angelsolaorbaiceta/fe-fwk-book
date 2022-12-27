export class Dispatcher {
  #subs = {}

  subscribe(eventName, handler) {
    if (this.#subs[eventName] === undefined) { // --1--
      this.#subs[eventName] = []
    }

    if (this.#subs[eventName].includes(handler)) { // --2--
      return () => {}
    }

    this.#subs[eventName].push(handler) // --3--

    return () => { // --4--
      const idx = this.#subs[eventName].indexOf(handler)
      this.#subs[eventName].splice(idx, 1)
    }
  }
}