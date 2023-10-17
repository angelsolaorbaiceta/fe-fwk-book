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
