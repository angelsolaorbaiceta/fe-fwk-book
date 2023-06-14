export function extractComponentProps(vdom) {
  const { on: events = {}, ...props } = vdom.props
  delete props.key

  for (const prop in props) {
    if (prop.startsWith('data-')) {
      delete props[prop]
    }
  }

  return { props, events }
}
