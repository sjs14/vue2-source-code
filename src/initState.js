import { observe } from "./observe/index.js";
import { proxy } from "./proxy";
import Watcher from "./observe/watcher";
import Dep from "./observe/dep.js";
export const initState = function (vm) {
  initData(vm);

  initComputed(vm);

  initWatch(vm);
};

function initData(vm) {
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;
  vm._data = data;

  observe(data);

  Object.keys(vm._data).forEach((key) => {
    // 数据代理
    proxy(vm, "_data", key);
  });
}

function initComputed(vm) {
  const computed = vm.$options.computed;
  if (!computed) return;
  vm._computedMap = {};
  Object.keys(computed).forEach((key) => {
    const userDef = computed[key];
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    vm._computedMap[key] = new Watcher(vm, getter, {
      lazy: true,
    });

    defineComputed(vm, key, userDef);
  });
}

function defineComputed(vm, key, userDef) {
  const setter = userDef.set || (() => {});

  Object.defineProperty(vm, key, {
    get: createComputedGetter(key),
    set: setter,
  });
}

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedMap[key];
    if (watcher.dirty) {
      watcher.evaluate();
    }

    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}

function initWatch(vm) {
  const watch = vm.$options.watch;
  if (!watch) return;

  Object.keys(watch).forEach((key) => {
    if (Array.isArray(watch[key])) {
      watch[key].forEach((item) => {
        createWatcher(vm, key, item);
      });
    } else {
      createWatcher(vm, key, watch[key]);
    }
  });
}

function createWatcher(vm, key, cb) {
  vm.$watch(key, cb);
}
