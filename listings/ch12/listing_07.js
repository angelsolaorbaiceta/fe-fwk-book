import { mountDOM } from './mount-dom'
import { destroyDOM } from './destroy-dom'
import { h } from './h'

export function createApp(RootComponent, props = {}) { // --1--
  let parentEl = null
  let isMounted = false
  let vdom = null

  function reset() { // --2-- 
    parentEl = null
    isMounted = false
    vdom = null
  }

  return {
    mount(_parentEl) {
      if (isMounted) { // --3-- 
        throw new Error('The application is already mounted')
      }

      parentEl = _parentEl // --4--
      vdom = h(RootComponent, props) // --5--
      mountDOM(vdom, parentEl) // --6--

      isMounted = true
    },

    unmount() {
      if (!isMounted) { // --7--
        throw new Error('The application is not mounted')
      }

      destroyDOM(vdom) // --8--
      reset() // --9--
    },
  }
}