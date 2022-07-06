import { mergeOptions } from "./util";
export function initGlobalApi(Vue) {
  Vue.options = {};

  Vue.mixin = function (mixin) {
    this.options = mergeOptions(Vue.options, mixin);
    return this;
  };
}
