import { addThisContext } from './context'

const METHOD_REF_REGEX = /^\s*[a-zA-Z0-9_]+\s*$/
const METHOD_IN_ARROW_FUNC_REGEX =
  /^\([^\)]*\)\s*=>\s*([a-zA-Z0-9_]+)\s*\([^\)]*\)\s*$/
const METHOD_IN_ARROW_FUNC_BLOCK_REGEX =
  /^\([^\)]*\)\s*=>\s*{\s*([^\}]*)}$/m
const METHOD_CALL_REGEX = /([a-zA-Z0-9_]+)\([^\)]*\)/g
const METHOD_CALL_EXPRESSION_REGEX = /^\s*([a-zA-Z0-9_]+)\([^\)]*\)\s*$/g

export function extractProps(attributes, bindings, events) {
  const props = {}

  Object.entries(attributes).forEach(([name, value]) => {
    props[name] = `'${value}'`
  })

  Object.entries(bindings).forEach(([name, value]) => {
    props[name] = addThisContext(value)
  })

  if (Object.keys(events).length) {
    props.on = {}

    Object.entries(events).forEach(([name, value]) => {
      props.on[name] = formatEvent(value)
    })
  }

  return propsToString(props)
}

/**
 * Given an event handler definition, it adds the "this." context to it.
 *
 * The handler can have the following formats:
 *
 * - `"handleClick"` ➞ `"this.handleClick"`
 * - `"() => handleClick()"` ➞ `"() => this.handleClick()"`
 * - `"() => this.handleClick(foo, bar)"` ➞ `"() => this.handleClick(foo, bar)"`
 * - `"(event) => handleClick(event)"` ➞ `"(event) => this.handleClick(event)"`
 * - `"() => { ... }"` ➞ All method calls are prefixed with "this."
 *
 * A special case is when a function call is used as the event handler:
 *
 * - `"handleClick()"` ➞ `"this.handleClick()"`
 *
 * In this case, it's the result of calling the function that is used as
 * the event handler, not the function itself.
 *
 * @param {string} handler the event handler definition
 */
function formatEvent(handler) {
  // Matches method references such as "handleClick"
  if (METHOD_REF_REGEX.test(handler)) {
    return `this.${handler}`
  }

  // Matches method calls such as "handleClick()"
  if (METHOD_CALL_EXPRESSION_REGEX.test(handler)) {
    return handler.replace(
      METHOD_CALL_EXPRESSION_REGEX,
      (match) => `this.${match}`
    )
  }

  // Matches arrow functions with method calls such as "() => handleClick()"
  if (METHOD_IN_ARROW_FUNC_REGEX.test(handler)) {
    return handler.replace(METHOD_IN_ARROW_FUNC_REGEX, (match, group) =>
      match.replace(group, `this.${group}`)
    )
  }

  // Matches arrow functions inside a block such as "() => { handleClick() }"
  if (METHOD_IN_ARROW_FUNC_BLOCK_REGEX.test(handler)) {
    return handler
      .replace(/\s+/g, ' ')
      .replace(METHOD_IN_ARROW_FUNC_BLOCK_REGEX, (match, group) =>
        match.replace(
          group,
          group.replace(METHOD_CALL_REGEX, (match) => `this.${match}`)
        )
      )
  }

  throw new Error(`Unsupported event handler: "${handler}"`)
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
