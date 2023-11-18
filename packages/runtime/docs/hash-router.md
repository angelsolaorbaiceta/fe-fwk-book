# Hash Router

A hash router stores the location in the has part of the URL.

```
https: // example.com : 8080 /something/ ?query=abc123 #fooBarBaz

⎣____⎦    ⎣__________⎦  ⎣__⎦ ⎣________⎦ ⎣____________⎦ ⎣________⎦
protocol     domain     port    path      parameters      hash
```

This router is popular with SPAs because it allows the application to handle routing without requiring any server-side configuration.
Using the hash part of the URL means that the browser always asks for the same HTML page to the server, so the server doesn't require any extra configuration.

In a hash router, only the hash part of the URL changes when the user navigates to a different page.
The path can be stored in the hash.
We can also leverage it to store the parameters of the current page:

```
https://example.com/something/ #path/to/page?foo=abc&bar=123
                              ⎣_____________________________⎦
```

From the hash section, we can extract the path and the parameters by splitting the string at the `?` character.

```js
const [path, params] = window.location.hash.split('?')
```

Then, the params can be parsed using the `URLSearchParams` API.

```js
const searchParams = new URLSearchParams(params)
```

## References

- [MDN: Anatomy of a URL](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL)
