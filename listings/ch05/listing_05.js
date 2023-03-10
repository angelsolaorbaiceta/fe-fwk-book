import { destroyDOM } from './destroy-dom'
import { mountDOM } from './mount-dom'

export function createApp({ state, view }) { // --1--
  let parentEl = null
  let vdom = null

  function renderApp() {
    if (vdom) {
      destroyDOM(vdom) // --2--
    }

    vdom = view(state) 
    mountDOM(vdom, parentEl) // --3--
  }

  return {
    mount(_parentEl) { // --4--
      parentEl = _parentEl
      renderApp()
    },
  }
}
