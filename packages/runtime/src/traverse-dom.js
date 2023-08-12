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
 * @param {(node: VNode, parentNode?: VNode, index?: number) => void} enter - The function to call when entering a node
 * @param {VNode} [parentNode] - The parent node of the node being entered
 * @param {number} [index] - The index of the node being entered in the parent's children array
 */
export function traverseDFS(vdom, enter, parentNode = null, index = null) {
  enter(vdom, parentNode, index)

  if (vdom.children) {
    vdom.children.forEach((child, i) => traverseDFS(child, enter, vdom, i))
  }
}
