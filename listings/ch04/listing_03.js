function createFragmentNode(vdom, parentEl) {
  const { children } = vdom

  const fragment = document.createDocumentFragment() //--1--
  vdom.el = parentEl //--2--

  children.forEach((child) => mountDOM(child, fragment)) //--3--
  parentEl.append(fragment) //--4--
}
