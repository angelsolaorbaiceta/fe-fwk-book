export function createApp({ state, view, reducers = {} }) {
  let parentEl = null
  let vdom = null

  const dispatcher = new Dispatcher()
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

  // --add-- //
  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload)
  }
  // --add-- //
    
  // --snip-- //

  function renderApp() {
    if (vdom) {
      destroyDOM(vdom)
    }

    vdom = view(state, /* --add-- */emit/* --add-- */)
    mountDOM(vdom, parentEl)
  }
  
  // --snip-- //
}