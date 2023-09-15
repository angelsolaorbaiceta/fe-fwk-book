import { addThisContext } from './context'

const attributeBindingRegex = /^\[([a-zA-Z0-9_-]+)\]$/

export function extractProps(attrs) {
  const props = {}

  for (const attrName in attrs) {
    if (attributeBindingRegex.test(attrName)) {
      const propName = attrName.match(attributeBindingRegex)[1]
      props[propName] = addThisContext(attrs[attrName])

      continue
    }

    props[attrName] = `'${attrs[attrName]}'`
  }

  return propsToString(props)
}

function propsToString(props) {
  const content = Object.keys(props)
    .map((name) => {
      const value = props[name]
      return `${name}: ${
        typeof value === 'object' ? propsToString(value) : value
      }`
    })
    .join(', ')
    .trim()

  return content ? `{ ${content} }` : '{}'
}
