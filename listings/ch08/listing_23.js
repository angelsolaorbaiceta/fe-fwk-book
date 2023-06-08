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
        const el = oldChildren[from].el
        const elAtTargetIndex = parentEl.childNodes[index]

        parentEl.insertBefore(el, elAtTargetIndex)
        patchDOM(oldChildren[from], newChildren[index], parentEl)

        break
      }

      case ARRAY_DIFF_OP.NOOP: {
        // --add--
        patchDOM(oldChildren[originalIndex], newChildren[index], parentEl)
        break
        // --add--
      }
    }
  }
}