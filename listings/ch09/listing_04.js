import { destroyDOM } from './destroy-dom'
import { mountDOM } from './mount-dom'
// --add--
import { patchDOM } from './patch-dom'
// --add--

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
    updateState(state) {
      this.state = { ...this.state, ...state } // --1--
      this.#patch() // --2--
    }
    // --add--

    render() {
      return render()
    }

    mount(hostEl, index = null) {
      // --snip-- //
    }
    
    unmount() {
      // --snip-- //
    }

    // --add--
    #patch() {
      if (!this.#isMounted) { // --3--
        throw new Error('Component is not mounted')
      }

      const vdom = this.render() // --4--
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl) // --5--
    }
    // --add--
  }

  return Component
}