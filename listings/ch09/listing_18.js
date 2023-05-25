function createFragmentNodes(vdom, parentEl, index/*--add--*/, hostComponent/*--add--*/) {
  const { children } = vdom
  vdom.el = parentEl

  children.forEach((child) =>
    mountDOM(child, parentEl, index ? index + i : null/*--add--*/, hostComponent/*--add--*/)
  )
}