import Dep from "./observe/dep";
import Watcher from "./observe/watcher";

export function initComputed(vm) {
  const userDefComputeds = vm.$options.computed;

  if (!userDefComputeds) {
    return;
  }

  vm._computedWatcherMap = {};
  Object.keys(userDefComputeds).forEach((key) => {
    const userDef = userDefComputeds[key];

    const getter = typeof userDef === "function" ? userDef : userDef.get;

    vm._computedWatcherMap[key] = new Watcher(vm, getter, { lazy: true });

    defineComputed(vm, key, userDef);
  });
}

function defineComputed(vm, key, userDef) {
  //   const getter = typeof userDef === "function" ? userDef : userDef.get;
  const setter = userDef.set || (() => {});

  Object.defineProperty(vm, key, {
    get: createComputedGetter(vm, key),
    set: setter,
  });
}

function createComputedGetter(vm, key) {
  return function () {
    const watcher = vm._computedWatcherMap[key];
    if (watcher.dirty) {
      watcher.evaluate();
    }
    debugger

    if (Dep.target) {
      watcher.depend();
    }

    return watcher.value;
  };
}
