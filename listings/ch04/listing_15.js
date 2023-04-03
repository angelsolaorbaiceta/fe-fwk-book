function removeFragmentNodes(vdom) {
  const { children } = vdom
  children.forEach(destroyDOM)
}
