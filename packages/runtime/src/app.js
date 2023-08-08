/**
 * @typedef Application
 * @type {object}
 *
 * @property {(parentEl: HTMLElement) => Promise<void>} mount - Mounts the application into the DOM.
 * @property {() => Promise<void>} unmount - Unmounts the application from the DOM.
 */

/**
 * Creates an application with the given root component (the top-level component in the view tree).
 * When the application is mounted, the root component is instantiated with the given props
 * and mounted into the DOM.
 *
 * @param {import('./component').Component} RootComponent the top-level component of the application's view tree
 * @param {Object.<string, Any>} props the top-level component's props
 *
 * @returns {Application} the app object
 */
export function createApp(RootComponent, props = {}) {
  let parentEl = null
  let isMounted = false
  let component = null

  function reset() {
    parentEl = null
    isMounted = false
    component = null
  }

  return {
    async mount(_parentEl) {
      if (isMounted) {
        throw new Error('The application is already mounted')
      }

      parentEl = _parentEl
      component = new RootComponent(props)
      await component.mount(parentEl)

      isMounted = true
    },

    async unmount() {
      if (!isMounted) {
        throw new Error('The application is not mounted')
      }

      await component.unmount()
      reset()
    },
  }
}
