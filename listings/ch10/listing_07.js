function createFragmentNodes(vdom, parentEl, index/*--add--*/, hostComponent/*--add--*/) { // --1--
  const { children } = vdom
  vdom.el = parentEl

  for (const child of children) {
    mountDOM(child, parentEl, index, /*--add--*/hostComponent/*--add--*/) // --2--

    if (index == null) {
      continue
    }

    switch (child.type) {
      case DOM_TYPES.FRAGMENT:
        index += child.children.length
        break
      default:
        index++
    }
  }
}