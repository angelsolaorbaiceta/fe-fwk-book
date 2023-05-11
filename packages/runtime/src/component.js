import { destroyDOM } from './destroy-dom'
import { Dispatcher } from './dispatcher'
import { mountDOM } from './mount-dom'
import { patchDOM } from './patch-dom'
import { hasOwnProperty } from './utils/objects'

/**
 * @typedef Component
 * @type {object}
 * @property {function} mount - Mounts the component into the DOM.
 * @property {function} unmount - Unmounts the component from the DOM.
 * @property {function} patch - Updates the component's virtual DOM tree and patches the DOM to reflect the changes.
 * @property {function} updateProps - Updates all or part of the component's props.
 * @property {function} updateState - Updates all or part of the component's state and patches the DOM.
 */

/**
 * @typedef DefineComponentArgs
 * @type {object}
 * @property {function} render - The component's render function returning the virtual DOM tree representing the component in its current state.
 * @property {(props: Object?) => Object} state - The component's state function returning the component's initial state.
 * @property {Object<string, Function>} methods - The component's methods.
 */

/**
 * Defines a component that can be instantiated and mounted into the DOM.
 *
 * @param {DefineComponentArgs} definitionArguments
 * @returns {Component}
 */
export function defineComponent({ render, state, ...methods }) {
  const Component = class {
    #isMounted = false
    #vdom = null
    #hostEl = null
    #eventHandlers = null
    #dispatcher = new Dispatcher()
    #subscriptions = []
    #parentComponent = null

    /**
     * Creates an instance of the component.
     * Each instance has its own props, state and lifecycle independent of other instances.
     *
     * @param {Object.<string, Any>} props the component's props
     * @param {Object.<string, Function>} eventHandlers the component's event handlers
     * @param {Component} parentComponent the component that created this component
     */
    constructor(props = {}, eventHandlers = {}, parentComponent = null) {
      this.props = props
      this.state = state ? state(props) : {}
      this.#eventHandlers = eventHandlers
      this.#parentComponent = parentComponent
    }

    get parentComponent() {
      return this.#parentComponent
    }

    get vdom() {
      return this.#vdom
    }

    /**
     * Updates all or part of the component's props and patches the DOM to reflect the changes.
     * This method shouldn't be called from within the component's code, as a component
     * shouldn't update its own props. Instead, the parent component should update the props
     * of its child components.
     *
     * @param {Object.<string, Any>} props the new props to be merged with the existing props
     */
    updateProps(props) {
      this.props = { ...this.props, ...props }
      this.#patch()
    }

    /**
     * Updates all or part of the component's state and patches the DOM to reflect the changes.
     *
     * @param {Object.<string, Any>} state the new state to be merged with the existing state
     */
    updateState(state) {
      this.state = { ...this.state, ...state }
      this.#patch()
    }

    render() {
      return render.call(this)
    }

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }

      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index, this)
      this.#wireEventHandlers()

      this.#isMounted = true
      this.#hostEl = hostEl
    }

    #wireEventHandlers() {
      this.#subscriptions = Object.entries(this.#eventHandlers).map(
        ([eventName, handler]) => this.#wireEventHandler(eventName, handler)
      )
    }

    #wireEventHandler(eventName, handler) {
      return this.#dispatcher.subscribe(eventName, (payload) => {
        if (this.#parentComponent) {
          handler.call(this.#parentComponent, payload)
        } else {
          handler(payload)
        }
      })
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      destroyDOM(this.#vdom)
      this.#subscriptions.forEach((unsubscribe) => unsubscribe())

      this.#vdom = null
      this.#isMounted = false
      this.#subscriptions = []
    }

    /**
     * Emits an event to the parent component.
     *
     * @param {string} eventName The name of the event to emit
     * @param {Any} [payload] The payload to pass to the event handler
     */
    emit(eventName, payload) {
      this.#dispatcher.dispatch(eventName, payload)
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      const vdom = this.render()
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this)
    }
  }

  for (const methodName in methods) {
    if (hasOwnProperty(Component, methodName)) {
      throw new Error(
        `Method "${methodName}()" already exists in the component. Can't override existing methods.`
      )
    }

    Component.prototype[methodName] = methods[methodName]
  }

  return Component
}
