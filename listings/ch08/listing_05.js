function createFragmentNode(vdom, parentEl, /*--add--*/index/*--add--*/) {
  const { children } = vdom

  const fragment = document.createDocumentFragment()
  vdom.el = parentEl

  children.forEach((child) => mountDOM(child, fragment))
  // --remove--
  parentEl.append(fragment)
  // --remove--
  // --add--
  insert(fragment, parentEl, index)
  // --add--
}