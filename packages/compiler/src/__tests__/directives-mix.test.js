import { expect, test } from 'vitest'
import { compileTemplate } from '../compile'
import { singleJSLine, toSingleJSLine } from './utils'

test('Compile show and for directives in different elements', () => {
  const { code } = compileTemplate(
    '<ul @show="state.isVisible"><li @for="item of state.items">{{ item }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return (
        this.state.isVisible
          ? h('ul', {}, this.state.items.map((item) => h('li', {}, [ hString(\`\${item}\`) ])) ) 
          : null
      )
    }`)
})
