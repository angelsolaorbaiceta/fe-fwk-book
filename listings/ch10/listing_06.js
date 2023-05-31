function addProps(el, props, vdom/*--add--*/, hostComponent/*--add--*/) { // --1--
  const { on: events, ...attrs } = props

  vdom.listeners = addEventListeners(events, el/*--add--*/, hostComponent/*--add--*/) // --2--
  setAttributes(el, attrs)
}