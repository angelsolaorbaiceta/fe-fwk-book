import { afterEach, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hSlot } from '../h'
import { mountDOM } from '../mount-dom'
import * as Slots from '../slots'
import { singleHtmlLine } from './utils'

afterEach(() => {
  document.body.innerHTML = ''
  vi.clearAllMocks()
})

test('can have a slot where external content can be inserted', () => {
  const Comp = defineComponent({
    render() {
      return h('div', {}, [hSlot()])
    },
  })
  const vdom = h(Comp, {}, [h('span', {}, ['Hello'])])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <div>
        <span>Hello</span>
      </div>
    `
  )
})

test('when no external content is provided, the default content is used', () => {
  const Comp = defineComponent({
    render() {
      return h('div', {}, [hSlot([h('span', {}, ['Hello'])])])
    },
  })
  const vdom = h(Comp)
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <div>
        <span>Hello</span>
      </div>
    `
  )
})

test('when neither external nor default content is provided, the slot is empty', () => {
  const Comp = defineComponent({
    render() {
      return h('div', {}, [hSlot()])
    },
  })
  const vdom = h(Comp)
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <div></div>
    `
  )
})

test('conditionally rendered slots', () => {
  const Comp = defineComponent({
    state() {
      return { show: false }
    },
    render() {
      const { show } = this.state

      return h('div', {}, [show ? hSlot([h('span', {}, ['Hello'])]) : null])
    },
  })
  const vdom = h(Comp)
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <div></div>
    `
  )

  const component = vdom.component
  component.updateState({ show: true })

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <div>
        <span>Hello</span>
      </div>
    `
  )
})

test('slot content updated between renders', () => {
  const Comp = defineComponent({
    render() {
      return h('div', {}, [hSlot()])
    },
  })
  const Container = defineComponent({
    state() {
      return { show: false }
    },
    render() {
      const { show } = this.state

      return h(
        Comp,
        {},
        show
          ? [h('p', {}, ['World']), h('span', {}, ['!'])]
          : [h('span', {}, ['Hello'])]
      )
    },
  })

  const vdom = h(Container)
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <div>
        <span>Hello</span>
      </div>
    `
  )

  const component = vdom.component
  component.updateState({ show: true })

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <div>
        <p>World</p>
        <span>!</span>
      </div>
    `
  )
})

test('slot in a nested component', () => {
  const Table = defineComponent({
    state() {
      return {
        titles: ['One', 'Two'],
      }
    },

    render() {
      return h('table', {}, [
        h('thead', {}, [h('tr', {}, [h('th', {}, ['Title'])])]),
        h(
          'tbody',
          {},
          this.state.titles.map((title) => h(TableRow, {}, [title]))
        ),
      ])
    },
  })
  const TableRow = defineComponent({
    render() {
      return h('tr', {}, [h('td', {}, [hSlot()])])
    },
  })

  const vdom = h(Table)
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    singleHtmlLine`
      <table>
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>One</td>
          </tr>
          <tr>
            <td>Two</td>
          </tr>
        </tbody>
      </table>
    `
  )
})

test('when the component has slots, the "fillSlot()" function is called', () => {
  const fillSlotsSpy = vi.spyOn(Slots, 'fillSlots')

  const Comp = defineComponent({
    render() {
      return h('div', {}, [hSlot()])
    },
  })

  const vdom = h(Comp, {}, [h('span', {}, ['Hello'])])
  mountDOM(vdom, document.body)

  expect(fillSlotsSpy).toHaveBeenCalled()
})

test('when the component has no slots, the "fillSlot()" function is not called', () => {
  const fillSlotsSpy = vi.spyOn(Slots, 'fillSlots')

  const Comp = defineComponent({
    render() {
      return h('div', {}, [h('span', {}, ['Hello'])])
    },
  })

  const vdom = h(Comp)
  mountDOM(vdom, document.body)

  expect(fillSlotsSpy).not.toHaveBeenCalled()
})
