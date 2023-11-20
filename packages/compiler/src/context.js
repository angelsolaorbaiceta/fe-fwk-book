const METHOD_CALL_REGEX = /(?<=^|\s+)([a-zA-Z0-9_]+\([^\)]*\))/g

/**
 * Given a string of HTML, add "this." to state, props interpolations and
 * method calls.
 *
 * @param {string} str The HTML template with state and props interpolations
 * @returns {string} The HTML template with "this." added to state and props interpolations
 */
export function addThisContext(str) {
  return str
    .replaceAll('state.', 'this.state.')
    .replaceAll('props.', 'this.props.')
    .replaceAll(METHOD_CALL_REGEX, (match) => `this.${match}`)
    .trim()
}
