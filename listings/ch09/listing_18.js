function createFragmentNodes(vdom, parentEl/*--add--*/, hostComponent/*--add--*/) {
  const { children } = vdom
  vdom.el = parentEl

  children.forEach((child) =>
    mountDOM(child, parentEl/*--add--*/, null, hostComponent/*--add--*/)
  )
}