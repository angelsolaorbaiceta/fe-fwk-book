function patchChildren(oldVdom, newVdom) {
  const oldChildren = oldVdom.children ?? []
  const newChildren = newVdom.children ?? []
  const parentEl = oldVdom.el

  if (oldChildren.length === 0 && newChildren.length === 0) {
    return
  }

  const diffSeq = arraysDiffSequence(
    oldChildren,
    newChildren,
    areNodesEqual
  )

  for (const operation of diffSeq) {
    const { from, index, item } = operation

    switch (operation.op) {
      case ARRAY_DIFF_OP.ADD: {
        // TODO: implement
      }

      case ARRAY_DIFF_OP.REMOVE: {
        // TODO: implement
      }

      case ARRAY_DIFF_OP.MOVE: {
        // TODO: implement
      }

      case ARRAY_DIFF_OP.NOOP: {
        // TODO: implement
      }
    }
  }
}