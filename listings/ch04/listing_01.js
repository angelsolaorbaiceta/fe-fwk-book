export class Dispatcher {
  #subs = {}

  subscribe(commandName, handler) {
    if (this.#subs[commandName] === undefined) { // --1--
      this.#subs[commandName] = []
    }

    if (this.#subs[commandName].includes(handler)) { // --2--
      return () => {}
    }

    this.#subs[commandName].push(handler) // --3--

    return () => { // --4--
      const idx = this.#subs[commandName].indexOf(handler)
      this.#subs[commandName].splice(idx, 1)
    }
  }
}