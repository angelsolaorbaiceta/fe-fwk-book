import equal from 'fast-deep-equal'
import { destroyDOM } from './destroy-dom'
// --add--
import { Dispatcher } from './dispatcher'
// --add--
import { DOM_TYPES, extractChildren } from './h'
import { mountDOM } from './mount-dom'
import { patchDOM } from './patch-dom'
import { hasOwnProperty } from './utils/objects'

export function defineComponent({ render, state, ...methods }) {
  class Component {
    #isMounted = false
    #vdom = null
    #hostEl = null
    #eventHandlers = null
    #parentComponent = null
    // --add--
    #dispatcher = new Dispatcher() // --1--
    #subscriptions = [] // --2--
    // --add--

    // --snip-- //

    // --add--
    #wireEventHandlers() {
      this.#subscriptions = Object.entries(this.#eventHandlers).map( // --3--
        ([eventName, handler]) => 
          this.#wireEventHandler(eventName, handler)
      )
    }

    #wireEventHandler(eventName, handler) {
      return this.#dispatcher.subscribe(eventName, (payload) => {
        if (this.#parentComponent) {
          handler.call(this.#parentComponent, payload) // --4--
        } else {
          handler(payload) // --5--
        }
      })
    }
    // --add--

    // --snip-- //
  }

  // --snip-- //

  return Component
}