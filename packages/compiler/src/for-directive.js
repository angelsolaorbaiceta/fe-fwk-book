import { addThisContext } from './context'

// Matches "<name> of <expression>"
const FOR_OF_DIRECTIVE_REGEX =
  /^\s*(?<name>\w+)\s+of\s+(?<expression>.+)\s*$/

export function formatForDirective(directive) {
  if (FOR_OF_DIRECTIVE_REGEX.test(directive)) {
    const matchGroups = directive.match(FOR_OF_DIRECTIVE_REGEX).groups
    const name = matchGroups.name
    const expression = addThisContext(matchGroups.expression)

    return {
      line: `${expression}.map((${name}) =>`,
      closing: ')',
    }
  }

  throw new Error(`Invalid for directive: "${directive}"`)
}
