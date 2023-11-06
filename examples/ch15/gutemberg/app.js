import {
  createApp,
  defineComponent,
  h,
  hFragment,
} from 'https://unpkg.com/fe-fwk@5'
import { getAllBooks } from './api.js'
import { BooksTable } from './components/books-table.js'

const App = defineComponent({
  state() {
    return {
      isLoading: true,
      books: [],
      page: 1,
      totalPages: 0,
    }
  },

  async onMounted() {
    this.loadBooks(1)
  },

  async loadBooks(page) {
    this.updateState({ isLoading: true, page })
    const books = await getAllBooks(page)
    const totalPages = Math.ceil(books.count / 32)

    this.updateState({
      isLoading: false,
      books: books.results,
      totalPages,
    })
  },

  render() {
    const { isLoading, books, page, totalPages } = this.state

    return hFragment([
      h('h1', {}, ['Gutemberg Books']),
      h(BooksTable, {
        isLoading,
        books: books,
        page,
        totalPages,
        on: {
          async previous() {
            const { page } = this.state
            await this.loadBooks(page - 1)
          },
          async next() {
            const { page } = this.state
            await this.loadBooks(page + 1)
          },
        },
      }),
    ])
  },
})

createApp(App).mount(document.getElementById('app'))
