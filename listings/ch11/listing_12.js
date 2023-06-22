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

  newVdom.component = component
  component.updateProps(props)
}