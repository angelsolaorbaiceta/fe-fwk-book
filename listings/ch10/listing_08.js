function patchComponent(oldVdom, newVdom) {
  const { component } = oldVdom
  const { props: newProps } = newVdom

  newVdom.component = component
  component.updateProps(newProps)
}