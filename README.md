# Build a frontend framework from scratch

![fe-fwk](https://img.shields.io/badge/fe--fwk-book-blueviolet)

Code for the book "Build a web frontend framework (from scratch)," published by [Manning](http://mng.bz/aM2o) and written [by myself](https://github.com/angelsolaorbaiceta).
In this book, you build a frontend framework yourself to learn how frontend frameworks work.

📘 [Purchase your copy of the book here](http://mng.bz/aM2o) and start learning today!

## Getting Started

To create an empty project where you can write the code for your framework, you can use the CLI:

```bash
$ npx fe-fwk init my-framework-name
```

Where `my-framework-name` is the name of your framework.
You can alternatively create and configure the project manually, by following the instructions at Appendix A in the book.

The project that you get contains three packages:

- `runtime`: the runtime for your framework; the framework itself.
- `compiler`: the compiler that transforms HTML templates into JavaScript render functions.
- `loader`: the Webpack loader that integrates the compiler with Webpack.

### Scripts

The three packages have the same scripts:

- `build`: bundles the code into a single ESM file, located at the _dist/_ folder.
- `lint`: lints the code with ESLint.
- `lint:fix`: lints the code with ESLint and fixes the errors.
- `test`: runs the tests in watch mode with Vitest.
- `test:run`: runs the tests once with Vitest.

## Versions

### [v1.0 — Chapter 4](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/ch4/packages/runtime)

_See the example application in the [examples/ch04 folder](https://github.com/angelsolaorbaiceta/fe-fwk-book/tree/main/examples/ch04)_.

To checkout this version of the code:

```bash
git checkout ch4
```

This version of the framework introduces the concept of a _Virtual DOM_.
It implements the `h()`, `hString()` and `hFragment()` functions to create virtual nodes and the `mountDOM()` and `destroyDOM()` functions to turn the virtual DOM representing the view of the application into HTML elements in the browser.

The application instance, created using the `createApp()` function, holds all the state for the application, which can be changed by dispatching events using an instance of a `Dispatcher`.
Every time an event is dispatched, the reducer subscribed to the event is run to update the state, and then, the entire view is destroyed and recreated from scratch.
This is done by registering the application's `renderApp()` function to run after each event is processed in the dispatcher.

In the next version we introduce the _reconciliation algorithm_ to only update the parts of the DOM that have changed.
