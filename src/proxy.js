export const proxy = function (vm, targetKey) {
  const target = vm[targetKey];

  if (typeof target !== "object" || target === null) {
    return;
  }

  Object.keys(target).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return target[key];
      },
      set(newVal) {
        if (target[key] === newVal) return;
        target[key] = newVal;
      },
    });
  });
};
