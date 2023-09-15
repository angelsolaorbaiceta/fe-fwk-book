function createElementNode(vdom, parentEl, index/*--add--*/, hostComponent/*--add--*/) { // --1--
  const { tag, props, children } = vdom

  const element = document.createElement(tag)
  addProps(element, props, vdom/*--add--*/, hostComponent/*--add--*/) // --2--
  vdom.el = element

  children.forEach((child) => 
    mountDOM(child, element/*--add--*/, null, hostComponent/*--add--*/) // --3--
  )
  insert(element, parentEl, index)
}