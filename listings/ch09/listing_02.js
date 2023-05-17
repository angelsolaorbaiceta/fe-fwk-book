export function defineComponent({ render }) {
  const Component = class {
    // --add--
    #isMounted = false
    // --add--
    #vdom = null
    #hostEl = null

    render() {
      return render()
    }

    mount(hostEl, index = null) {
      // --add--
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }
      // --add--
      
      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index)
      
      this.#hostEl = hostEl
      // --add--
      this.#isMounted = true
      // --add--
    }
    
    unmount() {
      // --add--
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }
      // --add--

      destroyDOM(this.#vdom)

      this.#vdom = null
      this.#hostEl = null
      // --add--
      this.#isMounted = false
      // --add--
    }
  }

  return Component
}