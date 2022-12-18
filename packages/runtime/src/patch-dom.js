import { destroyDOM } from './destroy-dom'
import { DOM_TYPES } from './h'
import { mountDOM } from './mount-dom'

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
