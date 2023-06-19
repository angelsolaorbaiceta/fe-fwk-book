import {
  removeAttribute,
  removeStyle,
  setAttribute,
  setStyle,
} from './attributes'
import { destroyDOM } from './destroy-dom'
import { addEventListener } from './events'
import { DOM_TYPES, extractChildren } from './h'
import { mountDOM } from './mount-dom'
import { areNodesEqual } from './nodes-equal'
import {
  arraysDiff,
  arraysDiffSequence,
  ARRAY_DIFF_OP,
} from './utils/arrays'
import { objectsDiff } from './utils/objects'
import { extractPropsAndEvents } from './utils/props'
import { isNotBlankOrEmptyString } from './utils/strings'

/**
 * Patches the DOM by comparing the `oldVdom` and `newVdom` virtual nodes and
 * finding the changes that need to be applied to the DOM.
 *
 * This function requires the `oldVdom` tree to have an `el` property set in
 * all its nodes, that is, the `oldVdom` tree must have been mounted before.
 *
 * The function sets the `el` property in the `newVdom` tree to the same
 * elements as in the `oldVdom` tree, but with the changes applied. If a node
 * in the new tree is new, it'll be mounted and its `el` property set.
 *
 * @param {import('./h').VNode} oldVdom the old virtual dom
 * @param {import('./h').VNode} newVdom the new virtual dom
 * @param {Node} parentEl the parent element
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 *
 * @returns {Element} the patched element
 */
export function patchDOM(oldVdom, newVdom, parentEl, hostComponent = null) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = findIndexInParent(parentEl, oldVdom.el)
    destroyDOM(oldVdom)
    mountDOM(newVdom, parentEl, index, hostComponent)

    return newVdom
  }

  newVdom.el = oldVdom.el

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom)
      return newVdom
    }

    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom, newVdom, hostComponent)
      break
    }

    case DOM_TYPES.COMPONENT: {
      patchComponent(oldVdom, newVdom)
      break
    }
  }

  patchChildren(oldVdom, newVdom, hostComponent)

  return newVdom
}

/**
 * Returns the index of the `el` element in its parent's children.
 * If the element is not found, returns `null`.
 *
 * @param {Element} parentEl the parent element
 * @param {Element} el the element to find
 * @returns {number | null} index
 */
function findIndexInParent(parentEl, el) {
  const index = Array.from(parentEl.childNodes).indexOf(el)
  if (index < 0) {
    return null
  }

  return index
}

/**
 * Patches a text virtual node.
 *
 * If the `newVdom.value` (its text content) is different from the `oldVdom.value`,
 * the `Text` node `nodeValue` property is updated with the new value.
 *
 * @param {import('./h').TextVNode} oldVdom The old virtual node
 * @param {import('./h').TextVNode} newVdom The new virtual node
 */
function patchText(oldVdom, newVdom) {
  const el = oldVdom.el
  const { value: oldText } = oldVdom
  const { value: newText } = newVdom

  if (oldText !== newText) {
    el.nodeValue = newText
  }
}

/**
 * Patches an element virtual node.
 *
 * Patching an element requires to patch its attributes, class, style and events.
 * (The element's children are patched separately.)
 *
 * @param {import('./h').ElementVNode} oldVdom the old virtual node
 * @param {import('./h').ElementVNode} newVdom the new virtual node
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function patchElement(oldVdom, newVdom, hostComponent) {
  const el = oldVdom.el
  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props
  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props
  const { listeners: oldListeners } = oldVdom

  patchAttrs(el, oldAttrs, newAttrs)
  patchClasses(el, oldClass, newClass)
  patchStyles(el, oldStyle, newStyle)
  newVdom.listeners = patchEvents(
    el,
    oldListeners,
    oldEvents,
    newEvents,
    hostComponent
  )
}

/**
 * Patches the attributes of an element virtual node.
 *
 * The attributes are patched by removing the old attributes and setting the value
 * of the new and modified attributes.
 *
 * @param {Element} el the element to patch
 * @param {Object.<string, string>} oldAttrs the attributes of the old virtual node
 * @param {Object.<string, string>} newAttrs the attributes of the new virtual node
 */
function patchAttrs(el, oldAttrs, newAttrs) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs)

  for (const attr of removed) {
    removeAttribute(el, attr)
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr])
  }
}

/**
 * Patches the class(es) of an element.
 *
 * The class(es) are patched by removing the old class(es) and adding the new
 * and modified class(es).
 *
 * @param {Node} el The element to patch
 * @param {string[]|string} [oldClass] the class(es) of the old virtual node
 * @param {string[]|string} [newClass] the class(es) of the new virtual node
 */
function patchClasses(el, oldClass, newClass) {
  const oldClasses = toClassList(oldClass)
  const newClasses = toClassList(newClass)

  const { added, removed } = arraysDiff(oldClasses, newClasses)

  if (removed.length > 0) {
    el.classList.remove(...removed)
  }
  if (added.length > 0) {
    el.classList.add(...added)
  }
}

