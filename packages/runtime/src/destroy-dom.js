import { removeEventListeners } from './events'
import { DOM_TYPES } from './h'
import { assert } from './utils/assert'

/**
 * Unmounts the DOM nodes for a virtual DOM tree recursively.
 *
 * Removes all `el` references from the vdom tree and removes all the event
 * listeners from the DOM.
 *
 * @param {object} vdom the virtual DOM node to destroy
 */
export function destroyDOM(vdom) {
  const { type, el, children, listeners } = vdom

  assert(!!el, 'Can only destroy DOM nodes that have been mounted')

  switch (type) {
    case DOM_TYPES.TEXT: {
      assert(el instanceof Text)
      el.remove()

      break
    }

    case DOM_TYPES.ELEMENT: {
      assert(el instanceof HTMLElement)
      el.remove()
      children.forEach(destroyDOM)
      if (listeners) {
        removeEventListeners(listeners, el)
      }

      break
    }

    case DOM_TYPES.FRAGMENT: {
      assert(el instanceof HTMLElement)
      children.forEach(destroyDOM)

      break
    }

    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`)
    }
  }

  delete vdom.el
}
