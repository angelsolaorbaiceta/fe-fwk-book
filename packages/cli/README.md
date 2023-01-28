# Fe-Fwk CLI

This CLI will help you get started with a new Fe-Fwk project.

## Installation

You can install the CLI globally with npm:

```bash
npm install -g fe-fwk-cli
```

## Usage

### Creating the project for the book

To create an empty project were you can write the code for the book, run:

```bash
fe-fwk init <framework-name>
```

Where `<framework-name>` is the name you want to give the framework.
This will create the following structure:

```
├── README.md
├── package.json
├── packages
│     ├── compiler
│     ├── loader
│     ├── runtime
```

Each of the packages is configured the same way, using the following scripts:

- `build`: bundles the javascript code—using Rollup—into a single ES module file
- `test`: starts the Vitest test runner in watch mode
- `test:run`: runs the Vitest test runner once
- `lint`: runs ESLint on the code
- `lint:fix`: runs ESLint on the code and fixes any issues it can
