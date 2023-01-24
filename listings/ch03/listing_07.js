import { DOM_TYPES } from './h'

export function mountDOM(vdom, parentEl) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      return createTextNode(vdom, parentEl)
    }

    case DOM_TYPES.ELEMENT: {
      return createElementNode(vdom, parentEl)
    }

    case DOM_TYPES.FRAGMENT: {
      return createFragmentNode(vdom, parentEl)
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}

// TODO: implement createTextNode()

// TODO: implement createElementNode()

// TODO: implement createFragmentNode()
