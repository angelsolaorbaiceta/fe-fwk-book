# Build a frontend framework from scratch

![fe-fwk](https://img.shields.io/badge/fe--fwk-book-blueviolet)

Code for the book "Build a web frontend framework (from scratch)," published by [Manning](http://mng.bz/aM2o) and written [by myself](https://github.com/angelsolaorbaiceta).
In this book, you build a frontend framework yourself to learn how frontend frameworks work.

![Cover](https://images.manning.com/360/480/resize/book/0/dfa7a0d-8341-4cb5-86eb-958d2ed263f7/Orbaiceta-MEAP-HI.png)

📘 [Purchase your copy of the book here](http://mng.bz/aM2o) and start learning today!

## Getting Started

To create an empty project where you can write the code for your framework, you can use the CLI:

```bash
$ npx fe-fwk-cli init my-framework-name
```

Where `my-framework-name` is the name of your framework.
You can alternatively create and configure the project manually, by following the instructions at Appendix A in the book.

The project that you get contains three packages:

- [`runtime`](./packages/runtime/README.md): the runtime for your framework; the framework itself.
- `compiler`: the compiler that transforms HTML templates into JavaScript render functions.
- `loader`: the Webpack loader that integrates the compiler with Webpack.

### Scripts

The three packages have the same scripts:

- `build`: bundles the code into a single ESM file, located at the _dist/_ folder.
- `lint`: lints the code with ESLint.
- `lint:fix`: lints the code with ESLint and fixes the errors.
- `test`: runs the tests in watch mode with Vitest.
- `test:run`: runs the tests once with Vitest.
