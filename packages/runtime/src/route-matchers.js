import { isNotBlankOrEmptyString } from './utils/strings'

/**
 * @typedef Route
 * @type {object}
 * @property {string} path - The path of the route.
 * @property {import('./component').Component} component - The component to render when the route is matched.
 */

/**
 * @typedef RouteMatcher
 * @type {object}
 * @property {Route} route - The route that this matcher matches.
 * @property {boolean} isRedirect - Whether the route is a redirect.
 * @property {(path: string) => boolean} checkMatch - Function that checks whether a route matches a path.
 * @property {(path: string) => Object<string, string>} extractParams - Function that extracts the parameters from a path.
 * @property {(path: string) => Object<string, string>} extractQuery - Function that extracts the query parameters from a path.
 */

const CATCH_ALL_ROUTE = '*'

/**
 * Validates the route to ensure it's a valid one.
 *
 * @param {Route} route the route to validate
 * @throws {Error} if the route is invalid
 */
export function validateRoute(route) {
  if (typeof route.path !== 'string') {
    throw new Error('Route path must be a string')
  }

  if (isNotBlankOrEmptyString(route.path) === false) {
    throw new Error('Route path must not be empty')
  }

  if (route.path[0] !== '/' && route.path !== CATCH_ALL_ROUTE) {
    throw new Error(
      'Route path must start with a "/" or be the catch-all route "*"'
    )
  }

  if (route.redirect && route.path === route.redirect) {
    throw new Error("A redirect route can't redirect to itself")
  }
}

/**
 * Creates a `RouteMatcher` object for a given route.
 * Routes start with a `/` and have one or more path segments.
 * URL parameters can be specified by prefixing the parameter name with a `:`.
 *
 * Examples:
 *
 * - `/users/:id`
 * - `/users/:id/posts/:postId`
 *
 * A route of a single '*' matches any path. It's the catch-all route
 * that can be used to handle 404s.
 *
 * @param {Route} route The route to create a matcher for.
 * @returns {RouteMatcher} The route matcher.
 */
export function makeRouteMatcher(route) {
  validateRoute(route)

  return routeHasParams(route)
    ? makeMatcherWithParams(route)
    : makeMatcherWithoutParams(route)
}

function routeHasParams({ path }) {
  return path.includes(':')
}

/**
 * Creates a `RouteMatcher` object for a given route that has parameters.
 *
 * @param {Route} route the route to create a matcher for
 * @returns {RouteMatcher} the route matcher
 */
function makeMatcherWithParams(route) {
  const regex = makeRouteWithParamsRegex(route)
  const isRedirect = typeof route.redirect === 'string'

  return {
    route,
    isRedirect,
    checkMatch(path) {
      return regex.test(path)
    },
    extractParams(path) {
      const { groups } = regex.exec(path)
      return groups
    },
    extractQuery,
  }
}

function makeRouteWithParamsRegex({ path }) {
  const regex = path.replace(
    /:([^/]+)/g,
    (_, paramName) => `(?<${paramName}>[^/]+)`
  )

  return new RegExp(`^${regex}$`)
}

/**
 * Creates a `RouteMatcher` object for a given route that doesn't have any parameters.
 *
 * @param {Route} route the route to create a matcher for
 * @returns {RouteMatcher} the route matcher
 */
function makeMatcherWithoutParams(route) {
  const regex = makeRouteWithoutParamsRegex(route)
  const isRedirect = typeof route.redirect === 'string'

  return {
    route,
    isRedirect,
    checkMatch(path) {
      return regex.test(path)
    },
    extractParams() {
      return {}
    },
    extractQuery,
  }
}

function makeRouteWithoutParamsRegex({ path }) {
  if (path === CATCH_ALL_ROUTE) {
    return new RegExp('^.*$')
  }

  return new RegExp(`^${path}$`)
}

function extractQuery(path) {
  const queryIndex = path.indexOf('?')

  if (queryIndex === -1) {
    return {}
  }

  const search = new URLSearchParams(path.slice(queryIndex + 1))

  return Object.fromEntries(search.entries())
}
