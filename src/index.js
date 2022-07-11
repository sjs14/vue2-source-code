import { initGlobalApi } from "./initGlobalApi";
import { initMixin } from "./initMixin";
import { initLiftCycle } from "./lifycycle";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLiftCycle(Vue);
initGlobalApi(Vue);

export default Vue;
