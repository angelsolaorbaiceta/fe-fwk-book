export function defineComponent({ render, state, ...methods }) {
  const Component = class {
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
        return extractChildren(this.#vdom).flatMap((child) => {
          if (child.type === DOM_TYPES.COMPONENT) {
            return child.component.elements
          }

          return [child.el]
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