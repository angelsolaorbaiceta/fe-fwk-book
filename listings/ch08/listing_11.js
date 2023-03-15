function patchElement(oldVdom, newVdom) {
  const el = oldVdom.el
  const {
    class: oldClass,
    style: oldStyle,
    on: oldEvents,
    ...oldAttrs
  } = oldVdom.props
  const {
    class: newClass,
    style: newStyle,
    on: newEvents,
    ...newAttrs
  } = newVdom.props

  patchAttrs(el, oldAttrs, newAttrs)
  patchClass(el, oldClass, newClass)
  patchStyle(el, oldStyle, newStyle)
  newVdom.listeners = patchEvents(el, oldEvents, newEvents)
}

// TODO: implement patchAttrs()

// TODO: implement patchClass()

// TODO: implement patchStyle()

// TODO: implement patchEvents()