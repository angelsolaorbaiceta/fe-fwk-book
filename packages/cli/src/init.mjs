import { copyFile, mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import mustache from 'mustache'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const templatesDir = join(__dirname, '..', 'templates', 'init')
const topLevelTemplates = ['package.json']
const packageTemplates = [
  '.eslintrc.js',
  'package.json',
  'README.md',
  'rollup.config.mjs',
  'vitest.config.js',
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
 *
 * @param {string} name the name of the framework
 */
export default async function init(name) {
  const workingDir = process.cwd()
  const projectDir = join(workingDir, name)

  const variables = {
    name,
  }

  await mkdir(projectDir)
  for (const template of topLevelTemplates) {
    const srcPath = join(templatesDir, template)
    const destPath = join(projectDir, template)

    await copyFile(srcPath, destPath)
  }

  await initPackage(projectDir, 'compiler', variables)
  await initPackage(projectDir, 'loader', variables)
  await initPackage(projectDir, 'runtime', variables)
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
    const srcPath = join(templatesDir, 'package', template)
    const destPath = join(packageDir, template)

    const content = await readFile(srcPath, 'utf8')
    const rendered = mustache.render(content, variables)
    await writeFile(destPath, rendered)
  }
}