/**
 * Extracts a list of classes from the given class string or array.
 * If the given class is undefined, an empty array is returned.
 *
 * @param {(string[]|string} [classes] the class string or array
 * @returns {string[]} the class list
 */
function toClassList(classes = '') {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString)
}

/**
 * Patches the style of an element.
 *
 * The style is patched by removing the styles that were in the old virtual node
 * but not in the new virtual node, and by setting the value of the new and
 * modified styles.
 *
 * @param {Node} el the element to patch
 * @param {Object.<string, string>} [oldStyle] the style object of the old virtual node
 * @param {Object.<string, string>} [newStyle] the style object of the new virtual node
 */
function patchStyles(el, oldStyle = {}, newStyle = {}) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle)

  for (const style of removed) {
    removeStyle(el, style)
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style])
  }
}

/**
 * Patches the event listeners of an element.
 *
 * The events are patched by removing the event listeners that were removed or
 * modified in the new virtual node, and by adding the added and modified event
 * listeners.
 *
 * @param {Element} el the element to patch
 * @param {Object.<string, Function>} oldListeners the listeners added to the DOM
 * @param {Object.<string, Function>} oldEvents the events of the old virtual node
 * @param {Object.<string, Function>} newEvents the events of the new virtual node
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 *
 * @returns {Object.<string, Function>} the listeners that were added
 */
function patchEvents(
  el,
  oldListeners = {},
  oldEvents = {},
  newEvents = {},
  hostComponent
) {
  const { removed, added, updated } = objectsDiff(oldEvents, newEvents)

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName])
  }

  const addedListeners = {}

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(
      eventName,
      newEvents[eventName],
      el,
      hostComponent
    )
    addedListeners[eventName] = listener
  }

  return addedListeners
}

/**
 * Patches a component virtual node.
 *
 * To patch a component, the new props are passed to the component's `updateProps()`.
 * This method is responsible for updating the component's state and re-rendering
 * the component. Calling `updateProps()` will cause call the component's `#patch()`
 * method, which will in turn use the `patchDOM()` function to patch the DOM.
 *
 * @param {import('./h').ElementVNode} oldVdom the old virtual node
 * @param {import('./h').ElementVNode} newVdom the new virtual node
 */
function patchComponent(oldVdom, newVdom) {
  const { component } = oldVdom
  const { props } = extractPropsAndEvents(newVdom)

  newVdom.component = component
  component.updateProps(props)
}

/**
 * Patches the children of a virtual node.
 *
 * To patch two virtual nodes' children, the `arraysDiffSequence` function
 * is used to compute a sequence of operations that transform the old
 * children array into the new children array. For each operation, the
 * corresponding DOM modification is performed:
 *
 * - `ARRAY_DIFF_OP.ADD`: the new child is mounted in the DOM at the given index
 * - `ARRAY_DIFF_OP.REMOVE`: the old child is removed from the DOM
 * - `ARRAY_DIFF_OP.MOVE`: the old child's element is moved to its new index and the nodes are passed to the `patchDOM` function
 * - `ARRAY_DIFF_OP.NOOP`: both virtual nodes are passed to the `patchDOM` function
 *
 * When the vdom is the view from a component (that is, when `hostComponent != null`), the operation indices
 * are relative to the component's view. In these cases, the offset of the component's first child in the
 * parent element is used to correct the indices. These only affects the operations where the indices
 * refer to the actual DOM:
 *
 * - `ADD`: the index where the new child is mounted in the DOM needs to be corrected
 * - `MOVE`: the index of the item used as reference in the DOM for the move needs to be corrected
 *
 * @param {import('./h').VNode} oldVdom The old virtual node
 * @param {import('./h').VNode} newVdom the new virtual node
 * @param {import('./component').Component} [hostComponent] The component that the listeners are added to
 */
function patchChildren(oldVdom, newVdom, hostComponent) {
  const oldChildren = extractChildren(oldVdom)
  const newChildren = extractChildren(newVdom)
  const parentEl = oldVdom.el

  const diffSeq = arraysDiffSequence(
    oldChildren,
    newChildren,
    areNodesEqual
  )

  for (const operation of diffSeq) {
    const { originalIndex, index, item } = operation
    const offset = hostComponent?.offset ?? 0

    switch (operation.op) {
      case ARRAY_DIFF_OP.ADD: {
        mountDOM(item, parentEl, index + offset, hostComponent)
        break
      }

      case ARRAY_DIFF_OP.REMOVE: {
        destroyDOM(item)
        break
      }

      case ARRAY_DIFF_OP.MOVE: {
        const oldChild = oldChildren[originalIndex]
        const newChild = newChildren[index]
        const el = oldChild.el
        const elAtTargetIndex = parentEl.childNodes[index + offset]

        parentEl.insertBefore(el, elAtTargetIndex)
        patchDOM(oldChild, newChild, parentEl, hostComponent)

        break
      }

      case ARRAY_DIFF_OP.NOOP: {
        patchDOM(
          oldChildren[originalIndex],
          newChildren[index],
          parentEl,
          hostComponent
        )
        break
      }
    }
  }
}
