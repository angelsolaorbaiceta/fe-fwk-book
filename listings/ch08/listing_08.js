import { destroyDOM } from './destroy-dom'
// --add--
import { DOM_TYPES } from './h'
// --add--
import { mountDOM } from './mount-dom'
import { areNodesEqual } from './nodes-equal'

export function patchDOM(oldVdom, newVdom, parentEl) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el)
    destroyDOM(oldVdom)
    mountDOM(newVdom, parentEl, index)

    return newVdom
  }

  // --add--
  newVdom.el = oldVdom.el // --1--

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom) // --2--
      break
    }
  }

  return newVdom // --3--
  // --add--
}