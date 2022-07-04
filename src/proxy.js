export const proxy = function (vm, targetKey,key) {

    Object.defineProperty(vm, key, {
      get() {
        return vm[targetKey][key];
      },
      set(newVal) {
        vm[targetKey][key] = newVal
      },
    });
};
