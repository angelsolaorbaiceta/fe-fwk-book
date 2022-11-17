/**
 * Event dispatcher that registers and unregisters event handlers to specific
 * events, or all of them.
 */
export class Dispatcher {
  #subs = { all: [] }

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

    const length = this.#subs[eventName].push(handler)
    const handlerIndex = length - 1

    return () => {
      this.#subs[eventName].splice(handlerIndex, 1)
    }
  }

  /**
   * Registers an event handler to all events and returns a function that
   * unregisters the handler.
   *
   * @param {(any) => void} handler the handler of the event
   * @returns {() => void} a function that unregisters the handler
   */
  subscribeToAll(handler) {
    this.#subs.all.push(handler)

    return () => {
      this.#subs.all.splice(this.#subs.all.indexOf(handler), 1)
    }
  }

  /**
   * Dispatches an event to all handlers registered to the event and to all
   * handlers registered to all events.
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

    Array.from(this.#subs.all).forEach((handler) => handler(payload))
  }
}
