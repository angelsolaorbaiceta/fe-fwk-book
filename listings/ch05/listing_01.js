export class Dispatcher {
  #subs = new Map()

  subscribe(commandName, handler) {
    if (!this.#subs.has(commandName)) { // --1--
      this.#subs.set(commandName, [])
    }

    const handlers = this.#subs.get(commandName)
    if (handlers.includes(handler)) { // --2--
      return () => {}
    }

    handlers.push(handler) // --3--

    return () => { // --4--
      const idx = handlers.indexOf(handler)
      handlers.splice(idx, 1)
    }
  }
}