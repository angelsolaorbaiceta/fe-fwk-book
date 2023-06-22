export function extractPropsAndEvents(vdom) {
  const { on: events = {}, ...props } = vdom.props

  return { props, events }
}