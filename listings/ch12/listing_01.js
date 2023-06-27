export function areNodesEqual(nodeOne, nodeTwo) {
  if (nodeOne.type !== nodeTwo.type) {
    return false
  }

  if (nodeOne.type === DOM_TYPES.ELEMENT) {
    const { tag: tagOne } = nodeOne
    const { tag: tagTwo } = nodeTwo

    return tagOne === tagTwo
  }
  
  // --add--
  if (nodeOne.type === DOM_TYPES.COMPONENT) {
    const { tag: componentOne } = nodeOne
    const { tag: componentTwo } = nodeTwo

    return componentOne === componentTwo
  }
  // --add--

  return true
}