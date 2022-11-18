import { assert } from './assert'
import { DOM_TYPES } from './h'

/**
 * Creates the DOM nodes for a virtual DOM tree, mounts them in the DOM, and
 * modifies the vdom tree to include the corresponding DOM nodes.
 *
 * It returns the created DOM element.
 *
 * @param {object} oldVDom the virtual DOM node to mount
 * @param {HTMLElement} parentEl the host element to mount the virtual DOM node to
 */
export function mountDOM(vdom, parentEl) {
  ensureIsValidParent(parentEl)

  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      return createTextNode(vdom, parentEl)
    }

    case DOM_TYPES.ELEMENT: {
      return createElementNode(vdom, parentEl)
    }

    case DOM_TYPES.FRAGMENT: {
      return createFragmentNode(vdom, parentEl)
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}

function createTextNode(vdom, parentEl) {
  const { type, value } = vdom

  assert(type === DOM_TYPES.TEXT)

  const textNode = document.createTextNode(value)
  vdom.el = textNode

  parentEl.appendChild(textNode)

  return textNode
}

function createElementNode(vdom, parentEl) {}

function createFragmentNode(vdom, parentEl) {}

function ensureIsValidParent(
  parentEl,
  errMsg = 'A parent element must be provided'
) {
  if (!parent) {
    throw new Error(errMsg)
  }

  const isElement = parentEl instanceof HTMLElement
  const isFragment = parentEl instanceof DocumentFragment

  if (!(isElement || isFragment)) {
    throw new Error(errMsg)
  }
}
