export function hFragment(vNodes, props = {}) {
  const children = mapTextNodes(withoutNulls(vNodes))

  for (const child of children) {
    if (child.type !== DOM_TYPES.TEXT) {
      child.props = { ...child.props, ...props }
    }
  }

  return {
    type: DOM_TYPES.FRAGMENT,
    children,
  }
}
