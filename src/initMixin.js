import { compileToFunction } from "./compiler/index";
import { initState } from "./initState";
import { mountComponent } from "./lifycycle";


export const initMixin = function (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    // 初始化数据
    initState(vm);

    
    // 挂载
    if(options.el){
      vm.$mount(options.el)
    }
  };


  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)
    const vm = this
    let ops = vm.$options
    if(!ops.render){
      let template
       if(ops.template&&el){
        template = ops.template
      }else if(el){
          template = el.outerHTML
      }

      if(template){
       ops.render =  compileToFunction(template)
      }
    }
    

    mountComponent(vm,el)
  }
};
