import { initState } from "./initState";
import { proxy } from "./proxy";

export const initMixin = function (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    // 数据劫持
    initState(vm);

    // 数据代理
    proxy(vm, "_data");
  };
};
