import { h as hexToOklab, l as lerpOklab, o as oklabToHex, r as rgbToHex, n as normalizeHexColor, t as throttle, d as debounce } from './logging-Bg1womcE.js';

const IS_DEV = false;
const equalFn = (a, b) => a === b;
const $TRACK = Symbol("solid-track");
const signalOptions = {
  equals: equalFn
};
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
let Transition = null;
let ExternalSourceConfig = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener,
    owner = Owner,
    unowned = fn.length === 0,
    current = detachedOwner === undefined ? owner : detachedOwner,
    root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: current ? current.context : null,
      owner: current
    },
    updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || undefined
  };
  const setter = value => {
    if (typeof value === "function") {
      value = value(s.value);
    }
    return writeSignal(s, value);
  };
  return [readSignal.bind(s), setter];
}
function createComputed(fn, value, options) {
  const c = createComputation(fn, value, true, STALE);
  updateComputation(c);
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE);
  c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  return fn;
}
function children(fn) {
  const children = createMemo(fn);
  const memo = createMemo(() => resolveChildren(children()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function readSignal() {
  if (this.sources && (this.state)) {
    if ((this.state) === STALE) updateComputation(this);else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const observers = this.observers;
    if (!observers || observers[observers.length - 1] !== Listener) {
      const sSlot = observers ? observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
        }
        if (Updates.length > 10e5) {
          Updates = [];
          if (IS_DEV) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(node, node.value, time);
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner,
    listener = Listener;
  Listener = Owner = node;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      {
        node.state = STALE;
        node.owned && node.owned.forEach(cleanNode);
        node.owned = null;
      }
    }
    node.updatedAt = time + 1;
    return handleError(err);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Owner === null) ;else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  if ((node.state) === 0) return;
  if ((node.state) === PENDING) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if ((node.state) === STALE) {
      updateComputation(node);
    } else if ((node.state) === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i,
    userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);else queue[userLength++] = e;
  }
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      const state = source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
      } else if (state === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
        index = node.sourceSlots.pop(),
        obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
          s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.tOwned) {
    for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
    delete node.tOwned;
  }
  if (node.owned) {
    for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      if (Array.isArray(result)) {
        if (result.length < 32768) results.push.apply(results, result);else for (let j = 0; j < result.length; j++) results.push(result[j]);
      } else {
        results.push(result);
      }
    }
    return results;
  }
  return children;
}

const FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [],
    mapped = [],
    disposers = [],
    len = 0,
    indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [],
      newLen = newItems.length,
      i,
      j;
    newItems[$TRACK];
    return untrack(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      }
      else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++);
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === undefined ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}

const narrowedError = name => `Stale read from <${name}>.`;
function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback || undefined));
}
function Show(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo(() => props.when, undefined, undefined);
  const condition = keyed ? conditionValue : createMemo(conditionValue, undefined, {
    equals: (a, b) => !a === !b
  });
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn ? untrack(() => child(keyed ? c : () => {
        if (!untrack(condition)) throw narrowedError("Show");
        return conditionValue();
      })) : child;
    }
    return props.fallback;
  }, undefined, undefined);
}
function Switch(props) {
  const chs = children(() => props.children);
  const switchFunc = createMemo(() => {
    const ch = chs();
    const mps = Array.isArray(ch) ? ch : [ch];
    let func = () => undefined;
    for (let i = 0; i < mps.length; i++) {
      const index = i;
      const mp = mps[i];
      const prevFunc = func;
      const conditionValue = createMemo(() => prevFunc() ? undefined : mp.when, undefined, undefined);
      const condition = mp.keyed ? conditionValue : createMemo(conditionValue, undefined, {
        equals: (a, b) => !a === !b
      });
      func = () => prevFunc() || (condition() ? [index, conditionValue, mp] : undefined);
    }
    return func;
  });
  return createMemo(() => {
    const sel = switchFunc()();
    if (!sel) return props.fallback;
    const [index, conditionValue, mp] = sel;
    const child = mp.children;
    const fn = typeof child === "function" && child.length > 0;
    return fn ? untrack(() => child(mp.keyed ? conditionValue() : () => {
      if (untrack(switchFunc)()?.[0] !== index) throw narrowedError("Match");
      return conditionValue();
    })) : child;
  }, undefined, undefined);
}
function Match(props) {
  return props;
}

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
    aEnd = a.length,
    bEnd = bLength,
    aStart = 0,
    bStart = 0,
    after = a[aEnd - 1].nextSibling,
    map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
            sequence = 1,
            t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}

const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    element === document ? code() : insert(element, code(), element.firstChild ? null : undefined, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, isImportNode, isSVG, isMathML) {
  let node;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstChild;
  };
  const fn = () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document = window.document) {
  const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (value == null) node.removeAttribute(name);else node.setAttribute(name, value);
}
function className(node, value) {
  if (value == null) node.removeAttribute("class");else node.className = value;
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = undefined);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function setStyleProperty(node, name, value) {
  value != null ? node.style.setProperty(name, value) : node.style.removeProperty(name);
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function eventHandler(e) {
  let node = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = value => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host));
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (e.composedPath) {
    const path = e.composedPath();
    retarget(path[0]);
    for (let i = 0; i < path.length - 2; i++) {
      node = path[i];
      if (!handleNode()) break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  }
  else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
    multi = marker !== undefined;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
      prev = current && current[normalized.length],
      t;
    if (item == null || item === true || item === false) ; else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}

// Minimal transition component inspired by solid-transition-group. When the
// resolved child element appears it runs the slide-enter class sequence on it; when it
// disappears it keeps the old element mounted, runs the slide-exit sequence, and
// removes it once its CSS transition ends.
var Slide = props => {
  const resolved = children(() => props.children);
  const [el, setEl] = createSignal(untrack(resolved));
  let cancel;
  const transition = (element, phase, done) => {
    const classes = [`slide-${phase}`, `slide-${phase}-active`, `slide-${phase}-to`];
    let raf;
    const cleanup = () => {
      cancelAnimationFrame(raf);
      element.removeEventListener("transitionend", onEnd);
      element.classList.remove(...classes);
      cancel = undefined;
    };
    const onEnd = e => {
      if (e.target === element) {
        cleanup();
        done?.();
      }
    };
    cancel = cleanup;
    element.classList.add(classes[0], classes[1]);
    element.addEventListener("transitionend", onEnd);

    // two frames so the browser commits the start state before the class swap
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        element.classList.remove(classes[0]);
        element.classList.add(classes[2]);
      });
    });
  };
  createComputed(prev => {
    const next = resolved();
    if (next !== prev) {
      cancel?.();
      if (next) {
        setEl(next);
        transition(next, "enter");
      } else {
        transition(untrack(el), "exit", () => setEl(undefined));
      }
    }
    return next;
  }, untrack(resolved));
  return el;
};

let wasm;
function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function getArrayU32FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
  if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
    cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32ArrayMemory0;
}
let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function getObject(idx) {
  return heap[idx];
}
let heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
let heap_next = heap.length;
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
let cachedTextDecoder = new TextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true
});
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder('utf-8', {
      ignoreBOM: true,
      fatal: true
    });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
const cachedTextEncoder = new TextEncoder();
if (!('encodeInto' in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
}
let WASM_VECTOR_LEN = 0;
const VtFinalization = typeof FinalizationRegistry === 'undefined' ? {
  register: () => {},
  unregister: () => {}
} : new FinalizationRegistry(ptr => wasm.__wbg_vt_free(ptr >>> 0, 1));
let Vt$1 = class Vt {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Vt.prototype);
    obj.__wbg_ptr = ptr;
    VtFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    VtFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vt_free(ptr, 0);
  }
  /**
   * @returns {any}
   */
  getCursor() {
    const ret = wasm.vt_getCursor(this.__wbg_ptr);
    return takeObject(ret);
  }
  /**
   * @param {string} s
   * @returns {any}
   */
  feed(s) {
    const ptr0 = passStringToWasm0(s, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vt_feed(this.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
  }
  /**
   * @param {number} cols
   * @param {number} rows
   * @returns {any}
   */
  resize(cols, rows) {
    const ret = wasm.vt_resize(this.__wbg_ptr, cols, rows);
    return takeObject(ret);
  }
  /**
   * @param {number} row
   * @param {boolean} cursor_on
   * @returns {any}
   */
  getLine(row, cursor_on) {
    const ret = wasm.vt_getLine(this.__wbg_ptr, row, cursor_on);
    return takeObject(ret);
  }
  /**
   * @returns {Uint32Array}
   */
  getSize() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vt_getSize(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var v1 = getArrayU32FromWasm0(r0, r1).slice();
      wasm.__wbindgen_export3(r0, r1 * 4, 4);
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
};
if (Symbol.dispose) Vt$1.prototype[Symbol.dispose] = Vt$1.prototype.free;

/**
 * @param {number} cols
 * @param {number} rows
 * @param {number} scrollback_limit
 * @param {boolean} bold_is_bright
 * @returns {Vt}
 */
function create(cols, rows, scrollback_limit, bold_is_bright) {
  const ret = wasm.create(cols, rows, scrollback_limit, bold_is_bright);
  return Vt$1.__wrap(ret);
}
const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);
async function __wbg_load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);
        if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return {
        instance,
        module
      };
    } else {
      return instance;
    }
  }
}
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbg_new_13317ed16189158e = function () {
    const ret = new Array();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_4ceb6a766bf78b04 = function () {
    const ret = new Object();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_3f1d0b984ed272ed = function (arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
  };
  imports.wbg.__wbg_set_8b6a9a61e98a8881 = function (arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
  };
  imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function (arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_cast_4625c577ab2ec9ee = function (arg0) {
    // Cast intrinsic for `U64 -> Externref`.
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function (arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_clone_ref = function (arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0);
  };
  return imports;
}
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedDataViewMemory0 = null;
  cachedUint32ArrayMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  return wasm;
}
function initSync(module) {
  if (wasm !== undefined) return wasm;
  if (typeof module !== 'undefined') {
    if (Object.getPrototypeOf(module) === Object.prototype) {
      ({
        module
      } = module);
    } else {
      console.warn('using deprecated parameters for `initSync()`; pass a single object instead');
    }
  }
  const imports = __wbg_get_imports();
  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }
  const instance = new WebAssembly.Instance(module, imports);
  return __wbg_finalize_init(instance, module);
}
async function __wbg_init(module_or_path) {
  if (wasm !== undefined) return wasm;
  if (typeof module_or_path !== 'undefined') {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({
        module_or_path
      } = module_or_path);
    } else {
      console.warn('using deprecated parameters for the initialization function; pass a single object instead');
    }
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === 'string' || typeof Request === 'function' && module_or_path instanceof Request || typeof URL === 'function' && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  const {
    instance,
    module
  } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}

var exports$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Vt: Vt$1,
  create: create,
  default: __wbg_init,
  initSync: initSync
});

