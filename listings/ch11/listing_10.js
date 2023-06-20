// --add--
import { extractPropsAndEvents } from './utils/props'
// --add--

// --snip-- //

function createComponentNode(vdom, parentEl, index, hostComponent) {
  const Component = vdom.tag
  // --remove--
  const props = vdom.props
  const component = new Component(props)
  // --remove--
  // --add--
  const { props, events } = extractPropsAndEvents(vdom) // --1--
  const component = new Component(props, events, hostComponent) // --2--
  // --add--

  component.mount(parentEl, index)
  vdom.component = component
  vdom.el = component.firstElement
}