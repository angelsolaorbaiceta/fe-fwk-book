export function createApp({ state, view, reducers = {} }) {
  let parentEl = null
  let vdom = null

  // --snip-- //
  
  return {
    mount(_parentEl) {
      parentEl = _parentEl
      renderApp()
    },

    // --add-- //
    unmount() {
      destroyDOM(vdom)
      vdom = null
      subscriptions.forEach((unsubscribe) => unsubscribe())
    },
    // --add-- //
  }
}
