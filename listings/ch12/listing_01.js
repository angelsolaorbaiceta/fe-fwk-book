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
  if (nodeOne.type === DOM_TYPES.COMPONENT) { // --1--
    const { tag: componentOne } = nodeOne // --2--
    const { tag: componentTwo } = nodeTwo // --3--

    return componentOne === componentTwo // --4--
  }
  // --add--

  return true
}