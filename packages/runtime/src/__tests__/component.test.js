import { beforeEach, describe, expect, test } from 'vitest'
import { defineComponent } from '../component'
import { h, hFragment, hString } from '../h'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Mounting and unmounting a component', () => {
  test('can be mounted into the DOM', () => {
    new Comp().mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p>'
    )
  })

  test('can be mounted at a specific position', () => {
    document.body.innerHTML = '<h1>Definitions</h1><hr>'

    const comp = new Comp()
    comp.mount(document.body, 1)

    expect(document.body.innerHTML).toBe(
      '<h1>Definitions</h1><p>A point is that which has no part.</p><hr>'
    )
  })

  test("can't be mounted twice", () => {
    const comp = new Comp()
    comp.mount(document.body)

    expect(() => comp.mount(document.body)).toThrow(/already mounted/)
  })

  test('can be unmounted', () => {
    const comp = new Comp()
    comp.mount(document.body)
    comp.unmount()

    expect(document.body.innerHTML).toBe('')
  })

  test("can't be unmounted if it wasn't mounted", () => {
    const comp = new Comp()
    expect(() => comp.unmount()).toThrow(/not mounted/)
  })

  test('can be mounted after being unmounted', () => {
    const comp = new Comp()
    comp.mount(document.body)
    comp.unmount()
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p>'
    )
  })

  test('can be mounted as a fragment', () => {
    const comp = new FragComp()
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p><p>A line is breadthless length.</p>'
    )
  })
})

describe('Component props', () => {
  test('can have props', () => {
    const comp = new PropsComp({ pClass: 'definition' })
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p class="definition">A point is that which has no part.</p>'
    )
  })

  test("can't patch the DOM if the component isn't mounted", () => {
    const comp = new PropsComp({ pClass: 'definition' })
    expect(() => comp.updateProps()).toThrow(/not mounted/)
  })

  test('can be updated and the DOM patched', () => {
    const comp = new PropsComp({ pClass: 'definition' })
    comp.mount(document.body)

    comp.updateProps({ pClass: ['definition', 'updated'] })

    expect(document.body.innerHTML).toBe(
      '<p class="definition updated">A point is that which has no part.</p>'
    )
  })
})

describe('Component state', () => {
  test('can have its own internal state', () => {
    const comp = new StateComp()
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe('<button>0</button>')
  })

  test('can be based on the props', () => {
    const Comp = defineComponent({
      state(props) {
        return { count: props.initialCount }
      },
      render() {
        return h('p', {}, [hString(this.state.count)])
      },
    })
    const comp = new Comp({ initialCount: 10 })

    comp.mount(document.body)

    expect(document.body.innerHTML).toBe('<p>10</p>')
  })

  test('when the state changes, the DOM is patched', () => {
    const comp = new StateComp()
    comp.mount(document.body)

    comp.updateState({ count: 5 })

    expect(document.body.innerHTML).toBe('<button>5</button>')
  })

  test('an event can change the state', () => {
    const comp = new StateComp()
    comp.mount(document.body)

    document.querySelector('button').click()

    expect(document.body.innerHTML).toBe('<button>1</button>')
  })
})

describe('Component methods', () => {
  test('can use methods to handle events', () => {
    const Comp = defineComponent({
      state() {
        return { count: 0 }
      },
      increment() {
        this.updateState({ count: this.state.count + 1 })
      },
      render() {
        return h(
          'button',
          {
            on: {
              click: this.increment,
            },
          },
          [hString(this.state.count)]
        )
      },
    })
    const comp = new Comp()
    comp.mount(document.body)

    document.querySelector('button').click()

    expect(document.body.innerHTML).toBe('<button>1</button>')
  })
})

test('A component can patch the DOM, adding event handlers bound to the component', () => {
  // A plus/minus counter that hides the "-" button when the count is 0.
  const Component = defineComponent({
    state() {
      return { count: 0 }
    },
    render() {
      return hFragment([
        this.state.count > 0
          ? h(
              'button',
              {
                id: 'minus-btn',
                on: {
                  // Using a method function to avoid having the event handler bound to the
                  // component due to lexical scoping. Make sure the binding is correctly
                  // done by the component, passing itself as a reference to the patchDOM() fn.
                  click() {
                    this.updateState({ count: this.state.count - 1 })
                  },
                },
              },
              ['-']
            )
          : null,
        h('span', {}, [hString(this.state.count)]),
        h(
          'button',
          {
            id: 'plus-btn',
            on: {
              click: () =>
                this.updateState({ count: this.state.count + 1 }),
            },
          },
          ['+']
        ),
      ])
    },
  })

  const comp = new Component()
  comp.mount(document.body)

  expect(document.body.innerHTML).toBe(
    '<span>0</span><button id="plus-btn">+</button>'
  )

  document.querySelector('#plus-btn').click()
  expect(document.body.innerHTML).toBe(
    '<button id="minus-btn">-</button><span>1</span><button id="plus-btn">+</button>'
  )

  document.querySelector('#minus-btn').click()
  expect(document.body.innerHTML).toBe(
    '<span>0</span><button id="plus-btn">+</button>'
  )
})

describe('Child components', () => {
  const items = ['Walk the dog', 'Water the plants']

  test('can mount child components', () => {
    const comp = new List({ items })
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<ul><li>Walk the dog</li><li>Water the plants</li></ul>'
    )
  })
})

// References from Euclid's Elements, Book I
// http://aleph0.clarku.edu/~djoyce/elements/bookI/bookI.html#defs

const Comp = defineComponent({
  render() {
    return h('p', {}, ['A point is that which has no part.'])
  },
})

const FragComp = defineComponent({
  render() {
    return hFragment([
      h('p', {}, ['A point is that which has no part.']),
      h('p', {}, ['A line is breadthless length.']),
    ])
  },
})

const PropsComp = defineComponent({
  render() {
    return h('p', { class: this.props.pClass }, [
      'A point is that which has no part.',
    ])
  },
})

const StateComp = defineComponent({
  state() {
    return { count: 0 }
  },
  render() {
    return h(
      'button',
      {
        on: {
          click: () => this.updateState({ count: this.state.count + 1 }),
        },
      },
      [hString(this.state.count)]
    )
  },
})

const ListItem = defineComponent({
  state() {
    return { highlighted: false }
  },
  render() {
    return h('li', { class: this.state.highlighted ? 'highlighted' : '' }, [
      this.props.text,
    ])
  },
})

const List = defineComponent({
  render() {
    return h(
      'ul',
      {},
      this.props.items.map((item) => h(ListItem, { text: item }))
    )
  },
})
