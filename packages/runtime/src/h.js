import { withoutNulls } from './utils/arrays'
import { assert } from './utils/assert'

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
  COMPONENT: 'component',
}

/**
 * A virtual node is an object representing a DOM element.
 * The virtual node can be a text node, an element node or a fragment node.
 * @typedef VNode
 * @type {TextVNode|ElementVNode|FragmentVNode}
 */

/**
 * @typedef ElementVNode
 * @type {object}
 * @property {string} tag - The tag of the element.
 * @property {string} type - The type of the virtual node = 'element'.
 * @property {ElementVNodeProps} props - The attributes of the element.
 * @property {VNode[]} children - The children of the element.
 * @property {HTMLElement} [el] - The mounted element.
 * @property {Object.<string,Function>} [listeners] - The event listeners added to the element.
 */

/**
 * @typedef ElementVNodeProps
 * @type {object}
 * @property {Object.<string,Function>} [on] - The event listeners to add to the element.
 * @property {(string|string[])} [class] - The class or classes to add to the element.
 * @property {Object.<string,string>} [style] - The CSS properties to add to the element.
 */

/**
 * Hypertext function: creates a virtual node representing an element with
 * the passed in tag or component constructor.
 *
 * The props are added to the element as attributes.
 * There are some special props:
 * - `on`: an object containing event listeners to add to the element
 * - `class`: a string or array of strings to add to the element's class list
 * - `style`: an object containing CSS properties to add to the element's style
 *
 * The children are added to the element as child nodes.
 * If a child is a string, it is converted to a text node using `hString()`.
 *
 * @param {(string|object)} tag the tag name of the element
 * @param {object} props the props to add to the element
 * @param {array} children the children to add to the element
 * @returns {ElementVNode} the virtual node
 */
export function h(tag, props = {}, children = []) {
  const type =
    typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT

  return {
    tag,
    props,
    type,
    children: mapTextNodes(withoutNulls(children)),
  }
}

/**
 * @typedef TextVNode
 * @type {object}
 * @property {string} type - The type of the virtual node = 'text'.
 * @property {string} value - The text of the text node.
 * @property {Text} [el] - The mounted element.
 */

/**
 * Creates a text virtual node.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @param {string} str the text to add to the text node
 * @returns {TextVNode} the virtual node
 */
export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str }
}

/**
 * @typedef FragmentVNode
 * @type {object}
 * @property {string} type - The type of the virtual node = 'fragment'.
 * @property {VNode[]} children - The children of the fragment.
 * @property {DocumentFragment} [el] - The mounted element, typically the parent of the fragment.
 * @property {FragmentVNode} [parentFragment] - The parent fragment, if any.
 */

/**
 * Wraps the virtual nodes in a fragment.
 *
 * If a child is a string, it is converted to a text node using `hString()`.
 *
 * @param {array} vNodes the virtual nodes to wrap in a fragment
 * @returns {FragmentVNode} the virtual node
 */
export function hFragment(vNodes) {
  assert(Array.isArray(vNodes), 'hFragment expects an array of vNodes')

  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  }
}

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === 'string' ? hString(child) : child
  )
}

/**
 * Extracts the children of a virtual node. If one of the children is a
 * fragment, its children are extracted and added to the list of children.
 * In other words, the fragments are replaced by their children.
 *
 * @param {FragmentVNode} vdom
 * @returns {VNode[]} the children of the virtual node
 */
export function extractChildren(vdom) {
  if (vdom.children == null) {
    return []
  }

  const children = []

  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child, children))
    } else {
      children.push(child)
    }
  }

  return children
}
