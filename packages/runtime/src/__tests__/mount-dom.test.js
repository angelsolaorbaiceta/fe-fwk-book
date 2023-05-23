import { beforeEach, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hFragment, hString } from '../h'
import { mountDOM } from '../mount-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

test("can't mount an element without a host element", () => {
  const vdom = h('div', {}, [hString('hello')])
  expect(() => mountDOM(vdom)).toThrow()
})

test('mount a text element in a host element', () => {
  const vdom = hString('hello')
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('hello')
})

test('save the created text element in the vdom', () => {
  const vdom = hString('hello')
  mountDOM(vdom, document.body)
  const el = vdom.el

  expect(el).toBeInstanceOf(Text)
  expect(el.textContent).toBe('hello')
})

test('mount an element in a host element', () => {
  const vdom = h('div', {}, [hString('hello')])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div>hello</div>')
})

test('save the created element in the vdom', () => {
  const vdom = h('div')
  mountDOM(vdom, document.body)
  const el = vdom.el

  expect(el).toBeInstanceOf(HTMLDivElement)
})

test("can't mount a fragment without a parent element", () => {
  const vdom = hFragment([hString('hello')])
  expect(() => mountDOM(vdom)).toThrow()
})

test('mount a fragment in a host element', () => {
  const vdom = hFragment([hString('hello, '), hString('world')])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('hello, world')
})

test('mount a fragment inside a fragment inside a host element', () => {
  const vdom = hFragment([
    h('p', {}, ['foo']),
    hFragment([h('p', {}, ['bar']), h('p', {}, ['baz'])]),
  ])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<p>foo</p><p>bar</p><p>baz</p>')
})

test('all nested fragments el references point to the parent element (where they are mounted)', () => {
  const vdomOne = hFragment([hString('hello, '), hString('world')])
  const vdomTwo = hFragment([vdomOne])
  const vdomThree = hFragment([vdomTwo])

  mountDOM(vdomThree, document.body)

  expect(vdomThree.el).toBe(document.body)
  expect(vdomTwo.el).toBe(document.body)
  expect(vdomOne.el).toBe(document.body)
})

test('mount fragment with children that have attributes', () => {
  const vdom = hFragment([
    h('span', { id: 'foo' }, [hString('hello, ')]),
    h('span', { id: 'bar' }, [hString('world')]),
  ])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    '<span id="foo">hello, </span><span id="bar">world</span>'
  )
})

test('mount an element with id', () => {
  const vdom = h('div', { id: 'foo' })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div id="foo"></div>')
})

test('mount an element with class', () => {
  const vdom = h('div', { class: 'foo' })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div class="foo"></div>')
})

test('mount an element with a list of classes', () => {
  const vdom = h('div', { class: ['foo', 'bar'] })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
})

test('mount an element with event handlers', () => {
  const onClick = vi.fn()
  const vdom = h('div', { on: { click: onClick } })
  mountDOM(vdom, document.body)

  vdom.el?.click()

  expect(onClick).toBeCalledTimes(1)
  expect(onClick).toBeCalledWith(expect.any(MouseEvent))
  expect(vdom.listeners).toEqual({ click: expect.any(Function) })
})

test('mounts an element with styles', () => {
  const vdom = h('div', { style: { color: 'red' } })
  mountDOM(vdom, document.body)
  const el = vdom.el

  expect(document.body.innerHTML).toBe('<div style="color: red;"></div>')
  expect(el.style.color).toBe('red')
})

test('where there is a host component, the event handlers are bound to it', async () => {
  const comp = { count: 5 }
  const vdom = hFragment([
    h(
      'button',
      {
        on: {
          // Can't use arrow functions, because their `this` is bound to the
          // lexical scope, and that can't be changed.
          click() {
            this.count++
          },
        },
        id: 'btn-1',
      },
      ['One']
    ),
    h('div', {}, [
      h(
        'button',
        {
          on: {
            // Can't use arrow functions, because their `this` is bound to the
            // lexical scope, and that can't be changed.
            click() {
              this.count++
            },
          },
          id: 'btn-2',
        },
        ['Two']
      ),
    ]),
  ])

  mountDOM(vdom, document.body, null, comp)

  document.querySelector('#btn-1').click()
  expect(comp.count).toBe(6)

  document.querySelector('#btn-2').click()
  expect(comp.count).toBe(7)
})

test('mount a component with props', () => {
  const Component = defineComponent({
    render() {
      return h('p', { class: 'important' }, [this.props.message])
    },
  })
  const vdom = h(Component, { message: 'hello' })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<p class="important">hello</p>')
  expect(vdom.component).toBeInstanceOf(Component)
})

test('mount a component with children', () => {
  const ChildComp = defineComponent({
    render() {
      return h('p', {}, [this.props.message])
    },
  })
  const ParentComp = defineComponent({
    render() {
      return h(
        'div',
        {},
        this.props.messages.map((msg) => h(ChildComp, { message: msg }))
      )
    },
  })
  const vdom = h(ParentComp, { messages: ['hello', 'world'] })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    '<div><p>hello</p><p>world</p></div>'
  )
  expect(vdom.component).toBeInstanceOf(ParentComp)
})

test('mount a component with event handlers', () => {
  const onClick = vi.fn()
  const Component = defineComponent({
    render() {
      return h('button', { on: { click: () => this.emit('click') } }, [
        'Click me',
      ])
    },
  })
  const vdom = h(Component, { on: { click: onClick } })
  mountDOM(vdom, document.body)

  document.querySelector('button').click()

  expect(onClick).toBeCalledTimes(1)
})

test('mount a component with a parent component', () => {
  // Parent component just as a stub; won't get rendered.
  const Parent = {}
  const Component = defineComponent({
    render() {
      return h('p', {}, ['child'])
    },
  })
  const vdom = h(Component)
  mountDOM(vdom, document.body, null, Parent)

  expect(document.body.innerHTML).toBe('<p>child</p>')
  expect(vdom.component.parentComponent).toBe(Parent)
})

test('child components keep a reference to their parent component', () => {
  const CompC = defineComponent({
    render() {
      return h('p', {}, ['c'])
    },
  })
  const CompB = defineComponent({
    render() {
      return h(CompC)
    },
  })
  const CompA = defineComponent({
    render() {
      return h(CompB)
    },
  })
  const vdom = h(CompA)
  mountDOM(vdom, document.body)

  const compA = vdom.component
  const compB = compA.vdom.component
  const compC = compB.vdom.component

  expect(compA.parentComponent).toBe(null)
  expect(compB.parentComponent).toBe(compA)
  expect(compC.parentComponent).toBe(compB)
})

test('when a component with multiple elements is mounted, the vdom keeps a reference to the first element', () => {
  const Component = defineComponent({
    render() {
      return hFragment([
        h('p', { id: 'one' }, ['1']),
        h('p', { id: 'two' }, ['2']),
      ])
    },
  })
  const vdom = h(Component)
  mountDOM(vdom, document.body)

  expect(vdom.el).toBe(document.querySelector('p#one'))
})

test('mount a fragment at index', () => {
  document.body.innerHTML = '<p>one</p><p>two</p><p>five</p>'
  const vdom = hFragment([h('p', {}, ['three']), h('p', {}, ['four'])])
  mountDOM(vdom, document.body, 2)

  expect(document.body.innerHTML).toBe(
    '<p>one</p><p>two</p><p>three</p><p>four</p><p>five</p>'
  )
})
