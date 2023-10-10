export function mountDOM(
  vdom, 
  parentEl, 
  index,
  /*--add--*/hostComponent = null/*--add--*/ // --1--
) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index)
      break
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index/*--add--*/, hostComponent/*--add--*/) // --2--
      break
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, index/*--add--*/, hostComponent/*--add--*/) // --3--
      break
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}