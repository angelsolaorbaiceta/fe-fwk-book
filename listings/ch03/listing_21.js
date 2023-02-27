function removeFragmentNode(vdom) {
  const { children } = vdom
  children.forEach(destroyDOM)
}