const base64codes = [62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];

            function getBase64Code(charCode) {
                return base64codes[charCode - 43];
            }

            function base64Decode(str) {
                let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0;
                let n = str.length;
                let result = new Uint8Array(3 * (n / 4));
                let buffer;

                for (let i = 0, j = 0; i < n; i += 4, j += 3) {
                    buffer =
                        getBase64Code(str.charCodeAt(i)) << 18 |
                        getBase64Code(str.charCodeAt(i + 1)) << 12 |
                        getBase64Code(str.charCodeAt(i + 2)) << 6 |
                        getBase64Code(str.charCodeAt(i + 3));
                    result[j] = buffer >> 16;
                    result[j + 1] = (buffer >> 8) & 0xFF;
                    result[j + 2] = buffer & 0xFF;
                }

                return result.subarray(0, result.length - missingOctets);
            }

            var vtWasmModule = base64Decode("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AwALIAZBlwhrDgMGBAUDCyADQQE6AMEBDAYLIANBAToAvgEgA0EANgJoIAMgAygCqAE2AmwMBQsgA0EBOgC/AQwECyADQQE6AHAMAwsgAxBXDAILIAMQVwsjAEEwayIGJAAgAy0AvAFBAUcEQCADQQE6ALwBIANB9ABqIANBiAFqQQUQWyADIANBJGpBCRBbIAZBDGoiDCADKAKcASADKAKgASINQQFBACADQbIBahAWIANBDGoQfiADIAxBJPwKAAAgAygCYCADKAJkQQAgDRBOCyAGQTBqJAAgAxAOCyAAQQJqIQAMAQsLIARBAkECEEYMKgsCQEEBIAUvAS4iACAAQQFNG0EBayIAIAUvATAiBCADKAKgASIGIAQbQQFrIgRJIAQgBklxRQRAIAMoAqgBIQAMAQsgAyAENgKsASADIAA2AqgBCyADQQA2AmggAyAAQQAgAy0AvgEbNgJsDCkLIANBAToAcCADQQA7AL0BIANBADsBugEgA0ECOgC2ASADQQI6ALIBIANBADsBsAEgA0IANwKkASADQYCAgAg2AoQBIANBAjoAgAEgA0ECOgB8IANCADcCdCADIAMoAqABQQFrNgKsAQwoCyADKAKgASADKAKsASIAQQFqIAAgAygCbCIASRshBCADIAAgBEEBIAUvAS4iBiAGQQFNGyAJEBQgAygCYCADKAJkIAAgBBBODCcLIAMgAygCaCADKAJsIgBBAEEBIAUvAS4iBCAEQQFNGyAJEBUgACADKAJkTw0eIAMoAmAgAGpBAToAAAwmCwJAAkACQCAFLQAtQQFrDgMBAigACyADIAMoAmggAygCbCIAQQEgBSAJEBUgAygCYCADKAJkIAAgAygCoAEQTgwnCyADIAMoAmggAygCbCIAQQIgBSAJEBUgAygCYCADKAJkQQAgAEEBahBODCYLIANBACADKAIcIAkQHiADKAJgIAMoAmRBACADKAKgARBODCULIAMoAmwhACADKAJoIQQCQAJAAkACQCAFLQAtQQFrDgIBAgALIAMgBCAAQQQgBSAJEBUgACADKAJkSQ0CDB8LIAMgBCAAQQUgBSAJEBUgACADKAJkTw0eDAELIAMgBCAAQQYgBSAJEBUgACADKAJkTw0dCyADKAJgIABqQQE6AAAMJAsgAyAFLQAtOgCxAQwjCyADIAUtAC06ALABDCIL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IAQQK0F/RwRAAAsLCwMAAAsDAAALAwAACwMAAAsDAAALAwAACxYAIAFBAXFFBEAgALgQCA8LIACtEAcLRAEBfyAAIAAoAgBBAWsiATYCACABRQRAIABBDGoQPQJAIABBf0YNACAAIAAoAgRBAWsiATYCBCABDQAgAEGcBhA1CwsLGAAgACAAKAIAQQEgASACECtBf0cEQAALCxgAIAAgACgCAEEBQQQgARArQX9HBEAACwsDAAALHwEBfyAAKAIQIgEgACgCFBBoIAAoAgwgAUEEQRAQRgsfAQF/IAAoAgQiASAAKAIIEGggACgCACABQQRBEBBGCxIAIAIEQCAAIAEgAkEEdBAxCwsWACAAQRBqEDMgACgCACAAKAIEEIMBCxMAIAAgACgCAEEBazYCACABEHkLEQBBBCAAEBEiAEUEQAALIAALFAAgAEF/RwRAIAAgAUEEQRQQRgsLEwAgAARADwtBwIDBAEEbEIwBAAsRACAAIAAoAgggAUEEQRQQcQsRACAAIAAoAgggAUEEQRAQcQsNACABBEAgACABEDULCw0AIAAgASACQRRsEDELDQAgACABEFZBAToADAsLACAAIwBqJAAjAAsOAEHbgMEAQc8AEIwBAAsJACAAIAEQBgALAwAACwYAIAAQMwsLsUQeAEH/iMAACwF4AEGgicAACxD/////////////////////AEHGicAACw8BAAAAAAAgAAAAAAAAAAIAQYCKwAALIP//////////////////////////////////////////AEHkisAACwgQAAAAAAAAAQBBgLjAAAsC/wcAQZS4wAALBw8A////9f8AQcC4wAALFv///////////////////////////wMAQeC4wAALHf////////////////////////////////////8PAEG/ucAACxj8//////////////////////////////8AQeC5wAALPv//////////////////////////////////////////////////////////////////////////////////AEHMusAACzj/////////////////////////////////////////////////////////////////////////fwBBoLvAAAvRAf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8DAEGAvcAACyf//////////////////////////////////////////////////w8AQYDAwAALvQViZ3RleHRjb2RlcG9pbnRzcmFzdGVyX3N5bWJvbHN2ZWN0b3Jfc3ltYm9sc4AlAACfJQAAAAAAAAD7AQA7+wEAAAAAAOIlAADlJQAAAAAAALDgAAC/4AAAAAAAADz7AQBp+wEAAAAAAGr7AQBs+wEAAAAAAAEADwDwGg8AAAAAAGF0dGVtcHRlZCB0byB0YWtlIG93bmVyc2hpcCBvZiBSdXN0IHZhbHVlIHdoaWxlIGl0IHdhcyBib3Jyb3dlZAAAAAAAAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAACAAAAAhAAAAIgAAACMAAAAkAAAAJQAAACYAAAAnAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAALgAAAC8AAAAwAAAAMQAAADIAAAAzAAAANAAAADUAAAA2AAAANwAAADgAAAA5AAAAOgAAADsAAAA8AAAAPQAAAD4AAAA/AAAAQAAAAEEAAABCAAAAQwAAAEQAAABFAAAARgAAAEcAAABIAAAASQAAAEoAAABLAAAATAAAAE0AAABOAAAATwAAAFAAAABRAAAAUgAAAFMAAABUAAAAVQAAAFYAAABXAAAAWAAAAFkAAABaAAAAWwAAAFwAAABdAAAAXgAAAF8AAABmJgAAkiUAAAkkAAAMJAAADSQAAAokAACwAAAAsQAAACQkAAALJAAAGCUAABAlAAAMJQAAFCUAADwlAAC6IwAAuyMAAAAlAAC8IwAAvSMAABwlAAAkJQAANCUAACwlAAACJQAAZCIAAGUiAADAAwAAYCIAAKMAAADFIgAAfwBByMXAAAtzAQAAABAAAAARAAAAEgAAABMAAAAUAAAAFAAAAAQAAAAVAAAAFgAAABcAAAAYAAAAY2xvc3VyZSBpbnZva2VkIHJlY3Vyc2l2ZWx5IG9yIGFmdGVyIGJlaW5nIGRyb3BwZWQAAAAAAAD//////////zAjEABBgcfAAAuHAQECAwMEBQYHCAkKCwwNDgMDAwMDAwMPAwMDAwMDAw8JCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCRAJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQBBgMnAAAtgVVV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAEH8ycAACylVVVVVFQBQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAQBBr8rAAAvEARBBEFVVVVVVV1VVVVVVVVVVVVFVVQAAQFT13VVVVVVVVVVVFQAAAAAAVVVVVfxdVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFABQAFARQVVVVVVVVVRVRVVVVVVVVVQAAAAAAAEBVVVVVVVVVVVXVV1VVVVVVVVVVVVVVBQAAVFVVVVVVVVVVVVVVVVUVAABVVVFVVVVVVQUQAAABAVBVVVVVVVVVVVVVAVVVVVVV/////39VVVVQVQAAVVVVVVVVVVVVVQUAQYDMwAALmARAVVVVVVVVVVVVVVVVVUVUAQBUUQEAVVUFVVVVVVVVVVFVVVVVVVVVVVVVVVVVVUQBVFVRVRVVVQVVVVVVVVVFQVVVVVVVVVVVVVVVVVVVVEEVFFBRVVVVVVVVVVBRVVVBVVVVVVVVVVVVVVVVVVVUARBUUVVVVVUFVVVVVVUFAFFVVVVVVVVVVVVVVVVVVQQBVFVRVQFVVQVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVRVRVVVFVFVVVVVVVVVVVVVVUVFVVVVVVVVVVVVVVVVUEVAUEUFVBVVUFVVVVVVVVVVFVVVVVVVVVVVVVVVVVVRREBQRQVUFVVQVVVVVVVVVVUFVVVVVVVVVVVVVVVVUVRAFUVUFVFVVVBVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVFFQVEVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVEAQFVVFQBAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQAAVFVVAEBVVVVVVVVVVVVVVVVVVVVVVVVQVVVVVVVVEVFVVVVVVVVVVVVVVVVVAQAAQAAEVQEAAAEAAAAAAAAAAFRVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBBABBQVVVVVVVVVAFVFVVVQFUVVVFQVVRVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgBBwNDAAAuQA1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAVVVVVVVVVVVVVVVVQVUVVVVVVVVBVVVVVVVVVUFVVVVVVVVVQVVVVV///33//3XX3fW1ddVEABQVUUBAABVV1FVVVVVVVVVVVVVFQBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAVVFVFVQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVXFRRVVVVVVVVVVVVVVVVVVUUAQEQBAFQVAAAUVVVVVVVVVVVVVVVVAAAAAAAAAEBVVVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVAABQBVVVVVVVVVVVVRUAAFVVVVBVVVVVVVVVBVAQUFVVVVVVVVVVVVVVVVVFUBFQVVVVVVVVVVVVVVVVVVUAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAAAAAEAFRRVVRQVVVVVVVVVVVVVVVVVVVVVVUAQeDTwAALkwhVVRUAVVVVVVVVBUBVVVVVVVVVVVVVVVUAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAAAAAAAAAABUVVVVVVVVVVVV9VVVVWlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf1X11VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV9VVVVVVVfVVVVVVVVVVVVVVVV////VVVVVVVVVVVVVdVVVVVV1VVVVV1V9VVVVVV9VV9VdVVXVVVVVXVV9V11XVVd9VVVVVVVVVVXVVVVVVVVVVV31d9VVVVVVVVVVVVVVVVVVVX9VVVVVVVVV1VV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVXVV1VVVVVVVVVVVVVVVVddVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVQVVVVVVVVVVVVVVVVVVVV/f///////////////19V1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAAAAAAAAAAKqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpaVVVVVVVVqqqqqqqqqqqqqqqqqqoKAKqqqmqpqqqqqqqqqqqqqqqqqqqqqqqqqqpqgaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVqaqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqKqqqqqqqqqqqmqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVZWqqqqqqqqqqqqqqmqqqqqqqqqqqqqqVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqVVVVVVVVVVVVVVVVVVVVVaqqqlaqqqqqqqqqqqqqqqqqalVVVVVVVVVVVVVVVVVfVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFUAAAFBVVVVVVVVVBVVVVVVVVVVVVVVVVVVVVVVVVVVVUFVVVUVFFVVVVVVVVUFVVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQVVVVVVVVAAAAAFBVRRVVVVVVVVVVVVUFAFBVVVVVVRUAAFBVVVWqqqqqqqqqVkBVVVVVVVVVVVVVVRUFUFBVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVQFAQUFVVRVVVVRVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVUEFFQFUVVVVVVVVVVVVVVQVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVFFVVVVVqqqqqqqqqqqqVVVVAAAAAABAFQBB/9vAAAvhDFVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAPCqqlpVAAAAAKqqqqqqqqqqaqqqqqpqqlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRWpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpWVVVVVVVVVVVVVVVVVVUFVFVVVVVVVVVVVVVVVVVVVapqVVUAAFRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBUBVAUFVAFVVVVVVVVVVVVVAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQVVVVVVVVdVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVRVVVVVVVVVVVVVVVVVVVVVVVVVAVVVVVVVVVVVVVVVVVVVVVVVBQAAVFVVVVVVVVVVVVVVBVBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVQAAAEBVVVVVVVVVVVVVFFRVFVBVVVVVVVVVVVVVVRVAQVVFVVVVVVVVVVVVVVVVVVVVQFVVVVVVVVVVFQABAFRVVVVVVVVVVVVVVVVVVRVVVVVQVVVVVVVVVVVVVVVVBQBABVUBFFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVAEVUVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVFQBAVVVVVVVQVVVVVVVVVVVVVVVVVRVEVFVVVVUVVVVVBQBUAFRVVVVVVVVVVVVVVVVVVVVVAAAFRFVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVVVVVFABEEQRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRUFUFUQVFVVVVVVVVBVVVVVVVVVVVVVVVVVVVVVVVVVVRUAQBFUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVRABBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAQUQAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFQAAQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFUVBBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUABVVUVVVVVVVVVQEAQFVVVVVVVVVVVRUABEBVFVVVAUABVVVVVVVVVVVVVQAAAABAUFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAQAAQVVVVVVVVVVVVVVVVVVVVVVVVVVUFAAAAAAAFAARBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAUBFEAAAVVVVVVVVVVVVVVVVVVVVVVVVUBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVFVVQFVVVVVVVVVVVVVVVQVAVURVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBUAAABQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAVFVVVVVVVVVVVVVVVVVVAEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVRVAVVVVVVVVVVVVVVVVVVVVVVVVVapUVVVaVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqpaVVVVVVVVVVVVVaqqVlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVaqpqmmqqqqqqqqqqmpVVVVlVVVVVVVVVWpZVVVVqlVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpVVVVVVVVVVUEAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUAQevowAALdVAAAAAAAEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVURUAUAAAAAQAEAVVVVVVVVVQVQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBVRVVVVVVVVVVVVVVVVVVQBB7enAAAsCQBUAQfvpwAALxQZUVVFVVVVUVVVVVRUAAQAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVAEAAAAAAFAAQBEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVQBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAEBVVVVVVVVVVVVVVVVVVVdVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV1VVVVVVVVVVVVVVVVVVVVXX9/39VVVVVVVVVVVVVVVVVVVVVVVX1////////blVVVaqquqqqqqrq+r+/VaqqVlVfVVVVqlpVVVVVVVX//////////1dVVf3/3///////////////////////9///////VVVV/////////////3/V/1VVVf////9XV///////////////////////f/f/////////////////////////////////////////////////////////////1////////////////////19VVdV/////////VVVVVXVVVVVVVVV9VVVVV1VVVVVVVVVVVVVVVVVVVVVVVVVV1f///////////////////////////1VVVVVVVVVVVVVVVf//////////////////////X1VXf/1V/1VV1VdV//9XVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV////VVdVVVVVVVX//////////////3///9//////////////////////////////////////////////////////////////VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf///1f//1dV///////////////f/19V9f///1X//1dV//9XVaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpaVVVVVVVVVVVZllVhqqVZqlVVVVVVlVVVVVVVVVWVVVUAQc7wwAALAQMAQdzwwAALzhBVVVVVVZVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRUAlmpaWmqqBUCmWZVlVVVVVVVVVVUAAAAAVVZVValWVVVVVVVVVVVVVlVVVVVVVVVVAAAAAAAAAABUVVVVlVlZVVVlVVVpVVVVVVVVVVVVVVWVVpVqqqqqVaqqWlVVVVlVqqqqVVVVVWVVVVpVVVVVpWVWVVVVlVVVVVVVVaaWmpZZWWWplqqqZlWqVVpZVVpWZVVVVWqqpaVaVVVVpapaVVVZWVVVWVVVVVVVlVVVVVVVVVVVVVVVVVVVVVVVVVVVZVX1VVVVaVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqVaqqqqqqqqqqqlVVVaqqqqqlWlVVmqpaVaWlVVpapZalWlVVVaVaVZVVVVV9VWlZpVVfVWZVVVVVVVVVVWZV////VVVVmppqmlVVVdVVVVVV1VVVpV1V9VVVVVW9Va+quqqrqqqaVbqq+q66rlVd9VVVVVVVVVVXVVVVVVlVVVV31d9VVVVVVVVVpaqqVVVVVVVV1VdVVVVVVVVVVVVVVVVXrVpVVVVVVVVVVVWqqqqqqqqqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgAAAMCqqlpVAAAAAKqqqqqqqqqqaqqqqqpqqlVVVVVVVVVVVVVVVQVUVVVVVVVVVVVVVVVVVVVVqmpVVQAAVFmqqmpVqqqqqqqqqlqqqqqqqqqqqqqqqqqqqlpVqqqqqqqqqrr+/7+qqqqqVlVVVVVVVVVVVVVVVVX1////////AAECAgICAwICBAIFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdAgIeAgICAgICAh8gISIjAiQlJicoKQIqAgICAissAgICAi0uAgICLzAxMjMCAgICAgI0AgI1NjcCODk6Ozw9Pj85OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTlAOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OUECAkJDAgJERUZHSEkCSjk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OUsCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI5OTk5TAICAgICTU5PUAICAlECUlMCAgICAgICAgICAgICVFUCAlYCVwICWFlaW1xdXl9gYQJiYwJkZWZnAmgCaWprbAICbW5vcAJxcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnR1AgICAgICAnZ3OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTl4OTk5OTk5OTk5eXoCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAns5OXw5OX0CAgICAgICAgICAgICAgICAgICfgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn8CAgKAgYICAgICAgICAgICAgICAgKDhAICAgICAgICAgKFhnUCAocCAgKIAgICAgICAomKAgICAgICAgICAgICAouMAo2OAo+QkZKTlJWWApcCApiZmpsCAgICAgICAgICOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5nB0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAnQICAgKenwIEAgUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0CAh4CAgICAgICHyAhIiMCJCUmJygpAioCAgICoKGio6Slpi6nqKmqq6ytMwICAgICAq4CAjU2NwI4OTo7PD0+rzk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OUwCAgICArBOT7GFhnUCAocCAgKIAgICAgICAomKAgICAgICAgICAgICAouMsrOOAo+QkZKTlJWWApcCApiZmpsCAgICAgICAgICbnVsbCBwb2ludGVyIHBhc3NlZCB0byBydXN0cmVjdXJzaXZlIHVzZSBvZiBhbiBvYmplY3QgZGV0ZWN0ZWQgd2hpY2ggd291bGQgbGVhZCB0byB1bnNhZmUgYWxpYXNpbmcgaW4gcnVzdABBrIHBAAsBBABICXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AgZ3YWxydXMGMC4yNC40DHdhc20tYmluZGdlbhMwLjIuMTA2ICgxMTgzMWZiODkp");

async function init(options) {
                    await __wbg_init({
                        module_or_path: await options.module,
                        memory: options.memory,
                    });
                    return exports$1;
                }

const vt = init({
  module: vtWasmModule
}); // trigger async loading of wasm
const memory = vt.then(wasm => wasm.default()).then(d => d.memory);
class Vt {
  static async build(cols, rows, boldIsBright, logger) {
    return new Vt(await vt, await memory, logger, cols, rows, boldIsBright);
  }
  constructor(wasm, memory, logger, cols, rows, boldIsBright) {
    this.wasm = wasm;
    this.memory = memory;
    this.logger = logger;
    this.cols = cols;
    this.rows = rows;
    this.boldIsBright = boldIsBright;
    this.vt = wasm.create(cols, rows, 100, boldIsBright);
  }
  feed(data) {
    return this.vt.feed(data);
  }
  reset(cols, rows, init = undefined) {
    this.logger.debug(`vt: reset (${cols}x${rows})`);
    this.vt = this.wasm.create(cols, rows, 100, this.boldIsBright);
    this.cols = cols;
    this.rows = rows;
    if (init !== undefined && init !== "") {
      this.vt.feed(init);
    }
    return Array.from({
      length: rows
    }, (_, i) => i);
  }
  resize(cols, rows) {
    if (cols === this.cols && rows === this.rows) return;
    this.logger.debug(`vt: resize (${cols}x${rows})`);
    const changedRows = this.vt.resize(cols, rows);
    this.cols = cols;
    this.rows = rows;
    return changedRows;
  }
  getLine(n, cursorOn) {
    return this.vt.getLine(n, cursorOn);
  }
  getDataView([ptr, len], size) {
    return new DataView(this.memory.buffer, ptr, len * size);
  }
  getUint32Array([ptr, len]) {
    return new Uint32Array(this.memory.buffer, ptr, len);
  }
  getCursor() {
    const cursor = this.vt.getCursor();
    if (cursor) {
      return {
        col: cursor[0],
        row: cursor[1],
        visible: true
      };
    }
    return {
      col: 0,
      row: 0,
      visible: false
    };
  }
}

