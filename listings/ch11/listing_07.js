function patchComponent(oldVdom, newVdom) {
  const { component } = oldVdom // --1--
  const { props } = newVdom // --2--

  newVdom.component = component // --3--
  component.updateProps(props) // --4--
}