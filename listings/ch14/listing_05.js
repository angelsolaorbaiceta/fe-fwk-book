/*--add--*/async/*--add--*/ function createComponentNode(vdom, parentEl, index, hostComponent) { // --1--
  const Component = vdom.tag
  const { props, events } = extractPropsAndEvents(vdom)
  const component = new Component(props, events, hostComponent)

  /*--add--*/await/*--add--*/ component.mount(parentEl, index) // --2--
  vdom.component = component
  vdom.el = component.firstElement
}