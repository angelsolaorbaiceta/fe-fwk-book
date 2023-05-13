# Fe-Fwk

![fe-fwk](https://img.shields.io/badge/fe--fwk-book-blueviolet)

Code for the book "[Build a frontend framework from scratch](http://mng.bz/aM2o)".

This framework **isn't intended for production use**.
Its intention is to **teach you how frontend frameworks work** by building one yourself, from scratch.

## [v1.0 — Chapter 6](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch6/packages/runtime)

_See the example application in the [examples/ch06 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch06)_.

To checkout this version of the code:

```bash
git checkout ch6
```

This version of the framework introduces the concept of a _Virtual DOM_.
It implements the `h()`, `hString()` and `hFragment()` functions to create virtual nodes and the `mountDOM()` and `destroyDOM()` functions to turn the virtual DOM representing the view of the application into HTML elements in the browser.

The application instance, created using the `createApp()` function, holds all the state for the application, which can be changed by dispatching commands using an instance of a `Dispatcher`.
Every time a command is dispatched, the reducer subscribed to the command is run to update the state, and then, the entire view is destroyed and recreated from scratch.
This is done by registering the application's `renderApp()` function to run after each command is processed in the dispatcher.

## [v2.0 - Chapter 8](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch8/packages/runtime)

_See the example application in the [examples/ch08 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch08)_.

To checkout this version of the code:

```bash
$ git checkout ch8
```

This version of the framework implements the _reconciliation algorithm_ to only update the parts of the DOM that have changed.

## v3.0 - Chapter 10

_See the example application in the [examples/ch10 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch10)_.

To checkout this version of the code:

```bash
$ git checkout ch10
```

This version of the framework implements stateful components; each component is similar to a mini-application with its own lifecycle.

### Defining components

Components are defined using the `defineComponent()` function.
The function takes as input an object that, at least, includes a `render()` function.
This `render()` function returns the virtual DOM for the component, and it's called by the framework every time the component needs to be updated:

```js
const MyComponent = defineComponent({
  render() {
    return h('div', {}, 'Hello world!')
  },
})
```

Components can be passed to the `h()` function to create virtual DOM nodes:

```js
const vdom = h(MyComponent)
mountDOM(vdom, document.body)
```

### Props

Components can receive data from the outside world via props.
The component can access the props passed to it via the `this.props` object.

Let's imagine we have the following component:

```js
const Greeting = defineComponent({
  render() {
    return h('p', {}, `Hello ${this.props.name}!`)
  },
})
```

To mount this component in the DOM, passing it the `name` prop, we can do:

```js
const vdom = h(Greeting, { name: 'Angel' })
mountDOM(vdom, document.body)
```

Which will render the following HTML:

```html
<body>
  <p>Hello Angel!</p>
</body>
```

Props are data coming from the outside world that the component doesn't own, thus, they can't be changed by the component.
If a component wants to change that data in any way, it needs to send a message to the outside world, which is done via _events_ (see section below).

### Internal state

Components can also define a `state()` function that returns the initial state for the component.
This function is passed the component's `props` as input:

```js
const Counter = defineComponent({
  state(props) {
    return {
      count: props.initialCount ?? 0,
    }
  },

  render() {
    return h('p', {}, [`Count: ${this.state.count}`])
  },
})
```

The component can access the state via the `this.state` object.
The component owns the state, so it can change it.
To modify the state, the component needs to call the `this.updateState()` function, which takes as input the new state—complete or partial—for the component:

```js
const Counter = defineComponent({
  state(props) {
    return {
      count: props.initialCount ?? 0,
    }
  },

  render() {
    return hFragment([
      h(
        'button',
        {
          on: {
            click: () => this.updateState({ count: this.state.count + 1 }),
          },
        },
        ['+']
      ),
      h('p', {}, [`Count: ${this.state.count}`]),
    ])
  },
})
```

You can now mount this component in the DOM, passing it the `initialCount` prop:

```js
const vdom = h(Counter, { initialCount: 10 })
mountDOM(vdom, document.body)
```

Which will render the following HTML:

```html
<body>
  <button>+</button>
  <p>Count: 10</p>
</body>
```

Clicking the button will update the state of the component, which will trigger a re-render of the component, updating the DOM.

### Child components

A component can render other components as its children by including them in the virtual DOM returned by the `render()` function:

```js
const ListItem = defineComponent({
  render() {
    return h('li', {}, [this.props.text])
  },
})

const List = defineComponent({
  render() {
    return h('ul', {}, [
      h(ListItem, { text: 'A point is that which has no part.' }),
      h(ListItem, { text: 'A line is breadthless length.' }),
      h(ListItem, { text: 'The ends of a line are points.' }),
    ])
  },
})
```

### Events

Components can send messages to the outside world via events.
To emit an event, a component needs to call the `this.emit()` function, which takes as input the name of the event and the payload to send.
The parent component can handle the event as if it was a regular DOM event.

Let's imagine a button that, when clicked, increments a count by one, but when double-clicked, increments it by ten:

```js
const IncrementButton = defineComponent({
  render() {
    return h(
      'button',
      {
        on: {
          click: () => this.emit('increment', { amount: 1 }),
          dblclick: () => this.emit('increment', { amount: 10 }),
        },
      },
      ['Increment']
    )
  },
})
```

We can incorporate it into a `Counter` component that keeps track of the count:

```js
const Counter = defineComponent({
  state() {
    return { count: 0 }
  },

  render() {
    return hFragment([
      h(IncrementButton, {
        on: {
          increment: ({ amount }) =>
            this.updateState({ count: this.state.count + amount }),
        },
      }),
      h('p', {}, [`Count: ${this.state.count}`]),
    ])
  },
})
```

You can now mount this component in the DOM:

```js
const vdom = h(Counter)
mountDOM(vdom, document.body)
```

And play with it.

### Methods

A component can define methods that can be called inside the `render()` function.
This helps to keep the `render()` function clean and easy to read.

For example, we can move the event handler in the example above to a method:

```js
const Counter = defineComponent({
  state() {
    return { count: 0 }
  },

  render() {
    return hFragment([
      h(IncrementButton, {
        on: {
          increment: this.increment, // Pass the method as the event handler
        },
      }),
      h('p', {}, [`Count: ${this.state.count}`]),
    ])
  },

  // Increments the count by the given amount
  increment({ amount }) {
    this.updateState({ count: this.state.count + amount })
  },
})
```
