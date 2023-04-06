export function extractChildren(vdom) {
  if (vdom.children == null) { // --1--
    return []
  }

  const children = []

  for (const child of vdom.children) { // --2--
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child, children)) // --3--
    } else {
      children.push(child) // --4--
    }
  }

  return children
}