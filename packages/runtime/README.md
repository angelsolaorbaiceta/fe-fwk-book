# Fe-Fwk

Code for the book "Build a frontend framework from scratch".

This framework **isn't intended for production use**.
Its intention is to **teach you how frontend frameworks work** by building one yourself, from scratch.

## v1.0 — Chapter 3

_See the example application in the [examples/ch03 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch03)_.

This version of the framework introduces the concept of a _Virtual DOM_.
It implements the `h()`, `hString()` and `hFragment()` functions to create virtual nodes and the `mountDOM()` and `destroyDOM()` functions to turn the virtual DOM representing the view of the application into HTML elements in the browser.

The application instance, created using the `createApp()` function, holds all the state for the application, which can be changed by dispatching events using an instance of a `Dispatcher`.
Every time an event is dispatched, the reducer subscribed to the event is run to update the state, and then, the entire view is destroyed and recreated from scratch.
This is done by registering the application's `renderApp()` function to run after each event is processed in the dispatcher.

In the next version we introduce the _reconciliation algorithm_ to only update the parts of the DOM that have changed.