var _tmpl$$f = /*#__PURE__*/template(`<div class=ap-term><canvas></canvas><svg class=ap-term-symbols xmlns=http://www.w3.org/2000/svg preserveAspectRatio=none width=100% height=100% aria-hidden=true><defs></defs><g></g></svg><pre class=ap-term-text aria-live=off tabindex=0>`);
const SVG_NS = "http://www.w3.org/2000/svg";
const BLOCK_H_RES = 8;
const BLOCK_V_RES = 24;
const BOLD_MASK = 1;
const FAINT_MASK = 1 << 1;
const ITALIC_MASK = 1 << 2;
const UNDERLINE_MASK = 1 << 3;
const STRIKETHROUGH_MASK = 1 << 4;
const BLINK_MASK = 1 << 5;
var Terminal = props => {
  // eslint-disable-next-line solid/reactivity -- core is a mount-time dependency, never swapped
  const core = props.core;
  const textRowPool = [];
  const vectorSymbolRowPool = [];
  const vectorSymbolUsePool = [];
  const vectorSymbolDefCache = new Set();
  const colorsCache = new Map();
  const attrClassCache = new Map();
  // eslint-disable-next-line solid/reactivity -- VT is built once with initial size, resizes arrive via core events
  const vtReady = Vt.build(props.cols, props.rows, props.boldIsBright, props.logger);
  let vt;
  const [size, setSize] = createSignal(
  // eslint-disable-next-line solid/reactivity -- initial size only, core reset/resize events update it
  {
    cols: props.cols,
    rows: props.rows
  }, {
    equals: (newVal, oldVal) => newVal.cols === oldVal.cols && newVal.rows === oldVal.rows
  });

  // eslint-disable-next-line solid/reactivity -- adaptivePalette is a static mount-time option
  const [theme, setTheme] = createSignal(buildTheme(FALLBACK_THEME, props.adaptivePalette));
  const lineHeight = () => props.lineHeight ?? 1.3333333333;
  const [blinkOn, setBlinkOn] = createSignal(true);
  const cursorOn = createMemo(() => {
    if (props.cursorMode === "hidden") return false;
    if (props.cursorMode === "steady") return true;
    return blinkOn() || cursorHold;
  });
  const style$1 = createMemo(() => {
    return {
      width: `${size().cols}ch`,
      height: `${lineHeight() * size().rows}em`,
      "font-size": `${(props.scale || 1.0) * 100}%`,
      "--term-line-height": `${lineHeight()}em`,
      "--term-cols": size().cols,
      "--term-rows": size().rows
    };
  });
  let cursor = {
    col: 0,
    row: 0,
    visible: false
  };
  let pendingChanges = {
    size: undefined,
    theme: undefined,
    rows: new Set()
  };
  let el;
  let canvasEl;
  let canvasCtx;
  let textEl;
  let vectorSymbolsEl;
  let vectorSymbolDefsEl;
  let vectorSymbolRowsEl;
  let frameRequestId;
  let blinkIntervalId;
  let cssTheme;
  let cursorHold = false;
  onMount(() => {
    setupCanvas();
    setInitialTheme();
    adjustTextRowNodeCount(size().rows);
    adjustSymbolRowNodeCount(size().rows);

    // eslint-disable-next-line solid/reactivity -- one-shot init continuation, core and onReady are mount-time props
    vtReady.then(vt_ => {
      vt = vt_;
      core.addEventListener("reset", onVtReset);
      core.addEventListener("resize", onVtResize);
      core.addEventListener("output", onVtOutput);
      props.onReady?.();
    });
  });
  onCleanup(() => {
    core.removeEventListener("reset", onVtReset);
    core.removeEventListener("resize", onVtResize);
    core.removeEventListener("output", onVtOutput);
    clearInterval(blinkIntervalId);
    cancelAnimationFrame(frameRequestId);
  });
  createEffect(() => {
    if (props.blinking && blinkIntervalId === undefined) {
      blinkIntervalId = setInterval(toggleBlink, 600);
    } else {
      clearInterval(blinkIntervalId);
      blinkIntervalId = undefined;
      setBlinkOn(true);
    }
  });
  createEffect(() => {
    cursorOn();
    if (cursor.visible) {
      pendingChanges.rows.add(cursor.row);
      scheduleRender();
    }
  });
  function setupCanvas() {
    canvasCtx = canvasEl.getContext("2d");
    if (!canvasCtx) throw new Error("2D ctx not available");
    const {
      cols,
      rows
    } = size();
    canvasEl.width = cols * BLOCK_H_RES;
    canvasEl.height = rows * BLOCK_V_RES;
    canvasEl.style.imageRendering = "pixelated";
    canvasCtx.imageSmoothingEnabled = false;
  }
  function resizeCanvas({
    cols,
    rows
  }) {
    canvasEl.width = cols * BLOCK_H_RES;
    canvasEl.height = rows * BLOCK_V_RES;
    canvasCtx.imageSmoothingEnabled = false;
  }
  function setInitialTheme() {
    cssTheme = getCssTheme(el);
    pendingChanges.theme = cssTheme;
  }
  function onVtReset({
    size,
    theme,
    init
  }) {
    const changedRows = vt.reset(size.cols, size.rows, init);
    onVtUpdate({
      size,
      theme,
      changedRows
    });
  }
  function onVtResize(size) {
    const changedRows = vt.resize(size.cols, size.rows);
    if (changedRows === undefined) return;
    onVtUpdate({
      size,
      changedRows
    });
  }
  function onVtOutput(data) {
    let changedRows;
    if (Array.isArray(data)) {
      changedRows = new Set();
      for (const d of data) {
        for (const row of vt.feed(d)) {
          changedRows.add(row);
        }
      }
    } else {
      changedRows = vt.feed(data);
    }
    onVtUpdate({
      changedRows
    });
  }
  function onVtUpdate({
    size: newSize,
    theme,
    changedRows
  }) {
    let activity = false;
    if (changedRows !== undefined) {
      for (const row of changedRows) {
        pendingChanges.rows.add(row);
        cursorHold = true;
        activity = true;
      }
    }
    if (theme !== undefined && props.preferEmbeddedTheme) {
      pendingChanges.theme = theme;
      for (let row = 0; row < size().rows; row++) {
        pendingChanges.rows.add(row);
      }
    }
    const newCursor = vt.getCursor();
    if (newCursor.visible != cursor.visible || newCursor.col != cursor.col || newCursor.row != cursor.row) {
      if (cursor.visible) {
        pendingChanges.rows.add(cursor.row);
      }
      if (newCursor.visible) {
        pendingChanges.rows.add(newCursor.row);
      }
      cursor = newCursor;
      cursorHold = true;
      activity = true;
    }
    if (newSize !== undefined) {
      pendingChanges.size = newSize;
      for (const row of pendingChanges.rows) {
        if (row >= newSize.rows) {
          pendingChanges.rows.delete(row);
        }
      }
    }
    if (activity && cursor.visible) {
      pendingChanges.rows.add(cursor.row);
    }
    scheduleRender();
  }
  function toggleBlink() {
    setBlinkOn(blink => {
      if (!blink) cursorHold = false;
      return !blink;
    });
  }
  function scheduleRender() {
    if (frameRequestId === undefined) {
      frameRequestId = requestAnimationFrame(render);
    }
  }
  function render() {
    frameRequestId = undefined;
    const {
      size: newSize,
      theme: newTheme,
      rows
    } = pendingChanges;
    batch(function () {
      if (newSize !== undefined) {
        resizeCanvas(newSize);
        adjustTextRowNodeCount(newSize.rows);
        adjustSymbolRowNodeCount(newSize.rows);
        setSize(newSize);
      }
      if (newTheme !== undefined) {
        if (newTheme === null) {
          setTheme(buildTheme(cssTheme, props.adaptivePalette));
        } else {
          setTheme(buildTheme(newTheme, props.adaptivePalette));
        }
        colorsCache.clear();
      }
      const theme_ = theme();
      const cursorOn_ = cursorOn();
      for (const r of rows) {
        renderRow(r, theme_, cursorOn_);
      }
    });
    pendingChanges.size = undefined;
    pendingChanges.theme = undefined;
    pendingChanges.rows.clear();
    props.stats.renders += 1;
  }
  function renderRow(rowIndex, theme, cursorOn) {
    const line = vt.getLine(rowIndex, cursorOn);
    clearCanvasRow(rowIndex);
    renderRowBg(rowIndex, line.bg, theme);
    renderRowRasterSymbols(rowIndex, line.raster_symbols, theme);
    renderRowVectorSymbols(rowIndex, line.vector_symbols, theme);
    renderRowText(rowIndex, line.text, line.codepoints, theme);
  }
  function clearCanvasRow(rowIndex) {
    canvasCtx.clearRect(0, rowIndex * BLOCK_V_RES, size().cols * BLOCK_H_RES, BLOCK_V_RES);
  }
  function renderRowBg(rowIndex, spans, theme) {
    // The memory layout of a BgSpan must follow one defined in lib.rs (see the assertions at the bottom)
    const view = vt.getDataView(spans, 8);
    const y = rowIndex * BLOCK_V_RES;
    let i = 0;
    while (i < view.byteLength) {
      const column = view.getUint16(i + 0, true);
      const width = view.getUint16(i + 2, true);
      const color = getColor(view, i + 4, theme);
      i += 8;
      canvasCtx.fillStyle = color;
      canvasCtx.fillRect(column * BLOCK_H_RES, y, width * BLOCK_H_RES, BLOCK_V_RES);
    }
  }
  function renderRowRasterSymbols(rowIndex, symbols, theme) {
    // The memory layout of a RasterSymbol must follow one defined in lib.rs (see the assertions at the bottom)
    const view = vt.getDataView(symbols, 12);
    const y = rowIndex * BLOCK_V_RES;
    let i = 0;
    while (i < view.byteLength) {
      const column = view.getUint16(i + 0, true);
      const codepoint = view.getUint32(i + 4, true);
      const color = getColor(view, i + 8, theme) || theme.fg;
      i += 12;
      canvasCtx.fillStyle = color;
      drawBlockGlyph(canvasCtx, codepoint, column * BLOCK_H_RES, y);
    }
  }
  function renderRowVectorSymbols(rowIndex, symbols, theme) {
    // The memory layout of a VectorSymbol must follow one defined in lib.rs (see the assertions at the bottom)
    const view = vt.getDataView(symbols, 16);
    const frag = document.createDocumentFragment();
    const symbolRow = vectorSymbolRowsEl.children[rowIndex];
    let i = 0;
    while (i < view.byteLength) {
      const column = view.getUint16(i + 0, true);
      const codepoint = view.getUint32(i + 4, true);
      const color = getColor(view, i + 8, theme);
      const attrs = view.getUint8(i + 12);
      i += 16;
      const blink = (attrs & BLINK_MASK) !== 0;
      const el = createVectorSymbolNode(codepoint, column, color, blink);
      if (el) {
        frag.appendChild(el);
      }
    }
    recycleVectorSymbolUses(symbolRow);
    symbolRow.replaceChildren(frag);
  }
  function renderRowText(rowIndex, spans, codepoints, theme) {
    // The memory layout of a TextSpan must follow one defined in lib.rs (see the assertions at the bottom)
    const spansView = vt.getDataView(spans, 12);
    const codepointsView = vt.getUint32Array(codepoints);
    const frag = document.createDocumentFragment();
    let i = 0;
    while (i < spansView.byteLength) {
      const column = spansView.getUint16(i + 0, true);
      const codepointsStart = spansView.getUint16(i + 2, true);
      const len = spansView.getUint16(i + 4, true);
      const color = getColor(spansView, i + 6, theme);
      const attrs = spansView.getUint8(i + 10);
      const text = String.fromCodePoint(...codepointsView.subarray(codepointsStart, codepointsStart + len));
      i += 12;
      const el = document.createElement("span");
      const style = el.style;
      style.setProperty("--offset", column);
      el.textContent = text;
      if (color) {
        style.color = color;
      }
      const cls = getAttrClass(attrs);
      if (cls !== null) {
        el.className = cls;
      }
      frag.appendChild(el);
    }
    textEl.children[rowIndex].replaceChildren(frag);
  }
  function getAttrClass(attrs) {
    let c = attrClassCache.get(attrs);
    if (c === undefined) {
      c = buildAttrClass(attrs);
      attrClassCache.set(attrs, c);
    }
    return c;
  }
  function buildAttrClass(attrs) {
    let cls = "";
    if ((attrs & BOLD_MASK) !== 0) {
      cls += "ap-bold ";
    } else if ((attrs & FAINT_MASK) !== 0) {
      cls += "ap-faint ";
    }
    if ((attrs & ITALIC_MASK) !== 0) {
      cls += "ap-italic ";
    }
    if ((attrs & UNDERLINE_MASK) !== 0) {
      cls += "ap-underline ";
    }
    if ((attrs & STRIKETHROUGH_MASK) !== 0) {
      cls += "ap-strike ";
    }
    if ((attrs & BLINK_MASK) !== 0) {
      cls += "ap-blink ";
    }
    return cls === "" ? null : cls;
  }
  function getColor(view, offset, theme) {
    const tag = view.getUint8(offset);
    if (tag === 0) {
      return null;
    } else if (tag === 1) {
      return theme.fg;
    } else if (tag === 2) {
      return theme.bg;
    } else if (tag === 3) {
      return theme.palette[view.getUint8(offset + 1)];
    } else if (tag === 4) {
      const key = view.getUint32(offset, true);
      let c = colorsCache.get(key);
      if (c === undefined) {
        const r = view.getUint8(offset + 1);
        const g = view.getUint8(offset + 2);
        const b = view.getUint8(offset + 3);
        c = "rgb(" + r + "," + g + "," + b + ")";
        colorsCache.set(key, c);
      }
      return c;
    } else {
      throw new Error(`invalid color tag: ${tag}`);
    }
  }
  function adjustTextRowNodeCount(rows) {
    let r = textEl.children.length;
    if (r < rows) {
      const frag = document.createDocumentFragment();
      while (r < rows) {
        const row = getNewRow();
        row.style.setProperty("--row", r);
        frag.appendChild(row);
        r += 1;
      }
      textEl.appendChild(frag);
    }
    while (textEl.children.length > rows) {
      const row = textEl.lastElementChild;
      textEl.removeChild(row);
      textRowPool.push(row);
    }
  }
  function adjustSymbolRowNodeCount(rows) {
    let r = vectorSymbolRowsEl.children.length;
    if (r < rows) {
      const frag = document.createDocumentFragment();
      while (r < rows) {
        const row = getNewSymbolRow();
        row.setAttribute("transform", `translate(0 ${r})`);
        frag.appendChild(row);
        r += 1;
      }
      vectorSymbolRowsEl.appendChild(frag);
    }
    while (vectorSymbolRowsEl.children.length > rows) {
      const row = vectorSymbolRowsEl.lastElementChild;
      vectorSymbolRowsEl.removeChild(row);
      vectorSymbolRowPool.push(row);
    }
  }
  function getNewRow() {
    let row = textRowPool.pop();
    if (row === undefined) {
      row = document.createElement("span");
      row.className = "ap-line";
    }
    return row;
  }
  function getNewSymbolRow() {
    let row = vectorSymbolRowPool.pop();
    if (row === undefined) {
      row = document.createElementNS(SVG_NS, "g");
      row.setAttribute("class", "ap-symbol-line");
    }
    return row;
  }
  function createVectorSymbolNode(codepoint, column, fg, blink) {
    if (!ensureVectorSymbolDef(codepoint)) {
      return null;
    }
    const isPowerline = POWERLINE_SYMBOLS.has(codepoint);
    const symbolX = isPowerline ? column - POWERLINE_SYMBOL_NUDGE : column;
    const symbolWidth = isPowerline ? 1 + POWERLINE_SYMBOL_NUDGE * 2 : 1;
    const node = getVectorSymbolUse();
    node.setAttribute("href", `#sym-${codepoint}`);
    node.setAttribute("x", symbolX);
    node.setAttribute("y", 0);
    node.setAttribute("width", symbolWidth);
    node.setAttribute("height", "1");
    if (fg) {
      node.style.setProperty("color", fg);
    } else {
      node.style.removeProperty("color");
    }
    if (blink) {
      node.classList.add("ap-blink");
    } else {
      node.classList.remove("ap-blink");
    }
    return node;
  }
  function recycleVectorSymbolUses(row) {
    while (row.firstChild) {
      const child = row.firstChild;
      row.removeChild(child);
      vectorSymbolUsePool.push(child);
    }
  }
  function getVectorSymbolUse() {
    let node = vectorSymbolUsePool.pop();
    if (node === undefined) {
      node = document.createElementNS(SVG_NS, "use");
    }
    return node;
  }
  function ensureVectorSymbolDef(codepoint) {
    const content = getVectorSymbolDef(codepoint);
    if (!content) {
      return false;
    }
    if (vectorSymbolDefCache.has(codepoint)) {
      return true;
    }
    const id = `sym-${codepoint}`;
    const symbol = document.createElementNS(SVG_NS, "symbol");
    symbol.setAttribute("id", id);
    symbol.setAttribute("viewBox", "0 0 1 1");
    symbol.setAttribute("preserveAspectRatio", "none");
    symbol.setAttribute("overflow", "visible");
    symbol.innerHTML = content;
    vectorSymbolDefsEl.appendChild(symbol);
    vectorSymbolDefCache.add(codepoint);
    return true;
  }
  return (() => {
    var _el$ = _tmpl$$f(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.firstChild,
      _el$5 = _el$4.nextSibling,
      _el$6 = _el$3.nextSibling;
    var _ref$ = el;
    typeof _ref$ === "function" ? use(_ref$, _el$) : el = _el$;
    var _ref$2 = canvasEl;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : canvasEl = _el$2;
    var _ref$3 = vectorSymbolsEl;
    typeof _ref$3 === "function" ? use(_ref$3, _el$3) : vectorSymbolsEl = _el$3;
    var _ref$4 = vectorSymbolDefsEl;
    typeof _ref$4 === "function" ? use(_ref$4, _el$4) : vectorSymbolDefsEl = _el$4;
    var _ref$5 = vectorSymbolRowsEl;
    typeof _ref$5 === "function" ? use(_ref$5, _el$5) : vectorSymbolRowsEl = _el$5;
    var _ref$6 = textEl;
    typeof _ref$6 === "function" ? use(_ref$6, _el$6) : textEl = _el$6;
    createRenderEffect(_p$ => {
      var _v$ = style$1(),
        _v$2 = `0 0 ${size().cols} ${size().rows}`,
        _v$3 = !!blinkOn(),
        _v$4 = !!blinkOn();
      _p$.e = style(_el$, _v$, _p$.e);
      _v$2 !== _p$.t && setAttribute(_el$3, "viewBox", _p$.t = _v$2);
      _v$3 !== _p$.a && _el$3.classList.toggle("ap-blink", _p$.a = _v$3);
      _v$4 !== _p$.o && _el$6.classList.toggle("ap-blink", _p$.o = _v$4);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined
    });
    return _el$;
  })();
};
function buildTheme(theme, adaptivePalette = false) {
  return {
    fg: theme.foreground,
    bg: theme.background,
    palette: adaptivePalette ? generate256Palette(theme.palette, theme.background, theme.foreground) : generateFixed256Palette(theme.palette)
  };
}
function getCssTheme(el) {
  const style = getComputedStyle(el);
  const foreground = normalizeHexColor(style.getPropertyValue("--term-color-foreground"), FALLBACK_THEME.foreground);
  const background = normalizeHexColor(style.getPropertyValue("--term-color-background"), FALLBACK_THEME.background);
  const palette = [];
  for (let i = 0; i < 16; i++) {
    const fallback = i >= 8 ? palette[i - 8] : FALLBACK_THEME.palette[i];
    palette[i] = normalizeHexColor(style.getPropertyValue(`--term-color-${i}`), fallback);
  }
  return {
    foreground,
    background,
    palette
  };
}
function generate256Palette(base16, bg, fg) {
  const bgLab = hexToOklab(bg);
  const fgLab = hexToOklab(fg);
  const c100 = hexToOklab(base16[1]);
  const c010 = hexToOklab(base16[2]);
  const c110 = hexToOklab(base16[3]);
  const c001 = hexToOklab(base16[4]);
  const c101 = hexToOklab(base16[5]);
  const c011 = hexToOklab(base16[6]);
  const palette = [...base16];

  // 216 color cube range

  for (let r = 0; r < 6; r += 1) {
    const tR = r / 5;
    const c0 = lerpOklab(tR, bgLab, c100);
    const c1 = lerpOklab(tR, c010, c110);
    const c2 = lerpOklab(tR, c001, c101);
    const c3 = lerpOklab(tR, c011, fgLab);
    for (let g = 0; g < 6; g += 1) {
      const tG = g / 5;
      const c4 = lerpOklab(tG, c0, c1);
      const c5 = lerpOklab(tG, c2, c3);
      for (let b = 0; b < 6; b += 1) {
        const tB = b / 5;
        const c6 = lerpOklab(tB, c4, c5);
        palette.push(oklabToHex(c6));
      }
    }
  }

  // grayscale range

  for (let i = 0; i < 24; i += 1) {
    const t = (i + 1) / 25;
    palette.push(oklabToHex(lerpOklab(t, bgLab, fgLab)));
  }
  return palette;
}
function generateFixed256Palette(base16) {
  const palette = [...base16];
  const levels = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff];

  // 216 color cube range

  for (let r = 0; r < 6; r += 1) {
    for (let g = 0; g < 6; g += 1) {
      for (let b = 0; b < 6; b += 1) {
        palette.push(rgbToHex(levels[r], levels[g], levels[b]));
      }
    }
  }

  // grayscale range

  for (let i = 0; i < 24; i += 1) {
    const level = 8 + i * 10;
    palette.push(rgbToHex(level, level, level));
  }
  return palette;
}
function drawBlockGlyph(ctx, codepoint, x, y) {
  const unitX = BLOCK_H_RES / 8;
  const unitY = BLOCK_V_RES / 8;
  const halfX = BLOCK_H_RES / 2;
  const halfY = BLOCK_V_RES / 2;
  const sextantX = BLOCK_H_RES / 2;
  const sextantY = BLOCK_V_RES / 3;
  switch (codepoint) {
    case 0x2503:
      // box drawings heavy vertical (https://symbl.cc/en/2503/)
      ctx.fillRect(x + 3, y, 2, BLOCK_V_RES);
      break;
    case 0x2579:
      // box drawings heavy up (https://symbl.cc/en/2579/)
      ctx.fillRect(x + 3, y, 2, halfY);
      break;
    case 0x257b:
      // box drawings heavy down (https://symbl.cc/en/257B/)
      ctx.fillRect(x + 3, y + halfY, 2, halfY);
      break;
    case 0x2580:
      // upper half block (https://symbl.cc/en/2580/)
      ctx.fillRect(x, y, BLOCK_H_RES, halfY);
      break;
    case 0x2581:
      // lower one eighth block (https://symbl.cc/en/2581/)
      ctx.fillRect(x, y + unitY * 7, BLOCK_H_RES, unitY);
      break;
    case 0x2582:
      // lower one quarter block (https://symbl.cc/en/2582/)
      ctx.fillRect(x, y + unitY * 6, BLOCK_H_RES, unitY * 2);
      break;
    case 0x2583:
      // lower three eighths block (https://symbl.cc/en/2583/)
      ctx.fillRect(x, y + unitY * 5, BLOCK_H_RES, unitY * 3);
      break;
    case 0x2584:
      // lower half block (https://symbl.cc/en/2584/)
      ctx.fillRect(x, y + halfY, BLOCK_H_RES, halfY);
      break;
    case 0x2585:
      // lower five eighths block (https://symbl.cc/en/2585/)
      ctx.fillRect(x, y + unitY * 3, BLOCK_H_RES, unitY * 5);
      break;
    case 0x2586:
      // lower three quarters block (https://symbl.cc/en/2586/)
      ctx.fillRect(x, y + unitY * 2, BLOCK_H_RES, unitY * 6);
      break;
    case 0x2587:
      // lower seven eighths block (https://symbl.cc/en/2587/)
      ctx.fillRect(x, y + unitY, BLOCK_H_RES, unitY * 7);
      break;
    case 0x2588:
      // full block (https://symbl.cc/en/2588/)
      ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
      break;
    case 0x25a0:
      // black square (https://symbl.cc/en/25A0/)
      ctx.fillRect(x, y + unitY * 2, BLOCK_H_RES, unitY * 4);
      break;
    case 0x2589:
      // left seven eighths block (https://symbl.cc/en/2589/)
      ctx.fillRect(x, y, unitX * 7, BLOCK_V_RES);
      break;
    case 0x258a:
      // left three quarters block (https://symbl.cc/en/258A/)
      ctx.fillRect(x, y, unitX * 6, BLOCK_V_RES);
      break;
    case 0x258b:
      // left five eighths block (https://symbl.cc/en/258B/)
      ctx.fillRect(x, y, unitX * 5, BLOCK_V_RES);
      break;
    case 0x258c:
      // left half block (https://symbl.cc/en/258C/)
      ctx.fillRect(x, y, halfX, BLOCK_V_RES);
      break;
    case 0x258d:
      // left three eighths block (https://symbl.cc/en/258D/)
      ctx.fillRect(x, y, unitX * 3, BLOCK_V_RES);
      break;
    case 0x258e:
      // left one quarter block (https://symbl.cc/en/258E/)
      ctx.fillRect(x, y, unitX * 2, BLOCK_V_RES);
      break;
    case 0x258f:
      // left one eighth block (https://symbl.cc/en/258F/)
      ctx.fillRect(x, y, unitX, BLOCK_V_RES);
      break;
    case 0x2590:
      // right half block (https://symbl.cc/en/2590/)
      ctx.fillRect(x + halfX, y, halfX, BLOCK_V_RES);
      break;
    case 0x2591:
      // light shade (https://symbl.cc/en/2591/)
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
      ctx.restore();
      break;
    case 0x2592:
      // medium shade (https://symbl.cc/en/2592/)
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
      ctx.restore();
      break;
    case 0x2593:
      // dark shade (https://symbl.cc/en/2593/)
      ctx.save();
      ctx.globalAlpha = 0.75;
      ctx.fillRect(x, y, BLOCK_H_RES, BLOCK_V_RES);
      ctx.restore();
      break;
    case 0x2594:
      // upper one eighth block (https://symbl.cc/en/2594/)
      ctx.fillRect(x, y, BLOCK_H_RES, unitY);
      break;
    case 0x2595:
      // right one eighth block (https://symbl.cc/en/2595/)
      ctx.fillRect(x + unitX * 7, y, unitX, BLOCK_V_RES);
      break;
    case 0x2596:
      // quadrant lower left (https://symbl.cc/en/2596/)
      ctx.fillRect(x, y + halfY, halfX, halfY);
      break;
    case 0x2597:
      // quadrant lower right (https://symbl.cc/en/2597/)
      ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
      break;
    case 0x2598:
      // quadrant upper left (https://symbl.cc/en/2598/)
      ctx.fillRect(x, y, halfX, halfY);
      break;
    case 0x2599:
      // quadrant upper left and lower left and lower right (https://symbl.cc/en/2599/)
      ctx.fillRect(x, y, halfX, BLOCK_V_RES);
      ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
      break;
    case 0x259a:
      // quadrant upper left and lower right (https://symbl.cc/en/259A/)
      ctx.fillRect(x, y, halfX, halfY);
      ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
      break;
    case 0x259b:
      // quadrant upper left and upper right and lower left (https://symbl.cc/en/259B/)
      ctx.fillRect(x, y, BLOCK_H_RES, halfY);
      ctx.fillRect(x, y + halfY, halfX, halfY);
      break;
    case 0x259c:
      // quadrant upper left and upper right and lower right (https://symbl.cc/en/259C/)
      ctx.fillRect(x, y, BLOCK_H_RES, halfY);
      ctx.fillRect(x + halfX, y + halfY, halfX, halfY);
      break;
    case 0x259d:
      // quadrant upper right (https://symbl.cc/en/259D/)
      ctx.fillRect(x + halfX, y, halfX, halfY);
      break;
    case 0x259e:
      // quadrant upper right and lower left (https://symbl.cc/en/259E/)
      ctx.fillRect(x + halfX, y, halfX, halfY);
      ctx.fillRect(x, y + halfY, halfX, halfY);
      break;
    case 0x259f:
      // quadrant upper right and lower left and lower right (https://symbl.cc/en/259F/)
      ctx.fillRect(x + halfX, y, halfX, BLOCK_V_RES);
      ctx.fillRect(x, y + halfY, halfX, halfY);
      break;
    case 0x1fb00:
      // sextant-1: upper left (https://symbl.cc/en/1FB00/)
      ctx.fillRect(x, y, sextantX, sextantY);
      break;
    case 0x1fb01:
      // sextant-2: upper right (https://symbl.cc/en/1FB01/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      break;
    case 0x1fb02:
      // sextant-12: upper one third (https://symbl.cc/en/1FB02/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      break;
    case 0x1fb03:
      // sextant-3: middle left (https://symbl.cc/en/1FB03/)
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb04:
      // sextant-13: top-left and middle-left filled (https://symbl.cc/en/1FB04/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb05:
      // sextant-23: upper right and middle left (https://symbl.cc/en/1FB05/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb06:
      // sextant-123: upper one third and middle left (https://symbl.cc/en/1FB06/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb07:
      // sextant-4: middle right (https://symbl.cc/en/1FB07/)
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb08:
      // sextant-14: upper left and middle right (https://symbl.cc/en/1FB08/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb09:
      // sextant-24: top-right and middle-right filled (https://symbl.cc/en/1FB09/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb0a:
      // sextant-124: upper one third and middle right (https://symbl.cc/en/1FB0A/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb0b:
      // sextant-34: middle one third (https://symbl.cc/en/1FB0B/)
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      break;
    case 0x1fb0c:
      // sextant-134: upper left, middle left and middle right (https://symbl.cc/en/1FB0C/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      break;
    case 0x1fb0d:
      // sextant-234: upper right and middle one third (https://symbl.cc/en/1FB0D/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      break;
    case 0x1fb0e:
      // sextant-1234: top and middle rows filled (https://symbl.cc/en/1FB0E/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      break;
    case 0x1fb0f:
      // sextant-5: lower left (https://symbl.cc/en/1FB0F/)
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb10:
      // sextant-15: upper left and lower left (https://symbl.cc/en/1FB10/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb11:
      // sextant-25: upper right and lower left (https://symbl.cc/en/1FB11/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb12:
      // sextant-125: upper one third and lower left (https://symbl.cc/en/1FB12/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb13:
      // sextant-35: middle left and lower left (https://symbl.cc/en/1FB13/)
      ctx.fillRect(x, y + sextantY, sextantX, sextantY * 2);
      break;
    case 0x1fb14:
      // sextant-235: upper right and left column lower two thirds (https://symbl.cc/en/1FB14/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY * 2);
      break;
    case 0x1fb15:
      // sextant-1235: upper one third and left column lower two thirds (https://symbl.cc/en/1FB15/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY * 2);
      break;
    case 0x1fb16:
      // sextant-45: middle right and lower left (https://symbl.cc/en/1FB16/)
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb17:
      // sextant-145: upper left, middle right and lower left (https://symbl.cc/en/1FB17/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb18:
      // sextant-245: right column upper two thirds and lower left (https://symbl.cc/en/1FB18/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY * 2);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb19:
      // sextant-1245: upper one third, middle right and lower left (https://symbl.cc/en/1FB19/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb1a:
      // sextant-345: middle one third and lower left (https://symbl.cc/en/1FB1A/)
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb1b:
      // sextant-1345: left column and middle right (https://symbl.cc/en/1FB1B/)
      ctx.fillRect(x, y, sextantX, sextantY * 3);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      break;
    case 0x1fb1c:
      // sextant-2345: upper right, middle one third and lower left (https://symbl.cc/en/1FB1C/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb1d:
      // sextant-12345: upper two thirds and lower left (https://symbl.cc/en/1FB1D/)
      ctx.fillRect(x, y, sextantX * 2, sextantY * 2);
      ctx.fillRect(x, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb1e:
      // sextant-6: lower right (https://symbl.cc/en/1FB1E/)
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb1f:
      // sextant-16: upper left and lower right (https://symbl.cc/en/1FB1F/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb20:
      // sextant-26: upper right and lower right (https://symbl.cc/en/1FB20/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb21:
      // sextant-126: upper one third and lower right (https://symbl.cc/en/1FB21/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb22:
      // sextant-36: middle left and lower right (https://symbl.cc/en/1FB22/)
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb23:
      // sextant-136: upper left, middle left and lower right (https://symbl.cc/en/1FB23/)
      ctx.fillRect(x, y, sextantX, sextantY * 2);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb24:
      // sextant-236: upper right, middle left and lower right (https://symbl.cc/en/1FB24/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb25:
      // sextant-1236: upper one third, middle left and lower right (https://symbl.cc/en/1FB25/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb26:
      // sextant-46: middle right and lower right (https://symbl.cc/en/1FB26/)
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
      break;
    case 0x1fb27:
      // sextant-146: upper left and right column lower two thirds (https://symbl.cc/en/1FB27/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
      break;
    case 0x1fb28:
      // sextant-1246: upper one third and right column lower two thirds (https://symbl.cc/en/1FB28/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
      break;
    case 0x1fb29:
      // sextant-346: middle one third and lower right (https://symbl.cc/en/1FB29/)
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb2a:
      // sextant-1346: left column upper two thirds and right column lower two thirds (https://symbl.cc/en/1FB2A/)
      ctx.fillRect(x, y, sextantX, sextantY * 2);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY * 2);
      break;
    case 0x1fb2b:
      // sextant-2346: upper right, middle one third and lower right (https://symbl.cc/en/1FB2B/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb2c:
      // sextant-12346: upper two thirds and lower right (https://symbl.cc/en/1FB2C/)
      ctx.fillRect(x, y, sextantX * 2, sextantY * 2);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb2d:
      // sextant-56: lower one third (https://symbl.cc/en/1FB2D/)
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb2e:
      // sextant-156: upper left and lower one third (https://symbl.cc/en/1FB2E/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb2f:
      // sextant-256: upper right and lower one third (https://symbl.cc/en/1FB2F/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb30:
      // sextant-1256: upper one third and lower one third (https://symbl.cc/en/1FB30/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb31:
      // sextant-356: middle left and lower one third (https://symbl.cc/en/1FB31/)
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb32:
      // sextant-1356: left column upper two thirds and lower one third (https://symbl.cc/en/1FB32/)
      ctx.fillRect(x, y, sextantX, sextantY * 2);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb33:
      // sextant-2356: upper right, middle left and lower one third (https://symbl.cc/en/1FB33/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb34:
      // sextant-12356: upper one third, middle left and lower one third (https://symbl.cc/en/1FB34/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb35:
      // sextant-456: middle right and lower one third (https://symbl.cc/en/1FB35/)
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb36:
      // sextant-1456: upper left, middle right and lower one third (https://symbl.cc/en/1FB36/)
      ctx.fillRect(x, y, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb37:
      // sextant-2456: right column upper two thirds and lower one third (https://symbl.cc/en/1FB37/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY * 2);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb38:
      // sextant-12456: upper one third, middle right and lower one third (https://symbl.cc/en/1FB38/)
      ctx.fillRect(x, y, sextantX * 2, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY * 2, sextantX * 2, sextantY);
      break;
    case 0x1fb39:
      // sextant-3456: middle one third and lower one third (https://symbl.cc/en/1FB39/)
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY * 2);
      break;
    case 0x1fb3a:
      // sextant-13456: left column and lower one third (https://symbl.cc/en/1FB3A/)
      ctx.fillRect(x, y, sextantX, sextantY * 3);
      ctx.fillRect(x + sextantX, y + sextantY, sextantX, sextantY);
      ctx.fillRect(x + sextantX, y + sextantY * 2, sextantX, sextantY);
      break;
    case 0x1fb3b:
      // sextant-23456: upper right and lower two thirds (https://symbl.cc/en/1FB3B/)
      ctx.fillRect(x + sextantX, y, sextantX, sextantY);
      ctx.fillRect(x, y + sextantY, sextantX * 2, sextantY * 2);
      break;
  }
}
const SYMBOL_STROKE = 0.05;
const CELL_RATIO = 9.0375 / 20;
function getVectorSymbolDef(codepoint) {
  const stroke = `stroke="currentColor" stroke-width="${SYMBOL_STROKE}" stroke-linejoin="miter" stroke-linecap="square"`;
  const strokeButt = `stroke="currentColor" stroke-width="${SYMBOL_STROKE}" stroke-linejoin="miter" stroke-linecap="butt"`;
  const stroked = d => `<path d="${d}" fill="none" ${stroke}/>`;
  const third = 1 / 3;
  const twoThirds = 2 / 3;
  switch (codepoint) {
    // ◢ - black lower right triangle (https://symbl.cc/en/25E2/)
    case 0x25e2:
      return '<path d="M1,1 L1,0 L0,1 Z" fill="currentColor"/>' + stroked("M1,1 L1,0 L0,1 Z");

    // ◣ - black lower left triangle (https://symbl.cc/en/25E3/)
    case 0x25e3:
      return '<path d="M0,1 L0,0 L1,1 Z" fill="currentColor"/>' + stroked("M0,1 L0,0 L1,1 Z");

    // ◤ - black upper left triangle (https://symbl.cc/en/25E4/)
    case 0x25e4:
      return '<path d="M0,0 L1,0 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L1,0 L0,1 Z");

    // ◥ - black upper right triangle (https://symbl.cc/en/25E5/)
    case 0x25e5:
      return '<path d="M1,0 L1,1 L0,0 Z" fill="currentColor"/>' + stroked("M1,0 L1,1 L0,0 Z");
    case 0x268f:
      {
        // ⚏ - digram for greater yin (https://symbl.cc/en/268F/)
        const horizontalGap = 0.15;
        const verticalGap = 0.2;
        const lineHeight = 0.17;
        const halfHorizontalGap = horizontalGap / 2;
        const halfVerticalGap = verticalGap / 2;
        const toViewBoxY = offset => 0.5 + offset * CELL_RATIO;
        const leftX1 = 0.5 - halfHorizontalGap;
        const rightX0 = 0.5 + halfHorizontalGap;
        const rightX1 = 1 + 0.02; // slight overdraw
        const topY0 = toViewBoxY(-halfVerticalGap - lineHeight);
        const topY1 = toViewBoxY(-halfVerticalGap);
        const bottomY0 = toViewBoxY(halfVerticalGap);
        const bottomY1 = toViewBoxY(halfVerticalGap + lineHeight);
        const rect = (x0, x1, y0, y1) => `M${x0},${y0} L${x1},${y0} L${x1},${y1} L${x0},${y1} Z`;
        return `<path d="${rect(0, leftX1, topY0, topY1)} ${rect(rightX0, rightX1, topY0, topY1)} ${rect(0, leftX1, bottomY0, bottomY1)} ${rect(rightX0, rightX1, bottomY0, bottomY1)}" fill="currentColor"/>`;
      }

    // 🬼 - lower left block diagonal lower middle left to lower centre (https://symbl.cc/en/1FB3C/)
    case 0x1fb3c:
      return `<path d="M0,${twoThirds} L0,1 L0.5,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L0.5,1 Z`);

    // 🬽 - lower left block diagonal lower middle left to lower right (https://symbl.cc/en/1FB3D/)
    case 0x1fb3d:
      return `<path d="M0,${twoThirds} L0,1 L1,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 Z`);

    // 🬾 - lower left block diagonal upper middle left to lower centre (https://symbl.cc/en/1FB3E/)
    case 0x1fb3e:
      return `<path d="M0,${third} L0.5,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L0.5,1 L0,1 Z`);

    // 🬿 - lower left block diagonal upper middle left to lower right (https://symbl.cc/en/1FB3F/)
    case 0x1fb3f:
      return `<path d="M0,${third} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L1,1 L0,1 Z`);

    // 🭀 - lower left block diagonal upper left to lower centre (https://symbl.cc/en/1FB40/)
    case 0x1fb40:
      return '<path d="M0,0 L0.5,1 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L0.5,1 L0,1 Z");

    // 🭁 - lower right block diagonal upper middle left to upper centre (https://symbl.cc/en/1FB41/)
    case 0x1fb41:
      return `<path d="M0,${third} L0,1 L1,1 L1,0 L0.5,0 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,1 L1,1 L1,0 L0.5,0 Z`);

    // 🭂 - lower right block diagonal upper middle left to upper right (https://symbl.cc/en/1FB42/)
    case 0x1fb42:
      return `<path d="M0,${third} L0,1 L1,1 L1,0 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,1 L1,1 L1,0 Z`);

    // 🭃 - lower right block diagonal lower middle left to upper centre (https://symbl.cc/en/1FB43/)
    case 0x1fb43:
      return `<path d="M0,${twoThirds} L0,1 L1,1 L1,0 L0.5,0 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 L1,0 L0.5,0 Z`);

    // 🭄 - lower right block diagonal lower middle left to upper right (https://symbl.cc/en/1FB44/)
    case 0x1fb44:
      return `<path d="M0,${twoThirds} L0,1 L1,1 L1,0 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 L1,0 Z`);

    // 🭅 - lower right block diagonal lower left to upper centre (https://symbl.cc/en/1FB45/)
    case 0x1fb45:
      return '<path d="M0.5,0 L1,0 L1,1 L0,1 Z" fill="currentColor"/>' + stroked("M0.5,0 L1,0 L1,1 L0,1 Z");

    // 🭆 - lower right block diagonal lower middle left to upper middle right (https://symbl.cc/en/1FB46/)
    case 0x1fb46:
      return `<path d="M0,${twoThirds} L0,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,1 L1,1 L1,${third} Z`);

    // 🭇 - lower right block diagonal lower centre to lower middle right (https://symbl.cc/en/1FB47/)
    case 0x1fb47:
      return `<path d="M0.5,1 L1,1 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0.5,1 L1,1 L1,${twoThirds} Z`);

    // 🭈 - lower right block diagonal lower left to lower middle right (https://symbl.cc/en/1FB48/)
    case 0x1fb48:
      return `<path d="M0,1 L1,1 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,1 L1,1 L1,${twoThirds} Z`);

    // 🭉 - lower right block diagonal lower centre to upper middle right (https://symbl.cc/en/1FB49/)
    case 0x1fb49:
      return `<path d="M0.5,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0.5,1 L1,1 L1,${third} Z`);

    // 🭊 - lower right block diagonal lower left to upper middle right (https://symbl.cc/en/1FB4A/)
    case 0x1fb4a:
      return `<path d="M0,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,1 L1,1 L1,${third} Z`);

    // 🭋 - lower right block diagonal lower centre to upper right (https://symbl.cc/en/1FB4B/)
    case 0x1fb4b:
      return '<path d="M0.5,1 L1,0 L1,1 Z" fill="currentColor"/>' + stroked("M0.5,1 L1,0 L1,1 Z");

    // 🭌 - lower left block diagonal upper centre to upper middle right (https://symbl.cc/en/1FB4C/)
    case 0x1fb4c:
      return `<path d="M0,0 L0.5,0 L1,${third} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L0.5,0 L1,${third} L1,1 L0,1 Z`);

    // 🭍 - lower left block diagonal upper left to upper middle right (https://symbl.cc/en/1FB4D/)
    case 0x1fb4d:
      return `<path d="M0,0 L0,1 L1,1 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,0 L0,1 L1,1 L1,${third} Z`);

    // 🭎 - lower left block diagonal upper centre to lower middle right (https://symbl.cc/en/1FB4E/)
    case 0x1fb4e:
      return `<path d="M0,0 L0.5,0 L1,${twoThirds} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L0.5,0 L1,${twoThirds} L1,1 L0,1 Z`);

    // 🭏 - lower left block diagonal upper left to lower middle right (https://symbl.cc/en/1FB4F/)
    case 0x1fb4f:
      return `<path d="M0,0 L1,${twoThirds} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,${twoThirds} L1,1 L0,1 Z`);

    // 🭐 - lower left block diagonal upper centre to lower right (https://symbl.cc/en/1FB50/)
    case 0x1fb50:
      return '<path d="M0,0 L0.5,0 L1,1 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L0.5,0 L1,1 L0,1 Z");

    // 🭑 - lower left block diagonal upper middle left to lower middle right (https://symbl.cc/en/1FB51/)
    case 0x1fb51:
      return `<path d="M0,${third} L1,${twoThirds} L1,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L1,${twoThirds} L1,1 L0,1 Z`);

    // 🭒 - upper right block diagonal lower middle left to lower centre (https://symbl.cc/en/1FB52/)
    case 0x1fb52:
      return `<path d="M0,${twoThirds} L0,0 L1,0 L1,1 L0.5,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,0 L1,0 L1,1 L0.5,1 Z`);

    // 🭓 - upper right block diagonal lower middle left to lower right (https://symbl.cc/en/1FB53/)
    case 0x1fb53:
      return `<path d="M0,${twoThirds} L0,0 L1,0 L1,1 Z" fill="currentColor"/>` + stroked(`M0,${twoThirds} L0,0 L1,0 L1,1 Z`);

    // 🭔 - upper right block diagonal upper middle left to lower centre (https://symbl.cc/en/1FB54/)
    case 0x1fb54:
      return `<path d="M0,${third} L0,0 L1,0 L1,1 L0.5,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,0 L1,0 L1,1 L0.5,1 Z`);

    // 🭕 - upper right block diagonal upper middle left to lower right (https://symbl.cc/en/1FB55/)
    case 0x1fb55:
      return `<path d="M0,${third} L0,0 L1,0 L1,1 Z" fill="currentColor"/>` + stroked(`M0,${third} L0,0 L1,0 L1,1 Z`);

    // 🭖 - upper right block diagonal upper left to lower centre (https://symbl.cc/en/1FB56/)
    case 0x1fb56:
      return '<path d="M0,0 L1,0 L1,1 L0.5,1 Z" fill="currentColor"/>' + stroked("M0,0 L1,0 L1,1 L0.5,1 Z");

    // 🭗 - upper left block diagonal upper middle left to upper centre (https://symbl.cc/en/1FB57/)
    case 0x1fb57:
      return `<path d="M0,${third} L0.5,0 L0,0 Z" fill="currentColor"/>` + stroked(`M0,${third} L0.5,0 L0,0 Z`);

    // 🭘 - upper left block diagonal upper middle left to upper right (https://symbl.cc/en/1FB58/)
    case 0x1fb58:
      return `<path d="M0,0 L1,0 L0,${third} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L0,${third} Z`);

    // 🭙 - upper left block diagonal lower middle left to upper centre (https://symbl.cc/en/1FB59/)
    case 0x1fb59:
      return `<path d="M0,0 L0.5,0 L0,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L0.5,0 L0,${twoThirds} Z`);

    // 🭚 - upper left block diagonal lower middle left to upper right (https://symbl.cc/en/1FB5A/)
    case 0x1fb5a:
      return `<path d="M0,0 L1,0 L0,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L0,${twoThirds} Z`);

    // 🭛 - upper left block diagonal lower left to upper centre (https://symbl.cc/en/1FB5B/)
    case 0x1fb5b:
      return '<path d="M0,0 L0.5,0 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L0.5,0 L0,1 Z");

    // 🭜 - upper left block diagonal lower middle left to upper middle right (https://symbl.cc/en/1FB5C/)
    case 0x1fb5c:
      return `<path d="M0,0 L1,0 L1,${third} L0,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} L0,${twoThirds} Z`);

    // 🭝 - upper left block diagonal lower centre to lower middle right (https://symbl.cc/en/1FB5D/)
    case 0x1fb5d:
      return `<path d="M0,0 L1,0 L1,${twoThirds} L0.5,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${twoThirds} L0.5,1 L0,1 Z`);

    // 🭞 - upper left block diagonal lower left to lower middle right (https://symbl.cc/en/1FB5E/)
    case 0x1fb5e:
      return `<path d="M0,0 L1,0 L1,${twoThirds} L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${twoThirds} L0,1 Z`);

    // 🭟 - upper left block diagonal lower centre to upper middle right (https://symbl.cc/en/1FB5F/)
    case 0x1fb5f:
      return `<path d="M0,0 L1,0 L1,${third} L0.5,1 L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} L0.5,1 L0,1 Z`);

    // 🭠 - upper left block diagonal lower left to upper middle right (https://symbl.cc/en/1FB60/)
    case 0x1fb60:
      return `<path d="M0,0 L1,0 L1,${third} L0,1 Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} L0,1 Z`);

    // 🭡 - upper left block diagonal lower centre to upper right (https://symbl.cc/en/1FB61/)
    case 0x1fb61:
      return '<path d="M0,0 L1,0 L0.5,1 L0,1 Z" fill="currentColor"/>' + stroked("M0,0 L1,0 L0.5,1 L0,1 Z");

    // 🭢 - upper right block diagonal upper centre to upper middle right (https://symbl.cc/en/1FB62/)
    case 0x1fb62:
      return `<path d="M0.5,0 L1,0 L1,${third} Z" fill="currentColor"/>` + stroked(`M0.5,0 L1,0 L1,${third} Z`);

    // 🭣 - upper right block diagonal upper left to upper middle right (https://symbl.cc/en/1FB63/)
    case 0x1fb63:
      return `<path d="M0,0 L1,0 L1,${third} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${third} Z`);

    // 🭤 - upper right block diagonal upper centre to lower middle right (https://symbl.cc/en/1FB64/)
    case 0x1fb64:
      return `<path d="M0.5,0 L1,0 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0.5,0 L1,0 L1,${twoThirds} Z`);

    // 🭥 - upper right block diagonal upper left to lower middle right (https://symbl.cc/en/1FB65/)
    case 0x1fb65:
      return `<path d="M0,0 L1,0 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,0 L1,0 L1,${twoThirds} Z`);

    // 🭦 - upper right block diagonal upper centre to lower right (https://symbl.cc/en/1FB66/)
    case 0x1fb66:
      return '<path d="M0.5,0 L1,0 L1,1 Z" fill="currentColor"/>' + stroked("M0.5,0 L1,0 L1,1 Z");

    // 🭧 - upper right block diagonal upper middle left to lower middle right (https://symbl.cc/en/1FB67/)
    case 0x1fb67:
      return `<path d="M0,${third} L0,0 L1,0 L1,${twoThirds} Z" fill="currentColor"/>` + stroked(`M0,${third} L0,0 L1,0 L1,${twoThirds} Z`);

    // 🭨 - upper and right and lower triangular three quarters block (https://symbl.cc/en/1FB68/)
    case 0x1fb68:
      return '<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M0,0 L0,1 L0.5,0.5 Z" fill="currentColor"/>' + `<path d="M0,0 L1,0 M0,1 L1,1 M1,0 L1,1" fill="none" ${stroke}/>` + `<path d="M0,0 L0.5,0.5 M0,1 L0.5,0.5" fill="none" ${strokeButt}/>`;

    // 🭩 - left and lower and right triangular three quarters block (https://symbl.cc/en/1FB69/)
    case 0x1fb69:
      return '<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M0,0 L1,0 L0.5,0.5 Z" fill="currentColor"/>' + `<path d="M0,0 L0,1 M1,0 L1,1 M0,1 L1,1" fill="none" ${stroke}/>` + `<path d="M0,0 L0.5,0.5 M1,0 L0.5,0.5" fill="none" ${strokeButt}/>`;

    // 🭪 - upper and left and lower triangular three quarters block (https://symbl.cc/en/1FB6A/)
    case 0x1fb6a:
      return '<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M1,0 L1,1 L0.5,0.5 Z" fill="currentColor"/>' + `<path d="M0,0 L1,0 M0,1 L1,1 M0,0 L0,1" fill="none" ${stroke}/>` + `<path d="M1,0 L0.5,0.5 M1,1 L0.5,0.5" fill="none" ${strokeButt}/>`;

    // 🭫 - left and upper and right triangular three quarters block (https://symbl.cc/en/1FB6B/)
    case 0x1fb6b:
      return '<path fill-rule="evenodd" d="M0,0 L1,0 L1,1 L0,1 Z M0,1 L1,1 L0.5,0.5 Z" fill="currentColor"/>' + `<path d="M0,0 L1,0 M0,0 L0,1 M1,0 L1,1" fill="none" ${stroke}/>` + `<path d="M0,1 L0.5,0.5 M1,1 L0.5,0.5" fill="none" ${strokeButt}/>`;

    // 🭬 - left triangular one quarter block (https://symbl.cc/en/1FB6C/)
    case 0x1fb6c:
      return '<path d="M0,0 L0,1 L0.5,0.5 Z" fill="currentColor"/>' + stroked("M0,0 L0,1 L0.5,0.5 Z");

    // powerline right full triangle (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b0:
      return '<path d="M0,0 L1,0.5 L0,1 Z" fill="currentColor"/>';

    // powerline right bracket (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b1:
      return '<path d="M0,0 L1,0.5 L0,1" fill="none" stroke="currentColor" stroke-width="0.07" stroke-linejoin="miter"/>';

    // powerline left full triangle (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b2:
      return '<path d="M1,0 L0,0.5 L1,1 Z" fill="currentColor"/>';

    // powerline left bracket (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b3:
      return '<path d="M1,0 L0,0.5 L1,1" fill="none" stroke="currentColor" stroke-width="0.07" stroke-linejoin="miter"/>';

    // nf-ple-right_half_circle_thick (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b4:
      return '<path d="M0,0 A1,0.5 0 0 1 0,1 Z" fill="currentColor"/>';

    // nf-ple-right_half_circle_thin (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b5:
      return '<path d="M0,0 A1,0.5 0 0 1 0,1" fill="none" stroke="currentColor" stroke-width="0.07"/>';

    // nf-ple-left_half_circle_thick (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b6:
      return '<path d="M1,0 A1,0.5 0 0 0 1,1 Z" fill="currentColor"/>';

    // nf-ple-left_half_circle_thin (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b7:
      return '<path d="M1,0 A1,0.5 0 0 0 1,1" fill="none" stroke="currentColor" stroke-width="0.07"/>';

    // nf-ple-lower_left_triangle (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b8:
      return '<path d="M0,1 L0,0 L1,1 Z" fill="currentColor"/>';

    // nf-ple-backslash_separator (https://www.nerdfonts.com/cheat-sheet)
    // nf-ple-backslash_separator_redundant (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0b9:
    case 0xe0bf:
      return '<path d="M0,0 L1,1" fill="none" stroke="currentColor" stroke-width="0.07"/>';

    // nf-ple-lower_right_triangle (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0ba:
      return '<path d="M1,1 L1,0 L0,1 Z" fill="currentColor"/>';

    // nf-ple-forwardslash_separator (https://www.nerdfonts.com/cheat-sheet)
    // nf-ple-forwardslash_separator_redundant (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0bb:
    case 0xe0bd:
      return '<path d="M0,1 L1,0" fill="none" stroke="currentColor" stroke-width="0.07"/>';

    // nf-ple-upper_left_triangle (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0bc:
      return '<path d="M0,0 L1,0 L0,1 Z" fill="currentColor"/>';

    // nf-ple-upper_right_triangle (https://www.nerdfonts.com/cheat-sheet)
    case 0xe0be:
      return '<path d="M1,0 L1,1 L0,0 Z" fill="currentColor"/>';
    default:
      return null;
  }
}
const POWERLINE_SYMBOLS = new Set([0xe0b0, 0xe0b1, 0xe0b2, 0xe0b3, 0xe0b4, 0xe0b5, 0xe0b6, 0xe0b7, 0xe0b8, 0xe0b9, 0xe0ba, 0xe0bb, 0xe0bc, 0xe0bd, 0xe0be, 0xe0bf]);
const POWERLINE_SYMBOL_NUDGE = 0.02;
const FALLBACK_THEME = {
  foreground: "#000000",
  background: "#000000",
  palette: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"]
};

