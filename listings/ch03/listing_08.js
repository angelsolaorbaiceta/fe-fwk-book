function createTextNode(vdom, parentEl) {
  const { value } = vdom

  const textNode = document.createTextNode(value) //--1--
  vdom.el = textNode //--2--

  parentEl.append(textNode) //--3--
}
