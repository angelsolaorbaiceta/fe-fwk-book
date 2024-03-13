import { defineComponent } from '../component'
import { h, hFragment } from '../h'
import { RouterOutlet, RouterLink } from '../router-components'

export const App = defineComponent({
  render() {
    return hFragment([
      h('header', {}, [
        h('nav', {}, [
          h(RouterLink, { to: '/' }, ['Home']),
          h(RouterLink, { to: '/about' }, ['About']),
        ]),
      ]),
      h(RouterOutlet),
      h('footer', {}, ['Footer']),
    ])
  },
})

const Home = defineComponent({
  render() {
    return h('div', {}, ['This is home'])
  },
})

const About = defineComponent({
  render() {
    return h('div', {}, ['This is about'])
  },
})

const Secret = defineComponent({
  render() {
    return h('div', {}, ['This is a secret'])
  },
})

const NotFound = defineComponent({
  render() {
    return h('div', {}, ['Not found'])
  },
})

export const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/secret', component: Secret },
  { path: '*', component: NotFound },
]
