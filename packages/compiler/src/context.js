export function addThisContext(str) {
  return str
    .replaceAll('state.', 'this.state.')
    .replaceAll('props.', 'this.props.')
    .trim()
}
