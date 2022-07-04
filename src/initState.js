import { observe } from "./observe/index.js";

export const initState = function (vm) {
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;
  vm._data = data;

  observe(data)
};
