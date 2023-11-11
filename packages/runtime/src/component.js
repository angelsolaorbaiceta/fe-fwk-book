import equal from 'fast-deep-equal'
import { destroyDOM } from './destroy-dom'
import { Dispatcher } from './dispatcher'
import {
  DOM_TYPES,
  didCreateSlot,
  extractChildren,
  resetDidCreateSlot,
} from './h'
import { mountDOM } from './mount-dom'
import { patchDOM } from './patch-dom'
import { hasOwnProperty } from './utils/objects'
import { fillSlots } from './slots'

const emptyFn = () => {}

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
 * @property {() => Promise<void>} onMounted - The component's onMounted lifecycle hook.
 * @property {() => Promise<void>} onUnmounted - The component's onUnmounted lifecycle hook.
 * @property {Object<string, Function>} methods - The component's methods.
 */

/**
 * Defines a component that can be instantiated and mounted into the DOM.
 *
 * @param {DefineComponentArgs} definitionArguments
 * @returns {Component}
 */
export function defineComponent({
  render,
  state,
  onMounted = emptyFn,
  onUnmounted = emptyFn,
  ...methods
}) {
  class Component {
    #isMounted = false
    #vdom = null
    #hostEl = null
    #eventHandlers = null
    #parentComponent = null
    #dispatcher = new Dispatcher()
    #subscriptions = []

    /**
     * @type {import('./h').VNode[]}
     * Array of external VNodes passed to the component as children, to be inserted
     * in place of the defined slot.
     */
    #children = []

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

    onMounted() {
      return Promise.resolve(onMounted.call(this))
    }

    onUnmounted() {
      return Promise.resolve(onUnmounted.call(this))
    }

    get parentComponent() {
      return this.#parentComponent
    }

    get vdom() {
      return this.#vdom
    }

    /**
     * Returns the component's mounted element or elements, if the component is a fragment.
     * If the component is not mounted, returns an empty array.
     *
     * @returns {Array.<Element>}
     */
    get elements() {
      if (this.#vdom == null) {
        return []
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return extractChildren(this.#vdom).flatMap((child) => {
          if (child.type === DOM_TYPES.COMPONENT) {
            return child.component.elements
          }

          return [child.el]
        })
      }

      return [this.#vdom.el]
    }

    get firstElement() {
      return this.elements[0]
    }

    /**
     * Returns the component's offset (with respect with the component's first element) in the DOM,
     * when the component's top-level node is a fragment.
     *
     * When the component's top-level node is not a fragment, returns 0, as the component is
     * considered to not be offset.
     */
    get offset() {
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return Array.from(this.#hostEl.children).indexOf(this.firstElement)
      }

      return 0
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
      const newProps = { ...this.props, ...props }
      if (equal(this.props, newProps)) {
        return
      }

      this.props = newProps
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

    /**
     * Saves the views passed as children to the vdom that defines the component.
     * When the component render method is called, this views are placed in the
     * corresponding slots.
     *
     * Call this method before `updateProps()` or `updateState()` to ensure that
     * the views are rendered with the updated external content.
     *
     * @param {import('./h').VNode[]} children The slot views to set
     */
    setExternalContent(children) {
      this.#children = children
    }

    /**
     * Fills in the slots of the component's virtual DOM tree with the passed
     * in children, and returns the resulting virtual DOM tree.
     *
     * @returns {import('./h').VNode} the virtual DOM tree representing the component in its current state
     */
    render() {
      const vdom = render.call(this)

      if (didCreateSlot()) {
        fillSlots(vdom, this.#children)
        resetDidCreateSlot()
      }

      return vdom
    }

    /**
     * Mounts the component into the parent HTML element and wires the event handlers.
     * Then calls the `onMounted()` lifecycle method and returns a promise that resolves
     * when the `onMounted()` method resolves.
     *
     * @param {HTMLElement} hostEl the element into which the component should be mounted
     * @param {[number]} index the index in the parent element at which the component should be mounted
     */
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

    /**
     * Unmounts the component from the DOM and calls the `onUnmounted()` lifecycle method.
     */
    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      destroyDOM(this.#vdom)
      this.#subscriptions.forEach((unsubscribe) => unsubscribe())

      this.#vdom = null
      this.#isMounted = false
      this.#hostEl = null
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
