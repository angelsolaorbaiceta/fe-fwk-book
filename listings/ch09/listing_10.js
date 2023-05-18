function patchChildren(oldVdom, newVdom/*--add--*/, hostComponent/*--add--*/) {
  const oldChildren = extractChildren(oldVdom)
  const newChildren = extractChildren(newVdom)
  const parentEl = oldVdom.el

  const diffSeq = arraysDiffSequence(
    oldChildren,
    newChildren,
    areNodesEqual
  )
  
  for (const operation of diffSeq) {
    const { from, index, item } = operation
    // --add--
    const offset = hostComponent?.offset ?? 0
    // --add--

    switch (operation.op) {
      case ARRAY_DIFF_OP.ADD: {
        mountDOM(item, parentEl, index/*--add--*/ + offset, hostComponent/*--add--*/)
        break
      }

      case ARRAY_DIFF_OP.REMOVE: {
        destroyDOM(item)
        break
      }
        
      case ARRAY_DIFF_OP.MOVE: {
        const el = oldChildren[from].el
        const elAtTargetIndex = parentEl.childNodes[index/*--add--*/ + offset/*--add--*/]

        parentEl.insertBefore(el, elAtTargetIndex)
        patchDOM(
          oldChildren[from],
          newChildren[index],
          parentEl,
          // --add--
          hostComponent
          // --add--
        )

        break
      }

      case ARRAY_DIFF_OP.NOOP: {
        patchDOM(
          oldChildren[from],
          newChildren[index],
          parentEl,
          // --add--
          hostComponent
          // --add--
        )
        break
      }
    }
  }
}