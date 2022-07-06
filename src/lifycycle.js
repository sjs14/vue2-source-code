import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vdom/index";

export function initLiftCycle(Vue) {
  Vue.prototype._c = function (tag, attrs, children) {
    return createElementVNode(this, ...arguments);
  };

  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };

  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value;
    return JSON.stringify(value);
  };

  Vue.prototype._render = function () {
    const vm = this,
      render = vm.$options.render;
    return render.call(vm);
  };

  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    vm.$el = patch(el, vnode);
  };
}

function createElement(vnode) {
  if (typeof vnode.tag === "string") {
    vnode.el = document.createElement(vnode.tag);

    patchProps(vnode.el, vnode.data);

    vnode.children.forEach((child) => {
      vnode.el.appendChild(createElement(child));
    });
  } else {
    vnode.el = document.createTextNode(vnode.text);
  }

  return vnode.el;
}
function patchProps(el, props) {
  Object.keys(props).forEach((key) => {
    switch (key) {
      case "style":
        Object.keys(props.style).forEach((key) => {
          el.style[key] = props.style[key];
        });
        break;

      default:
        el.setAttribute(key, props[key]);
        break;
    }
  });
}
function patch(oldVNode, vnode) {
  const isRealNode = oldVNode.nodeType;
  if (isRealNode) {
    const elm = oldVNode,
      parentElm = elm.parentNode;

    const newElm = createElement(vnode);

    parentElm.insertBefore(newElm, elm.nextSibling);

    parentElm.removeChild(elm);
    return newElm;
  } else {
  }
}

export const mountComponent = function (vm, el) {
  vm.$el = el;

  const updateComponent = function () {
    vm._update(vm._render());
  };

  const watcher = new Watcher(vm, updateComponent, {
    renderWatch: true,
  });

};

export function callHook(vm, hook) {
  const handles = vm.$options[hook];
  if (!handles) return;

  handles.forEach((handle) => handle());
}
