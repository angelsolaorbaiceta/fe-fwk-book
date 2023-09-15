export function patchDOM(
  oldVdom, 
  newVdom, 
  parentEl, 
  hostComponent = null
) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = findIndexInParent(parentEl, oldVdom.el)
    destroyDOM(oldVdom)
    mountDOM(newVdom, parentEl, index/*--add--*/, hostComponent/*--add--*/) // --1--

    return newVdom
  }

  newVdom.el = oldVdom.el

  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom, newVdom)
      return newVdom
    }

    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom, newVdom/*--add--*/, hostComponent/*--add--*/) // --2--
      break
    }
  }

  patchChildren(oldVdom, newVdom, hostComponent)

  return newVdom
}