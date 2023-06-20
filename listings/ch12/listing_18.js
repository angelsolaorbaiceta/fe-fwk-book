export function extractComponentProps(vdom) {
  const { on: events = {}, ...props } = vdom.props
  // --add--
  delete props.key
  // --add--

  return { props, events }
}
