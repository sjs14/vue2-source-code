import { observe } from "./observe/index.js";
import { proxy } from "./proxy";

export const initState = function (vm) {
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;
  vm._data = data;

  observe(data);

  Object.keys(vm._data).forEach((key) => {
    // 数据代理
    proxy(vm, "_data", key);
  });
};
