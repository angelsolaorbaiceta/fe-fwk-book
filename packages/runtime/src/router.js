import { makeRouteMatcher } from './route-matchers'
import { assert } from './utils/assert'

export class HashRouter {
  /** @type {import('./route-matchers').RouteMatcher[]} */
  #matchers = []

  /** @type {import('./route-matchers').Route | null} */
  #matchedRoute = null
  get matchedRoute() {
    return this.#matchedRoute
  }

  #params = {}
  get params() {
    return this.#params
  }

  #query = {}
  get query() {
    return this.#query
  }

  // Saved to a variable to be able to remove the event listener in the destroy() method.
  #onPopState = () => this.#matchCurrentRoute()

  constructor(routes = []) {
    assert(Array.isArray(routes), 'Routes must be an array')
    this.#matchers = routes.map(makeRouteMatcher)
  }

  /**
   * Returns the current route's hash portion without the leading `#`.
   * If the hash is empty, `/` is returned.
   *
   * @returns {string} The current route hash.
   */
  get #currentRouteHash() {
    const hash = document.location.hash

    if (hash === '') {
      return '/'
    }

    return hash.slice(1)
  }

  /**
   * Initializes the router by matching the current route to a component and
   * listening for the browser's popstate events.
   * If there is no hash in the URL, it adds one.
   */
  init() {
    if (document.location.hash === '') {
      window.history.replaceState({}, '', '#/')
    }

    window.addEventListener('popstate', this.#onPopState)
    this.#matchCurrentRoute()
  }

  destroy() {
    window.removeEventListener('popstate', this.#onPopState)
  }

  /**
   * Navigates to the given route path, matching it to a component
   * and pushing it to the browser's history.
   *
   * When there isn't a "catch-all" route defined in the router and an unknown
   * path is navigated to, the router doesn't change the URL, it simply
   * ignores the navigation, as there isn't a route to match the path to.
   *
   * On the other hand, when there is a "catch-all" route, it matches the
   * path to the catch-all route and pushes it to the browser's history.
   * In this case, the Browser's URL will point to the unknown path.
   *
   * @param {object} route The route's path or name to navigate to.
   */
  navigateTo(path) {
    this.#matchRoute(path)

    if (this.#matchedRoute) {
      this.#pushState(path)
    } else {
      console.warn(`[Router] No route matches path "${path}"`)
    }
  }

  /**
   * A convenience method to push a path to the browser's history.
   * The path is always added to the hash portion of the URL.
   *
   * Note that the `pushState()` requires a second argument which is unused,
   * but required by the API. According to the MDN docs, it should be an empty string:
   *
   * > This parameter exists for historical reasons, and cannot be omitted;
   * > passing an empty string is safe against future changes to the method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
   *
   * @param {string} path - The path to push to the browser's history.
   */
  #pushState(path) {
    window.history.pushState({}, '', `#${path}`)
  }

  #matchCurrentRoute() {
    this.#matchRoute(this.#currentRouteHash)
  }

  /**
   * Matches the given path to a route. If no route is matched, the `matchedRoute`
   * property is set to `null`. The first route that matches the path is used.
   *
   * @param {string} path The path to match.
   */
  #matchRoute(path) {
    const matcher = this.#matchers.find((matcher) =>
      matcher.checkMatch(path)
    )

    if (matcher) {
      this.#matchedRoute = matcher.route
      this.#params = matcher.extractParams(path)
      this.#query = matcher.extractQuery(path)
    } else {
      this.#matchedRoute = null
      this.#params = {}
      this.#query = {}
    }
  }
}
