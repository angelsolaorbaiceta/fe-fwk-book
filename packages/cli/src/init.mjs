import { join } from 'path'
import { mkdir } from 'fs/promises'

export default async function init(name) {
  const workingDir = process.cwd()
  const projectDir = join(workingDir, name)
  await mkdir(projectDir)

  console.log('init', name, projectDir)
}
