import { beforeEach, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hString } from '../h'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('a component reacts to being mounted', async () => {
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

  await new Component().mount(document.body)

  expect(onMounted).toHaveBeenCalledTimes(1)
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

  expect(onMounted).toHaveBeenCalledTimes(1)
  expect(document.body.textContent).toBe('mounted')
})

test('a component reacts to being unmounted', async () => {
  const onMounted = vi.fn()
  const onUnmounted = vi.fn()
  const Component = defineComponent({
    onMounted,
    onUnmounted,
    render() {
      return h('div')
    },
  })

  const component = new Component()
  await component.mount(document.body)
  await component.unmount()

  expect(onMounted).toHaveBeenCalledTimes(1)
  expect(onUnmounted).toHaveBeenCalledTimes(1)
})

test('a component reacts to being unmounted asynchronously', async () => {
  const onMounted = vi.fn()
  const onUnmounted = vi.fn().mockResolvedValue({})
  const Component = defineComponent({
    onMounted,
    onUnmounted,
    render() {
      return h('div')
    },
  })

  const component = new Component()
  await component.mount(document.body)
  await component.unmount()

  expect(onMounted).toHaveBeenCalledTimes(1)
  expect(onUnmounted).toHaveBeenCalledTimes(1)
})