var _tmpl$$e = /*#__PURE__*/template(`<svg version=1.1 viewBox="0 0 12 12"class="ap-icon ap-icon-fullscreen-off"aria-hidden=true><path d="M7,5 L7,0 L9,2 L11,0 L12,1 L10,3 L12,5 Z"></path><path d="M5,7 L0,7 L2,9 L0,11 L1,12 L3,10 L5,12 Z">`);
var ExpandIcon = () => {
  return _tmpl$$e();
};

var _tmpl$$d = /*#__PURE__*/template(`<svg version=1.1 viewBox="6 8 14 16"class=ap-icon aria-hidden=true><path d="M0.938 8.313h22.125c0.5 0 0.938 0.438 0.938 0.938v13.5c0 0.5-0.438 0.938-0.938 0.938h-22.125c-0.5 0-0.938-0.438-0.938-0.938v-13.5c0-0.5 0.438-0.938 0.938-0.938zM1.594 22.063h20.813v-12.156h-20.813v12.156zM3.844 11.188h1.906v1.938h-1.906v-1.938zM7.469 11.188h1.906v1.938h-1.906v-1.938zM11.031 11.188h1.938v1.938h-1.938v-1.938zM14.656 11.188h1.875v1.938h-1.875v-1.938zM18.25 11.188h1.906v1.938h-1.906v-1.938zM5.656 15.031h1.938v1.938h-1.938v-1.938zM9.281 16.969v-1.938h1.906v1.938h-1.906zM12.875 16.969v-1.938h1.906v1.938h-1.906zM18.406 16.969h-1.938v-1.938h1.938v1.938zM16.531 20.781h-9.063v-1.906h9.063v1.906z">`);
var KeyboardIcon = () => {
  return _tmpl$$d();
};

