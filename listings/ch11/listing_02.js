export function defineComponent({ render, state, ...methods }) {
  class Component {
    // --snip-- //

    get elements() {
      if (this.#vdom == null) {
        return []
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        // --remove--
        return extractChildren(this.#vdom).map((child) => child.el)
        // --remove--
        // --add--
        return extractChildren(this.#vdom).flatMap((child) => { // --1--
          if (child.type === DOM_TYPES.COMPONENT) { // --2--
            return child.component.elements // --3--
          }

          return [child.el] // --4--
        })
        // --add--
      }

      return [this.#vdom.el]
    }

    // --snip-- //
  }
  
  // --snip-- //

  return Component
}