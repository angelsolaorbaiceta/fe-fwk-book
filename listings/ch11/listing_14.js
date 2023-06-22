export function defineComponent({ render, state, ...methods }) {
  class Component {
    // --snip-- //

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }

      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index, this)
      // --add--
      this.#wireEventHandlers() // --1--
      // --add--

      this.#isMounted = true
      this.#hostEl = hostEl
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      destroyDOM(this.#vdom)
      // --add--
      this.#subscriptions.forEach((unsubscribe) => unsubscribe()) // --2--
      // --add--

      this.#vdom = null
      this.#isMounted = false
      this.#hostEl = null
      // --add--
      this.#subscriptions = [] // --3--
      // --add--
    }

    // --snip-- //
  }

  // --snip-- //

  return Component
}