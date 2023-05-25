export function defineComponent({ render, state, ...methods }) {
  class Component {
    // --snip-- //

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }
      
      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index/*--add--*/, this/*--add--*/) // --1--
      
      this.#hostEl = hostEl
      this.#isMounted = true
    }
    
    // --snip-- //
  }

  // --snip-- //

  return Component
}