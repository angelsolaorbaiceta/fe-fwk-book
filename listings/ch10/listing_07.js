function createFragmentNodes(
  vdom, 
  parentEl, 
  index, 
  /*--add--*/hostComponent/*--add--*/ // --1--
) {
  const { children } = vdom
  vdom.el = parentEl

  children.forEach((child) =>
    mountDOM(
      child, 
      parentEl, 
      index ? index + i : null,
      /*--add--*/hostComponent/*--add--*/ // --2--
    )
  )
}