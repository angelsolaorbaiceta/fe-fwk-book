function createComponentNode(vdom, parentEl, index, hostComponent) {
  const Component = vdom.tag
  const { props, events } = extractPropsAndEvents(vdom)
  const component = new Component(props, events, hostComponent)

  /*--add--*/const result = component.mount(parentEl, index)/*--add--*/
  vdom.component = component
  vdom.el = component.firstElement

  // --add--
  return result
  // --add--
}