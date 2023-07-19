export function defineComponent({ render, state }) {
  class Component {
    // --snip-- //
    
    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      const vdom = this.render()
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl/*--add--*/, this/*--add--*/) // --1--
    }
  }

  return Component
}