var _tmpl$$c = /*#__PURE__*/template(`<svg version=1.1 viewBox="0 0 12 12"class=ap-icon aria-hidden=true><path d="M1,0 L4,0 L4,12 L1,12 Z"></path><path d="M8,0 L11,0 L11,12 L8,12 Z">`);
var PauseIcon = () => {
  return _tmpl$$c();
};

var _tmpl$$b = /*#__PURE__*/template(`<svg version=1.1 viewBox="0 0 12 12"class=ap-icon aria-hidden=true><path d="M1,0 L11,6 L1,12 Z">`);
var PlayIcon = () => {
  return _tmpl$$b();
};

var _tmpl$$a = /*#__PURE__*/template(`<svg version=1.1 viewBox="0 0 12 12"class="ap-icon ap-icon-fullscreen-on"aria-hidden=true><path d="M12,0 L7,0 L9,2 L7,4 L8,5 L10,3 L12,5 Z"></path><path d="M0,12 L0,7 L2,9 L4,7 L5,8 L3,10 L5,12 Z">`);
var ShrinkIcon = () => {
  return _tmpl$$a();
};

var _tmpl$$9 = /*#__PURE__*/template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor aria-hidden=true><path d="M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z"></path><path d="M14.329 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z">`);
var SpeakerOnIcon = () => {
  return _tmpl$$9();
};

var _tmpl$$8 = /*#__PURE__*/template(`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 20 20"fill=currentColor class=size-5 aria-hidden=true><path d="M10.047 3.062a.75.75 0 0 1 .453.688v12.5a.75.75 0 0 1-1.264.546L5.203 13H2.667a.75.75 0 0 1-.7-.48A6.985 6.985 0 0 1 1.5 10c0-.887.165-1.737.468-2.52a.75.75 0 0 1 .7-.48h2.535l4.033-3.796a.75.75 0 0 1 .811-.142ZM13.78 7.22a.75.75 0 1 0-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 0 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L16.56 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L15.5 8.94l-1.72-1.72Z">`);
var SpeakerOffIcon = () => {
  return _tmpl$$8();
};

