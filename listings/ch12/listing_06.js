// --remove--
function addProps(el, props, vdom, hostComponent) {
// --remove---
// --add-- 
function addProps(el, vdom, hostComponent) {
// --add--
  // --remove--
  const { on: events, ...attrs } = props
  // --remove--
  // --add--
  const { props: attrs, events } = extractPropsAndEvents(vdom)
  // --add--

  vdom.listeners = addEventListeners(events, el, hostComponent)
  setAttributes(el, attrs)
}