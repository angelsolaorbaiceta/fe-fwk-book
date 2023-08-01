class Component {
  // --snip-- //

  constructor(props = {}, eventHandlers = {}, parentComponent = null) {
    this.props = props
    this.state = state ? state(props) : {}
    this.#eventHandlers = eventHandlers
    this.#parentComponent = parentComponent

    // --add--
    this.onMounted = function () {
      return Promise.resolve(onMounted.call(this))
    }
    this.onUnmounted = function () {
      return Promise.resolve(onUnmounted.call(this))
    }
    // --add--
  }
}