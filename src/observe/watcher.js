import Dep, { popTarget, pushTarget } from "./dep";

let id = 0;

export default class Watcher {
  constructor(vm, fn, options) {
    this.id = id++;
    this.vm = vm;
    this.getter = fn;

    this.renderWatch = !!options.renderWatch;

    this.deps = [];

    this.depIds = new Set();
    this.lazy = !!options.lazy;
    this.dirty = !!options.lazy;
    this.lazy ? undefined : this.get();
  }
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  get() {
    debugger;
    pushTarget(this);
    const result = this.getter.call(this.vm);
    debugger;
    popTarget();
    return result;
  }

  addDep(dep) {
    const depId = dep.id;
    if (!this.depIds.has(depId)) {
      this.deps.push(dep);
      this.depIds.add(depId);
      dep.addSub(this);
    }
  }
  depend() {
    this.deps.forEach((dep) => {
      dep.depend();
    });
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }

  run() {
    this.get();
  }
}

let watcherQueue = [],
  watcherMap = {},
  pending = false;
function queueWatcher(watcher) {
  const id = watcher.id;
  if (!watcherMap[id]) {
    watcherQueue.push(watcher);
    watcherMap[id] = true;

    if (!pending) {
      nextTick(flushSchedulerQueue);
      pending = true;
    }
  }
}

function flushSchedulerQueue() {
  const watchers = watcherQueue.slice(0);
  watcherQueue = [];
  watcherMap = {};
  pending = false;

  watchers.forEach((watcher) => watcher.run());
}

let timerFn;
if (Promise) {
  timerFn = () => {
    Promise.resolve().then(flushCbQueue);
  };
} else if (MutationObserver) {
  const observer = new MutationObserver(flushCbQueue);
  const textNode = document.createTextNode(1);
  observer.observe(textNode, {
    characterData: true,
  });
  timerFn = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  timerFn = () => {
    setImmediate(flushCbQueue);
  };
} else {
  timerFn = () => {
    setTimeout(flushCbQueue);
  };
}

let cbQueue = [],
  waiting = false;
export function nextTick(cb) {
  cbQueue.push(cb);

  if (!waiting) {
    timerFn();
    waiting = true;
  }
}

function flushCbQueue() {
  const cbs = cbQueue.slice(0);
  cbQueue = [];
  waiting = false;

  cbs.forEach((cb) => cb());
}
