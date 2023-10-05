import { addThisContext } from './context'

// Matches attribute bindings (appearing between square brackets) like [foo] and [bar]
const attributeBindingRegex = /^\[([a-zA-Z0-9_-]+)\]$/

/**
 * Given an object of HTML node attributes, convert them to a string in the
 * format that a render function expects.
 *
 * @param {Object.<string, string>} attrs The HTML node attributes
 * @returns {string} The props as a string formatted for a render function
 */
export function extractProps(attrs) {
  console.log(attrs)
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

/**
 * Given an object of props, convert them to a string in the format that a
 * render function expects.
 *
 * @param {object} props The props to convert to a string
 * @returns {string} The props as a string
 */
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
