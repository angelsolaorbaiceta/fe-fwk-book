import { copyFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const templatesDir = join(__dirname, '..', 'templates', 'init')
const topLevelTemplates = ['package.json']
const runtimeTemplates = [
  '.eslintrc.js',
  'package.json',
  'README.md',
  'rollup.config.mjs',
  'vitest.config.js',
]

export default async function init(name) {
  const workingDir = process.cwd()
  const projectDir = join(workingDir, name)

  await mkdir(projectDir)
  topLevelTemplates.forEach(async (template) => {
    const srcPath = join(templatesDir, template)
    const destPath = join(projectDir, template)
    await copyFile(srcPath, destPath)
  })

  await initRuntime(projectDir)

  console.log('init', name, projectDir)
}

async function initRuntime(projectDir) {
  const runtimeDir = join(projectDir, 'runtime')
  await mkdir(runtimeDir)

  console.log('initRuntime', projectDir)
}
