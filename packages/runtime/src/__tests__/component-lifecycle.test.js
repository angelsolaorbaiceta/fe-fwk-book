import { beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hFragment, hString } from '../h'
import { singleHtmlLine } from './utils'
import { mountDOM } from '../mount-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('a component reacts to being mounted', () => {
  const onMounted = vi.fn()
  const Component = defineComponent({
    state() {
      return { mounted: false }
    },

    onMounted() {
      onMounted()
      this.updateState({ mounted: true })
    },

    render() {
      return h('div', {}, [
        hString(this.state.mounted ? 'mounted' : 'not mounted'),
      ])
    },
  })

  new Component().mount(document.body)

  expect(onMounted).toHaveBeenCalled()
  expect(document.body.textContent).toBe('mounted')
})

test('a component reacts asynchronously to being mounted', async () => {
  const onMounted = vi.fn().mockResolvedValue({})
  const Component = defineComponent({
    state() {
      return { mounted: false }
    },

    render() {
      return h('div', {}, [
        hString(this.state.mounted ? 'mounted' : 'not mounted'),
      ])
    },

    async onMounted() {
      await onMounted()
      this.updateState({ mounted: true })
    },
  })

  await new Component().mount(document.body)

  expect(onMounted).toHaveBeenCalled()
  expect(document.body.textContent).toBe('mounted')
})
