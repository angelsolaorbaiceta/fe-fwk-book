function createElementNode(vdom, parentEl, index, hostComponent) {
  // --remove--
  const { tag, props, children } = vdom
  // --remove--
  // --add--
  const { tag, children } = vdom // --1--
  // --add--

  const element = document.createElement(tag)
  // --remove--
  addProps(element, props, vdom, hostComponent)
  // --remove--
  // --add--
  addProps(element, vdom, hostComponent) // --2--
  // --add--
  vdom.el = element

  children.forEach((child) => 
    mountDOM(child, element, null, hostComponent)
  )
  insert(element, parentEl, index)
}