import { addThisContext } from './context'

// Matches "<name> of <expression>"
const FOR_OF_DIRECTIVE_REGEX =
  /^\s*(?<name>\w+)\s+of\s+(?<expression>.+)\s*$/

// Matches "(<name>, <index>) of <expression>"
const FOR_OF_INDEX_DIRECTIVE_REGEX =
  /^\s*\((?<name>\w+),\s*(?<index>\w+)\)\s+of\s+(?<expression>.+)\s*$/

// Matches "(<name>, <value>) of <expression>"
const FOR_IN_DIRECTIVE_REGEX =
  /^\s*\((?<name>\w+),\s*(?<value>\w+)\)\s+in\s+(?<expression>.+)\s*$/

/**
 * Handles the "for" directive, adding the corresponding line and closing to the
 * lines and stack arrays.
 *
 * Returns an integer representing the number of closings added to the stack.
 *
 * @param {{ lines: string[], stack: string[] }} param The lines and stack arrays
 * @param {Object<string, string>} directives The directives object added to the node
 * @returns {number} The number of closings added to the stack
 */
export function handleForDirective({ lines, stack }, directives) {
  const forDirective = directives.for
  if (!forDirective) {
    return 0
  }

  const { line, closing } = formatForDirective(forDirective)
  const lastIdx = lines.length - 1

  if (lastIdx >= 0) {
    // Remove the ' [' suffix from the previous line
    lines[lastIdx] = lines[lastIdx].slice(0, -2)
    // Remove the ']' prefix from the closings stack
    stack[0] = stack[0].slice(1)
  }

  lines.push(line)
  stack.unshift(closing)

  return 1
}

/**
 * Formats a for directive into a line and closing for the "for" directive.
 * The accepted formats are:
 *
 * - `<name> of <expression>`
 * - `(<name>, <index>) of <expression>`
 *
 * @param {string} directive the for directive's definition
 * @returns {object} the line and closing for the "for" directive
 */
export function formatForDirective(directive) {
  if (FOR_OF_DIRECTIVE_REGEX.test(directive)) {
    return formatForOfDirective(directive)
  }

  if (FOR_OF_INDEX_DIRECTIVE_REGEX.test(directive)) {
    return formatForOfWithIndexDirective(directive)
  }

  if (FOR_IN_DIRECTIVE_REGEX.test(directive)) {
    return formatForInDirective(directive)
  }

  throw new Error(`Invalid for directive: "${directive}"`)
}

function formatForOfDirective(directive) {
  const matchGroups = directive.match(FOR_OF_DIRECTIVE_REGEX).groups
  const name = matchGroups.name
  const expression = addThisContext(matchGroups.expression)

  return {
    line: `${expression}.map((${name}) =>`,
    closing: ')',
  }
}

function formatForOfWithIndexDirective(directive) {
  const matchGroups = directive.match(FOR_OF_INDEX_DIRECTIVE_REGEX).groups
  const name = matchGroups.name
  const index = matchGroups.index
  const expression = addThisContext(matchGroups.expression)

  return {
    line: `${expression}.map((${name}, ${index}) =>`,
    closing: ')',
  }
}

function formatForInDirective(directive) {
  const matchGroups = directive.match(FOR_IN_DIRECTIVE_REGEX).groups
  const name = matchGroups.name
  const value = matchGroups.value
  const expression = addThisContext(matchGroups.expression)

  return {
    line: `Object.entries(${expression}).map(([${name}, ${value}]) =>`,
    closing: ')',
  }
}
