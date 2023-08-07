function patchComponent(oldVdom, newVdom) {
  const { component } = oldVdom // --1--
  const { props } = newVdom // --2--

  component.updateProps(props) // --3--

  newVdom.component = component // --4--
  newVdom.el = component.firstElement // --5--
}