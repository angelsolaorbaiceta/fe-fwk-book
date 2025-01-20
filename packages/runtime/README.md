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

### Virtual DOM

The view of the application is represented by a virtual DOM tree.
The virtual DOM tree can be broken down into components, which are functions that return a virtual DOM tree.
There are three types of virtual DOM nodes:

- `h()`: creates an element virtual DOM node.
- `hString()`: creates a text virtual DOM node.
- `hFragment()`: creates a fragment virtual DOM node. This is a special type of virtual DOM node that represents a list of virtual DOM nodes, but it doesn't create any HTML element in the DOM.

The `h()` function takes as input the following arguments:

- `tag`: the tag name of the HTML element to create.
- `props`: an object with the attributes and event handlers to set on the HTML element.
- `children`: an array of virtual DOM nodes to append as children of the HTML element. A child of type string will be converted to a text virtual DOM node.

Here's an example of how to use the `h()` function to create a form with an input and a button:

```js
h('form', { class: 'form' }, [
  h('input', { type: 'text', value: 'Hello world!' }),
  h('button', { type: 'submit' }, ['Submit']),
])
```

### Defining components

A component is a pure function that returns a virtual DOM tree.
Components get the state of the application, or a part of it, as input:

```js
function Counter(state) {
  return h('p', { class: 'counter' }, [`Count: ${state.count}`])
}
```

Components can receive the `emit()` function as second argument.
This function can be used to dispatch commands to update the state of the application:

```js
function Counter(state, emit) {
  return hFragment([
    h('p', { class: 'counter' }, [`Count: ${state.count}`]),
    h('button', { on: { click: () => emit('increment') } }, ['Increment']),
  ])
}
```

The commands dispatched by the component are handled by the reducers of the application.
The reducers change the state of the application, and then, the entire view is recreated from scratch.

### The application

The application is created using the `createApp()` function.
The function expects an object with three properties:

- `view`: the function that returns the virtual DOM tree representing the view of the application.
- `state`: the initial state of the application.
- `reducers`: an object with the reducers of the application.

Here's an example of a button that increments a counter (using the `Counter` component defined above):

```js
function view(state)
const app = createApp({
  view: Counter,
  state: { count: 0 },
  reducers: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
  },
})
```

## [v2.0 - Chapter 8](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch8/packages/runtime)

_See the example application in the [examples/ch08 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch08)_.

To checkout this version of the code:

```bash
$ git checkout ch8
```

This version of the framework implements the _reconciliation algorithm_ to only update the parts of the DOM that have changed.

## [v3.0 - Chapter 12](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch12/packages/runtime)

_See the example application in the [examples/ch12 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch12)_.

To checkout this version of the code:

```bash
$ git checkout ch12
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

## [v4.0 - Chapter 14](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch14/packages/runtime)

_See the example application in the [examples/ch14 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch14)_.

To checkout this version of the code:

```bash
$ git checkout ch14
```

This version of the framework implements the `onMounted()` and `onUnmounted()` _lifecycle hooks_ for components.
You can react to a component being mounted and unmounted by passing the `defineComponent()` function you own functions:

```js
defineComponent({
  async onMounted() {
    // Called when the component is mounted
  },

  async onUnmounted() {
    // Called when the component is unmounted
  },
})
```

## [v5.0 - Chapter 15](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch15/packages/runtime)

_See the example application in the [examples/ch15 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch15)_.

To checkout this version of the code:

```bash
$ git checkout ch15
```

This version of the framework allows to insert external content into a component using _slots_.
A component can define where the external content should be inserted by using the `hSlot()` function:

```js
const Comp = defineComponent({
  render() {
    return h('div', {}, [hSlot()])
  },
})
```

Then, when mounting the component, you can pass the external content as the third argument to the `h()` function:

```js
h(Comp, {}, [h('span', {}, ['Hello'])])
```

The result of mounting the component above will be:

```html
<div>
  <span>Hello</span>
</div>
```

## [v6.0 - Chapter 18](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch18/packages/runtime)

_See the example application in the [examples/ch18 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch18)_.

To checkout this version of the code:

```bash
$ git checkout ch18
```

This version of the framework includes the `HashRouter` router to handle routing in a single-page application.
In a hash router, the location is kept in the hash portion or the URL:

```
https: // example.com : 8080 /something/ ?query=abc123 #/fooBarBaz

⎣____⎦    ⎣__________⎦  ⎣__⎦ ⎣________⎦ ⎣____________⎦ ⎣________⎦
protocol     domain     port    path      parameters      hash
```

The `createApp()` function accepts a third parameter, which is an `options` object. This `options` object includes a `router` property to pass an instance of a `HashRouter` to the application:

```javascript
const router = new HashRouter(routes)
createApp(RootComponent, {}, { router })
```

The routes map route paths to the component that should be rendered inside the `RouterOutlet` component.
Routes are defined as follow:

```javascript
const routes = [
  {
    // Matches 'yourapp.com/#/'
    path: '/',
    component: Home,
  },
  // Matches 'yourapp.com/#/one'
  {
    path: '/one',
    component: One,
  },
  {
    // Matches 'yourapp.com/#/two/?/bar/?'
    // Path variables can be defined by prepending them with a ":"
    path: '/two/:foo/bar/:bazz',
    component: Two,
  },
  {
    // Matches 'yourapp.com/#/three'
    // Paths can be set a redirect to a different route
    path: '/three',
    redirect: '/one',
  },
  {
    // A catch-all route can be defined to handle all unmatched routes
    path: '*',
    component: NotFound,
  },
]
```

Here are the rules for defining routes:

- Route paths must either start with a `/` or be the catch-all route (`*`)
- A route must have a component to handle it, or be a redirection (both can't happen at the same time)
- Path variables can be defined by prepending a `:` to the variable name
- Nested routes aren't supported

### Router Outlet

The content matched by the application's router is rendered in the `RouterOutlet` component:

```javascript
const App = defineComponent({
  render() {
    return h('main', {}, [RouterOutlet()])
  },
})
```

Using more than one `RouterOutlet` in the application results in the component matched by the router being injected in all the outlets.
Nested outlets isn't supported (if you nest outlets, they'll all contain the same component).

The `RouterOutlet` component inserts the matched component inside a `<div>` element with an id attribute of `'router-outlet'`:

```html
<div id="router-outlet">...</div>
```

### Router Links

The `RouterLink` component can be used to add links that route to a particular route:

```javascript
const Navigation = defineComponent({
  render() {
    return h('nav', {}, [
      h(RouterLink, { to: '/' }, ['Home']),
      h(RouterLink, { to: '/about' }, ['About']),
    ])
  },
})
```

The `RouterLink` expects one prop:

- `to`: the path name where the link will redirect the user to

The `RouterLink` handles the `click` event by first preventing it's default action of requesting the page to the server.
Then handles the navigation by accessing the application's router and programatically navigate to the route.
