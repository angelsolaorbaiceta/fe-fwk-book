export function areNodesEqual(nodeOne, nodeTwo) {
  if (nodeOne.type !== nodeTwo.type) {
    return false
  }

  if (nodeOne.type === DOM_TYPES.ELEMENT) {
    const {
      tag: tagOne,
      // --add--
      props: { key: keyOne }, // --1--
      // --add--
    } = nodeOne
    const {
      tag: tagTwo,
      // --add--
      props: { key: keyTwo }, // --2--
      // --add--
    } = nodeTwo

    return tagOne === tagTwo/* --add-- */ && keyOne === keyTwo/* --add-- */ // --3--
  }

  if (nodeOne.type === DOM_TYPES.COMPONENT) {
    const {
      tag: componentOne,
      props: { key: keyOne },
    } = nodeOne
    const {
      tag: componentTwo,
      props: { key: keyTwo },
    } = nodeTwo

    return componentOne === componentTwo && keyOne === keyTwo
  }

  return true
}