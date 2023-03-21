function patchChildren(oldVdom, newVdom) {
  // --snip-- //
  
  for (const operation of diffSeq) {
    const { from, index, item } = operation

    switch (operation.op) {
      case ARRAY_DIFF_OP.ADD: {
        // --add--
        mountDOM(item, parentEl, index)
        // --add--
        break
      }

      case ARRAY_DIFF_OP.REMOVE: {
        // TODO: implement
        break
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