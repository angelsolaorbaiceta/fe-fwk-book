import { setAttributes } from './attributes'
import { addEventListeners } from './events'
import { DOM_TYPES } from './h'
import { extractPropsAndEvents } from './utils/props'

/**
 * Creates the DOM nodes for a virtual DOM tree, mounts them in the DOM, and
 * modifies the vdom tree to include the corresponding DOM nodes and event listeners.
 *
 * If an index is given, the created DOM node is inserted at that index in the parent element.
 * Otherwise, it is appended to the parent element.
 *
 * If a host component is given, the event listeners attached to the DOM nodes are bound to
 * the host component.
 *
 * @param {import('./h').VNode} vdom the virtual DOM node to mount
 * @param {HTMLElement} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index)
      break
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index, hostComponent)
      break
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, index, hostComponent)
      break
    }

    case DOM_TYPES.COMPONENT: {
      createComponentNode(vdom, parentEl, index, hostComponent)
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
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function createElementNode(vdom, parentEl, index, hostComponent) {
  const { tag, children } = vdom

  const element = document.createElement(tag)
  addProps(element, vdom, hostComponent)
  vdom.el = element

  children.forEach((child) => mountDOM(child, element, null, hostComponent))
  insert(element, parentEl, index)
}

/**
 * Adds the attributes and event listeners to an element.
 *
 * @param {Element} el The element to add the attributes to
 * @param {import('./h').ElementVNode} vdom The vdom node
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function addProps(el, vdom, hostComponent) {
  const { props: attrs, events } = extractPropsAndEvents(vdom)

  vdom.listeners = addEventListeners(events, el, hostComponent)
  setAttributes(el, attrs)
}

/**
 * Creates the nodes for the children of a virtual DOM fragment node and appends them to the
 * parent element.
 *
 * @param {import('./h').FragmentVNode} vdom the virtual DOM node of type "fragment"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function createFragmentNodes(vdom, parentEl, index, hostComponent) {
  const { children } = vdom
  vdom.el = parentEl

  children.forEach((child, i) =>
    mountDOM(child, parentEl, index ? index + i : null, hostComponent)
  )
}

/**
 * Creates the component node, and all of its subcomponents recursively.
 *
 * The created `Component` is added to the `component` property of the vdom.
 * The created `Element` is added to the `el` property of the vdom. If the component
 * has a fragment, and thus several top-level elements, the first one is added to the `el`.
 *
 * The use case for the `el` reference is the reconciliation algorithm. In the case of
 * a component, it's sole use is to move a component to a different position using the
 * `insertBefore()` method. To insert an element before a component, the `el` property
 * points at the component's first element.
 *
 * @param {import('./h').FragmentVNode} vdom the virtual DOM node of type "fragment"
 * @param {Element} parentEl the host element to mount the virtual DOM node to
 * @param {number} [index] the index at the parent element to mount the virtual DOM node to
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function createComponentNode(vdom, parentEl, index, hostComponent) {
  const Component = vdom.tag
  const { props, events } = extractPropsAndEvents(vdom)
  const component = new Component(props, events, hostComponent)

  component.mount(parentEl, index)
  vdom.component = component
  vdom.el = component.firstElement
}

/**
 * Inserts `el` into `parentEl` at `index`.
 * If `index` is `null`, the element is appended to the end.
 *
 * @param {Element} el the element to be inserted
 * @param {Element} parentEl the host element
 * @param {number} [index] the index at which the element should be inserted. If null or undefined, it will be appended
 */
function insert(el, parentEl, index) {
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
