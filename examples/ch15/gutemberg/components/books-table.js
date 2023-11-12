import {
  defineComponent,
  h,
  hFragment,
  hSlot,
  hString,
} from 'https://unpkg.com/fe-fwk@5'

export const BooksTable = defineComponent({
  render() {
    const { isLoading, books, page, totalPages } = this.props

    return hFragment([
      h('table', {}, [
        h('thead', {}, [
          h('tr', {}, [
            h('th', {}, ['Title']),
            h('th', {}, ['Authors']),
            h('th', {}, ['Download count']),
          ]),
        ]),
        h(
          'tbody',
          {},
          isLoading
            ? [h('tr', {}, [h('td', { colspan: 3 }, ['Loading...'])])]
            : BooksTableBody(books)
        ),
      ]),

      isLoading
        ? null
        : h('div', { class: 'table-navigation' }, [
            h(
              'button',
              {
                disabled: page === 1,
                on: {
                  click: () => {
                    this.emit('previous')
                  },
                },
              },
              ['Previous']
            ),
            h('span', {}, [`Page ${page} of ${totalPages}`]),
            h(
              'button',
              {
                disabled: page === totalPages,
                on: {
                  click: () => {
                    this.emit('next')
                  },
                },
              },
              ['Next']
            ),
          ]),
    ])
  },
})

function BooksTableBody(books) {
  return books.map((book) =>
    h('tr', {}, [
      h(TableCell, {}, [book.title]),
      h(TableCell, {}, [book.authors.map(({ name }) => name).join('& ')]),
      h(TableCell, {}, [hString(book.download_count)]),
    ])
  )
}

const TableCell = defineComponent({
  render() {
    const { colspan = 1 } = this.props

    return h(
      'td',
      {
        colspan,
      },
      [hSlot()]
    )
  },
})
