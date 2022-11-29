function addEventListeners(listeners = {}, el) {
  const addedListeners = {};
  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el);
    addedListeners[eventName] = listener;
  });
  return addedListeners
}
function addEventListener(eventName, handler, el) {
  el.addEventListener(eventName, handler);
  return handler
}
function removeEventListeners(listeners = {}, el) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}

function toArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray]
}
function filterNulls(arr) {
  return arr.filter((item) => item != null)
}

const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
  COMPONENT: 'component',
};
const listenersKey = '__listeners__';
function h(tag, props = {}, children = []) {
  const type =
    typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;
  return { tag, props, children: filterNulls(children), type }
}
function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str }
}
function hFragment(vNodes, props = {}) {
  if (!Array.isArray(vNodes)) {
    throw new Error('hFragment expects an array of vNodes')
  }
  const children = filterNulls(vNodes);
  for (const child of children) {
    if (child.type !== DOM_TYPES.TEXT) {
      child.props = { ...child.props, ...props };
    }
  }
  return {
    type: DOM_TYPES.FRAGMENT,
    children,
  }
}

function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message)
  }
}

function destroyDOM(vdom) {
  const { type, el, children, props } = vdom;
  assert(!!el, 'Can only destroy DOM nodes that have been mounted');
  switch (type) {
    case DOM_TYPES.TEXT: {
      assert(el instanceof Text);
      el.remove();
      break
    }
    case DOM_TYPES.ELEMENT: {
      assert(el instanceof HTMLElement);
      el.remove();
      children.forEach(destroyDOM);
      if (props && props[listenersKey]) {
        removeEventListeners(props[listenersKey], el);
      }
      break
    }
    case DOM_TYPES.FRAGMENT: {
      assert(el instanceof HTMLElement);
      children.forEach(destroyDOM);
      break
    }
    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`)
    }
  }
  delete vdom.el;
}

class Dispatcher {
  #subs = { all: [] }
  subscribe(eventName, handler) {
    if (this.#subs[eventName] === undefined) {
      this.#subs[eventName] = [];
    }
    const length = this.#subs[eventName].push(handler);
    const handlerIndex = length - 1;
    return () => {
      this.#subs[eventName].splice(handlerIndex, 1);
    }
  }
  subscribeToAll(handler) {
    this.#subs.all.push(handler);
    return () => {
      this.#subs.all.splice(this.#subs.all.indexOf(handler), 1);
    }
  }
  dispatch(eventName, payload) {
    if (eventName in this.#subs) {
      Array.from(this.#subs[eventName]).forEach((handler) =>
        handler(payload)
      );
    } else {
      console.warn(`No handlers for event: ${eventName}`);
    }
    Array.from(this.#subs.all).forEach((handler) => handler(payload));
  }
}

const propertyNames = new Set(['value', 'checked', 'selected', 'disabled']);
function setAttribute(el, name, value) {
  if (propertyNames.has(name)) {
    el[name] = value;
  } else {
    el.setAttribute(name, value);
  }
}
function setStyle(el, name, value) {
  el.style[name] = value;
}
function setAttributes(domEl, attrs) {
  const { class: className, style, ...otherAttrs } = attrs;
  delete otherAttrs.key;
  if (className) {
    domEl.className = '';
    domEl.classList.add(...toArray(className));
  }
  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(domEl, prop, value);
    });
  }
  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(domEl, name, value);
  }
}

function mountDOM(vdom, parentEl) {
  ensureIsValidParent(parentEl);
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      return createTextNode(vdom, parentEl)
    }
    case DOM_TYPES.ELEMENT: {
      return createElementNode(vdom, parentEl)
    }
    case DOM_TYPES.FRAGMENT: {
      return createFragmentNode(vdom, parentEl)
    }
    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}
function createTextNode(vdom, parentEl) {
  const { type, value } = vdom;
  assert(type === DOM_TYPES.TEXT);
  const textNode = document.createTextNode(value);
  vdom.el = textNode;
  parentEl.appendChild(textNode);
  return textNode
}
function createElementNode(vdom, parentEl) {
  const { type, tag, props, children } = vdom;
  assert(type === DOM_TYPES.ELEMENT);
  const element = document.createElement(tag);
  addProps(element, props);
  vdom.el = element;
  children.forEach((child) => {
    element.appendChild(mountDOM(child, element));
  });
  parentEl.appendChild(element);
  return element
}
function addProps(el, props) {
  const { on: events, ...attrs } = props;
  props[listenersKey] = addEventListeners(events, el);
  setAttributes(el, attrs);
}
function createFragmentNode(vdom, parentEl) {
  const { type, children } = vdom;
  assert(type === DOM_TYPES.FRAGMENT);
  const fragment = document.createDocumentFragment();
  vdom.el = parentEl;
  children.forEach((child) => {
    fragment.appendChild(mountDOM(child, fragment));
  });
  parentEl.appendChild(fragment);
  return fragment
}
function ensureIsValidParent(
  parentEl,
  errMsg = 'A parent element must be provided'
) {
  if (!parent) {
    throw new Error(errMsg)
  }
  const isElement = parentEl instanceof HTMLElement;
  const isFragment = parentEl instanceof DocumentFragment;
  if (!(isElement || isFragment)) {
    throw new Error(errMsg)
  }
}

function createApp({ state, view, reducers = {} }) {
  let parentEl = null;
  let vdom = null;
  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.subscribeToAll(renderApp)];
  const emit = (eventName, payload) =>
    dispatcher.dispatch(eventName, payload);
  for (const actionName in reducers) {
    const reducer = reducers[actionName];
    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }
  function renderApp() {
    if (vdom) {
      destroyDOM(vdom);
    }
    vdom = view(state, emit);
    mountDOM(vdom, parentEl);
  }
  return {
    mount(_parentEl) {
      parentEl = _parentEl;
      renderApp();
      return this
    },
    unmount() {
      destroyDOM(vdom);
      vdom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },
    emit(eventName, payload) {
      emit(eventName, payload);
    },
  }
}

export { DOM_TYPES, createApp, h, hFragment, hString };
