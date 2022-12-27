export class Dispatcher {
  #subs = {}
  #afterHandlers = []

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

  afterEveryEvent(handler) {
    this.#afterHandlers.push(handler)

    return () => {
      const idx = this.#afterHandlers.indexOf(handler)
      this.#afterHandlers.splice(idx, 1)
    }
  }

  dispatch(eventName, payload) {
    if (eventName in this.#subs) {
      this.#subs[eventName].forEach((handler) => handler(payload))
    } else {
      console.warn(`No handlers for event: ${eventName}`)
    }

    this.#afterHandlers.forEach((handler) => handler())
  }
}
