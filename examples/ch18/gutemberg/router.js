import { HashRouter } from './fwk.js'
import { Book } from './pages/book.js'
import { Books } from './pages/books.js'

const routes = [
  {
    path: '/',
    component: Books,
  },
  {
    path: '/book/:id',
    component: Book,
  },
]

export const router = new HashRouter(routes)
