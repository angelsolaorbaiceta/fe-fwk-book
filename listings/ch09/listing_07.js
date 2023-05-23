// --add--
import { DOM_TYPES, extractChildren } from './h'
// --add--
import { mountDOM } from './mount-dom'
import { patchDOM } from './patch-dom'

export function defineComponent({ render, state }) {
  class Component {
    #isMounted = false
    #vdom = null
    #hostEl = null

    constructor(props = {}) {
      this.props = props
      this.state = state ? state(props) : {}
    }
    
    // --add--
    get elements() {
      if (this.#vdom == null) { // --1--
        return []
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) { // --2-- 
        return extractChildren(this.#vdom).map((child) => child.el)
      }

      return [this.#vdom.el] // --3--
    }

    get firstElement() {
      return this.elements[0] // --4--
    }

    get offset() {
      return Array.from(this.#hostEl.children).indexOf(this.firstElement) // --5--
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