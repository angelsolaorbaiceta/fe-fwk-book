/**
 * Given a string of HTML, add "this." to state and props interpolations.
 *
 * @param {string} str The HTML template with state and props interpolations
 * @returns {string} The HTML template with "this." added to state and props interpolations
 */
export function addThisContext(str) {
  return str
    .replaceAll('state.', 'this.state.')
    .replaceAll('props.', 'this.props.')
    .trim()
}
