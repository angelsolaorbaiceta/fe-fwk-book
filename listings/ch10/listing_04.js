// --add--
import { extractComponentProps } from './utils/props'
// --add--

// --snip-- //

// --add--
function createComponentNode(vdom, parentEl, index, hostComponent) {
  const Component = vdom.tag
  const props = extractComponentProps(vdom)
  const component = new Component(props)

  component.mount(parentEl, index)
  vdom.component = component
  vdom.el = component.firstElement
}
// --add--