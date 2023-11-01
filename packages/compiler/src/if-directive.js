import { addThisContext } from './context'

export function handleIfDirective({ lines, stack }, directives) {
  const showDirective = directives.show
  if (!showDirective) {
    return 0
  }

  const condition = addThisContext(directives.show)
  lines.push(`${condition} ?`)
  stack.unshift(': null')

  return 1
}
