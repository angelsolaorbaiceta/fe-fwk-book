import { destroyDOM } from './destroy-dom'
import { mountDOM } from './mount-dom'

/**
 * Defines a component that can be instantiated and mounted into the DOM.
 *
 * @param {*} param0
 * @returns
 */
export function defineComponent({ render }) {
  const Component = class {
    #isMounted = false
    #vdom = null

    /**
     * Renders the component, returning the virtual DOM tree representing
     * the component in its current state.
     */
    render() {
      return render()
    }

    /**
     * Mounts the component into the DOM.
     *
     * @param {HTMLElement} hostEl the host element to mount the component to
     */
    mount(hostEl) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }

      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl)

      this.#isMounted = true
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
  }

  return Component
}
