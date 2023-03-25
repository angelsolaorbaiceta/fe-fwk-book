import { destroyDOM } from './destroy-dom'
import { mountDOM } from './mount-dom'
import { patchDOM } from './patch-dom'

/**
 * Defines a component that can be instantiated and mounted into the DOM.
 *
 * @param {*} param0
 * @returns
 */
export function defineComponent({ render, state }) {
  const Component = class {
    #isMounted = false
    #vdom = null
    #hostEl = null

    constructor(props = {}) {
      this.props = props
      this.state = state ? state(props) : {}
    }

    /**
     * Updates all or part of the component's props.
     *
     * @param {object} props
     */
    updateProps(props) {
      this.props = { ...this.props, ...props }
    }

    /**
     * Updates all or part of the component's state and patches the DOM.
     *
     * @param {object} state
     */
    updateState(state) {
      this.state = { ...this.state, ...state }
      this.patch()
    }

    /**
     * Renders the component, returning the virtual DOM tree representing
     * the component in its current state.
     */
    render() {
      return render.call(this)
    }

    /**
     * Mounts the component into the DOM.
     *
     * @param {HTMLElement} hostEl the host element to mount the component to
     */
    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }

      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index)

      this.#isMounted = true
      this.#hostEl = hostEl
    }

    /**
     * Unmounts the component from the DOM.
     */
    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      destroyDOM(this.#vdom)

      this.#vdom = null
      this.#isMounted = false
    }

    /**
     * Updates the component's virtual DOM tree and patches the DOM to
     * reflect the changes.
     */
    patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      const vdom = this.render()
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl)
    }
  }

  return Component
}
