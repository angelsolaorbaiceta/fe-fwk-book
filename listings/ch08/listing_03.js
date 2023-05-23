function createTextNode(vdom, parentEl/*--add--*/, index/*--add--*/) {
  const { value } = vdom

  const textNode = document.createTextNode(value)
  vdom.el = textNode

  // --remove--
  parentEl.append(textNode)
  // --remove--
  // --add--
  insert(textNode, parentEl, index)
  // --add--
}