var _tmpl$$7 = /*#__PURE__*/template(`<button class="ap-button ap-playback-button"type=button>`),
  _tmpl$2$2 = /*#__PURE__*/template(`<span class=ap-bar><span class="ap-gutter ap-gutter-empty"></span><span class="ap-gutter ap-gutter-full">`),
  _tmpl$3$1 = /*#__PURE__*/template(`<span class=ap-tooltip>Unmute (m)`),
  _tmpl$4$1 = /*#__PURE__*/template(`<span class=ap-tooltip>Mute (m)`),
  _tmpl$5$1 = /*#__PURE__*/template(`<button class="ap-button ap-speaker-button ap-tooltip-container"type=button aria-label="Mute / unmute">`),
  _tmpl$6$1 = /*#__PURE__*/template(`<div class=ap-control-bar><span class=ap-timer><span class=ap-time-elapsed></span><span class=ap-time-remaining></span></span><span class=ap-progressbar></span><button class="ap-button ap-kbd-button ap-tooltip-container"type=button aria-label="Show keyboard shortcuts"><span class=ap-tooltip>Keyboard shortcuts (?)</span></button><button class="ap-button ap-fullscreen-button ap-tooltip-container"type=button aria-label="Toggle fullscreen mode"><span class=ap-tooltip>Fullscreen (f)`),
  _tmpl$7$1 = /*#__PURE__*/template(`<span class="ap-marker-container ap-tooltip-container"><span class=ap-marker></span><span class=ap-tooltip>`);
function formatTime(seconds) {
  let s = Math.floor(seconds);
  const d = Math.floor(s / 86400);
  s %= 86400;
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  s %= 60;
  if (d > 0) {
    return `${zeroPad(d)}:${zeroPad(h)}:${zeroPad(m)}:${zeroPad(s)}`;
  } else if (h > 0) {
    return `${zeroPad(h)}:${zeroPad(m)}:${zeroPad(s)}`;
  } else {
    return `${zeroPad(m)}:${zeroPad(s)}`;
  }
}
function zeroPad(n) {
  return n < 10 ? `0${n}` : n.toString();
}
var ControlBar = props => {
  const currentTime = () => typeof props.currentTime === "number" ? formatTime(props.currentTime) : "--:--";
  const remainingTime = () => typeof props.remainingTime === "number" ? "-" + formatTime(props.remainingTime) : currentTime();
  const markers = createMemo(() => typeof props.duration === "number" ? props.markers.filter(m => m[0] < props.duration) : []);
  const markerPosition = m => `${m[0] / props.duration * 100}%`;
  const markerText = m => {
    if (m[1] === "") {
      return formatTime(m[0]);
    } else {
      return `${formatTime(m[0])} - ${m[1]}`;
    }
  };
  const isPastMarker = m => typeof props.currentTime === "number" ? m[0] <= props.currentTime : false;
  const gutterBarStyle = () => {
    return {
      transform: `scaleX(${props.progress || 0}`
    };
  };
  const calcPosition = e => {
    const barWidth = e.currentTarget.offsetWidth;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const pos = Math.max(0, mouseX / barWidth);
    return `${pos * 100}%`;
  };
  const [mouseDown, setMouseDown] = createSignal(false);
  // eslint-disable-next-line solid/reactivity -- called from event handlers only, reads the prop at call time
  const throttledSeek = throttle(pos => props.onSeekClick(pos), 50);
  const onMouseDown = e => {
    if (e._marker) return;
    if (e.altKey || e.shiftKey || e.metaKey || e.ctrlKey || e.button !== 0) return;
    setMouseDown(true);
    props.onSeekClick(calcPosition(e));
  };
  const onMove = e => {
    if (e.altKey || e.shiftKey || e.metaKey || e.ctrlKey) return;
    if (mouseDown()) {
      throttledSeek(calcPosition(e));
    }
  };
  const onDocumentMouseUp = () => {
    setMouseDown(false);
  };
  document.addEventListener("mouseup", onDocumentMouseUp);
  onCleanup(() => {
    document.removeEventListener("mouseup", onDocumentMouseUp);
  });
  return (() => {
    var _el$ = _tmpl$6$1(),
      _el$3 = _el$.firstChild,
      _el$4 = _el$3.firstChild,
      _el$5 = _el$4.nextSibling,
      _el$6 = _el$3.nextSibling,
      _el$11 = _el$6.nextSibling,
      _el$12 = _el$11.firstChild,
      _el$13 = _el$11.nextSibling,
      _el$14 = _el$13.firstChild;
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, createComponent(Show, {
      get when() {
        return props.isPausable;
      },
      get children() {
        var _el$2 = _tmpl$$7();
        _el$2.$$click = e => {
          e.preventDefault();
          props.onPlayClick(e);
        };
        insert(_el$2, createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                return props.isPlaying;
              },
              get children() {
                return createComponent(PauseIcon, {});
              }
            }), createComponent(Match, {
              when: true,
              get children() {
                return createComponent(PlayIcon, {});
              }
            })];
          }
        }));
        createRenderEffect(() => setAttribute(_el$2, "aria-label", props.isPlaying ? "Pause" : "Play"));
        return _el$2;
      }
    }), _el$3);
    insert(_el$4, currentTime);
    insert(_el$5, remainingTime);
    insert(_el$6, createComponent(Show, {
      get when() {
        return typeof props.progress === "number" || props.isSeekable;
      },
      get children() {
        var _el$7 = _tmpl$2$2(),
          _el$8 = _el$7.firstChild,
          _el$9 = _el$8.nextSibling;
        _el$7.$$mousemove = onMove;
        _el$7.$$mousedown = onMouseDown;
        insert(_el$7, createComponent(For, {
          get each() {
            return markers();
          },
          children: (m, i) => (() => {
            var _el$15 = _tmpl$7$1(),
              _el$16 = _el$15.firstChild,
              _el$17 = _el$16.nextSibling;
            _el$15.$$mousedown = e => {
              e._marker = true;
            };
            _el$15.$$click = e => {
              e.preventDefault();
              props.onSeekClick({
                marker: i()
              });
            };
            insert(_el$17, () => markerText(m));
            createRenderEffect(_p$ => {
              var _v$ = markerPosition(m),
                _v$2 = !!isPastMarker(m);
              _v$ !== _p$.e && setStyleProperty(_el$15, "left", _p$.e = _v$);
              _v$2 !== _p$.t && _el$16.classList.toggle("ap-marker-past", _p$.t = _v$2);
              return _p$;
            }, {
              e: undefined,
              t: undefined
            });
            return _el$15;
          })()
        }), null);
        createRenderEffect(_$p => style(_el$9, gutterBarStyle(), _$p));
        return _el$7;
      }
    }));
    insert(_el$, createComponent(Show, {
      get when() {
        return props.isMuted !== undefined;
      },
      get children() {
        var _el$0 = _tmpl$5$1();
        _el$0.$$click = e => {
          e.preventDefault();
          props.onMuteClick(e);
        };
        insert(_el$0, createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                return props.isMuted === true;
              },
              get children() {
                return [createComponent(SpeakerOffIcon, {}), _tmpl$3$1()];
              }
            }), createComponent(Match, {
              get when() {
                return props.isMuted === false;
              },
              get children() {
                return [createComponent(SpeakerOnIcon, {}), _tmpl$4$1()];
              }
            })];
          }
        }));
        return _el$0;
      }
    }), _el$11);
    _el$11.$$click = e => {
      e.preventDefault();
      props.onHelpClick(e);
    };
    insert(_el$11, createComponent(KeyboardIcon, {}), _el$12);
    _el$13.$$click = e => {
      e.preventDefault();
      props.onFullscreenClick(e);
    };
    insert(_el$13, createComponent(ShrinkIcon, {}), _el$14);
    insert(_el$13, createComponent(ExpandIcon, {}), _el$14);
    createRenderEffect(() => _el$.classList.toggle("ap-seekable", !!props.isSeekable));
    return _el$;
  })();
};
delegateEvents(["click", "mousedown", "mousemove"]);

var _tmpl$$6 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-error"><span>💥`);
var ErrorOverlay = () => {
  return _tmpl$$6();
};

var _tmpl$$5 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-loading"><span class=ap-loader>`);
var LoaderOverlay = () => {
  return _tmpl$$5();
};

var _tmpl$$4 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-info"><span>`);
var InfoOverlay = props => {
  return (() => {
    var _el$ = _tmpl$$4(),
      _el$2 = _el$.firstChild;
    insert(_el$2, () => props.message);
    createRenderEffect(() => _el$.classList.toggle("ap-was-playing", !!props.wasPlaying));
    return _el$;
  })();
};

