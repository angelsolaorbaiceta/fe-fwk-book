export class Dispatcher {
  #subs = {}
  #afterHandlers = []

  subscribe(commandName, handler) {
    if (this.#subs[commandName] === undefined) {
      this.#subs[commandName] = []
    }

    if (this.#subs[commandName].includes(handler)) {
      return () => {}
    }

    this.#subs[commandName].push(handler)

    return () => {
      const idx = this.#subs[commandName].indexOf(handler)
      this.#subs[commandName].splice(idx, 1)
    }
  }

  afterEveryCommand(handler) {
    this.#afterHandlers.push(handler)

    return () => {
      const idx = this.#afterHandlers.indexOf(handler)
      this.#afterHandlers.splice(idx, 1)
    }
  }

  dispatch(commandName, payload) {
    if (commandName in this.#subs) {
      this.#subs[commandName].forEach((handler) => handler(payload))
    } else {
      console.warn(`No handlers for command: ${commandName}`)
    }

    this.#afterHandlers.forEach((handler) => handler())
  }
}
