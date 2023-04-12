/**
 * Given a multiline string, convert it to a single line string.
 * Assuming the string is HTML, it also removes the spaces between tags.
 *
 * @param {string} str - The multiline string to convert to single line
 * @returns {string} The single line string
 */
export function toSingleHtmlLine(str) {
  return str.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
}
