/**
 * @typedef {Object} Attributes
 * @property {Object.<string, string>} attributes The HTML node attributes
 * @property {Object.<string, string>} bindings The HTML node attribute bindings
 * @property {Object.<string, string>} events The HTML node events
 * @property {Object.<string, string>} directives The HTML node directives
 */

// Matches attribute bindings (appearing between square brackets) like [foo] and [bar]
const attributeBindingRegex = /^\[([a-zA-Z0-9_-]+)\]$/

// Matches events (appearing between parentheses) like (click) and (input)
const eventRegex = /^\(([a-zA-Z0-9_-]+)\)$/

// Matches directives (appearing prepended by an @) like @for and @show
const directiveRegex = /^@([a-zA-Z0-9_-]+)$/

/**
 * Splits the HTML attributes into attributes, attributes, bindings (props with bindings),
 * events, and directives.
 *
 * @param {Object.<string, string>} attrs The HTML node attributes
 * @returns {Attributes} The attributes, bindings, events, and directives
 */
export function splitAttributes(attrs) {
  const attributes = {}
  const bindings = {}
  const events = {}
  const directives = {}

  for (const attrName in attrs) {
    if (attributeBindingRegex.test(attrName)) {
      const propName = attrName.match(attributeBindingRegex)[1]
      bindings[propName] = attrs[attrName]

      continue
    }

    if (eventRegex.test(attrName)) {
      const eventName = attrName.match(eventRegex)[1]
      events[eventName] = attrs[attrName]

      continue
    }

    if (directiveRegex.test(attrName)) {
      const directiveName = attrName.match(directiveRegex)[1]
      directives[directiveName] = attrs[attrName]

      continue
    }

    attributes[attrName] = attrs[attrName]
  }

  return {
    attributes,
    bindings,
    events,
    directives,
  }
}
