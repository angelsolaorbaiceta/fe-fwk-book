import { mountDOM } from './mount-dom'
// --add--
import { patchDOM } from './patch-dom'
// --add--

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
    updateState(state) {
      this.state = { ...this.state, ...state }
      this.#patch()
    }
    // --add--

    render() {
      return render()
    }

    mount(hostEl, index = null) {
      // --snip--
    }
    
    unmount() {
      // --snip--
    }

    // --add--
    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      const vdom = this.render()
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl)
    }
    // --add--
  }

  return Component
}