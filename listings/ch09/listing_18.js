function createFragmentNodes(vdom, parentEl/*--add--*/, hostComponent/*--add--*/) {
  const { children } = vdom
  vdom.el = parentEl

  children.forEach((child) =>
    mountDOM(child, parentEl, null/*--add--*/, hostComponent/*--add--*/)
  )
}