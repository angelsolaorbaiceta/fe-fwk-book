export function hFragment(vNodes) {
  const children = mapTextNodes(withoutNulls(vNodes))

  return {
    type: DOM_TYPES.FRAGMENT,
    children,
  }
}
