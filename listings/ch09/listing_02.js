export function defineComponent({ render }) {
  class Component {
    // --add--
    #isMounted = false // --1--
    // --add--
    #vdom = null
    #hostEl = null

    render() {
      return render()
    }

    mount(hostEl, index = null) {
      // --add--
      if (this.#isMounted) { // --2--
        throw new Error('Component is already mounted')
      }
      // --add--
      
      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index)
      
      this.#hostEl = hostEl
      // --add--
      this.#isMounted = true // --3--
      // --add--
    }
    
    unmount() {
      // --add--
      if (!this.#isMounted) { // --4--
        throw new Error('Component is not mounted')
      }
      // --add--

      destroyDOM(this.#vdom)

      this.#vdom = null
      this.#hostEl = null
      // --add--
      this.#isMounted = false // --5--
      // --add--
    }
  }

  return Component
}