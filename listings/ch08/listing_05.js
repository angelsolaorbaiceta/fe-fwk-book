function createFragmentNodes(vdom, parentEl/*--add--*/, index/*--add--*/) {
  const { children } = vdom
  vdom.el = parentEl

  // --remove--
  children.forEach((child) => mountDOM(child, parentEl))
  // --remove--
  // --add--
  for (const child of children) {
    mountDOM(child, parentEl, index)

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
  // --add--
}
