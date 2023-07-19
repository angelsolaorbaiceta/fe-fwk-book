/**
 * Tagged template that given a multiline string, convert it to a single line string.
 * Assuming the string is HTML, it also removes the spaces between tags.
 *
 * @param {string[]} str - The multiline string to convert to single line
 * @returns {string} The single line string
 */
export function singleHtmlLine(str) {
  return str[0].replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}
