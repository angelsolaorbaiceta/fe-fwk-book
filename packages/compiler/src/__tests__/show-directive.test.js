import { test, expect } from 'vitest'
import { compileTemplate } from '../compile'
import { singleJSLine } from './utils'

test('Compile show directive with a boolean state property', () => {
  const { code } = compileTemplate('<p @show="state.isVisible">Hello</p>')

  expect(code).toBe(singleJSLine`
    function render() {
      return (
        this.state.isVisible ? h('p', {}, [ hString('Hello') ]) : null
      )
    }`)
})
