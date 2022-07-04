import { observe } from "./index";

const oldArrayProto = Array.prototype;

export const newArrayProto = Object.create(oldArrayProto);

const methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reserve",
  "sort",
  "splice",
];

methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    const res = oldArrayProto[method].call(this, ...args);

    const ob = this.__ob__;

    let addItems = [];
    switch (method) {
      case "push":
      case "unshift":
        addItems = args;
        break;
      case "splice":
        addItems = args.slice(2);
        break;
      default:
        break;
    }
    ob.observeArray(addItems);

    return res;
  };
});
