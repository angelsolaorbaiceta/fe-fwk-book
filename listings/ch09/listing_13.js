function addProps(el, props, vdom/*--add--*/, hostComponent/*--add--*/) {
  const { on: events, ...attrs } = props

  vdom.listeners = addEventListeners(events, el/*--add--*/, hostComponent/*--add--*/)
  setAttributes(el, attrs)
}