import { destroyDOM } from './destroy-dom'
// --add--
import { Dispatcher } from './dispatcher'
// --add--
import { mountDOM } from './mount-dom'

export function createApp({ state, view, /* --add-- */reducers = {}/* --add-- */ }) {
  let parentEl = null
  let vdom = null

  // --add--
  const dispatcher = new Dispatcher()
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)] // --1--

  for (const actionName in reducers) {
    const reducer = reducers[actionName]

    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload) // --2--
    })
    subscriptions.push(subs) // --3--
  }
  // --add--

  // --snip-- //
}
