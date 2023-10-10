export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index)
      break
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index, hostComponent)
      break
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, hostComponent)
      break
    }

    // --add--
    case DOM_TYPES.COMPONENT: { // --1--
      createComponentNode(vdom, parentEl, index, hostComponent) // --2--
      break
    }
    // --add--

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}