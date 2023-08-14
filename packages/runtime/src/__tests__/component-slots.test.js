import { test, expect, afterEach } from 'vitest'
import { defineComponent } from '../component'
import { h, hSlot } from '../h'
import { mountDOM } from '../mount-dom'
import { singleHtmlLine } from './utils'

afterEach(() => {
  document.body.innerHTML = ''
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
