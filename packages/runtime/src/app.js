/**
 * @typedef Application
 * @type {object}
 *
 * @property {(parentEl: HTMLElement) => void} mount - Mounts the application into the DOM.
 * @property {function} unmount - Unmounts the application from the DOM.
 */

/**
 * Creates an application with the given top-level component.
 * When the application is mounted, the top level component is instantiated with the given props
 * and mounted into the DOM.
 *
 * @param {import('./component').Component} ParentComponent the top-level component of the application
 * @param {Object.<string, Any>} props the top-level component's props
 *
 * @returns {Application} the app object
 */
export function createApp(ParentComponent, props = {}) {
  let parentEl = null
  let isMounted = false
  let component = null

  function reset() {
    parentEl = null
    isMounted = false
    component = null
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl
      component = new ParentComponent(props)
      component.mount(parentEl)

      isMounted = true
    },

    unmount() {
      if (!isMounted) {
        return
      }

      component.unmount()
      reset()
    },
  }
}
