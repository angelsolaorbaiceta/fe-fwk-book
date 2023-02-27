import { setAttributes } from './attributes'
import { addEventListeners } from './events'
import { DOM_TYPES } from './h'

/**
 * Creates the DOM nodes for a virtual DOM tree, mounts them in the DOM, and
 * modifies the vdom tree to include the corresponding DOM nodes and event listeners.
 *
 * If an index is given, the created DOM node is inserted at that index in the parent element.
 * Otherwise, it is appended to the parent element.
 *
 * @param {import('./h').VNode} vdom the virtual DOM node to mount
 * @param {HTMLElement} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
export function mountDOM(vdom, parentEl, index) {
  ensureIsValidParent(parentEl)

  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index)
      break
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index)
      break
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNode(vdom, parentEl, index)
      break
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}

/**
 * Creates the text node for a virtual DOM text node.
 * The created `Text` is added to the `el` property of the vdom.
 *
 * Note that `Text` is a subclass of `CharacterData`, which is a subclass of `Node`,
 * but not of `Element`. Methods like `append()`, `prepend()`, `before()`, `after()`,
 * or `remove()` are not available on `Text` nodes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @param {import('./h').TextVNode} vdom the virtual DOM node of type "text"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
function createTextNode(vdom, parentEl, index) {
  const { value } = vdom

  const textNode = document.createTextNode(value)
  vdom.el = textNode

  insert(textNode, parentEl, index)
}

/**
 * Creates the HTML element for a virtual DOM element node and its children recursively.
 * The created `Element` is added to the `el` property of the vdom.
 *
 * If the vdom includes event listeners, these are added to the vdom object, under the
 * `listeners` property.
 *
 * @param {import('./h').ElementVNode} vdom the virtual DOM node of type "element"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
function createElementNode(vdom, parentEl, index) {
  const { tag, props, children } = vdom

  const element = document.createElement(tag)
  addProps(element, props, vdom)
  vdom.el = element

  children.forEach((child) => mountDOM(child, element))
  insert(element, parentEl, index)
}

/**
 * Adds the attributes and event listeners to an element.
 *
 * @param {Element} el The element to add the attributes to
 * @param {import('./h').ElementVNodeProps} props The props to add
 * @param {import('./h').ElementVNode} vdom The vdom node
 */
function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props

  vdom.listeners = addEventListeners(events, el)
  setAttributes(el, attrs)
}

/**
 * Creates the fragment for a virtual DOM fragment node and its children recursively.
 * The vdom's `el` property is set to be the `parentEl` passed to the function.
 * This is because a fragment loses its children when it is appended to the DOM, so
 * we can't use it to reference the fragment's children.
 *
 * Note that `DocumentFragment` is a subclass of `Node`, but not of `Element`.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment}
 *
 * @param {import('./h').FragmentVNode} vdom the virtual DOM node of type "fragment"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 */
function createFragmentNode(vdom, parentEl, index) {
  const { children } = vdom

  const fragment = document.createDocumentFragment()
  vdom.el = parentEl

  children.forEach((child) => mountDOM(child, fragment))
  insert(fragment, parentEl, index)
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

/**
 * Inserts `el` into `parentEl` at `index`.
 * If `index` is `null`, the element is appended to the end.
 *
 * @param {Element} el the element to be inserted
 * @param {Element} parentEl the host element
 * @param {number} [index] the index at which the element should be inserted. If null or undefined, it will be appended
 */
export function insert(el, parentEl, index) {
  // If index is null or undefined, simply append. Note the usage of `==` instead of `===`.
  if (index == null) {
    parentEl.append(el)
    return
  }

  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`)
  }

  const children = parentEl.childNodes

  if (index >= children.length) {
    parentEl.append(el)
  } else {
    parentEl.insertBefore(el, children[index])
  }
}
