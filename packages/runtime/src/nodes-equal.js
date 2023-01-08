import { DOM_TYPES } from './h'

/**
 * Checks whether two virtual nodes are equal, following a specific logic:
 *
 * - If the two nodes are of different types, they are not equal.
 * - Element nodes are equal if their tag is equal.
 * - All other nodes are equal.
 *
 * This logic is necessary for the `patchDOM()` function to work properly.
 *
 * @param {import('./h').VNode} nodeOne the first virtual node
 * @param {import('./h').VNode} nodeTwo the second virtual node
 * @returns {boolean} whether the two nodes are equal
 */
export function areNodesEqual(nodeOne, nodeTwo) {
  if (nodeOne.type !== nodeTwo.type) {
    return false
  }

  if (DOM_TYPES.ELEMENT) {
    const { tag: tagOne } = nodeOne
    const { tag: tagTwo } = nodeTwo

    return tagOne === tagTwo
  }

  return true
}
