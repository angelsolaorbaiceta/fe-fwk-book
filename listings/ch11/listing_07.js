export function patchDOM(
  oldVdom, 
  newVdom, 
  parentEl, 
  hostComponent = null,
) {
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

    // --add--
    case DOM_TYPES.COMPONENT: {
      patchComponent(oldVdom, newVdom) // --1--
      break
    }
    // --add--
  }

  patchChildren(oldVdom, newVdom, hostComponent)

  return newVdom
}

// TODO: implement patchComponent()