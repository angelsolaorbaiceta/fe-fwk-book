import { expect, test } from 'vitest'
import { defineComponent } from '../component'
import { h } from '../h'

const ComponentOne = defineComponent({
  render() {
    return h('p', {}, ['Component One'])
  },
})

test('An application context can be added to a component', () => {
  const appContext = {
    foo: 'bar',
  }

  const component = new ComponentOne()
  component.setAppContext(appContext)

  expect(component.appContext).toEqual(appContext)
})

test('If the component does not have an application context, it asks its parent component for it', () => {
  const appContext = {
    foo: 'bar',
  }

  const parentComponent = new ComponentOne()
  parentComponent.setAppContext(appContext)
  const component = new ComponentOne({}, {}, parentComponent)

  expect(component.appContext).toEqual(appContext)
})

test('If the component does not have an application context and its parent component does not have one, it returns null', () => {
  const parentComponent = new ComponentOne()
  const component = new ComponentOne({}, {}, parentComponent)

  expect(component.appContext).toBeNull()
})
