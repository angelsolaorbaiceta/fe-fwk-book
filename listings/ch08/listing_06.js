import { destroyDOM } from './destroy-dom'
import { mountDOM } from './mount-dom'
import { areNodesEqual } from './nodes-equal'

export function patchDOM(oldVdom, newVdom, parentEl) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el) // --1--
    destroyDOM(oldVdom) // --2--
    mountDOM(newVdom, parentEl, index) // --3--

    return newVdom
  }
}
