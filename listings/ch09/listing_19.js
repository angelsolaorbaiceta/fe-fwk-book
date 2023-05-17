export function defineComponent({ render, state, ...methods }) {
  const Component = class {
    // --snip--

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }
      
      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index/*--add--*/, this/*--add--*/)
      
      this.#hostEl = hostEl
      this.#isMounted = true
    }
    
    // --snip--

    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      const vdom = this.render()
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl/*--add--*/, this/*--add--*/)
    }
  }

  // --snip--

  return Component
}