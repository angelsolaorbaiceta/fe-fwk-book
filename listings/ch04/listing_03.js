function createFragmentNodes(vdom, parentEl) {
  const { children } = vdom
  vdom.el = parentEl //--1--

  children.forEach((child) => mountDOM(child, parent)) //--2--
}
