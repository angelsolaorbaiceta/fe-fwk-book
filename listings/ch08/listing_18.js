function patchChildren(oldVdom, newVdom) {
  const oldChildren = oldVdom.children ?? [] // --1--
  const newChildren = newVdom.children ?? [] // --2--
  const parentEl = oldVdom.el

  const diffSeq = arraysDiffSequence( // --3--
    oldChildren,
    newChildren,
    areNodesEqual
  )

  for (const operation of diffSeq) { // --4--
    const { from, index, item } = operation

    switch (operation.op) { // --5--
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