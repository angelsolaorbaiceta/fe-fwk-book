import { getAllBooks } from '../api.js'
import { BooksTable } from '../components/books-table.js'
import { Filters } from '../components/filters.js'
import { defineComponent, h, hFragment } from '../fwk.js'

export const Books = defineComponent({
  state() {
    return {
      isLoading: true,
      filters: {},
      books: [],
      page: 1,
      totalPages: 0,
      totalBooks: 0,
    }
  },

  async onMounted() {
    await this.loadBooks(1)
  },

  async loadBooks(page, filters) {
    this.updateState({
      isLoading: true,
      filters,
      page,
      totalPages: 0,
      totalBooks: 0,
    })
    const books = await getAllBooks(page, filters)
    const totalBooks = books.count
    const totalPages = Math.ceil(totalBooks / 32)

    this.updateState({
      isLoading: false,
      books: books.results,
      totalPages,
      totalBooks,
    })
  },

  render() {
    const { isLoading, books, page, totalPages, totalBooks } = this.state

    return hFragment([
      h(Filters, {
        isLoading,
        on: {
          langsChanged: async (languages) => {
            await this.loadBooks(1, { languages })
          },
        },
      }),
      h('p', {}, [h('em', {}, [`Found ${totalBooks} books.`])]),

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
