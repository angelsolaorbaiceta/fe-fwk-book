function createElementNode(vdom, parentEl, index, hostComponent) {
  // --remove--
  const { tag, props, children } = vdom
  // --remove--
  // --add--
  const { tag, children } = vdom
  // --add--

  const element = document.createElement(tag)
  // --remove--
  addProps(element, props, vdom, hostComponent)
  // --remove--
  // --add--
  addProps(element, vdom, hostComponent)
  // --add--
  vdom.el = element

  children.forEach((child) => mountDOM(child, element, null, hostComponent))
  insert(element, parentEl, index)
}