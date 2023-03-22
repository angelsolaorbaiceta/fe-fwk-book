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
