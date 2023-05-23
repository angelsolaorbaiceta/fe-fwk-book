function createFragmentNodes(vdom, parentEl/*--add--*/, index/*--add--*/) {
  const { children } = vdom
  vdom.el = parentEl

  // --remove--
  children.forEach((child) => mountDOM(child, parentEl))
  // --remove--
  // --add--
  children.forEach((child, i) =>
    mountDOM(child, parentEl, index ? index + i : null)
  )
  // --add--
}
