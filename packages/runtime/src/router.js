import { Dispatcher } from './dispatcher'
import { makeRouteMatcher } from './route-matchers'
import { assert } from './utils/assert'

/**
 * @typedef {Object} Router
 *
 * @property {import('./route-matchers').Route} matchedRoute The `Route` object that matches the current route or `null` if no route matches.
 * @property {Object<string, string>} params The parameters extracted from the current route's path, in an object.
 * @property {Object<string, string>} query The query parameters extracted from the current route's path, in an object.
 *
 * @property {()=> Promise<void>} init Initializes the router by matching the current route to a component and listening for the browser's popstate events.
 * @property {() => void} destroy Stops listening to the browser's popstate events. If the router is not initialized, calling this method has no effect.
 *
 * @property {(path: string) => Promise<void>} navigateTo Navigates to the given route path, matching it to a component and pushing it to the browser's history.
 * @property {() => void} back Navigates to the previous page in the browser's history.
 * @property {() => void} forward Navigates to the next page in the browser's history.
 *
 * @property {(handler: RouteChangeHandler) => void} subscribe Subscribes a handler function to the router's route change events.
 * @property {(handler: RouteChangeHandler) => void} unsubscribe Unsubscribes a handler function from the router's route change events.
 */

/**
 * The object passed as an argument to the route change handler.
 *
 * @typedef {object} RouteChangeHandlerParams
 * @property {import('./route-matchers').Route} from the source route, where the navigation is coming from
 * @property {import('./route-matchers').Route} to the target route, where the navigation is going to
 * @property {HashRouter} router the router instance
 */

/**
 * A function that handles route changes.
 *
 * @typedef {(params: RouteChangeHandler) => void} RouteChangeHandler
 */

/**
 * Result of a navigation attempt after the guards have been checked.
 *
 * @typedef {Object} NavigationGuardResult
 * @property {boolean} shouldNavigate whether the route change should be allowed
 * @property {boolean} shouldRedirect whether the route change should be redirected
 * @property {(string|null)} redirectPath the path to redirect to
 */

const ROUTER_EVENT = 'router-event'

/**
 * Implements the `HashRouter` to navigate between pages without requesting them to the server.
 * In a hash router, the location is kept in the hash portion or the URL:
 *
 * ```
 * https: // example.com : 8080 /something/ ?query=abc123 #/fooBarBaz
 *
 * ⎣____⎦    ⎣__________⎦  ⎣__⎦ ⎣________⎦ ⎣____________⎦ ⎣________⎦
 * protocol     domain     port    path      parameters      hash
 * ```
 *
 * The router is initialized with a list of routes, each with a path and a component.
 * Routes can contain parameters, which are extracted from the path and made available.
 * Parameters are defined in the path with a colon, like `/user/:id`.
 * A catch-all route can be defined with a path of `*`.
 *
 * The router starts listening to the browser's popstate events when initialized.
 * To initialize the router, call the `init()` method.
 *
 * Example:
 *
 * ```javascript
 * const routes = [
 *  { path: '/', component: Home },
 *  { path: '/one', component: One },
 *  { path: '/two/:userId/page/:pageId', component: Two },
 *  { path: '*', component: NotFound },
 * ]
 *
 * const router = new HashRouter(routes)
 * router.init()
 * ```
 *
 * ## Routes
 *
 * A route is an object with the following properties:
 *
 * - `path` (`string`): The path of the route.
 * - `component` (`Component`): The component to render when the route is matched. Use the '*' path to match any route.
 * - `redirect?` (`string`): The path to redirect to when the route is matched.
 * - `beforeEnter?` (`(from: string, to: string) => Promise<boolean|string>`): The function to call before the navigation, and which can be used to cancel the navigation or redirect to another route.
 *
 * A simple route has a `path` and a `component`:
 *
 * ```javascript
 * { path: '/users', component: Users }
 * ```
 *
 * This route matches the `/users` path and renders the `Users` component.
 * The path can include parameters by prefixing the parameter name with a colon ('`:`').
 * These parameters are extracted from the path and made available in the `params`
 * property of the router:
 *
 * ```javascript
 * { path: '/users/:userId', component: User }
 * ```
 *
 * This route matches the `/users/123` path and renders the `User` component.
 * The `params` property of the router will contain `{ userId: '123' }`.
 *
 * Routes can define a redirect path:
 *
 * ```javascript
 * { path: '/old-users', redirect: '/users' }
 * ```
 *
 * This route matches the `/old-users` path and redirects to the `/users` path.
 *
 * Routes can define a guard function that is called before the navigation, and decides
 * whether the navigation should be allowed or not:
 *
 * ```javascript
 * { path: '/users', component: Users, beforeEnter: (from, to) => Promise<boolean|string> }
 * ```
 *
 * The guard function receives the path of the source route and the target route.
 * If it returns `false`, the navigation is canceled.
 * If it returns a string, the navigation is redirected to the returned path.
 * If it returns `true` or nothing, the navigation is allowed.
 */
export class HashRouter {
  /** @type {import('./route-matchers').RouteMatcher[]} */
  #matchers = []

  /** @type {import('./route-matchers').Route | null} */
  #matchedRoute = null

  #dispatcher = new Dispatcher()
  /** @type {WeakMap<RouteChangeHandler, () => void>} */
  #subscriptions = new WeakMap()
  /** @type {Set<RouteChangeHandler>} */
  #subscriberFns = new Set()

  /**
   * The `Route` object that matches the current route or `null` if no route matches.
   */
  get matchedRoute() {
    return this.#matchedRoute
  }

  /** @type {Object<string, string>} */
  #params = {}

