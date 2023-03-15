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
        const el = oldChildren[from].el
        const elAtTargetIndex = parentEl.childNodes[index]

        if (el !== elAtTargetIndex) {
          parentEl.insertBefore(el, elAtTargetIndex)
        }

        patchDOM(oldChildren[from], newChildren[index], parentEl)

        break
        // --add--
      }

      case ARRAY_DIFF_OP.NOOP: {
        // TODO: implement
      }
    }
  }
}