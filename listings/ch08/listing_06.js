import { DOM_TYPES } from './h'

export function areNodesEqual(nodeOne, nodeTwo) {
  if (nodeOne.type !== nodeTwo.type) { // --1--
    return false
  }

  if (nodeOne.type === DOM_TYPES.ELEMENT) {
    const { tag: tagOne } = nodeOne
    const { tag: tagTwo } = nodeTwo

    return tagOne === tagTwo // --2--
  }

  return true
}
