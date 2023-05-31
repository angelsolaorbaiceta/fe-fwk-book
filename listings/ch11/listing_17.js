export function extractComponentProps(vdom) {
  const { on: events = {}, ...props } = vdom.props
  // --add--
  delete props.key
  // --add--

  for (const prop in props) {
    if (prop.startsWith('data-')) {
      delete props[prop]
    }
  }

  return { props, events }
}
