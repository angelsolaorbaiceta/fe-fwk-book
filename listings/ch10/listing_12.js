export function defineComponent({ render, state, ...methods }) {
  const Component = class {
    #isMounted = false
    #vdom = null
    #hostEl = null
    #eventHandlers = null
    #parentComponent = null
    // --add--
    #dispatcher = new Dispatcher()
    #subscriptions = []
    // --add--

    // --snip-- //

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }

      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index, this)
      // --add--
      this.#wireEventHandlers()
      // --add--

      this.#isMounted = true
      this.#hostEl = hostEl
    }

    // --add--
    #wireEventHandlers() {
      this.#subscriptions = Object.entries(this.#eventHandlers).map(
        ([eventName, handler]) => this.#wireEventHandler(eventName, handler)
      )
    }

    #wireEventHandler(eventName, handler) {
      return this.#dispatcher.subscribe(eventName, (payload) => {
        if (this.#parentComponent) {
          handler.call(this.#parentComponent, payload)
        } else {
          handler(payload)
        }
      })
    }
    // --add--
    
    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      destroyDOM(this.#vdom)
      // --add--
      this.#subscriptions.forEach((unsubscribe) => unsubscribe())
      // --add--

      this.#vdom = null
      this.#isMounted = false
      this.#hostEl = null
      // --add--
      this.#subscriptions = []
      // --add--
    }

    // --snip-- //
  }

  // --snip-- //

  return Component
}

