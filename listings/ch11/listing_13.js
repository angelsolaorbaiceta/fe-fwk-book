export function defineComponent({ render, state, ...methods }) {
  class Component {
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