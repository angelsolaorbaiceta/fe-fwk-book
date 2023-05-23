function createElementNode(vdom, parentEl/*--add--*/, index/*--add--*/) {
  const { tag, props, children } = vdom

  const element = document.createElement(tag)
  addProps(element, props, vdom)
  vdom.el = element

  children.forEach((child) => mountDOM(child, element))
  // --remove--
  parentEl.append(element)
  // --remove--
  // --add--
  insert(element, parentEl, index)
  // --add--
}