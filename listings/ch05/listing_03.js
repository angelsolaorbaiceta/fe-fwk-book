export class Dispatcher {
  // --snip-- //

  // --add--
  dispatch(commandName, payload) {
    if (this.#subs.has(commandName)) { // --1--
      this.#subs.get(commandName).forEach((handler) => handler(payload))
    } else {
      console.warn(`No handlers for command: ${commandName}`)
    }

    this.#afterHandlers.forEach((handler) => handler()) // --2--
  }
  // --add--
}