function createComponentNode(vdom, parentEl, index, hostComponent) {
  const Component = vdom.tag // --1--
  const props = vdom.props // --2--
  const component = new Component(props) // --3--

  component.mount(parentEl, index) // --4--
  vdom.component = component // --5--
  vdom.el = component.firstElement // --6--
}