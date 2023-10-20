import { expect, test } from 'vitest'
import { compileTemplate } from '../compile'
import { toSingleJSLine } from './utils'

test.each([
  ['state.isVisible', 'this.state.isVisible'],
  ['props.isVisible', 'this.props.isVisible'],
  ['state.count > 0', 'this.state.count > 0'],
  [
    'state.count > 0 && isVisible()',
    'this.state.count > 0 && this.isVisible()',
  ],
  ['getItems().length > 0', 'this.getItems().length > 0'],
])('Compile show directive with "%s" condition', (condition, expected) => {
  const { code } = compileTemplate(`<p @show="${condition}">Hello</p>`)

  expect(code).toBe(
    toSingleJSLine(`
    function render() {
      return (
        ${expected} ? h('p', {}, [ hString('Hello') ]) : null
      )
    }`)
  )
})
