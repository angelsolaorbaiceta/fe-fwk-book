export function extractPropsAndEvents(vdom) {
  const { on: events = {}, ...props } = vdom.props
  // --add--
  delete props.key // --1--
  // --add--

  return { props, events }
}
