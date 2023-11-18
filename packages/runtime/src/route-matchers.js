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
 * @property {boolean} hasParams - Whether the route has parameters.
 * @property {(path: string) => boolean} checkMatch - Function that checks whether a route matches a path.
 * @property {(path: string) => object} extractParams - Function that extracts the parameters from a path.
 */

const CATCH_ALL_ROUTE = '*'

/**
 * Returns whether a route is the catch-all route.
 *
 * @param {Route} route - The route to check.
 * @returns {boolean} Whether the route is the catch-all route.
 */
export function isCatchAllRoute({ path }) {
  return path === CATCH_ALL_ROUTE
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
  return makeMatcherWithoutParams(route)
}

function makeMatcherWithoutParams(route) {
  const regex = makeRouteRegex(route)

  return {
    route,

    checkMatch(path) {
      return regex.test(path)
    },

    hasParams: false,
    get params() {
      return {}
    },

    get query() {
      return {}
    },
  }
}

function makeRouteRegex({ path }) {
  if (path === CATCH_ALL_ROUTE) {
    return new RegExp('^.*$')
  }

  return new RegExp(`^${path}$`)
}
