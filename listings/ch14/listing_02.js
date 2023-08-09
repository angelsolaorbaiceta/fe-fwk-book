class Component {
  // --snip-- //

  constructor(props = {}, eventHandlers = {}, parentComponent = null) {
    // --snip-- //
  }

  // --add--
  onMounted() {
    return Promise.resolve(onMounted.call(this))
  }

  onUnmounted() {
    return Promise.resolve(onUnmounted.call(this))
  }
  // --add--
  
  // --snip-- //
}