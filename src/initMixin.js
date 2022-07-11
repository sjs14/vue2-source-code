import { compileToFunction } from "./compiler/index";
import { initComputed } from "./initComputed";
import { initState } from "./initState";
import { callHook, mountComponent } from "./lifycycle";
import Watcher, { nextTick } from "./observe/watcher";
import { mergeOptions } from "./util";

export const initMixin = function (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = mergeOptions(vm.constructor.options, options);
    callHook(vm, "beforeCreate");
    // 初始化数据
    initState(vm);
    initComputed(vm)
    callHook(vm, "created");

    // 挂载
    if (options.el) {
      callHook(vm, "beforeMount");
      vm.$mount(options.el);
      callHook(vm, "mounted");
    }
  };

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el);
    const vm = this;
    let ops = vm.$options;
    if (!ops.render) {
      let template;
      if (ops.template && el) {
        template = ops.template;
      } else if (el) {
        template = el.outerHTML;
      }

      if (template) {
        ops.render = compileToFunction(template);
      }
    }

    mountComponent(vm, el);
  };
  Vue.prototype.$nextTick = nextTick;

  Vue.prototype.$watch = function (expOrFn, cb) {
    new Watcher(this, expOrFn, { user: true }, cb);
  };
};
