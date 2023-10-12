import { expect, test } from 'vitest'
import { TemplateCompiler } from '../compile'
import { singleJSLine } from './utils'

const compiler = new TemplateCompiler()

test('Compile and empty <div> element', () => {
  const { code, imports } = compiler.compile('<div></div>')

  expect(imports).toEqual(new Set(['h']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ ]) )
    }`)
})

test('Compile element with text content', () => {
  const { code, imports } = compiler.compile('<div>Hello World</div>')

  expect(imports).toEqual(new Set(['h', 'hString']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ hString('Hello World') ]) )
    }`)
})

test('Compile two contiguous elements inside a fragment', () => {
  const { code, imports } = compiler.compile('<div></div><p></p>')

  expect(imports).toEqual(new Set(['h', 'hFragment']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h(Fragment, {}, [ 
        h('div', {}, [ ]), 
        h('p', {}, [ ]) 
      ]) )
    }`)
})

test('Compile nested elements', () => {
  const { code, imports } = compiler.compile('<div><p>Hello</p></div>')

  expect(imports).toEqual(new Set(['h', 'hString']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ 
        h('p', {}, [ hString('Hello') ]) 
      ]) )
    }`)
})

test('Compile props interpolation', () => {
  const { code } = compiler.compile('<p>{{ props.text }}</p>')

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`\${this.props.text}\`) ]) )
    }`)
})

test('Compile state interpolation', () => {
  const { code } = compiler.compile('<p>{{ state.text }}</p>')

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`\${this.state.text}\`) ]) )
    }`)
})

test('Compile props and state interpolation along with regular text', () => {
  const { code } = compiler.compile(
    '<p>{{ props.text }} - {{ state.text }}</p>'
  )

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ 
        hString(\`\${this.props.text} - \${this.state.text}\`) 
      ]) )
    }`)
})

test('Does not add "this" to non state/props interpolations', () => {
  const { code } = compiler.compile('<p>Hello, {{ name }}</p>')

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`Hello, \${name}\`) ]) )
    }`)
})

test('Compile expression interpolation', () => {
  const { code } = compiler.compile('<p>{{ state.a + props.b + 5 }}</p>')

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`\${this.state.a + this.props.b + 5}\`) ]) )
    }`)
})

test('Compile method call interpolation', () => {
  const { code } = compiler.compile(
    '<p>This is {{ state.country.toUpperCase() }}</p>'
  )

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', {}, [ hString(\`This is \${this.state.country.toUpperCase()}\`) ]) )
    }`)
})

test('Compile element with static attributes', () => {
  const { code } = compiler.compile('<p class="text-center"></p>')

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: 'text-center' }, [ ]) )
    }`)
})

test('Compile attribute with props/state binding', () => {
  const { code } = compiler.compile(
    '<p [class]="state.text" [hidden]="props.hide"></p>'
  )

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: this.state.text, hidden: this.props.hide }, [ ]) )
    }`)
})

test('Compile attribute binding with compound expression', () => {
  const { code } = compiler.compile(
    '<p [class]="state.foo + \'--\' + props.bar"></p>'
  )

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: this.state.foo + '--' + this.props.bar }, [ ]) )
    }`)
})

test('Compile class array attribute binding', () => {
  const { code } = compiler.compile(
    '<p [class]="[state.foo, props.bar, \'foo\']"></p>'
  )

  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('p', { class: [this.state.foo, this.props.bar, 'foo'] }, [ ]) )
    }`)
})
