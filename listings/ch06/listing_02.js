import { createApp, h, hFragment } from 'https://unpkg.com/_<fwk-name>_@1'

const state = {
  currentTodo: '',
  edit: {
    idx: null,
    original: null,
    edited: null,
  },
  todos: ['Walk the dog', 'Water the plants'],
}