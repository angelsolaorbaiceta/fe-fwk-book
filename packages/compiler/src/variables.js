import { addThisContext } from './context'

const variableInterpolationRegex = /{{\s*([^{}]+)\s*}}/g

export function interpolateVariables(str) {
  if (!variableInterpolationRegex.test(str)) {
    return `'${str}'`
  }

  const replaced = str.replaceAll(variableInterpolationRegex, (_, name) => {
    return '${' + addThisContext(name) + '}'
  })

  return '`' + replaced + '`'
}
