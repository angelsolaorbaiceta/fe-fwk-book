export class Dispatcher {
  // --snip-- //

  // --add--
  dispatch(commandName, payload) {
    if (commandName in this.#subs) { // --1--
      this.#subs[commandName].forEach((handler) => handler(payload))
    } else {
      console.warn(`No handlers for command: ${commandName}`)
    }

    this.#afterHandlers.forEach((handler) => handler()) // --2--
  }
  // --add--
}