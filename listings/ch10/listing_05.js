export function extractComponentProps(vdom) {
  const props = vdom.props

  for (const prop in props) {
    if (prop.startsWith('data-')) {
      delete props[prop]
    }
  }

  return props
}