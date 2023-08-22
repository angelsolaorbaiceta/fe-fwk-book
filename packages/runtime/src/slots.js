import { DOM_TYPES, hFragment } from './h'
import { traverseDFS } from './traverse-dom'
import { assert } from './utils/assert'

/**
 * In-place replacement of the slot virtual nodes with the provided children
 * views or, in their absence, with the default content. The views are always
 * inserted inside a fragment virtual node, even if there's only one view, or
 * no views at all.
 *
 * @param {import("./h").VNode} vdom
 * @param {import("./h").VNode[]} slotViews - the vNodes to insert in the slots
 */
export function fillSlots(vdom, slotViews = []) {
  function processNode(node, parent, index) {
    insertViewInSlot(node, parent, index, slotViews)
  }

  traverseDFS(vdom, processNode, shouldSkipBranch)
}

function insertViewInSlot(node, parent, index, slotViews) {
  if (node.type !== DOM_TYPES.SLOT) return

  assert(parent !== null, 'Slot nodes must have a parent')
  assert(index !== null, 'Slot nodes must have an index')

  const defaultContent = node.children
  const views = slotViews.length > 0 ? slotViews : defaultContent

  assert(Array.isArray(views), 'Slot views must be an array')

  parent.children.splice(index, 1, hFragment(views))
}

function shouldSkipBranch(node) {
  return node.type === DOM_TYPES.COMPONENT
}
