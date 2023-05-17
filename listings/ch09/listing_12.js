function createElementNode(vdom, parentEl, index/*--add--*/, hostComponent/*--add--*/) {
  const { tag, props, children } = vdom

  const element = document.createElement(tag)
  addProps(element, props, vdom/*--add--*/, hostComponent/*--add--*/)
  vdom.el = element

  children.forEach((child) => mountDOM(child, element/*--add--*/, null, hostComponent/*--add--*/))
  insert(element, parentEl, index)
}