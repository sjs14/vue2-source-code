import { initMixin } from "./initMixin";
import { initLiftCycle } from "./lifycycle";
import { mergeOptions } from "./util";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLiftCycle(Vue);

Vue.options = {};

Vue.mixin = function (mixin) {
  this.options = mergeOptions(Vue.options, mixin);
  return this;
};

export default Vue;
