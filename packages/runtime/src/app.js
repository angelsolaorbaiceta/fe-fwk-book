import { destroyDOM } from './destroy-dom'
import { h } from './h'
import { mountDOM } from './mount-dom'
import { HashRouter } from './router'

/**
 * @typedef Application
 * @type {object}
 *
 * @property {(parentEl: HTMLElement) => void} mount - Mounts the application into the DOM.
 * @property {function} unmount - Unmounts the application from the DOM.
 */

/**
 * @typedef AppOptions
 * @type {object}
 *
 * @property {import('./router').Route[]} routes - The routes of the application
 */

/**
 * Creates an application with the given root component (the top-level component in the view tree).
 * When the application is mounted, the root component is instantiated with the given props
 * and mounted into the DOM.
 *
 * @param {import('./component').Component} RootComponent the top-level component of the application's view tree
 * @param {Object.<string, Any>} props the top-level component's props
 * @param {AppOptions} options the options of the application
 *
 * @returns {Application} the app object
 */
export function createApp(RootComponent, props = {}, { routes } = {}) {
  let parentEl = null
  let isMounted = false
  let vdom = null

  const context = {
    router: new HashRouter(routes ?? []),
  }

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
      mountDOM(vdom, parentEl, null, { appContext: context })

      context.router.init()

      isMounted = true
    },

    unmount() {
      if (!isMounted) {
        throw new Error('The application is not mounted')
      }

      destroyDOM(vdom)
      context.router.destroy()
      reset()
    },
  }
}
