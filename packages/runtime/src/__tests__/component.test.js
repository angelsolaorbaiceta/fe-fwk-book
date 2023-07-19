import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hFragment, hString } from '../h'
import { singleHtmlLine } from './utils'
import { mountDOM } from '../mount-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Mounting and unmounting', () => {
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
    expect(() => comp.updateProps({ pClass: 'lemma' })).toThrow(
      /not mounted/
    )
  })

  test('when the props are updated, the DOM is patched', () => {
    const comp = new PropsComp({ pClass: 'definition' })
    comp.mount(document.body)

    comp.updateProps({ pClass: ['definition', 'updated'] })

    expect(document.body.innerHTML).toBe(
      '<p class="definition updated">A point is that which has no part.</p>'
    )
  })

  test('Does not patch the DOM if the props are the same', () => {
    const comp = new PropsComp({ pClass: 'definition' })
    comp.mount(document.body)

    const renderSpy = vi.spyOn(comp, 'render')

    comp.updateProps({ pClass: 'definition' })

    expect(renderSpy).not.toHaveBeenCalled()
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

describe('Patching the DOM', () => {
  test('Can add event handlers bound to the component', () => {
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
})

describe('Child components', () => {
  const items = [
    'A point is that which has no part',
    'A line is breadthless length',
  ]

  test('can mount child components', () => {
    const comp = new List({ items })
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<ul><li>A point is that which has no part</li><li>A line is breadthless length</li></ul>'
    )
  })

  test('can unmount child components', () => {
    const comp = new List({ items })
    comp.mount(document.body)

    comp.unmount()

    expect(document.body.innerHTML).toBe('')
  })

  test('the state of children is preserved through a re-render', () => {
    const comp = new List({ items })
    comp.mount(document.body)

    // Highlight the first item
    document.querySelectorAll('li')[0].click()
    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
      <ul>
        <li class="highlighted">A point is that which has no part</li>
        <li>A line is breadthless length</li>
      </ul>
      `
    )

    // Force a re-render of the component by adding a new item
    comp.updateProps({ items: [...items, 'The ends of a line are points'] })

    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
      <ul>
        <li class="highlighted">A point is that which has no part</li>
        <li>A line is breadthless length</li>
        <li>The ends of a line are points</li>
      </ul>
      `
    )
  })

  test('children can be added', () => {
    const comp = new List({ items })
    comp.mount(document.body)

    comp.updateProps({ items: [...items, 'The ends of a line are points'] })

    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
      <ul>
        <li>A point is that which has no part</li>
        <li>A line is breadthless length</li>
        <li>The ends of a line are points</li>
      </ul>
      `
    )
  })

  test('children can be removed', () => {
    const comp = new List({ items })
    comp.mount(document.body)

    comp.updateProps({ items: [items[0]] })

    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
      <ul>
        <li>A point is that which has no part</li>
      </ul>
      `
    )
  })
})

describe('Events', () => {
  test('components can emit events', () => {
    const handler = vi.fn()
    const comp = new ListItem(
      { text: 'A point is that which has no part' },
      { 'remove-item': handler }
    )
    comp.mount(document.body)

    document.querySelector('li').dispatchEvent(new Event('dblclick'))

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(
      'A point is that which has no part'
    )
  })

  test('before the component is mounted, its event handlers are not called', () => {
    const handler = vi.fn()
    const comp = new ListItem(
      { text: 'A point is that which has no part' },
      { 'remove-item': handler }
    )

    comp.emit('remove-item')

    expect(handler).not.toHaveBeenCalled()
  })

  test('when the component is unmounted, its event handlers are removed', () => {
    const handler = vi.fn()
    const comp = new ListItem(
      { text: 'A point is that which has no part' },
      { 'remove-item': handler }
    )
    comp.mount(document.body)
    comp.unmount()

    comp.emit('remove-item')

    expect(handler).not.toHaveBeenCalled()
  })

  test('event handlers can be bound to the component', () => {
    const comp = new DefinitionsComponent()
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
      <ul>
        <li>A point is that which has no part</li>
        <li>A line is breadthless length</li>
        <li>The ends of a line are points</li>
      </ul>
      `
    )

    // Remove the second item
    document.querySelectorAll('li')[1].dispatchEvent(new Event('dblclick'))

    expect(document.body.innerHTML).toBe(
      singleHtmlLine`
      <ul>
        <li>A point is that which has no part</li>
        <li>The ends of a line are points</li>
      </ul>
      `
    )
  })
})

describe('Mounted elements', () => {
  test('unmounted components have no mounted elements', () => {
    const Component = defineComponent({
      render() {
        return h('p', {}, ['A point is that which has no part.'])
      },
    })
    const comp = new Component()

    expect(comp.elements).toEqual([])
  })

  test('component with a single root element', () => {
    const Component = defineComponent({
      render() {
        return h('p', {}, ['A point is that which has no part.'])
      },
    })
    const comp = new Component()
    comp.mount(document.body)

    const expectedEl = document.querySelector('p')

    expect(comp.elements).toEqual([expectedEl])
  })

  test('component with a root fragment containing elements', () => {
    const Component = defineComponent({
      render() {
        return hFragment([
          h('p', {}, ['A point is that which has no part.']),
          h('p', {}, ['A line is breadthless length.']),
        ])
      },
    })
    const comp = new Component()
    comp.mount(document.body)

    const [expectedOne, expectedTwo] = document.querySelectorAll('p')

    expect(comp.elements).toEqual([expectedOne, expectedTwo])
  })

  test('component with a root fragment containing other components', () => {
    const Subcomponent = defineComponent({
      render() {
        return h('p', {}, ['A point is that which has no part.'])
      },
    })
    const Component = defineComponent({
      render() {
        return hFragment([h(Subcomponent), h(Subcomponent)])
      },
    })
    const comp = new Component()
    comp.mount(document.body)

    const [expectedOne, expectedTwo] = document.querySelectorAll('p')

    expect(comp.elements).toEqual([expectedOne, expectedTwo])
  })

  test('component with a root fragment containing other nested components', () => {
    const Subcomponent = defineComponent({
      render() {
        return hFragment([h('p', {}, ['One']), h('p', {}, ['Two'])])
      },
    })
    const Component = defineComponent({
      render() {
        return hFragment([h(Subcomponent), h(Subcomponent)])
      },
    })
    const comp = new Component()
    comp.mount(document.body)

    const [expectedOne, expectedTwo, expectedThree, expectedFour] =
      document.querySelectorAll('p')

    expect(comp.elements).toEqual([
      expectedOne,
      expectedTwo,
      expectedThree,
      expectedFour,
    ])
  })
})

describe('Offset', () => {
  test('when the components top-level element is a fragment, it has an offset', () => {
    const vdom = h('div', {}, [h(FragComp), h(FragComp), h(FragComp)])
    mountDOM(vdom, document.body)

    const firstComponent = vdom.children[0].component
    const secondComponent = vdom.children[1].component
    const thirdComponent = vdom.children[2].component

    expect(firstComponent.offset).toBe(0)
    expect(secondComponent.offset).toBe(2)
    expect(thirdComponent.offset).toBe(4)
  })

  test('when the components top-level element is not a fragment, it has NO offset', () => {
    const vdom = h('div', {}, [h(Comp), h(Comp), h(Comp)])
    mountDOM(vdom, document.body)

    const firstComponent = vdom.children[0].component
    const secondComponent = vdom.children[1].component
    const thirdComponent = vdom.children[2].component

    expect(firstComponent.offset).toBe(0)
    expect(secondComponent.offset).toBe(0)
    expect(thirdComponent.offset).toBe(0)
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
    return h(
      'li',
      {
        class: this.state.highlighted ? 'highlighted' : '',
        on: {
          click: () =>
            this.updateState({ highlighted: !this.state.highlighted }),
          dblclick: () => this.emit('remove-item', this.props.text),
        },
      },
      [this.props.text]
    )
  },
})

const List = defineComponent({
  render() {
    return h(
      'ul',
      {},
      this.props.items.map((item) =>
        h(ListItem, {
          text: item,
          on: { 'remove-item': (item) => this.emit('remove-item', item) },
        })
      )
    )
  },
})

const DefinitionsComponent = defineComponent({
  state() {
    return {
      items: [
        'A point is that which has no part',
        'A line is breadthless length',
        'The ends of a line are points',
      ],
    }
  },
  removeItem(item) {
    const idx = this.state.items.indexOf(item)
    const items = this.state.items.filter((_, i) => i !== idx)
    this.updateState({ items })
  },
  render() {
    return h(List, {
      items: this.state.items,
      on: { 'remove-item': this.removeItem },
    })
  },
})
