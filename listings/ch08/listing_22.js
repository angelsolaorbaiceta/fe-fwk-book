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
        destroyDOM(item)
        break
      }

      case ARRAY_DIFF_OP.MOVE: {
        // --add--
        const oldChild = oldChildren[originalIndex] // --1--
        const newChild = newChildren[index] // --2--
        const el = oldChild.el // --3--
        const elAtTargetIndex = parentEl.childNodes[index] // --4--

        parentEl.insertBefore(el, elAtTargetIndex) // --5--
        patchDOM(oldChild, newChild, parentEl) // --6--

        break
        // --add--
      }

      case ARRAY_DIFF_OP.NOOP: {
        // TODO: implement
      }
    }
  }
}