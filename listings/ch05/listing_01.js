import { destroyDOM } from './destroy-dom'
import { Dispatcher } from './dispatcher'
import { mountDOM } from './mount-dom'
// --add--
import { patchDOM } from './patch-dom'
// --add--

export function createApp({ state, view, reducers = {} }) {
  let parentEl = null
  let vdom = null
  
  // --snip-- //
  
  function renderApp() {
    // --remove--
    //if (vdom) {
    //  destroyDOM(vdom)
    //}
    // --remove--
    // --add--
    const newVdom = view(state, emit)
    // --add--
    // --remove--
    //mountDOM(vdom, parentEl)
    // --remove--
    // --add--
    vdom = patchDOM(vdom, newVdom, parentEl)
    // --add--
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl
      // --remove--
      //renderApp()
      // --remove--
      // --add--
      vdom = view(state, emit)
      mountDOM(vdom, parentEl)
      // --add--
    },

    // --snip-- //
  }
}
