import { removeEventListeners } from './events'
import { DOM_TYPES } from './h'
import { assert } from './utils/assert'

/**
 * Unmounts the DOM nodes for a virtual DOM tree recursively.
 *
 * Removes all `el` references from the vdom tree and removes all the event
 * listeners from the DOM.
 *
 * @param {import('./h').VNode} vdom the virtual DOM node to destroy
 */
export function destroyDOM(vdom) {
  const { type, el } = vdom

  assert(!!el, 'Can only destroy DOM nodes that have been mounted')

  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vdom)
      break
    }

    case DOM_TYPES.ELEMENT: {
      removeElementNode(vdom)
      break
    }

    case DOM_TYPES.FRAGMENT: {
      removeFragmentNodes(vdom)
      break
    }

    case DOM_TYPES.COMPONENT: {
      vdom.component.unmount()
      break
    }

    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`)
    }
  }

  delete vdom.el
}

function removeTextNode(vdom) {
  const { el } = vdom

  assert(el instanceof Text)

  el.remove()
}

function removeElementNode(vdom) {
  const { el, children, listeners } = vdom

  assert(el instanceof HTMLElement)

  el.remove()
  children.forEach(destroyDOM)

  if (listeners) {
    removeEventListeners(listeners, el)
    delete vdom.listeners
  }
}

function removeFragmentNodes(vdom) {
  const { el, children } = vdom

  assert(el instanceof HTMLElement)

  children.forEach(destroyDOM)
}
