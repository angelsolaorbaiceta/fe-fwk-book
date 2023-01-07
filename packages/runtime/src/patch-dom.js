import {
  removeAttribute,
  removeStyle,
  setAttribute,
  setStyle,
} from './attributes'
import { destroyDOM } from './destroy-dom'
import { DOM_TYPES } from './h'
import { mountDOM } from './mount-dom'
import { arraysDiff } from './utils/arrays'
import { objectsDiff } from './utils/objects'
import { isNotBlankOrEmptyString } from './utils/strings'

/**
 *
 * @param {import('./h').VNode} oldVdom
 * @param {import('./h').VNode} newVdom
 * @param {Node} parentEl
 * @returns
 */
export function patchDOM(oldVdom, newVdom, parentEl) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    destroyDOM(oldVdom)
    mountDOM(newVdom, parentEl)

    return newVdom
  }

  newVdom.el = oldVdom.el

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom)
      break
    }

    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom, newVdom)
      break
    }
  }

  return newVdom
}

function areNodesEqual(nodeOne, nodeTwo) {
  const { type: typeOne, tag: tagOne } = nodeOne
  const { type: typeTwo, tag: tagTwo } = nodeTwo

  return typeOne === typeTwo && tagOne === tagTwo
}

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
 * @param {import('./h').ElementVNode} oldVdom the old virtual node
 * @param {import('./h').ElementVNode} newVdom the new virtual node
 */
function patchElement(oldVdom, newVdom) {
  const el = oldVdom.el
  const { class: oldClass, style: oldStyle, ...oldAttrs } = oldVdom.props
  const { class: newClass, style: newStyle, ...newAttrs } = newVdom.props

  patchAttrs(el, oldAttrs, newAttrs)
  patchClass(el, oldClass, newClass)
  patchStyle(el, oldStyle, newStyle)
}

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
 * @param {Node} el The element to patch
 * @param {(string[]|string|undefined)} oldClass the old class(es)
 * @param {(string[]|string|undefined)} newClass the new class(es)
 */
function patchClass(el, oldClass, newClass) {
  if (oldClass === newClass) {
    return
  }

  const oldClasses = toClassList(oldClass)
  const newClasses = toClassList(newClass)

  const { added, removed } = arraysDiff(oldClasses, newClasses)
  el.classList.remove(...removed)
  el.classList.add(...added)
}

/**
 * Extracts a list of classes from the given class string or array.
 * If the given class is undefined, an empty string is returned.
 *
 * @param {(string[]|string|undefined)} classes the class string or array
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
 * @param {Node} el the element to patch
 * @param {(object|undefined)} oldStyle the old style object
 * @param {(object|undefined)} newStyle the new style object
 */
function patchStyle(el, oldStyle = {}, newStyle = {}) {
  if (oldStyle === newStyle) {
    return
  }

  const { added, removed, updated } = objectsDiff(oldStyle, newStyle)

  for (const style of removed) {
    removeStyle(el, style)
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style])
  }
}
