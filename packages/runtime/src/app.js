import { destroyDOM } from './destroy-dom'
import { Dispatcher } from './dispatcher'
import { mountDOM } from './mount-dom'

export function createApp({ state, view, reducers = {} }) {
  let parentEl = null
  let vdom = null

  const dispatcher = new Dispatcher()
  const subscriptions = [dispatcher.subscribeToAll(renderApp)]
  const emit = (eventName, payload) =>
    dispatcher.dispatch(eventName, payload)

  // Attach reducers
  // Reducer = f(state, payload) => state
  for (const actionName in reducers) {
    const reducer = reducers[actionName]

    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload)
    })
    subscriptions.push(subs)
  }

  function renderApp() {
    vdom = view(state, emit)
    mountDOM(vdom, parentEl)
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl
      renderApp()

      return this
    },

    unmount() {
      destroyDOM(vdom)
      subscriptions.forEach((unsubscribe) => unsubscribe())
    },

    emit(eventName, payload) {
      emit(eventName, payload)
    },
  }
}
