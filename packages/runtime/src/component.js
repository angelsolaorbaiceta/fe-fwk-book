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

      const vdom = this.render()
      mountDOM(vdom, hostEl)

      this.#isMounted = true
    }
  }

  return Component
}
