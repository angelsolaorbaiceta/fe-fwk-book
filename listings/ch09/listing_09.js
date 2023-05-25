export function patchDOM(oldVdom, newVdom, parentEl/*--add--*/, hostComponent = null/*--add--*/) { // --1--
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = findIndexInParent(parentEl, oldVdom.el)
    destroyDOM(oldVdom)
    mountDOM(newVdom, parentEl, index)

    return newVdom
  }

  newVdom.el = oldVdom.el

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom)
      return newVdom
    }

    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom, newVdom)
      break
    }
  }

  patchChildren(oldVdom, newVdom/*--add--*/, hostComponent/*--add--*/) // --2--

  return newVdom
}