import { initMixin } from "./initMixin";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);

export default Vue;
