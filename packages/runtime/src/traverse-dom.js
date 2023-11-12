/**
 * Walks each node in the vDom tree in a depth-first manner. Each time a node
 * is entered, the `enter()` function is called with the node, parent node and
 * the node index in the parent's child array as arguments:
 *
 * ```js
 * enter(node, parentNode, index)
 * ```
 *
 * The `parentNode` and `index` arguments are only available when the node is
 * not the top-level node passed to the function. In case of being the top node,
 * both the `parentNode` and `index` are `null`.
 *
 * @param {import("./h").VNode} vdom - The virtual DOM tree to traverse
 * @param {(node: VNode, parentNode?: VNode, index?: number) => void} processNode - The function to call when entering a node
 * @param {(node: VNode) => boolean} [shouldSkipBranch] - A function that returns true if the branch should be skipped
 * @param {VNode} [parentNode] - The parent node of the node being entered
 * @param {number} [index] - The index of the node being entered in the parent's children array
 */
export function traverseDFS(
  vdom,
  processNode,
  shouldSkipBranch = () => false,
  parentNode = null,
  index = null
) {
  if (shouldSkipBranch(vdom)) return

  processNode(vdom, parentNode, index)

  if (vdom.children) {
    vdom.children.forEach((child, i) =>
      traverseDFS(child, processNode, shouldSkipBranch, vdom, i)
    )
  }
}
