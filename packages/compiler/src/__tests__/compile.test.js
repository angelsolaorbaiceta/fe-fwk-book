import { expect, test } from 'vitest'
import { compileTemplate } from '../compile'
import { singleJSLine, toSingleJSLine } from './utils'

test('Compile and empty <div> element', () => {
  const { code, imports } = compileTemplate('<div></div>')

  expect(imports).toEqual(new Set(['h']))
  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ ]) )
    }`)
})

test('Compile element with text content', () => {
  const { code, imports } = compileTemplate('<div>Hello World</div>')

  expect(imports).toEqual(new Set(['h', 'hString']))
  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ hString('Hello World') ]) )
    }`)
})

test('Compile two contiguous elements inside a fragment', () => {
  const { code, imports } = compileTemplate('<div></div><p></p>')

  expect(imports).toEqual(new Set(['h', 'hFragment']))
  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h(Fragment, {}, [ 
        h('div', {}, [ ]), 
        h('p', {}, [ ]) 
      ]) )
    }`)
})

test('Compile nested elements', () => {
  const { code, imports } = compileTemplate('<div><p>Hello</p></div>')

  expect(imports).toEqual(new Set(['h', 'hString']))
  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ 
        h('p', {}, [ hString('Hello') ]) 
      ]) )
    }`)
})

test('Compile props interpolation', () => {
  const { code } = compileTemplate('<p>{{ props.text }}</p>')

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`\${this.props.text}\`) ]) )
    }`)
})

test('Compile state interpolation', () => {
  const { code } = compileTemplate('<p>{{ state.text }}</p>')

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`\${this.state.text}\`) ]) )
    }`)
})

test('Compile props and state interpolation along with regular text', () => {
  const { code } = compileTemplate(
    '<p>{{ props.text }} - {{ state.text }}</p>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ 
        hString(\`\${this.props.text} - \${this.state.text}\`) 
      ]) )
    }`)
})

test('Does not add "this" to non state/props interpolations', () => {
  const { code } = compileTemplate('<p>Hello, {{ name }}</p>')

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`Hello, \${name}\`) ]) )
    }`)
})

test('Compile expression interpolation', () => {
  const { code } = compileTemplate('<p>{{ state.a + props.b + 5 }}</p>')

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`\${this.state.a + this.props.b + 5}\`) ]) )
    }`)
})

test('Compile method call interpolation', () => {
  const { code } = compileTemplate(
    '<p>This is {{ state.country.toUpperCase() }}</p>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`This is \${this.state.country.toUpperCase()}\`) ]) )
    }`)
})

test('Compile element with static attributes', () => {
  const { code } = compileTemplate('<p class="text-center"></p>')

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: 'text-center' }, [ ]) )
    }`)
})

test('Compile attribute with props/state binding', () => {
  const { code } = compileTemplate(
    '<p [class]="state.text" [hidden]="props.hide"></p>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: this.state.text, hidden: this.props.hide }, [ ]) )
    }`)
})

test('Compile attribute binding with compound expression', () => {
  const { code } = compileTemplate(
    '<p [class]="state.foo + \'--\' + props.bar"></p>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: this.state.foo + '--' + this.props.bar }, [ ]) )
    }`)
})

test('Compile class array attribute binding', () => {
  const { code } = compileTemplate(
    '<p [class]="[state.foo, props.bar, \'foo\']"></p>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: [this.state.foo, this.props.bar, 'foo'] }, [ ]) )
    }`)
})

test.each([
  ['handleClick', 'this.handleClick'],
  ['handleClick()', 'this.handleClick()'],
  ['handle_click2', 'this.handle_click2'],
  ['handle_click2()', 'this.handle_click2()'],
  ['() => handleClick()', '() => this.handleClick()'],
  ['() => handle_click2()', '() => this.handle_click2()'],
  ['() => handleClick(foo, bar)', '() => this.handleClick(foo, bar)'],
  [
    '(event) => handleClick(event.target, foo, bar)',
    '(event) => this.handleClick(event.target, foo, bar)',
  ],
  [
    '(event) => handle_click2(event.target, foo, bar)',
    '(event) => this.handle_click2(event.target, foo, bar)',
  ],
  [
    '() => { handleClick(); handle_click2() }',
    '() => { this.handleClick(); this.handle_click2() }',
  ],
  [
    '() => { handleClick();\n handle_click2() }',
    '() => { this.handleClick(); this.handle_click2() }',
  ],
])('Compile "%s" event handler', (template, expected) => {
  const { code } = compileTemplate(
    `<button (click)="${template}"></button>`
  )

  expect(toSingleJSLine(code)).toBe(
    toSingleJSLine(`
    function render() {
      return ( h('button', { on: { click: ${expected} } }, [ ]) )
    }`)
  )
})
