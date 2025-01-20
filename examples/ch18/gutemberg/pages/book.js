import { getBook } from '../api.js'
import { RouterLink, defineComponent, h, hFragment } from '../fwk.js'

export const Book = defineComponent({
  state() {
    return {
      isLoading: true,
      book: null,
    }
  },

  async onMounted() {
    const bookId = this.appContext.router.params.id
    const book = await getBook(bookId)

    this.updateState({
      isLoading: false,
      book,
    })

    console.log('Book:', book)
  },

  render() {
    const { isLoading, book } = this.state

    if (isLoading) {
      return h('p', {}, ['Loading...'])
    }

    const bookCover = book.formats['image/jpeg']

    return h('article', {}, [
      h(RouterLink, { to: '/' }, ['← Back']),

      h('header', {}, [
        h('h1', { class: 'book-title' }, [book.title]),
        h(
          'p',
          {},
          book.authors.map((author) => h('em', {}, [author.name]))
        ),
        h(
          'div',
          {},
          book.bookshelves.map((shelf) =>
            h('span', { class: 'book-bookshelf' }, [shelf])
          )
        ),
      ]),

      h('div', { class: 'book-twocols' }, [
        h('div', {}, [
          h('section', {}, [
            h('h2', {}, ['Subjects']),
            h(
              'ul',
              {},
              book.subjects.map((subject) => h('li', {}, [subject]))
            ),
          ]),

          h('section', {}, [
            h('h2', {}, ['Download']),
            h(
              'ul',
              {},
              Object.entries(book.formats).map(([name, url]) =>
                h('li', {}, [h('a', { href: url }, [name])])
              )
            ),
          ]),
        ]),

        h('div', {}, [
          h('img', {
            class: 'book-cover',
            src: bookCover,
            alt: book.title,
          }),
        ]),
      ]),
    ])
  },
})
