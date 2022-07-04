import { newArrayProto } from "./array";
import Dep from "./dep";

class Observer {
  constructor(data) {
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
    });
    if (Array.isArray(data)) {
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }

  observeArray(data) {
    data.__proto__ = newArrayProto;

    data.forEach((item) => observe(item));
  }
}

export const defineReactive = function (target, key, value) {
  // 递归
  observe(value);
  const dep = new Dep();
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.depend();
      }
      return value;
    },
    set(newVal) {
      if (newVal === value) return;
      observe(newVal);
      value = newVal;
      dep.notify();
    },
  });
};

export const observe = function (data) {
  if (typeof data !== "object" || data === null) {
    return;
  }

  if (data.__ob__) {
    return data.__ob__;
  }

  new Observer(data);
};
