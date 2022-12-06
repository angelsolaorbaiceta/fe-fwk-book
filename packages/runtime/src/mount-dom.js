import { setAttributes } from './attributes'
import { DOM_TYPES, hString } from './h'
import { assert } from './utils/assert'
import { addEventListeners } from './events'

/**
 * Creates the DOM nodes for a virtual DOM tree, mounts them in the DOM, and
 * modifies the vdom tree to include the corresponding DOM nodes and event listeners.
 *
 * It returns the created DOM element.
 *
 * @param {object} oldVDom the virtual DOM node to mount
 * @param {HTMLElement} parentEl the host element to mount the virtual DOM node to
 * @returns {Node} the created node
 */
export function mountDOM(vdom, parentEl) {
  ensureIsValidParent(parentEl)
  vdom = typeof vdom === 'string' ? hString(vdom) : vdom

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

/**
 * Creates the text node for a virtual DOM text node.
 * The created `Text` is returned as well as added to the `el` property of the vdom.
 *
 * Note that `Text` is a subclass of `CharacterData`, which is a subclass of `Node`,
 * but not of `Element`. Methods like `append()`, `prepend()`, `before()`, `after()`,
 * or `remove()` are not available on `Text` nodes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @param {object} vdom the virtual DOM node of type "text"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @returns {Text} the created text node
 */
function createTextNode(vdom, parentEl) {
  const { type, value } = vdom

  assert(type === DOM_TYPES.TEXT)

  const textNode = document.createTextNode(value)
  vdom.el = textNode

  parentEl.append(textNode)

  return textNode
}

/**
 * Creates the HTML element for a virtual DOM element node and its children recursively.
 * The created `Element` is returned as well as added to the `el` property of the vdom.
 *
 * If the vdom includes event listeners, these are added to the vdom object, under the
 * `listeners` property.
 *
 * @param {object} vdom the virtual DOM node of type "element"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @returns {HTMLElement} the created element
 */
function createElementNode(vdom, parentEl) {
  const { type, tag, props, children } = vdom

  assert(type === DOM_TYPES.ELEMENT)
  assert(Array.isArray(children))

  const element = document.createElement(tag)
  addProps(element, props, vdom)
  vdom.el = element

  element.append(...children.map((child) => mountDOM(child, element)))
  parentEl.append(element)

  return element
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props

  vdom.listeners = addEventListeners(events, el)
  setAttributes(el, attrs)
}

/**
 * Creates the fragment for a virtual DOM fragment node and its children recursively.
 * The created `DocumentFragment` is returned, but the vdom's `el` property is set to
 * be the `parentEl` passed to the function.
 * This is because a fragment loses its children when it is appended to the DOM, so
 * we can't use it to reference the fragment's children.
 *
 * Note that `DocumentFragment` is a subclass of `Node`, but not of `Element`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment}
 * @param {object} vdom the virtual DOM node of type "fragment"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @returns {DocumentFragment} the created fragment
 */
function createFragmentNode(vdom, parentEl) {
  const { type, children } = vdom

  assert(type === DOM_TYPES.FRAGMENT)
  assert(Array.isArray(children))

  const fragment = document.createDocumentFragment()
  vdom.el = parentEl

  fragment.append(...children.map((child) => mountDOM(child, fragment)))
  parentEl.append(fragment)

  return fragment
}

function ensureIsValidParent(
  parentEl,
  errMsg = 'A parent element must be provided'
) {
  if (!parent) {
    throw new Error(errMsg)
  }

  const isElement = parentEl instanceof Element
  const isFragment = parentEl instanceof DocumentFragment

  if (!(isElement || isFragment)) {
    throw new Error(errMsg)
  }
}
