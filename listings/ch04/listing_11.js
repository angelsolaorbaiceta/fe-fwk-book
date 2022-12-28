import {
  createApp,
  h,
  hString,
  hFragment,
} from '../../packages/runtime/dist/fe-fwk.js'

const state = {
  currentTodo: '',
  edit: {
    idx: null,
    original: null,
    edited: null,
  },
  todos: ['Walk the dog', 'Water the plants'],
}