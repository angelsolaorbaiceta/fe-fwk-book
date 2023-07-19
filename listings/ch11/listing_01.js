export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
  // --add--
  COMPONENT: 'component',
  // --add--
}

export function h(tag, props = {}, children = []) {
  // --add--
  const type =
    typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT
  // --add--

  return {
    tag,
    props,
    // --add--
    type,
    // --add--
    children: mapTextNodes(withoutNulls(children)),
    // --remove--
    type: DOM_TYPES.ELEMENT,
    // --remove--
  }
}