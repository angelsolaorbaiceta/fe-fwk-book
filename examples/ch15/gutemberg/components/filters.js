import { defineComponent, h, hFragment } from 'https://unpkg.com/fe-fwk@5'

export const Filters = defineComponent({
  state() {
    return {
      languages: new Set(),
    }
  },

  onLangChanged(lang) {
    const langs = this.state.languages

    if (langs.has(lang)) {
      langs.delete(lang)
    } else {
      langs.add(lang)
    }

    this.emit('langsChanged', Array.from(langs))
  },

  render() {
    const { isLoading } = this.props
    const { languages } = this.state

    return h('div', { class: 'filters-box' }, [
      h('h3', {}, ['Languages']),
      h('fieldset', { disabled: isLoading }, [
        h('input', {
          type: 'checkbox',
          value: 'en',
          checked: languages.has('en'),
          on: { change: () => this.onLangChanged('en') },
        }),
        h('label', {}, ['English']),

        h('input', {
          type: 'checkbox',
          value: 'es',
          checked: languages.has('es'),
          on: { change: () => this.onLangChanged('es') },
        }),
        h('label', {}, ['Spanish']),

        h('input', {
          type: 'checkbox',
          value: 'de',
          checked: languages.has('de'),
          on: { change: () => this.onLangChanged('de') },
        }),
        h('label', {}, ['German']),
      ]),
    ])
  },
})
