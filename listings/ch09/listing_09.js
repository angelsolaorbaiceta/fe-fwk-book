export function patchDOM(oldVdom, newVdom, parentEl/*--add--*/, hostComponent = null/*--add--*/) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el)
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

  patchChildren(oldVdom, newVdom/*--add--*/, hostComponent/*--add--*/)

  return newVdom
}