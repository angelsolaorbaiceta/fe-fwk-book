import { test, expect } from 'vitest'
import { traverseDFS } from '../traverse-dom'

test('Traverses the virtual DOM tree in depth-first order', () => {
  const vdom = {
    name: 'a',
    children: [
      {
        name: 'a1',
        children: [
          {
            name: 'a11',
            children: [],
          },
        ],
      },
      {
        name: 'a2',
      },
      {
        name: 'a3',
        children: [
          {
            name: 'a31',
            children: [],
          },
        ],
      },
    ],
  }
  const names = []
  const parentNames = []

  traverseDFS(vdom, (node, parent) => {
    names.push(node.name)
    parentNames.push(parent?.name ?? null)
  })

  expect(names).toEqual(['a', 'a1', 'a11', 'a2', 'a3', 'a31'])
  expect(parentNames).toEqual([null, 'a', 'a1', 'a', 'a', 'a3'])
})
