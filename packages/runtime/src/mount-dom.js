import { setAttributes } from './attributes'
import { DOM_TYPES, listenersKey } from './h'
import { assert } from './utils/assert'
import { addEventListeners } from './events'

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

function createElementNode(vdom, parentEl) {
  const { type, tag, props, children } = vdom

  assert(type === DOM_TYPES.ELEMENT)

  const element = document.createElement(tag)
  addProps(element, props)
  vdom.el = element

  children.forEach((child) => {
    element.appendChild(mountDOM(child, element))
  })

  parentEl.appendChild(element)

  return element
}

function addProps(el, props) {
  const { on: events, ...attrs } = props

  props[listenersKey] = addEventListeners(events, el)
  setAttributes(el, attrs)
}

function createFragmentNode(vdom, parentEl) {
  const { type, children } = vdom

  assert(type === DOM_TYPES.FRAGMENT)

  const fragment = document.createDocumentFragment()
  vdom.el = parentEl

  children.forEach((child) => {
    fragment.appendChild(mountDOM(child, fragment))
  })

  parentEl.appendChild(fragment)

  return fragment
}

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
