export function extractComponentProps(vdom) {
  // --remove--
  const props = vdom.props
  // --remove--
  // --add--
  const { on: events = {}, ...props } = vdom.props
  // --add--

  for (const prop in props) {
    if (prop.startsWith('data-')) {
      delete props[prop]
    }
  }

  // --remove--
  return props
  // --remove--
  // --add--
  return { props, events }
  // --add--
}