var _tmpl$$3 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-start"><div class=ap-play-button><div><span><svg version=1.1 viewBox="0 0 1000.0 1000.0"class=ap-icon><defs><mask id=small-triangle-mask><rect width=100% height=100% fill=white></rect><polygon points="700.0 500.0, 400.00000000000006 326.7949192431122, 399.9999999999999 673.2050807568877"fill=black></polygon></mask></defs><polygon points="1000.0 500.0, 250.0000000000001 66.98729810778059, 249.99999999999977 933.0127018922192"mask=url(#small-triangle-mask) fill=white class=ap-play-btn-fill></polygon><polyline points="673.2050807568878 400.0, 326.7949192431123 600.0"stroke=white stroke-width=90 class=ap-play-btn-stroke>`);
var StartOverlay = props => {
  return (() => {
    var _el$ = _tmpl$$3();
    _el$.$$click = e => {
      e.preventDefault();
      props.onClick(e);
    };
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$$2 = /*#__PURE__*/template(`<li><kbd>space</kbd> - pause / resume`),
  _tmpl$2$1 = /*#__PURE__*/template(`<li><kbd>←</kbd> / <kbd>→</kbd> - rewind / fast-forward by 5 seconds`),
  _tmpl$3 = /*#__PURE__*/template(`<li><kbd>Shift</kbd> + <kbd>←</kbd> / <kbd>→</kbd> - rewind / fast-forward by 10%`),
  _tmpl$4 = /*#__PURE__*/template(`<li><kbd>[</kbd> / <kbd>]</kbd> - jump to the previous / next marker`),
  _tmpl$5 = /*#__PURE__*/template(`<li><kbd>0</kbd>, <kbd>1</kbd>, <kbd>2</kbd> ... <kbd>9</kbd> - jump to 0%, 10%, 20% ... 90%`),
  _tmpl$6 = /*#__PURE__*/template(`<li><kbd>,</kbd> / <kbd>.</kbd> - step back / forward, a frame at a time (when paused)`),
  _tmpl$7 = /*#__PURE__*/template(`<li><kbd>m</kbd> - mute / unmute audio`),
  _tmpl$8 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-help"><div><div><p>Keyboard shortcuts</p><ul><li><kbd>f</kbd> - toggle fullscreen mode</li><li><kbd>k</kbd> - toggle keystroke overlay</li><li><kbd>?</kbd> - show this help popup`);
var HelpOverlay = props => {
  return (() => {
    var _el$ = _tmpl$8(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.firstChild,
      _el$5 = _el$4.nextSibling,
      _el$10 = _el$5.firstChild,
      _el$11 = _el$10.nextSibling,
      _el$13 = _el$11.nextSibling;
    _el$.$$click = e => {
      e.preventDefault();
      props.onClose(e);
    };
    _el$2.$$click = e => {
      e.stopPropagation();
    };
    insert(_el$5, createComponent(Show, {
      get when() {
        return props.isPausable;
      },
      get children() {
        return _tmpl$$2();
      }
    }), _el$10);
    insert(_el$5, createComponent(Show, {
      get when() {
        return props.isSeekable;
      },
      get children() {
        return [_tmpl$2$1(), _tmpl$3(), _tmpl$4(), _tmpl$5(), _tmpl$6()];
      }
    }), _el$10);
    insert(_el$5, createComponent(Show, {
      get when() {
        return props.hasAudio;
      },
      get children() {
        return _tmpl$7();
      }
    }), _el$13);
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$$1 = /*#__PURE__*/template(`<div><kbd>`),
  _tmpl$2 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-keystrokes">`);
const VISIBLE_MS = 2000;
const FADE_MS = 700;
function KeystrokePill(props) {
  const [isFading, setIsFading] = createSignal(false);
  createEffect(() => {
    const {
      id
    } = props.keystroke;
    // Subscribe to append/increment bumps so the fade timer restarts.
    props.keystroke.rev();
    setIsFading(false);
    const fadeTimeoutId = setTimeout(function () {
      setIsFading(true);
    }, VISIBLE_MS);
    const expireTimeoutId = setTimeout(function () {
      props.onExpired(id);
    }, VISIBLE_MS + FADE_MS);
    onCleanup(() => {
      clearTimeout(fadeTimeoutId);
      clearTimeout(expireTimeoutId);
    });
  });
  return (() => {
    var _el$ = _tmpl$$1(),
      _el$2 = _el$.firstChild;
    insert(_el$2, () => props.keystroke.label());
    createRenderEffect(() => className(_el$, isFading() ? "ap-keystroke-pill fading" : "ap-keystroke-pill"));
    return _el$;
  })();
}
var KeystrokesOverlay = props => {
  return (() => {
    var _el$3 = _tmpl$2();
    insert(_el$3, createComponent(For, {
      get each() {
        return props.keystrokes;
      },
      children: keystroke => createComponent(KeystrokePill, {
        keystroke: keystroke,
        get onExpired() {
          return props.onExpired;
        }
      })
    }));
    createRenderEffect(_$p => setStyleProperty(_el$3, "--ap-keystrokes-bottom", `${(props.bottomOffset ?? 0) + 12}px`));
    return _el$3;
  })();
};

const controlSeqs = Object.fromEntries(Array.from({
  length: 26
}, (_, i) => {
  const char = String.fromCharCode(i + 1);
  const key = String.fromCharCode(97 + i);
  return [char, `C-${key}`];
}));
const basicSeqs = {
  ...controlSeqs,
  "\b": "Back",
  "\r": "Ret",
  "\t": "Tab",
  "\u001b": "Esc",
  "\u007f": "Back"
};
const singles = {
  " ": "Spc"
};
const functionalKeys = {
  57358: "Caps",
  57359: "Scroll",
  57360: "Num",
  57361: "Print",
  57362: "Pause",
  57363: "Menu",
  57414: "Enter",
  57421: "PgUp",
  57422: "PgDn"
};
const arrowKeys = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→"
};
const csiFinalKeys = {
  A: arrowKeys.up,
  B: arrowKeys.down,
  C: arrowKeys.right,
  D: arrowKeys.left,
  F: "End",
  H: "Home",
  P: "F1",
  Q: "F2",
  R: "F3",
  S: "F4"
};
const csiTildeKeys = {
  2: "Ins",
  3: "Del",
  5: "PgUp",
  6: "PgDn",
  15: "F5",
  17: "F6",
  18: "F7",
  19: "F8",
  20: "F9",
  21: "F10",
  23: "F11",
  24: "F12"
};
function addModifierPrefix(key, modifier) {
  const mod = Number.parseInt(modifier.split(":")[0], 10);
  if (!Number.isFinite(mod) || mod <= 1) {
    return key;
  }
  const bits = mod - 1;
  const parts = [];
  if (bits & 4) parts.push("C");
  if (bits & 2) parts.push("A");
  if (bits & 1) parts.push("S");
  return parts.length === 0 ? key : `${parts.join("-")}-${key}`;
}
function codepointToKey(codepoint) {
  if (codepoint in functionalKeys) {
    return functionalKeys[codepoint];
  }
  const char = String.fromCodePoint(codepoint);
  if (char in basicSeqs) {
    return basicSeqs[char];
  }
  if (char in singles) {
    return singles[char];
  }
  return char;
}
function formatCsiSequence(seq) {
  const csiUAlt = seq.match(/^(\d+);;(\d+)u$/);
  if (csiUAlt !== null) {
    return `A-${codepointToKey(Number.parseInt(csiUAlt[2], 10))}`;
  }
  const csiU = seq.match(/^(\d+)(?:;([\d:]+))?u$/);
  if (csiU !== null) {
    const key = codepointToKey(Number.parseInt(csiU[1], 10));
    return csiU[2] === undefined ? key : addModifierPrefix(key, csiU[2]);
  }
  const finalKey = seq.match(/^O?([A-Z])$/);
  if (finalKey !== null && finalKey[1] in csiFinalKeys) {
    return csiFinalKeys[finalKey[1]];
  }
  const tildeKey = seq.match(/^(\d+)~$/);
  if (tildeKey !== null && tildeKey[1] in csiTildeKeys) {
    return csiTildeKeys[tildeKey[1]];
  }
  const modifyOtherKeys = seq.match(/^27;([\d:]+);(\d+)~$/);
  if (modifyOtherKeys !== null) {
    const key = codepointToKey(Number.parseInt(modifyOtherKeys[2], 10));
    return addModifierPrefix(key, modifyOtherKeys[1]);
  }
  const modifiedFinal = seq.match(/^(?:1;)?([\d:]+)([A-Z])$/);
  if (modifiedFinal !== null && modifiedFinal[2] in csiFinalKeys) {
    return addModifierPrefix(csiFinalKeys[modifiedFinal[2]], modifiedFinal[1]);
  }
  const modifiedTilde = seq.match(/^(\d+);([\d:]+)~$/);
  if (modifiedTilde !== null && modifiedTilde[1] in csiTildeKeys) {
    return addModifierPrefix(csiTildeKeys[modifiedTilde[1]], modifiedTilde[2]);
  }
  return "";
}
function formatEscapeSequence(data) {
  const seq = data.slice(1);
  if (seq.length === 1) {
    if (seq in basicSeqs) {
      return "A-" + basicSeqs[seq];
    }
    return seq in singles ? "A-" + singles[seq] : "A-" + seq;
  }
  if (seq.startsWith("[")) {
    return formatCsiSequence(seq.slice(1));
  }
  if (seq.startsWith("O")) {
    return formatCsiSequence(seq);
  }
  return "";
}
function formatKeystroke(data) {
  if (data in basicSeqs) {
    return {
      kind: "special",
      label: basicSeqs[data]
    };
  }
  if (data.length === 1) {
    if (data in singles) {
      return {
        kind: "special",
        label: singles[data]
      };
    }
    return {
      kind: "text",
      label: data
    };
  }
  if (data.startsWith("\u001b")) {
    const key = formatEscapeSequence(data);
    if (key !== "") {
      return {
        kind: "special",
        label: key
      };
    }
  }
  return null;
}

var _tmpl$ = /*#__PURE__*/template(`<div class=ap-wrapper tabindex=-1><div>`);
const CONTROL_BAR_HEIGHT = 32; // must match height of div.ap-control-bar in CSS
var Player = props => {
  /* eslint-disable solid/reactivity -- mount-time config, passed as plain values (see view.js) */
  const logger = props.logger;
  const core = props.core;
  const autoPlay = props.autoPlay;
  const charW = props.charW;
  const charH = props.charH;
  const bordersW = props.bordersW;
  const bordersH = props.bordersH;
  const themeOption = props.theme ?? "auto/asciinema";
  /* eslint-enable solid/reactivity */
  const preferEmbeddedTheme = themeOption.slice(0, 5) === "auto/";
  const themeName = preferEmbeddedTheme ? themeOption.slice(5) : themeOption;
  const [terminalSize, setTerminalSize] = createSignal(
  // eslint-disable-next-line solid/reactivity -- initial size only, core reset/resize events update it
  {
    cols: props.cols,
    rows: props.rows
  }, {
    equals: (newVal, oldVal) => newVal.cols === oldVal.cols && newVal.rows === oldVal.rows
  });
  const [containerSize, setContainerSize] = createSignal({
    width: 0,
    height: 0
  }, {
    equals: (newVal, oldVal) => newVal.width === oldVal.width && newVal.height === oldVal.height
  });
  const [isPausable, setIsPausable] = createSignal(true);
  const [isSeekable, setIsSeekable] = createSignal(true);
  const [isFullscreen, setIsFullscreen] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal(null);
  const [remainingTime, setRemainingTime] = createSignal(null);
  const [progress, setProgress] = createSignal(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [isMuted, setIsMuted] = createSignal(undefined);
  const [wasPlaying, setWasPlaying] = createSignal(false);
  const [overlay, setOverlay] = createSignal(!autoPlay ? "start" : null);
  const [infoMessage, setInfoMessage] = createSignal(null);
  const [blinking, setBlinking] = createSignal(false);
  const [duration, setDuration] = createSignal(null);
  const [markers, setMarkers] = createSignal([]);
  const [userActive, setUserActive] = createSignal(false);
  const [isHelpVisible, setIsHelpVisible] = createSignal(false);
  const [originalTheme, setOriginalTheme] = createSignal(null);
  const terminalCols = createMemo(() => terminalSize().cols || 80);
  const terminalRows = createMemo(() => terminalSize().rows || 24);
  const controlBarHeight = () => props.controls === false ? 0 : CONTROL_BAR_HEIGHT;
  const [isKeystrokeOverlayEnabled, setKeystrokeOverlayEnabled] = createSignal(
  // eslint-disable-next-line solid/reactivity -- initial value only, toggled with the "k" key
  props.keystrokeOverlay !== false);
  const [keystrokes, setKeystrokes] = createSignal([]);
  const controlsVisible = () => props.controls === true || props.controls === "auto" && userActive();
  let nextKeystrokeId = 1;
  let userActivityTimeoutId;
  let timeUpdateIntervalId;
  let wrapperRef;
  let playerRef;
  let controlBarRef;
  let resizeObserver;
  function onPlaying() {
    setBlinking(true);
    startTimeUpdates();
  }
  function onStopped() {
    setBlinking(false);
    stopTimeUpdates();
    updateTime();
  }
  const onCoreReady = ({
    isPausable,
    isSeekable
  }) => {
    batch(() => {
      setIsPausable(isPausable);
      setIsSeekable(isSeekable);
    });
  };
  const onCoreMetadata = meta => {
    batch(() => {
      if (meta.duration !== undefined) {
        setDuration(meta.duration);
        setCurrentTime(0);
        setRemainingTime(meta.duration);
        setProgress(0);
      }
      if (meta.markers !== undefined) {
        setMarkers(meta.markers);
      }
      if (meta.hasAudio !== undefined) {
        setIsMuted(meta.hasAudio ? false : undefined);
      }
    });
  };
  const onCoreReset = ({
    size,
    theme
  }) => {
    batch(() => {
      setTerminalSize(size);
      if (theme !== undefined) {
        setOriginalTheme(theme);
      }
    });
  };
  const onCoreResize = size => {
    setTerminalSize(size);
  };
  const onCorePlay = () => {
    setOverlay(null);
  };
  const onCorePlaying = () => {
    batch(() => {
      setIsPlaying(true);
      setWasPlaying(true);
      setOverlay(null);
      onPlaying();
    });
  };
  const onCorePause = () => {
    batch(() => {
      setIsPlaying(false);
      onStopped();
    });
  };
  const onCoreLoading = () => {
    batch(() => {
      setIsPlaying(false);
      onStopped();
      setOverlay("loader");
      clearKeystrokes();
    });
  };
  const onCoreOffline = ({
    message
  }) => {
    batch(() => {
      setIsPlaying(false);
      onStopped();
      clearKeystrokes();
      if (message !== undefined) {
        setInfoMessage(message);
        setOverlay("info");
      }
    });
  };
  const onCoreMuted = muted => {
    setIsMuted(muted);
  };
  const stats = {
    terminal: {
      renders: 0
    }
  };
  const onCoreEnded = ({
    message
  }) => {
    batch(() => {
      setIsPlaying(false);
      onStopped();
      if (message !== undefined) {
        setInfoMessage(message);
        setOverlay("info");
      }
    });
    logger.debug("stats", stats.terminal);
  };
  const onCoreError = () => {
    clearKeystrokes();
    setOverlay("error");
  };
  const onCoreInput = ({
    data
  }) => {
    if (!isKeystrokeOverlayEnabled()) {
      return;
    }
    const keystroke = formatKeystroke(data);
    if (keystroke === null) {
      return;
    }
    const currentKeystrokes = keystrokes();
    const latestKeystroke = currentKeystrokes[currentKeystrokes.length - 1];
    if (latestKeystroke?.kind === "text" && keystroke.kind === "text") {
      latestKeystroke.append(keystroke.label);
      return;
    }
    if (latestKeystroke?.kind === "special" && keystroke.kind === "special" && latestKeystroke.key === keystroke.label) {
      latestKeystroke.increment();
      return;
    }
    setKeystrokes([...currentKeystrokes, createKeystroke(keystroke)].slice(-4));
  };
  const onCoreSeeked = () => {
    updateTime();
    clearKeystrokes();
  };
  const clearKeystrokes = () => {
    setKeystrokes([]);
  };
  const removeKeystroke = id => {
    setKeystrokes(keystrokes => keystrokes.filter(keystroke => keystroke.id !== id));
  };
  const createKeystroke = ({
    kind,
    label
  }) => {
    const [value, setValue] = createSignal(label);
    const [count, setCount] = createSignal(1);
    const [rev, setRev] = createSignal(0);
    return {
      id: nextKeystrokeId++,
      kind,
      key: label,
      label: () => count() === 1 ? value() : `${value()} × ${count()}`,
      rev,
      append: label => {
        setValue(value => (value + label).slice(-10));
        setRev(rev => rev + 1);
      },
      increment: () => {
        setCount(count => count + 1);
        setRev(rev => rev + 1);
      }
    };
  };
  core.addEventListener("ready", onCoreReady);
  core.addEventListener("metadata", onCoreMetadata);
  core.addEventListener("play", onCorePlay);
  core.addEventListener("playing", onCorePlaying);
  core.addEventListener("pause", onCorePause);
  core.addEventListener("loading", onCoreLoading);
  core.addEventListener("offline", onCoreOffline);
  core.addEventListener("muted", onCoreMuted);
  core.addEventListener("ended", onCoreEnded);
  core.addEventListener("error", onCoreError);
  core.addEventListener("input", onCoreInput);
  core.addEventListener("seeked", onCoreSeeked);
  core.addEventListener("reset", onCoreReset);
  core.addEventListener("resize", onCoreResize);
  const setupResizeObserver = () => {
    resizeObserver = new ResizeObserver(debounce(_entries => {
      setContainerSize({
        width: wrapperRef.offsetWidth,
        height: wrapperRef.offsetHeight
      });
      wrapperRef.dispatchEvent(new CustomEvent("resize", {
        detail: {
          el: playerRef
        }
      }));
    }, 10));
    resizeObserver.observe(wrapperRef);
  };
  onMount(async () => {
    logger.info("view: mounted");
    logger.debug("view: font measurements", {
      charW,
      charH
    });
    setupResizeObserver();
    setContainerSize({
      width: wrapperRef.offsetWidth,
      height: wrapperRef.offsetHeight
    });
  });
  onCleanup(() => {
    core.removeEventListener("ready", onCoreReady);
    core.removeEventListener("metadata", onCoreMetadata);
    core.removeEventListener("play", onCorePlay);
    core.removeEventListener("playing", onCorePlaying);
    core.removeEventListener("pause", onCorePause);
    core.removeEventListener("loading", onCoreLoading);
    core.removeEventListener("offline", onCoreOffline);
    core.removeEventListener("muted", onCoreMuted);
    core.removeEventListener("ended", onCoreEnded);
    core.removeEventListener("error", onCoreError);
    core.removeEventListener("input", onCoreInput);
    core.removeEventListener("seeked", onCoreSeeked);
    core.removeEventListener("reset", onCoreReset);
    core.removeEventListener("resize", onCoreResize);
    core.stop();
    stopTimeUpdates();
    resizeObserver.disconnect();
  });
  const terminalElementSize = createMemo(() => {
    const terminalW = charW * terminalCols() + bordersW;
    const terminalH = charH * terminalRows() + bordersH;
    let fit = props.fit ?? "width";
    const currentContainerSize = containerSize();
    if (fit === "both" || isFullscreen()) {
      const containerRatio = currentContainerSize.width / (currentContainerSize.height - controlBarHeight());
      const terminalRatio = terminalW / terminalH;
      if (containerRatio > terminalRatio) {
        fit = "height";
      } else {
        fit = "width";
      }
    }
    if (fit === false || fit === "none") {
      return {};
    } else if (fit === "width") {
      const scale = currentContainerSize.width / terminalW;
      return {
        scale: scale,
        width: currentContainerSize.width,
        height: terminalH * scale + controlBarHeight()
      };
    } else if (fit === "height") {
      const scale = (currentContainerSize.height - controlBarHeight()) / terminalH;
      return {
        scale: scale,
        width: terminalW * scale,
        height: currentContainerSize.height
      };
    } else {
      throw new Error(`unsupported fit mode: ${fit}`);
    }
  });
  const onFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement ?? document.webkitFullscreenElement);
  };
  const toggleFullscreen = () => {
    if (isFullscreen()) {
      (document.exitFullscreen ?? document.webkitExitFullscreen ?? (() => {})).apply(document);
    } else {
      (wrapperRef.requestFullscreen ?? wrapperRef.webkitRequestFullscreen ?? (() => {})).apply(wrapperRef);
    }
  };
  const toggleHelp = () => {
    if (isHelpVisible()) {
      setIsHelpVisible(false);
    } else {
      core.pause();
      setIsHelpVisible(true);
    }
  };
  const toggleKeystrokeOverlay = () => {
    if (isKeystrokeOverlayEnabled()) {
      clearKeystrokes();
      setKeystrokeOverlayEnabled(false);
    } else {
      setKeystrokeOverlayEnabled(true);
    }
  };
  const onKeyDown = e => {
    if (e.altKey || e.metaKey || e.ctrlKey) {
      return;
    }

    // Let a focused control button activate itself on Space/Enter rather than
    // also triggering the global keyboard shortcuts.
    if ((e.key == " " || e.key == "Enter") && e.target instanceof HTMLButtonElement) {
      return;
    }
    if (e.key == " ") {
      togglePlay();
    } else if (e.key == ",") {
      core.step(-1).then(updateTime);
    } else if (e.key == ".") {
      core.step().then(updateTime);
    } else if (e.key == "f") {
      toggleFullscreen();
    } else if (e.key == "m") {
      toggleMuted();
    } else if (e.key == "[") {
      core.seek({
        marker: "prev"
      });
    } else if (e.key == "]") {
      core.seek({
        marker: "next"
      });
    } else if (e.key.charCodeAt(0) >= 48 && e.key.charCodeAt(0) <= 57) {
      const pos = (e.key.charCodeAt(0) - 48) / 10;
      core.seek(`${pos * 100}%`);
    } else if (e.key == "?") {
      toggleHelp();
    } else if (e.key == "k") {
      toggleKeystrokeOverlay();
    } else if (e.key == "ArrowLeft") {
      if (e.shiftKey) {
        core.seek("<<<");
      } else {
        core.seek("<<");
      }
    } else if (e.key == "ArrowRight") {
      if (e.shiftKey) {
        core.seek(">>>");
      } else {
        core.seek(">>");
      }
    } else if (e.key == "Escape") {
      setIsHelpVisible(false);
    } else {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
  };
  const wrapperOnMouseMove = () => {
    if (isFullscreen()) {
      onUserActive(true);
    }
  };
  const playerOnMouseLeave = () => {
    if (!isFullscreen()) {
      onUserActive(false);
    }
  };
  const startTimeUpdates = () => {
    clearInterval(timeUpdateIntervalId);
    timeUpdateIntervalId = setInterval(updateTime, 100);
  };
  const stopTimeUpdates = () => {
    clearInterval(timeUpdateIntervalId);
  };
  const updateTime = async () => {
    const newCurrentTime = await core.getCurrentTime();
    const newRemainingTime = await core.getRemainingTime();
    const newProgress = await core.getProgress();
    batch(() => {
      setCurrentTime(newCurrentTime);
      setRemainingTime(newRemainingTime);
      setProgress(newProgress);
    });
  };
  const onUserActive = show => {
    clearTimeout(userActivityTimeoutId);
    if (show) {
      userActivityTimeoutId = setTimeout(() => onUserActive(false), 2000);
    }
    setUserActive(show);
  };
  const embeddedTheme = createMemo(() => preferEmbeddedTheme ? originalTheme() : null);
  const playerStyle = () => {
    const style = {};
    if ((props.fit === false || props.fit === "none") && props.terminalFontSize !== undefined) {
      if (props.terminalFontSize === "small") {
        style["font-size"] = "12px";
      } else if (props.terminalFontSize === "medium") {
        style["font-size"] = "18px";
      } else if (props.terminalFontSize === "big") {
        style["font-size"] = "24px";
      } else {
        style["font-size"] = props.terminalFontSize;
      }
    }
    const size = terminalElementSize();
    if (size.width !== undefined) {
      style["width"] = `${size.width}px`;
      style["height"] = `${size.height}px`;
    }
    if (props.terminalFontFamily !== undefined) {
      style["--term-font-family"] = props.terminalFontFamily;
    }
    const themeColors = embeddedTheme();
    if (themeColors) {
      style["--term-color-foreground"] = themeColors.foreground;
      style["--term-color-background"] = themeColors.background;
    }
    return style;
  };
  const play = () => {
    core.play();
  };
  const togglePlay = () => {
    if (isPlaying()) {
      core.pause();
    } else {
      core.play();
    }
  };
  const toggleMuted = () => {
    if (isMuted() === true) {
      core.unmute();
    } else {
      core.mute();
    }
  };
  const seek = pos => {
    core.seek(pos);
  };
  const playerClass = () => `ap-player ap-default-term-ff asciinema-player-theme-${themeName}`;
  const terminalScale = () => terminalElementSize()?.scale;
  const el = (() => {
    var _el$ = _tmpl$(),
      _el$2 = _el$.firstChild;
    var _ref$ = wrapperRef;
    typeof _ref$ === "function" ? use(_ref$, _el$) : wrapperRef = _el$;
    _el$.addEventListener("webkitfullscreenchange", onFullscreenChange);
    _el$.addEventListener("fullscreenchange", onFullscreenChange);
    _el$.$$mousemove = wrapperOnMouseMove;
    _el$.$$keydown = onKeyDown;
    var _ref$2 = playerRef;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : playerRef = _el$2;
    _el$2.$$mousemove = () => onUserActive(true);
    _el$2.addEventListener("mouseleave", playerOnMouseLeave);
    insert(_el$2, createComponent(Terminal, {
      get cols() {
        return terminalCols();
      },
      get rows() {
        return terminalRows();
      },
      get scale() {
        return terminalScale();
      },
      get blinking() {
        return blinking();
      },
      get cursorMode() {
        return props.cursorMode;
      },
      get boldIsBright() {
        return props.boldIsBright;
      },
      get adaptivePalette() {
        return props.adaptivePalette;
      },
      get lineHeight() {
        return props.terminalLineHeight;
      },
      preferEmbeddedTheme: preferEmbeddedTheme,
      core: core,
      logger: logger,
      get onReady() {
        return props.onTerminalReady;
      },
      get stats() {
        return stats.terminal;
      }
    }), null);
    insert(_el$2, createComponent(Show, {
      get when() {
        return props.controls !== false;
      },
      get children() {
        return createComponent(ControlBar, {
          get duration() {
            return duration();
          },
          get currentTime() {
            return currentTime();
          },
          get remainingTime() {
            return remainingTime();
          },
          get progress() {
            return progress();
          },
          get markers() {
            return markers();
          },
          get isPlaying() {
            return isPlaying() || overlay() == "loader";
          },
          get isPausable() {
            return isPausable();
          },
          get isSeekable() {
            return isSeekable();
          },
          get isMuted() {
            return isMuted();
          },
          onPlayClick: togglePlay,
          onFullscreenClick: toggleFullscreen,
          onHelpClick: toggleHelp,
          onSeekClick: seek,
          onMuteClick: toggleMuted,
          ref(r$) {
            var _ref$3 = controlBarRef;
            typeof _ref$3 === "function" ? _ref$3(r$) : controlBarRef = r$;
          }
        });
      }
    }), null);
    insert(_el$2, createComponent(Show, {
      get when() {
        return keystrokes().length > 0;
      },
      get children() {
        return createComponent(KeystrokesOverlay, {
          get bottomOffset() {
            return controlBarHeight();
          },
          get keystrokes() {
            return keystrokes();
          },
          onExpired: removeKeystroke
        });
      }
    }), null);
    insert(_el$2, createComponent(Switch, {
      get children() {
        return [createComponent(Match, {
          get when() {
            return overlay() == "start";
          },
          get children() {
            return createComponent(StartOverlay, {
              onClick: play
            });
          }
        }), createComponent(Match, {
          get when() {
            return overlay() == "loader";
          },
          get children() {
            return createComponent(LoaderOverlay, {});
          }
        }), createComponent(Match, {
          get when() {
            return overlay() == "error";
          },
          get children() {
            return createComponent(ErrorOverlay, {});
          }
        })];
      }
    }), null);
    insert(_el$2, createComponent(Slide, {
      get children() {
        return createComponent(Show, {
          get when() {
            return overlay() == "info";
          },
          get children() {
            return createComponent(InfoOverlay, {
              get message() {
                return infoMessage();
              },
              get wasPlaying() {
                return wasPlaying();
              }
            });
          }
        });
      }
    }), null);
    insert(_el$2, createComponent(Show, {
      get when() {
        return isHelpVisible();
      },
      get children() {
        return createComponent(HelpOverlay, {
          onClose: () => setIsHelpVisible(false),
          get isPausable() {
            return isPausable();
          },
          get isSeekable() {
            return isSeekable();
          },
          get hasAudio() {
            return isMuted() !== undefined;
          }
        });
      }
    }), null);
    createRenderEffect(_p$ => {
      var _v$ = !!controlsVisible(),
        _v$2 = playerClass(),
        _v$3 = playerStyle();
      _v$ !== _p$.e && _el$.classList.toggle("ap-hud", _p$.e = _v$);
      _v$2 !== _p$.t && className(_el$2, _p$.t = _v$2);
      _p$.a = style(_el$2, _v$3, _p$.a);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined
    });
    return _el$;
  })();
  return el;
};
delegateEvents(["keydown", "mousemove"]);

function mount(core, elem, opts = {}) {
  const metrics = measureTerminal(opts.terminalFontFamily, opts.terminalLineHeight);
  const props = {
    core: core,
    logger: opts.logger,
    cols: opts.cols,
    rows: opts.rows,
    fit: opts.fit,
    controls: opts.controls,
    cursorMode: opts.cursorMode,
    keystrokeOverlay: opts.keystrokeOverlay,
    autoPlay: opts.autoPlay,
    boldIsBright: opts.boldIsBright,
    adaptivePalette: opts.adaptivePalette,
    terminalFontSize: opts.terminalFontSize,
    terminalFontFamily: opts.terminalFontFamily,
    terminalLineHeight: opts.terminalLineHeight,
    theme: opts.theme,
    onTerminalReady: opts.onTerminalReady,
    ...metrics
  };
  let el;
  const dispose = render(() => {
    el = createComponent(Player, props);
    return el;
  }, elem);
  return {
    el: el,
    dispose: dispose
  };
}
function measureTerminal(fontFamily, lineHeight) {
  const cols = 80;
  const rows = 24;
  const playerDiv = document.createElement("div");
  playerDiv.className = "ap-default-term-ff";
  playerDiv.style.height = "0px";
  playerDiv.style.overflow = "hidden";
  playerDiv.style.fontSize = "15px"; // must match font-size of div.asciinema-player in CSS

  if (fontFamily !== undefined) {
    playerDiv.style.setProperty("--term-font-family", fontFamily);
  }
  const termDiv = document.createElement("div");
  termDiv.className = "ap-term";
  termDiv.style.width = `${cols}ch`;
  termDiv.style.height = `${rows * (lineHeight ?? 1.3333333333)}em`;
  termDiv.style.fontSize = "100%";
  playerDiv.appendChild(termDiv);
  document.body.appendChild(playerDiv);
  const metrics = {
    charW: termDiv.clientWidth / cols,
    charH: termDiv.clientHeight / rows,
    bordersW: termDiv.offsetWidth - termDiv.clientWidth,
    bordersH: termDiv.offsetHeight - termDiv.clientHeight
  };
  document.body.removeChild(playerDiv);
  return metrics;
}

const CORE_OPTS = ["audioUrl", "autoPlay", "autoplay", "cols", "idleTimeLimit", "loop", "markers", "pauseOnMarkers", "poster", "preload", "rows", "speed", "startAt"];
const UI_OPTS = ["autoPlay", "autoplay", "boldIsBright", "cols", "adaptivePalette", "controls", "cursorMode", "fit", "keystrokeOverlay", "rows", "terminalFontFamily", "terminalFontSize", "terminalLineHeight", "theme"];
function coreOpts(inputOpts, overrides = {}) {
  const opts = Object.fromEntries(Object.entries(inputOpts).filter(([key]) => CORE_OPTS.includes(key)));
  opts.autoPlay ??= opts.autoplay;
  opts.speed ??= 1.0;
  return {
    ...opts,
    ...overrides
  };
}
function uiOpts(inputOpts, overrides = {}) {
  const opts = Object.fromEntries(Object.entries(inputOpts).filter(([key]) => UI_OPTS.includes(key)));
  opts.autoPlay ??= opts.autoplay;
  opts.adaptivePalette ??= false;
  opts.controls ??= "auto";
  opts.cursorMode ??= "blinking";
  opts.keystrokeOverlay ??= false;
  if (!["blinking", "steady", "hidden"].includes(opts.cursorMode)) {
    throw new Error(`unsupported cursor mode: ${opts.cursorMode}`);
  }
  if (typeof opts.keystrokeOverlay !== "boolean") {
    throw new Error(`unsupported keystroke overlay option: ${opts.keystrokeOverlay}`);
  }
  return {
    ...opts,
    ...overrides
  };
}

export { coreOpts as c, mount as m, uiOpts as u };
