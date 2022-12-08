/**
 * Event dispatcher that registers and unregisters event handlers to specific
 * events, and allows the execution of handlers after each event.
 */
export class Dispatcher {
  #subs = {}
  #afterHandlers = []

  /**
   * Registers an event handler to a specific event and returns a function that
   * unregisters the handler.
   *
   * @param {string} eventName the name of the event to register the handler for
   * @param {(any) => void} handler the handler of the event
   * @returns {() => void} a function that unregisters the handler
   */
  subscribe(eventName, handler) {
    if (this.#subs[eventName] === undefined) {
      this.#subs[eventName] = []
    }

    if (this.#subs[eventName].includes(handler)) {
      return () => {}
    }

    this.#subs[eventName].push(handler)

    return () => {
      const idx = this.#subs[eventName].indexOf(handler)
      this.#subs[eventName].splice(idx, 1)
    }
  }

  /**
   * Registers a handler function that runs after each event and returns a
   * function that unregisters the handler.
   *
   * @param {() => void} handler a function that runs after each event
   * @returns {() => void} a function that unregisters the handler
   */
  afterEveryEvent(handler) {
    this.#afterHandlers.push(handler)

    return () => {
      const idx = this.#afterHandlers.indexOf(handler)
      this.#afterHandlers.splice(idx, 1)
    }
  }

  /**
   * Dispatches an event to all handlers registered to the event and runs all
   * handlers registered to run after each event.
   *
   * Displays a warning if the event has no handlers registered.
   *
   * @param {string} eventName the name of the event to dispatch
   * @param {any} payload the payload of the event
   */
  dispatch(eventName, payload) {
    if (eventName in this.#subs) {
      Array.from(this.#subs[eventName]).forEach((handler) =>
        handler(payload)
      )
    } else {
      console.warn(`No handlers for event: ${eventName}`)
    }

    this.#afterHandlers.forEach((handler) => handler())
  }
}
