export function defineComponent({ render, state }) {
  const Component = class {
    #isMounted = false
    #vdom = null
    #hostEl = null

    constructor(props = {}) {
      this.props = props
      this.state = state ? state(props) : {}
    }
    
    // --add--
    get elements() {
      if (this.#vdom == null) {
        return []
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return this.#vdom.children.map((child) => child.el)
      }

      return [this.#vdom.el]
    }

    get firstElement() {
      return this.elements[0]
    }

    get offset() {
      return Array.from(this.#hostEl.children).indexOf(this.firstElement)
    }
    // --add--
    
    updateState(state) {
      this.state = { ...this.state, ...state }
      this.#patch()
    }

    // --snip-- //
  }

  return Component
}