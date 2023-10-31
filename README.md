# Build a frontend framework from scratch

![fe-fwk](https://img.shields.io/badge/fe--fwk-book-blueviolet)

Code for the book "Build a web frontend framework (from scratch)," published by [Manning](http://mng.bz/aM2o) and written [by myself](https://github.com/angelsolaorbaiceta).
In this book, you build a frontend framework yourself to learn how frontend frameworks work.

![Cover](https://images.manning.com/360/480/resize/book/0/dfa7a0d-8341-4cb5-86eb-958d2ed263f7/Orbaiceta-MEAP-HI.png)

📘 [Purchase your copy of the book here](http://mng.bz/aM2o) and start learning today!

## Table Of Contents

The first three parts of the book are published by [Manning](http://mng.bz/aM2o):

* _Part I_—No Framework (📘 book)
  * [_Chapter 1_—Are frontend frameworks magic to you?](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-1)
  * [_Chapter 2_—Vanilla JavaScript—like in the old days](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-2)
    
* _Part II_—A Basic Framework (📘 book)
  * [_Chapter 3_—Rendering and the virtual DOM](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-3)
  * [_Chapter 4_—Mounting and destroying the virtual DOM](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-4)
  * [_Chapter 5_—State management and the application's lifecycle](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-5)
  * [_Chapter 6_—Publishing and using your framework's first version](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-6)
  * [_Chapter 7_—The reconciliation algorithm: diffing virtual trees](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-7)
  * [_Chapter 8_—The reconciliation algorithm: patching the DOM](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-8)
    
* _Part III_—Improving the Framework (📘 book)
  * [_Chapter 9_—Stateful component](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-9)
  * [_Chapter 10_—Component methods](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-10)
  * [_Chapter 11_—Subcomponents—Communication via props and events](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-11)
  * [_Chapter 12_—Keyed lists](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-12)
  * [_Chapter 13_—The component lifecycle hooks and the scheduler](https://livebook.manning.com/book/build-a-frontend-web-framework-from-scratch/chapter-13)
  * _Chapter 14_—Testing asynchronous components

The last two are freely available in the [repository's Wiki](https://github.com/angelsolaorbaiceta/fe-fwk-book/wiki):

* _Part IV_—Extra features (🖥 online; coming soon)
  * [_Chapter 15_—Slots—Inserting external content](https://github.com/angelsolaorbaiceta/fe-fwk-book/wiki/Chapter-15%E2%80%94Slots%E2%80%94Inserting-external-content)
  * _Chapter 16_—Single Page Application routing
    
* _Part V_—Advanced topics (🖥 online; coming soon)


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
- `test`: runs the tests once with Vitest.
- `test:watch`: runs the tests in "watch" mode with Vitest.
- `test:coverage`: runs the tests and generate a coverage report.
