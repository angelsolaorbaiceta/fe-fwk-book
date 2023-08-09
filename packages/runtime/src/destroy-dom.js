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
 *
 * @returns {Promise<void>} a promise that resolves when the DOM is destroyed
 */
export async function destroyDOM(vdom) {
  const { type, el } = vdom

  assert(!!el, 'Can only destroy DOM nodes that have been mounted')

  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vdom)
      break
    }

    case DOM_TYPES.ELEMENT: {
      await removeElementNode(vdom)
      break
    }

    case DOM_TYPES.FRAGMENT: {
      await removeFragmentNodes(vdom)
      break
    }

    case DOM_TYPES.COMPONENT: {
      try {
        await vdom.component.unmount()
      } catch (err) {
        console.error(
          `Error unmounting component: ${err.message}`,
          vdom.component
        )
      }
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

async function removeElementNode(vdom) {
  const { el, children, listeners } = vdom

  assert(el instanceof HTMLElement)

  el.remove()
  for (const child of children) {
    await destroyDOM(child)
  }

  if (listeners) {
    removeEventListeners(listeners, el)
    delete vdom.listeners
  }
}

async function removeFragmentNodes(vdom) {
  const { el, children } = vdom

  assert(el instanceof HTMLElement)

  for (const child of children) {
    await destroyDOM(child)
  }
}
