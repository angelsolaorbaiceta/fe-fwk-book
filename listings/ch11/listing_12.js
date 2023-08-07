// --add--
import { extractPropsAndEvents } from './utils/props'
// --add--

// --snip--

function patchComponent(oldVdom, newVdom) {
  const { component } = oldVdom
  // --remove--
  const { props } = newVdom
  // --remove--
  // --add--
  const { props } = extractPropsAndEvents(newVdom)
  // --add--

  component.updateProps(props)

  newVdom.component = component
  newVdom.el = component.firstElement
}