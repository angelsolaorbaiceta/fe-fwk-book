import { mountDOM } from './mount-dom'
import { destroyDOM } from './destroy-dom'
import { h } from './h'

/**
 * @typedef Application
 * @type {object}
 *
 * @property {(parentEl: HTMLElement) => void} mount - Mounts the application into the DOM.
 * @property {function} unmount - Unmounts the application from the DOM.
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
  let vdom = null

  function reset() {
    parentEl = null
    isMounted = false
    vdom = null
  }

  return {
    mount(_parentEl) {
      if (isMounted) {
        throw new Error('The application is already mounted')
      }

      parentEl = _parentEl
      vdom = h(RootComponent, props)
      mountDOM(vdom, parentEl)

      isMounted = true
    },

    unmount() {
      if (!isMounted) {
        throw new Error('The application is not mounted')
      }

      destroyDOM(vdom)
      reset()
    },
  }
}
