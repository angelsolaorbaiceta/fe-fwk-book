import {
  createApp,
  h,
  hFragment,
} from '../../packages/runtime/dist/fe-fwk'

const state = {
  currentTodo: '',
  edit: {
    idx: null,
    original: null,
    edited: null,
  },
  todos: ['Walk the dog', 'Water the plants'],
}