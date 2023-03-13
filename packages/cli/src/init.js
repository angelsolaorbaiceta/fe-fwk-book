const { copyFile, mkdir, readFile, writeFile } = require('fs/promises')
const { join } = require('path')
const mustache = require('mustache')

const bookUrl = 'http://mng.bz/aM2o'
const templatesDir = join(__dirname, '..', 'templates', 'init')
const topLevelTemplates = ['package.json', 'README.md']
const packageTemplates = [
  '.eslintrc.js',
  'package.json',
  'README.md',
  'rollup.config.mjs',
  'vitest.config.js',
  {
    dir: 'src',
    files: ['index.js', { dir: '__tests__', files: ['sample.test.js'] }],
  },
]

/**
 * Initialize an empty project where to write the code for the framework.
 *
 * The project consists of an NPM project with three workspaces:
 * - `runtime` - the runtime for the framework
 * - `compiler` - the templates compiler
 * - `loader` - A webpack loader to load the templates
 *
 * The three workspaces have the same configuration and tooling:
 * - `eslint` - for linting using ESLint recommended rules
 * - `rollup` - for bundling into ES modules
 * - `vitest` - for testing, using JSDOM environment
 *
 * The following variables are replaced in the templates:
 * - `{{name}}` - the name of the framework
 * - `{{bookUrl}}` - the URL where to buy the book
 *
 * @param {string} name the name of the framework
 */
export async function init(name) {
  const workingDir = process.cwd()
  const projectDir = join(workingDir, name)

  // Create the files in the root directory
  await mkdir(projectDir)
  for (const template of topLevelTemplates) {
    const srcPath = join(templatesDir, template)
    const destPath = join(projectDir, template)

    await copyFile(srcPath, destPath)
  }

  // Create the examples directory git a .gitkeep file
  const examplesDir = join(projectDir, 'examples')
  await mkdir(examplesDir)
  await writeFile(join(examplesDir, '.gitkeep'), '')

  // Create the packages: runtime, compiler, loader
  await initPackage(projectDir, 'compiler', {
    bookUrl,
    name: `${name}-compiler`,
  })
  await initPackage(projectDir, 'loader', {
    bookUrl,
    name: `${name}-loader`,
  })
  await initPackage(projectDir, 'runtime', { name, bookUrl })
}

/**
 * Creates the directory for the package with the given name and copies the
 * template files.
 *
 * @param {string} projectDir the path to the project directory
 * @param {string} name the name of the package
 * @param {object} variables the variables to replace in the templates
 */
async function initPackage(projectDir, name, variables) {
  const packageDir = join(projectDir, 'packages', name)
  await mkdir(packageDir, { recursive: true })

  for (const template of packageTemplates) {
    await renderTemplate(packageDir, [], template, variables)
  }
}

async function renderTemplate(
  packageDir,
  subdirectories,
  template,
  variables
) {
  if (typeof template === 'string') {
    // template is the name of a file
    const templatePath = join(
      templatesDir,
      'package',
      ...subdirectories,
      template
    )
    const destPath = join(packageDir, template)

    const content = await readFile(templatePath, 'utf8')
    const rendered = mustache.render(content, variables)

    await writeFile(destPath, rendered)
  } else {
    // template is a directory of files
    const { dir, files } = template
    const dirPath = join(packageDir, dir)
    await mkdir(dirPath, { recursive: true })

    for (const file of files) {
      await renderTemplate(
        dirPath,
        [...subdirectories, dir],
        file,
        variables
      )
    }
  }
}
