import {
  createApp,
  defineComponent,
  h,
  hFragment,
} from 'https://unpkg.com/fe-fwk@3'
import { fetchRandomCocktail } from './api.js'

const App = defineComponent({
  state() {
    return {
      isLoading: false,
      cocktail: null,
    }
  },

  render() {
    const { isLoading, cocktail } = this.state

    if (isLoading) {
      return hFragment([
        h('h1', {}, ['Random Cocktail']),
        h('p', {}, ['Loading...']),
      ])
    }

    if (!cocktail) {
      return hFragment([
        h('h1', {}, ['Random Cocktail']),
        h('button', { on: { click: this.fetchCocktail } }, [
          'Get a cocktail',
        ]),
      ])
    }

    const { strDrink, strDrinkThumb, strInstructions } = cocktail

    return hFragment([
      h('h1', {}, [strDrink]),
      h('p', {}, [strInstructions]),
      h('img', {
        src: strDrinkThumb,
        alt: strDrink,
        style: { width: '300px', height: '300px' },
      }),
      h(
        'button',
        {
          on: { click: this.fetchCocktail },
          style: { display: 'block', margin: '1em auto' },
        },
        ['Get another cocktail']
      ),
    ])
  },

  async fetchCocktail() {
    this.updateState({ isLoading: true, cocktail: null })
    const cocktail = await fetchRandomCocktail()

    setTimeout(() => {
      this.updateState({ isLoading: false, cocktail })
    }, 1000)
  },
})

createApp(App).mount(document.querySelector('#app'))
