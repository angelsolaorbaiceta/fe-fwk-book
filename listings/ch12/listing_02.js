export function areNodesEqual(nodeOne, nodeTwo) {
  if (nodeOne.type !== nodeTwo.type) {
    return false
  }

  if (nodeOne.type === DOM_TYPES.ELEMENT) {
    const { tag: tagOne } = nodeOne
    const { tag: tagTwo } = nodeTwo

    return tagOne === tagTwo
  }

  if (nodeOne.type === DOM_TYPES.COMPONENT) {
    const {
      tag: componentOne,
      // --add--
      props: { key: keyOne },
      // --add--
    } = nodeOne
    const {
      tag: componentTwo,
      // --add--
      props: { key: keyTwo },
      // --add--
    } = nodeTwo

    return componentOne === componentTwo/* --add-- */ && keyOne === keyTwo/* --add-- */
  }

  return true
}