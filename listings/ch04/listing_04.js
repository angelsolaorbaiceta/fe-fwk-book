export class Dispatcher {
  // --snip-- //

  // --add--
  dispatch(eventName, payload) {
    if (eventName in this.#subs) { // --1--
      this.#subs[eventName].forEach((handler) => handler(payload))
    } else {
      console.warn(`No handlers for event: ${eventName}`)
    }

    this.#afterHandlers.forEach((handler) => handler()) // --2--
  }
  // --add--
}