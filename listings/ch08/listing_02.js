export function mountDOM(vdom, parentEl, /*--add--*/index/*--add--*/) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, /*--add--*/index/*--add--*/)
      break
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, /*--add--*/index/*--add--*/)
      break
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNode(vdom, parentEl, /*--add--*/index/*--add--*/)
      break
    }

    default: {
      throw new Error(\`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}