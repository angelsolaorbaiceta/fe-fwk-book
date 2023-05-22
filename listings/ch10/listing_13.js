export function defineComponent({ render, state, ...methods }) {
  const Component = class {
    // --snip-- //

    // --add--
    emit(eventName, payload) {
      this.#dispatcher.dispatch(eventName, payload)
    }
    // --add--
  }

  // --snip-- //

  return Component
}