export function defineComponent({ render, state }) {
  const Component = class {
    // --snip-- //
    
    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      const vdom = this.render()
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl/*--add--*/, this/*--add--*/)
    }
  }

  return Component
}