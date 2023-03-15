function patchChildren(oldVdom, newVdom) {
  // --snip-- //

  for (const operation of diffSeq) {
    const { from, index, item } = operation

    switch (operation.op) {
      case ARRAY_DIFF_OP.ADD: {
        mountDOM(item, parentEl, index)
        break
      }

      case ARRAY_DIFF_OP.REMOVE: {
        // --add--
        destroyDOM(item)
        break
        // --add--
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