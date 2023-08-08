import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hFragment, hString } from '../h'
import { flushPromises, singleHtmlLine } from './utils'
import { mountDOM } from '../mount-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Mounting and unmounting', () => {
  test('can be mounted into the DOM', async () => {
    await new Comp().mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p>'
    )
  })

  test('can be mounted at a specific position', async () => {
    document.body.innerHTML = '<h1>Definitions</h1><hr>'

    const comp = new Comp()
    await comp.mount(document.body, 1)

    expect(document.body.innerHTML).toBe(
      '<h1>Definitions</h1><p>A point is that which has no part.</p><hr>'
    )
  })

  test("can't be mounted twice", async () => {
    const comp = new Comp()
    await comp.mount(document.body)

    expect(() => comp.mount(document.body)).rejects.toThrow(
      /already mounted/
    )
  })

  test('can be unmounted', async () => {
    const comp = new Comp()
    await comp.mount(document.body)
    await comp.unmount()

    expect(document.body.innerHTML).toBe('')
  })

  test("can't be unmounted if it wasn't mounted", () => {
    const comp = new Comp()
    expect(() => comp.unmount()).toThrow(/not mounted/)
  })

  test('can be mounted after being unmounted', async () => {
    const comp = new Comp()
    await comp.mount(document.body)
    await comp.unmount()
    await comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p>'
    )
  })

  test('can be mounted as a fragment', async () => {
    const comp = new FragComp()
    await comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p><p>A line is breadthless length.</p>'
    )
  })
})

describe('Component props', () => {
  test('can have props', async () => {
    const comp = new PropsComp({ pClass: 'definition' })
    await comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p class="definition">A point is that which has no part.</p>'
    )
  })

  test("can't patch the DOM if the component isn't mounted", async () => {
    const comp = new PropsComp({ pClass: 'definition' })
    expect(() => comp.updateProps({ pClass: 'lemma' })).rejects.toThrow(
      /not mounted/
    )
  })

  test('when the props are updated, the DOM is patched', async () => {
    const comp = new PropsComp({ pClass: 'definition' })
    await comp.mount(document.body)

    await comp.updateProps({ pClass: ['definition', 'updated'] })

    expect(document.body.innerHTML).toBe(
      '<p class="definition updated">A point is that which has no part.</p>'
    )
  })

  test('does not patch the DOM if the props are the same', () => {
    const comp = new PropsComp({ pClass: 'definition' })
    comp.mount(document.body)

    const renderSpy = vi.spyOn(comp, 'render')

    comp.updateProps({ pClass: 'definition' })

    expect(renderSpy).not.toHaveBeenCalled()
  })
})

describe('Component state', () => {
  test('can have its own internal state', async () => {
    const comp = new StateComp()
    await comp.mount(document.body)

    expect(document.body.innerHTML).toBe('<button>0</button>')
  })

  test('can be based on the props', async () => {
    const Comp = defineComponent({
      state(props) {
        return { count: props.initialCount }
      },
      render() {
        return h('p', {}, [hString(this.state.count)])
      },
    })
    const comp = new Comp({ initialCount: 10 })

    await comp.mount(document.body)

    expect(document.body.innerHTML).toBe('<p>10</p>')
  })

  test('when the state changes, the DOM is patched', async () => {
    const comp = new StateComp()
    await comp.mount(document.body)

    await comp.updateState({ count: 5 })

    expect(document.body.innerHTML).toBe('<button>5</button>')
  })

  test('an event can change the state', async () => {
    const comp = new StateComp()
    await comp.mount(document.body)

    document.querySelector('button').click()

    expect(document.body.innerHTML).toBe('<button>1</button>')
  })
})

describe('Component methods', () => {
  test('can use methods to handle events', async () => {
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
    await comp.mount(document.body)

    document.querySelector('button').click()

    expect(document.body.innerHTML).toBe('<button>1</button>')
  })
})

describe('Patching the DOM', () => {
  test('can add event handlers bound to the component', async () => {
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
                      this.updateState({
                        count: this.state.count - 1,
                      })
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
    await comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<span>0</span><button id="plus-btn">+</button>'
    )

    document.querySelector('#plus-btn').click()
    await flushPromises()
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

  test('can mount child components', async () => {
    const comp = new List({ items })
    await comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<ul><li>A point is that which has no part</li><li>A line is breadthless length</li></ul>'
    )
  })

  test('can unmount child components', async () => {
    const comp = new List({ items })
    await comp.mount(document.body)

    await comp.unmount()

    expect(document.body.innerHTML).toBe('')
  })

  test('the state of children is preserved through a re-render', async () => {
    const comp = new List({ items })
    await comp.mount(document.body)

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
    await comp.updateProps({
      items: [...items, 'The ends of a line are points'],
    })

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

  test('children can be added', async () => {
    const comp = new List({ items })
    await comp.mount(document.body)

    await comp.updateProps({
      items: [...items, 'The ends of a line are points'],
    })

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

  test('children can be removed', async () => {
    const comp = new List({ items })
    await comp.mount(document.body)

    await comp.updateProps({ items: [items[0]] })

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
  test('components can emit events', async () => {
    const handler = vi.fn()
    const comp = new ListItem(
      { text: 'A point is that which has no part' },
      { 'remove-item': handler }
    )
    await comp.mount(document.body)

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

  test('when the component is unmounted, its event handlers are removed', async () => {
    const handler = vi.fn()
    const comp = new ListItem(
      { text: 'A point is that which has no part' },
      { 'remove-item': handler }
    )
    await comp.mount(document.body)
    await comp.unmount()

    comp.emit('remove-item')

    expect(handler).not.toHaveBeenCalled()
  })

  test('event handlers can be bound to the component', async () => {
    const comp = new DefinitionsComponent()
    await comp.mount(document.body)

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

  test('component with a single root element', async () => {
    const Component = defineComponent({
      render() {
        return h('p', {}, ['A point is that which has no part.'])
      },
    })
    const comp = new Component()
    await comp.mount(document.body)

    const expectedEl = document.querySelector('p')

    expect(comp.elements).toEqual([expectedEl])
  })

  test('component with a root fragment containing elements', async () => {
    const Component = defineComponent({
      render() {
        return hFragment([
          h('p', {}, ['A point is that which has no part.']),
          h('p', {}, ['A line is breadthless length.']),
        ])
      },
    })
    const comp = new Component()
    await comp.mount(document.body)

    const [expectedOne, expectedTwo] = document.querySelectorAll('p')

    expect(comp.elements).toEqual([expectedOne, expectedTwo])
  })

  test('component with a root fragment containing other components', async () => {
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
    await comp.mount(document.body)

    const [expectedOne, expectedTwo] = document.querySelectorAll('p')

    expect(comp.elements).toEqual([expectedOne, expectedTwo])
  })

  test('component with a root fragment containing other nested components', async () => {
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
    await comp.mount(document.body)

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
  test('when the components top-level element is a fragment, it has an offset', async () => {
    const vdom = h('div', {}, [h(FragComp), h(FragComp), h(FragComp)])
    await mountDOM(vdom, document.body)

    const firstComponent = vdom.children[0].component
    const secondComponent = vdom.children[1].component
    const thirdComponent = vdom.children[2].component

    expect(firstComponent.offset).toBe(0)
    expect(secondComponent.offset).toBe(2)
    expect(thirdComponent.offset).toBe(4)
  })

  test('when the components top-level element is not a fragment, it has NO offset', async () => {
    const vdom = h('div', {}, [h(Comp), h(Comp), h(Comp)])
    await mountDOM(vdom, document.body)

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
