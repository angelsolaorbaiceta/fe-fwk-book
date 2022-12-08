import { destroyDOM } from './destroy-dom'
import { Dispatcher } from './dispatcher'
import { mountDOM } from './mount-dom'

/**
 * Creates an application with the given top-level view, initial state and
 * reducers.
 * A reducer is a function that takes the current state and a payload and
 * returns the new state.
 *
 * @param {object} config the configuration object, containing the view, reducers and initial state
 * @returns {object} the app object
 */
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
    if (vdom) {
      destroyDOM(vdom)
    }

    vdom = view(state, emit)
    mountDOM(vdom, parentEl)
  }

  return {
    /**
     * Mounts the application to the given host element.
     *
     * @param {Element} _parentEl the host element to mount the virtual DOM node to
     * @returns {object} the application object
     */
    mount(_parentEl) {
      parentEl = _parentEl
      renderApp()

      return this
    },

    /**
     * Unmounts the application from the host element.
     */
    unmount() {
      destroyDOM(vdom)
      vdom = null
      subscriptions.forEach((unsubscribe) => unsubscribe())
    },

    /**
     * Emits an event to the application.
     *
     * @param {string} eventName the name of the event to emit
     * @param {any} payload the payload to pass to the event listeners
     */
    emit(eventName, payload) {
      emit(eventName, payload)
    },
  }
}