  /**
   * The parameters extracted from the current route's path, in an object.
   *
   * Example:
   *
   * ```javascript
   * // Given the route defined as `/users/:userId`
   * // And the URL: https://example.com/#/users/123
   * router.params
   * // => { userId: '123' }
   * ```
   */
  get params() {
    return this.#params
  }

  /** @type {Object<string, string>} */
  #query = {}

  /**
   * The query parameters extracted from the current route's path, in an object.
   *
   * Example:
   *
   * ```javascript
   * // Given the URL: https://example.com/#/path?query=abc123&foo=bar
   * router.query
   * // => { query: 'abc123', foo: 'bar' }
   * ```
   */
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

  // Whether the router is initialized or not.
  // Saved to avoid initializing the router multiple times.
  #isInitialized = false

  /**
   * Initializes the router by matching the current route to a component and
   * listening for the browser's popstate events.
   *
   * If there is no hash in the URL, it adds one.
   *
   * If the router is already initialized, calling this method again has no effect.
   */
  async init() {
    if (this.#isInitialized) {
      return
    }

    if (document.location.hash === '') {
      window.history.replaceState({}, '', '#/')
    }

    window.addEventListener('popstate', this.#onPopState)
    await this.#matchCurrentRoute()

    this.#isInitialized = true
  }

  /**
   * Stops listening to the browser's popstate events. If the router is not
   * initialized, calling this method has no effect.
   *
   * Call this method to clean up the router when it's no longer needed.
   */
  destroy() {
    if (!this.#isInitialized) {
      return
    }

    window.removeEventListener('popstate', this.#onPopState)
    Array.from(this.#subscriberFns).forEach(this.unsubscribe, this)
    this.#isInitialized = false
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
   * @param {string} path The route's path or name to navigate to.
   */
  async navigateTo(path) {
    const matcher = this.#matchers.find((matcher) =>
      matcher.checkMatch(path)
    )

    if (matcher == null) {
      console.warn(`[Router] No route matches path "${path}"`)

      this.#matchedRoute = null
      this.#params = {}
      this.#query = {}

      return
    }

    if (matcher.isRedirect) {
      return this.navigateTo(matcher.route.redirect)
    }

    const from = this.#matchedRoute
    const to = matcher.route
    const { shouldNavigate, shouldRedirect, redirectPath } =
      await this.#canChangeRoute(from, to)

    if (shouldRedirect) {
      return this.navigateTo(redirectPath)
    }

    if (shouldNavigate) {
      this.#matchedRoute = matcher.route
      this.#params = matcher.extractParams(path)
      this.#query = matcher.extractQuery(path)
      this.#pushState(path)

      this.#dispatcher.dispatch(ROUTER_EVENT, { from, to, router: this })
    }
  }

  /**
   * Navigates to the previous page in the browser's history.
   *
   * It uses the `window.history.back()` method to navigate back.
   * This is an asynchronous method. We need to listen to the popstate event to know when
   * the back action is completed.
   */
  back() {
    window.history.back()
  }

  /**
   * Navigates to the next page in the browser's history.
   *
   * It uses the `window.history.forward()` method to navigate forward.
   * This is an asynchronous method. We need to listen to the popstate event to know when
   * the forward action is completed.
   */
  forward() {
    window.history.forward()
  }

  /**
   * Subscribes a handler function to the router's route change events.
   * The handler is called every time the route changes, and the handler is passed an object
   * with the `from` and `to` routes and the router itself.
   *
   * ```javascript
   * router.subscribe(({ from, to, router }) => {
   *  // Do something with the routes
   * })
   * ```
   *
   * @param {RouteChangeHandler} handler
   */
  subscribe(handler) {
    const unsubscribe = this.#dispatcher.subscribe(ROUTER_EVENT, handler)
    this.#subscriptions.set(handler, unsubscribe)
    this.#subscriberFns.add(handler)
  }

  /**
   * Unsubscribes a handler function from the router's route change events.
   *
   * @param {RouteChangeHandler} handler
   */
  unsubscribe(handler) {
    const unsubscribe = this.#subscriptions.get(handler)
    if (unsubscribe) {
      unsubscribe()
      this.#subscriptions.delete(handler)
      this.#subscriberFns.delete(handler)
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
    return this.navigateTo(this.#currentRouteHash)
  }

  /**
   * Checks whether the route change is allowed by the matched route's guard,
   * if there is one. If a guard returns a route path (a string), the navigation
   * is redirected to the route's path.
   *
   * @param {import('./route-matchers').Route} from the source route, as defined in the router
   * @param {import('./route-matchers').Route} to the target route, the one that's matched
   * @returns {Promise<NavigationGuardResult>} whether the route change should be allowed
   */
  async #canChangeRoute(from, to) {
    const guard = to.beforeEnter

    if (typeof guard !== 'function') {
      return {
        shouldRedirect: false,
        shouldNavigate: true,
        redirectPath: null,
      }
    }

    const result = await guard(from?.path, to?.path)
    if (result === false) {
      return {
        shouldRedirect: false,
        shouldNavigate: false,
        redirectPath: null,
      }
    }

    if (typeof result === 'string') {
      return {
        shouldRedirect: true,
        shouldNavigate: false,
        redirectPath: result,
      }
    }

    return {
      shouldRedirect: false,
      shouldNavigate: true,
      redirectPath: null,
    }
  }
}

/**
 * A router that doesn't do anything.
 * It's used as a fallback when no router is provided to the app.
 */
export class NoopRouter {
  init() {}
  destroy() {}
  navigateTo() {}
  back() {}
  forward() {}
  subscribe() {}
  unsubscribe() {}
}
