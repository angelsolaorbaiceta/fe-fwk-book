import { DOM_TYPES } from './h'

/**
 * Checks whether two virtual nodes are equal, following a specific logic:
 *
 * - If the two nodes are of different types, they are not equal.
 * - Element nodes are equal if their tag is equal.
 * - Components are equal if the component instance is the same and their `key` are equal.
 * - All other nodes are equal.
 *
 * A `key` attribute is necessary for the component nodes to be patched correctly
 * when they are part of a dynamic list. Without a key, the reconciliation algorithm
 * isn't able to match the old and new nodes correctly. Components have their
 * own internal state, so they can't be replaced by another instance of the same
 * component. The diffing algorithm doesn't have access to the components state, so
 * it can't know that the component instance is the same, except if the component
 * has a `key` attribute.
 *
 * For example, a list of components like the following:
 *
 * ```
 * Component{ state: 1 }
 * Component{ state: 2 }
 * Component{ state: 3 }
 * ```
 *
 * Might be modified by removing the middle component:
 *
 * ```
 * Component{ state: 1 }
 * Component{ state: 3 }
 * ```
 *
 * In this case, without a key, it'll look like the last component (the one with the state 3)
 * was removed. Since the reconciliation algorithm doesn't have access to the component's
 * state, it can't know that the component that got removed is the one with the state 2.
 *
 * Using a `key` attribute would fix this issue, letting the algorithm know that the
 * component with the state 2 is the one that got removed:
 *
 * ```
 * Component{ state: 1, key: 1 }
 * Component{ state: 2, key: 2 }
 * Component{ state: 3, key: 3 }
 * ```
 *
 * Becomes:
 *
 * ```
 * Component{ state: 1, key: 1 }
 * Component{ state: 3, key: 3 }
 * ```
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

  if (nodeOne.type === DOM_TYPES.ELEMENT) {
    const {
      tag: tagOne,
      props: { key: keyOne },
    } = nodeOne
    const {
      tag: tagTwo,
      props: { key: keyTwo },
    } = nodeTwo

    return tagOne === tagTwo && keyOne === keyTwo
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
