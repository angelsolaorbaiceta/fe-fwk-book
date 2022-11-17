import { Dispatcher } from './dispatcher'
import { mountDOM } from './mount-dom'

export function createApp({ state, view, reducers = {} }) {
  let parentEl = null

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
    const oldVDom = view(state, emit)
    mountDOM(oldVDom, parentEl)
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl
      renderApp()

      return this
    },

    unmount() {
      parentEl.replaceChildren()
      subscriptions.forEach((unsubscribe) => unsubscribe())
    },

    emit(eventName, payload) {
      emit(eventName, payload)
    },
  }
}
