import Dep from "./dep";

let id = 0;

export default class Watcher {
  constructor(vm, fn, options) {
    this.id = id++;

    this.getter = fn;

    this.renderWatch = !!options.renderWatch;

    this.deps = [];

    this.depIds = new Set();

    this.get();
  }

  get() {
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }

  addDep(dep) {
    const depId = dep.id;
    if (!this.depIds.has(depId)) {
      this.deps.push(dep);
      this.depIds.add(depId);
      dep.addSub(this);
    }
  }

  update() {
    this.get();
  }
}
