export function singleJSLine(str) {
  return toSingleJSLine(str[0])
}

/**
 * Removes newlines and replaces all the whitespace between tags.
 * It also removes all spaces between two consecutive closing parenthesis
 * iteratively, so that all instances of `) )` become `))`.
 *
 * @param {string} str The javascript string to normalize
 * @returns string The normalized string
 */
export function toSingleJSLine(str) {
  let result = str.replace(/\s+/g, ' ').trim()

  while (result.includes(') )')) {
    result = result.replace(/\)\s+\)/g, '))')
  }

  return result
}
