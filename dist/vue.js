(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  var tactics = {};
  var lifycycles = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed"];
  lifycycles.forEach(function (lifycycle) {
    tactics[lifycycle] = function (p, c) {
      if (c) {
        if (p) {
          return p.concat(c);
        } else {
          return [c];
        }
      } else {
        return p;
      }
    };
  });
  function mergeOptions(parent, child) {
    var options = {};
    Object.keys(parent).forEach(function (key) {
      mergeField(key);
    });
    Object.keys(child).forEach(function (key) {
      if (!parent.hasOwnProperty(key)) {
        mergeField(key);
      }
    });

    function mergeField(key) {
      if (tactics[key]) {
        options[key] = tactics[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    }

    return options;
  }

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(Vue.options, mixin);
      return this;
    };
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/;
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;
  function parseHTML(html) {
    var stack = [];
    var root, currentParent;

    function createAstElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        attrs: attrs,
        parent: null,
        children: []
      };
    }

    function startHandle(tag, attrs) {
      var node = createAstElement(tag, attrs);

      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      }

      if (!root) {
        root = node;
      }

      stack.push(node);
      currentParent = node;
    }

    function charsHandle(text) {
      currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }

    function endHandle(tag) {
      stack.pop();
      currentParent = stack[stack.length - 1];
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        startHandle(match.tagName, match.attrs);
        advance(start[0].length);
        var end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (end) {
          end[1] === "/" && endHandle(start[1]);
          advance(end[0].length);
        }

        return match;
      }

      return false;
    }

    while (html) {
      var textEnd = html.indexOf("<");

      if (textEnd === 0) {
        // 标签开始或者结束位置
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          endHandle(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      } else {
        // 文本节点开始
        var text = void 0;

        if (textEnd > 0) {
          text = html.substring(0, textEnd);
        } else {
          text = html;
        }

        if (text) {
          charsHandle(text);
          advance(text.length);
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function toS(str) {
    return JSON.stringify(str);
  }

  function genElement(ast) {
    var code = "_c(".concat(toS(ast.tag), ",{").concat(ast.attrs ? genProps(ast.attrs) : "", "}").concat(ast.children && ast.children.length > 0 ? ",".concat(ast.children.map(function (item) {
      return codeGen(item);
    }).join(",")) : "", ")");
    return code;
  }

  function genProps(obj) {
    var propsStrArr = [];
    obj.forEach(function (_ref) {
      var name = _ref.name,
          value = _ref.value;

      switch (name) {
        case "style":
          var styleStrArr = [];
          value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                cssname = _item$split2[0],
                cssvalue = _item$split2[1];

            styleStrArr.push("".concat(toS(cssname.trim()), ":").concat(toS(cssvalue.trim())));
          });
          propsStrArr.push("\"style\":{".concat(styleStrArr.join(","), "}"));
          break;

        default:
          propsStrArr.push("".concat(toS(name.trim()), ":").concat(toS((value !== null && value !== void 0 ? value : "" === "") ? value : value.trim())));
          break;
      }
    });
    return propsStrArr.join(",");
  }

  function codeGen(ast) {
    var code;

    if (ast.type === ELEMENT_TYPE) {
      code = genElement(ast);
    }

    if (ast.type === TEXT_TYPE) {
      var text = ast.text;
      var tokens = [];
      var token;
      var lastIndex = 0;
      defaultTagRE.lastIndex = 0;

      while (token = defaultTagRE.exec(text)) {
        var curIndex = token.index;

        if (curIndex > lastIndex) {
          tokens.push(toS(text.slice(lastIndex, curIndex)));
        }

        tokens.push("_s(".concat(token[1].trim(), ")"));
        lastIndex = curIndex + token[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(toS(text.slice(lastIndex)));
      }

      code = "_v(".concat(tokens.join("+"), ")");
    }

    return code;
  }

  var compileToFunction = function compileToFunction(html) {
    var ast = parseHTML(html);
    var code = codeGen(ast);
    return new Function("with(this){ return ".concat(code, "}"));
  };

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; // 收集watcher
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  var stack = [];
  Dep.target = null;
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, options) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.vm = vm;
      this.getter = fn;
      this.renderWatch = !!options.renderWatch;
      this.deps = [];
      this.depIds = new Set();
      this.lazy = !!options.lazy;
      this.dirty = !!options.lazy;
      this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "get",
      value: function get() {
        debugger;
        pushTarget(this);
        var result = this.getter.call(this.vm);
        debugger;
        popTarget();
        return result;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var depId = dep.id;

        if (!this.depIds.has(depId)) {
          this.deps.push(dep);
          this.depIds.add(depId);
          dep.addSub(this);
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        this.deps.forEach(function (dep) {
          dep.depend();
        });
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();
  var watcherQueue = [],
      watcherMap = {},
      pending = false;

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!watcherMap[id]) {
      watcherQueue.push(watcher);
      watcherMap[id] = true;

      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }

  function flushSchedulerQueue() {
    var watchers = watcherQueue.slice(0);
    watcherQueue = [];
    watcherMap = {};
    pending = false;
    watchers.forEach(function (watcher) {
      return watcher.run();
    });
  }

  var timerFn;

  if (Promise) {
    timerFn = function timerFn() {
      Promise.resolve().then(flushCbQueue);
    };
  } else if (MutationObserver) {
    var observer = new MutationObserver(flushCbQueue);
    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });

    timerFn = function timerFn() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFn = function timerFn() {
      setImmediate(flushCbQueue);
    };
  } else {
    timerFn = function timerFn() {
      setTimeout(flushCbQueue);
    };
  }

  var cbQueue = [],
      waiting = false;
  function nextTick(cb) {
    cbQueue.push(cb);

    if (!waiting) {
      timerFn();
      waiting = true;
    }
  }

  function flushCbQueue() {
    var cbs = cbQueue.slice(0);
    cbQueue = [];
    waiting = false;
    cbs.forEach(function (cb) {
      return cb();
    });
  }

  function initComputed(vm) {
    var userDefComputeds = vm.$options.computed;

    if (!userDefComputeds) {
      return;
    }

    vm._computedWatcherMap = {};
    Object.keys(userDefComputeds).forEach(function (key) {
      var userDef = userDefComputeds[key];
      var getter = typeof userDef === "function" ? userDef : userDef.get;
      vm._computedWatcherMap[key] = new Watcher(vm, getter, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    });
  }

  function defineComputed(vm, key, userDef) {
    //   const getter = typeof userDef === "function" ? userDef : userDef.get;
    var setter = userDef.set || function () {};

    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key),
      set: setter
    });
  }

  function createComputedGetter(vm, key) {
    return function () {
      var watcher = vm._computedWatcherMap[key];

      if (watcher.dirty) {
        watcher.evaluate();
      }

      debugger;

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    };
  }

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ["push", "pop", "shift", "unshift", "reserve", "sort", "splice"];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var res = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

      var ob = this.__ob__;
      var addItems = [];

      switch (method) {
        case "push":
        case "unshift":
          addItems = args;
          break;

        case "splice":
          addItems = args.slice(2);
          break;
      }

      ob.observeArray(addItems);
      return res;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      Object.defineProperty(data, "__ob__", {
        value: this,
        enumerable: false
      });

      if (Array.isArray(data)) {
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.__proto__ = newArrayProto;
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  var defineReactive = function defineReactive(target, key, value) {
    // 递归
    observe(value);
    var dep = new Dep();
    window["_".concat(key)] = dep;
    Object.defineProperty(target, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();
        }

        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return;
        observe(newVal);
        value = newVal;
        dep.notify();
      }
    });
  };
  var observe = function observe(data) {
    if (_typeof(data) !== "object" || data === null) {
      return;
    }

    if (data.__ob__) {
      return data.__ob__;
    }

    new Observer(data);
  };

  var proxy = function proxy(vm, targetKey, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[targetKey][key];
      },
      set: function set(newVal) {
        vm[targetKey][key] = newVal;
      }
    });
  };

  var initState = function initState(vm) {
    var data = vm.$options.data;
    data = typeof data === "function" ? data.call(vm) : data;
    vm._data = data;
    observe(data);
    Object.keys(vm._data).forEach(function (key) {
      // 数据代理
      proxy(vm, "_data", key);
    });
  };

  function createElementVNode(vm, tag) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var key = props.key;

    if (key) {
      delete props.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, key, props, children);
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function initLiftCycle(Vue) {
    Vue.prototype._c = function (tag, attrs, children) {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (value) {
      if (_typeof(value) !== "object") return value;
      return JSON.stringify(value);
    };

    Vue.prototype._render = function () {
      var vm = this,
          render = vm.$options.render;
      return render.call(vm);
    };

    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      vm.$el = patch(el, vnode);
    };
  }

  function createElement(vnode) {
    if (typeof vnode.tag === "string") {
      vnode.el = document.createElement(vnode.tag);
      patchProps(vnode.el, vnode.data);
      vnode.children.forEach(function (child) {
        vnode.el.appendChild(createElement(child));
      });
    } else {
      vnode.el = document.createTextNode(vnode.text);
    }

    return vnode.el;
  }

  function patchProps(el, props) {
    Object.keys(props).forEach(function (key) {
      switch (key) {
        case "style":
          Object.keys(props.style).forEach(function (key) {
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
    var isRealNode = oldVNode.nodeType;

    if (isRealNode) {
      var elm = oldVNode,
          parentElm = elm.parentNode;
      var newElm = createElement(vnode);
      parentElm.insertBefore(newElm, elm.nextSibling);
      parentElm.removeChild(elm);
      return newElm;
    }
  }

  var mountComponent = function mountComponent(vm, el) {
    vm.$el = el;

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, {
      renderWatch: true
    });
  };
  function callHook(vm, hook) {
    var handles = vm.$options[hook];
    if (!handles) return;
    handles.forEach(function (handle) {
      return handle();
    });
  }

  var initMixin = function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, "beforeCreate"); // 初始化数据

      initState(vm);
      initComputed(vm);
      callHook(vm, "created"); // 挂载

      if (options.el) {
        callHook(vm, "beforeMount");
        vm.$mount(options.el);
        callHook(vm, "mounted");
      }
    };

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el);
      var vm = this;
      var ops = vm.$options;

      if (!ops.render) {
        var template;

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
  };

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  initLiftCycle(Vue);
  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
