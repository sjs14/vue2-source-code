import { initMixin } from "./initMixin";
import { initLiftCycle } from "./lifycycle";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLiftCycle(Vue);

export default Vue;
