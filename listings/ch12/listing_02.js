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
      props: { key: keyOne }, // --1--
      // --add--
    } = nodeOne
    const {
      tag: componentTwo,
      // --add--
      props: { key: keyTwo }, // --2--
      // --add--
    } = nodeTwo

    return componentOne === componentTwo/* --add-- */ && keyOne === keyTwo/* --add-- */ // --3--
  }

  return true
}