(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("curvature/base/Bag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bag = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bag = /*#__PURE__*/function () {
  function Bag() {
    var changeCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

    _classCallCheck(this, Bag);

    this.meta = Symbol('meta');
    this.content = new Set();
    this._items = false;
    this.changeCallback = changeCallback;
  }

  _createClass(Bag, [{
    key: "add",
    value: function add(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be added to Bags.');
      }

      if (this.content.has(item)) {
        return;
      }

      this.content.add(item);

      if (this.changeCallback) {
        this.changeCallback(item, this.meta, 1);
      }
    }
  }, {
    key: "remove",
    value: function remove(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be removed from Bags.');
      }

      if (!this.content.has(item)) {
        if (this.changeCallback) {
          this.changeCallback(undefined, this.meta, 0);
        }

        return false;
      }

      this.content["delete"](item);

      if (this.changeCallback) {
        this.changeCallback(item, this.meta, -1);
      }

      return item;
    }
  }, {
    key: "items",
    value: function items() {
      return Array.from(this.content.entries()).map(function (entry) {
        return entry[0];
      });
    }
  }]);

  return Bag;
}();

exports.Bag = Bag;
  })();
});

require.register("curvature/base/Bindable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bindable = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bindable = /*#__PURE__*/function () {
  function Bindable() {
    _classCallCheck(this, Bindable);
  }

  _createClass(Bindable, null, [{
    key: "isBindable",
    value: function isBindable(object) {
      if (!object.___binding___) {
        return false;
      }

      return object.___binding___ === Bindable;
    }
  }, {
    key: "makeBindable",
    value: function makeBindable(object) {
      var _this = this;

      if (!object || !(object instanceof Object) || object.___binding___ || object instanceof Node || object instanceof IntersectionObserver || Object.isSealed(object) || !Object.isExtensible(object)) {
        return object;
      }

      if (object.___ref___) {
        return object.___ref___;
      }

      Object.defineProperty(object, '___ref___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, 'bindTo', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, 'isBound', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___deck___', {
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, '___binding___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___bindingAll___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___isBindable___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___executing___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___stack___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___stackTime___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___before___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___after___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___setCount___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___wrapped___', {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, '___object___', {
        enumerable: false,
        writable: false,
        value: object
      });
      object.___isBindable___ = Bindable;
      object.___wrapped___ = {};
      object.___binding___ = {};
      object.___bindingAll___ = [];
      object.___stack___ = [];
      object.___stackTime___ = [];
      object.___before___ = [];
      object.___after___ = [];
      object.___setCount___ = {};

      var bindTo = function bindTo(property) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var bindToAll = false;

        if (property instanceof Function) {
          options = callback || {};
          callback = property;
          bindToAll = true;
        }

        if (options.delay >= 0) {
          callback = _this.wrapDelayCallback(callback, options.delay);
        }

        if (options.throttle >= 0) {
          callback = _this.wrapThrottleCallback(callback, options.throttle);
        }

        if (options.wait >= 0) {
          callback = _this.wrapWaitCallback(callback, options.wait);
        }

        if (options.frame) {
          callback = _this.wrapFrameCallback(callback);
        }

        if (options.idle) {
          callback = _this.wrapIdleCallback(callback);
        }

        if (bindToAll) {
          var _bindIndex = object.___bindingAll___.length;

          object.___bindingAll___.push(callback);

          for (var i in object) {
            callback(object[i], i, object, false);
          }

          return function () {
            object.___bindingAll___[_bindIndex] = null;
          };
        }

        if (!object.___binding___[property]) {
          object.___binding___[property] = [];
        }

        var bindIndex = object.___binding___[property].length;

        object.___binding___[property].push(callback);

        callback(object[property], property, object, false);
        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;

          if (!object.___binding___[property]) {
            return;
          }

          delete object.___binding___[property][bindIndex];
        };
      };

      var ___before = function ___before(callback) {
        var beforeIndex = object.___before___.length;

        object.___before___.push(callback);

        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object.___before___[beforeIndex];
        };
      };

      var ___after = function ___after(callback) {
        var afterIndex = object.___after___.length;

        object.___after___.push(callback);

        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object.___after___[afterIndex];
        };
      };

      Object.defineProperty(object, 'bindTo', {
        enumerable: false,
        writable: false,
        value: bindTo
      });
      Object.defineProperty(object, 'bindChain', {
        enumerable: false,
        writable: false,
        value: function value(path, callback) {
          var parts = path.split('.');
          var node = parts.shift();
          var subParts = parts.slice(0);
          var debind = [];
          debind.push(object.bindTo(node, function (v, k, t, d) {
            var rest = subParts.join('.');

            if (subParts.length === 0) {
              callback(v, k, t, d);
              return;
            }

            if (v === undefined) {
              v = t[k] = _this.makeBindable({});
            }

            debind = debind.concat(v.bindChain(rest, callback));
          })); // console.log(debind);

          return function () {
            return debind.map(function (x) {
              return x();
            });
          };
        }
      });
      Object.defineProperty(object, '___before', {
        enumerable: false,
        writable: false,
        value: ___before
      });
      Object.defineProperty(object, '___after', {
        enumerable: false,
        writable: false,
        value: ___after
      });

      var isBound = function isBound() {
        for (var i in object.___bindingAll___) {
          if (object.___bindingAll___[i]) {
            return true;
          }
        }

        for (var _i in object.___binding___) {
          for (var j in object.___binding___[_i]) {
            if (object.___binding___[_i][j]) {
              return true;
            }
          }
        }

        return false;
      };

      Object.defineProperty(object, 'isBound', {
        enumerable: false,
        writable: false,
        value: isBound
      });

      for (var i in object) {
        if (object[i] && object[i] instanceof Object && !object[i] instanceof Node && !object[i] instanceof Promise) {
          object[i] = Bindable.makeBindable(object[i]);
        }
      }

      var set = function set(target, key, value) {
        if (object.___deck___[key] === value) {
          return true;
        }

        if (typeof key === 'string' && key.substring(0, 3) === '___' && key.slice(-3) === '___') {
          return true;
        }

        if (target[key] === value) {
          return true;
        }

        if (value && value instanceof Object && !(value instanceof Node)) {
          if (value.___isBindable___ !== Bindable) {
            value = Bindable.makeBindable(value);

            if (_this.isBindable(value)) {
              for (var _i2 in value) {
                if (value[_i2] && value[_i2] instanceof Object) {
                  value[_i2] = Bindable.makeBindable(value[_i2]);
                }
              }
            }
          }
        }

        object.___deck___[key] = value;

        for (var _i3 in object.___bindingAll___) {
          if (!object.___bindingAll___[_i3]) {
            continue;
          }

          object.___bindingAll___[_i3](value, key, target, false);
        }

        var stop = false;

        if (key in object.___binding___) {
          for (var _i4 in object.___binding___[key]) {
            if (!object.___binding___[key]) {
              continue;
            }

            if (!object.___binding___[key][_i4]) {
              continue;
            }

            if (object.___binding___[key][_i4](value, key, target, false, target[key]) === false) {
              stop = true;
            }
          }
        }

        delete object.___deck___[key];

        if (!stop) {
          var descriptor = Object.getOwnPropertyDescriptor(target, key);
          var excluded = target instanceof File && key == 'lastModifiedDate';

          if (!excluded && (!descriptor || descriptor.writable) && target[key] === value) {
            target[key] = value;
          }
        } // if (!target.___setCount___[key]) {
        // 	target.___setCount___[key] = 0;
        // }
        // target.___setCount___[key]++;
        // const warnOn = 10;
        // if (target.___setCount___[key] > warnOn && value instanceof Object) {
        // console.log(
        //     'Warning: Resetting bindable reference "' +
        //     key +
        //     '" to object ' +
        //     target.___setCount___[key] +
        //     ' times.'
        // );
        // }


        return Reflect.set(target, key, value);
      };

      var del = function del(target, key) {
        if (!(key in target)) {
          return true;
        }

        for (var _i5 in object.___bindingAll___) {
          object.___bindingAll___[_i5](undefined, key, target, true, target[key]);
        }

        if (key in object.___binding___) {
          for (var _i6 in object.___binding___[key]) {
            if (!object.___binding___[key][_i6]) {
              continue;
            }

            object.___binding___[key][_i6](undefined, key, target, true, target[key]);
          }
        }

        delete target[key];
        return true;
      };

      var get = function get(target, key) {
        if (target[key] instanceof Function) {
          if (target.___wrapped___[key]) {
            return target.___wrapped___[key];
          }

          var descriptor = Object.getOwnPropertyDescriptor(object, key);

          if (descriptor && !descriptor.configurable && !descriptor.writable) {
            target.___wrapped___[key] = target[key];
            return target.___wrapped___[key];
          }

          target.___wrapped___[key] = function () {
            target.___executing___ = key;

            target.___stack___.unshift(key); // target.___stackTime___.unshift((new Date).getTime());
            // console.log(`Start ${key}()`);


            for (var _i7 in target.___before___) {
              target.___before___[_i7](target, key, object);
            }

            var objRef = object instanceof Promise ? object : object.___ref___;

            for (var _len = arguments.length, providedArgs = new Array(_len), _key = 0; _key < _len; _key++) {
              providedArgs[_key] = arguments[_key];
            }

            var ret = target[key].apply(objRef, providedArgs);

            for (var _i8 in target.___after___) {
              target.___after___[_i8](target, key, object);
            }

            target.___executing___ = null; // let execTime = (new Date).getTime() - target.___stackTime___[0];
            // if (execTime > 150) {
            //     // console.log(`End ${key}(), took ${execTime} ms`);
            // }

            target.___stack___.shift(); // target.___stackTime___.shift();


            return ret;
          };

          return target.___wrapped___[key];
        }

        if (target[key] instanceof Object) {
          Bindable.makeBindable(target[key]);
        } // console.log(`Getting ${key}`);


        return target[key];
      };

      object.___ref___ = new Proxy(object, {
        deleteProperty: del,
        get: get,
        set: set
      });
      return object.___ref___;
    }
  }, {
    key: "clearBindings",
    value: function clearBindings(object) {
      object.___wrapped___ = {};
      object.___bindingAll___ = [];
      object.___binding___ = {};
      object.___before___ = [];
      object.___after___ = [];
      object.___ref___ = {}; // object.toString         = ()=>'{}';
    }
  }, {
    key: "resolve",
    value: function resolve(object, path) {
      var owner = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // console.log(path, object);
      var node;
      var pathParts = path.split('.');
      var top = pathParts[0];

      while (pathParts.length) {
        if (owner && pathParts.length === 1) {
          var obj = this.makeBindable(object);
          return [obj, pathParts.shift(), top];
        }

        node = pathParts.shift();

        if (!node in object || !object[node] || !(object[node] instanceof Object)) {
          object[node] = {};
        }

        object = this.makeBindable(object[node]);
      }

      return [this.makeBindable(object), node, top];
    }
  }, {
    key: "wrapDelayCallback",
    value: function wrapDelayCallback(callback, delay) {
      return function (v, k, t, d) {
        setTimeout(function () {
          return callback(v, k, t, d, t[k]);
        }, delay);
      };
    }
  }, {
    key: "wrapThrottleCallback",
    value: function wrapThrottleCallback(callback, throttle) {
      return function (callback) {
        var throttle = false;
        return function (v, k, t, d) {
          if (throttle) {
            return;
          }

          callback(v, k, t, d, t[k]);
          throttle = true;
          setTimeout(function () {
            throttle = false;
          }, throttle);
        };
      }(callback);
    }
  }, {
    key: "wrapWaitCallback",
    value: function wrapWaitCallback(callback, wait) {
      var waiter = false;
      return function (v, k, t, d) {
        if (waiter) {
          clearTimeout(waiter);
          waiter = false;
        }

        waiter = setTimeout(function () {
          return callback(v, k, t, d, t[k]);
        }, wait);
      };
    }
  }, {
    key: "wrapFrameCallback",
    value: function wrapFrameCallback(callback) {
      return function (v, k, t, d, p) {
        requestAnimationFrame(function () {
          return callback(v, k, t, d, p);
        });
      };
    }
  }, {
    key: "wrapIdleCallback",
    value: function wrapIdleCallback(callback) {
      return function (v, k, t, d, p) {
        requestIdleCallback(function () {
          return callback(v, k, t, d, p);
        });
      };
    }
  }]);

  return Bindable;
}();

exports.Bindable = Bindable;
  })();
});

require.register("curvature/base/Cache.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cache = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cache = /*#__PURE__*/function () {
  function Cache() {
    _classCallCheck(this, Cache);
  }

  _createClass(Cache, null, [{
    key: "store",
    value: function store(key, value, expiry) {
      var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'standard';
      var expiration = 0;

      if (expiry) {
        expiration = expiry * 1000 + new Date().getTime();
      } // console.log(
      // 	`Caching ${key} until ${expiration} in ${bucket}.`
      // 	, value
      // 	, this.bucket
      // );


      if (!this.bucket) {
        this.bucket = {};
      }

      if (!this.bucket[bucket]) {
        this.bucket[bucket] = {};
      }

      this.bucket[bucket][key] = {
        expiration: expiration,
        value: value
      };
    }
  }, {
    key: "load",
    value: function load(key) {
      var defaultvalue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var bucket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'standard';

      // console.log(
      // 	`Checking cache for ${key} in ${bucket}.`
      // 	, this.bucket
      // );
      if (this.bucket && this.bucket[bucket] && this.bucket[bucket][key]) {
        // console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
        if (this.bucket[bucket][key].expiration == 0 || this.bucket[bucket][key].expiration > new Date().getTime()) {
          return this.bucket[bucket][key].value;
        }
      }

      return defaultvalue;
    }
  }]);

  return Cache;
}();

exports.Cache = Cache;
  })();
});

require.register("curvature/base/Config.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;

var _Config = require("Config");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Config = /*#__PURE__*/function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, null, [{
    key: "get",
    value: function get(name) {
      return this.data[name];
    }
  }, {
    key: "set",
    value: function set(name, value) {
      return this.data[name] = value;
    }
  }]);

  return Config;
}();

exports.Config = Config;
Config.data = _Config.Config || {};
  })();
});

require.register("curvature/base/Dom.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dom = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var traversals = 0;

var Dom = /*#__PURE__*/function () {
  function Dom() {
    _classCallCheck(this, Dom);
  }

  _createClass(Dom, null, [{
    key: "mapTags",
    value: function mapTags(doc, selector, callback, startNode, endNode) {
      var result = [];
      var started = true;

      if (startNode) {
        started = false;
      }

      var ended = false;
      var treeWalker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: function acceptNode(node, walker) {
          if (!started) {
            if (node === startNode) {
              started = true;
            } else {
              return NodeFilter.FILTER_SKIP;
            }
          }

          if (endNode && node === endNode) {
            ended = true;
          }

          if (ended) {
            return NodeFilter.FILTER_SKIP;
          }

          if (selector) {
            if (node instanceof Element) {
              if (node.matches(selector)) {
                return NodeFilter.FILTER_ACCEPT;
              }
            }

            return NodeFilter.FILTER_SKIP;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);
      var traversal = traversals++;

      while (treeWalker.nextNode()) {
        result.push(callback(treeWalker.currentNode, treeWalker));
      }

      return result;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(doc, event) {
      doc.dispatchEvent(event);
      Dom.mapTags(doc, false, function (node) {
        node.dispatchEvent(event);
      });
    }
  }]);

  return Dom;
}();

exports.Dom = Dom;
  })();
});

require.register("curvature/base/Import.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Import = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Import = /*#__PURE__*/function () {
  function Import(uri) {
    _classCallCheck(this, Import);

    console.log(this.__proto__.constructor);

    if (this.__proto__.constructor.instances[uri]) {
      return this.__proto__.constructor.instances[uri];
    }

    this.uri = uri;
    var tag = document.createElement('script');
    tag.setAttribute('src', this.uri);
    this.ready = new Promise(function (accept, reject) {
      tag.addEventListener('load', function (event) {
        return accept(tag);
      });
      tag.addEventListener('error', function (error) {
        console.error(error);
        reject(error);
      });
    });
    this.tag = tag;
    this.attached = false;
    this.__proto__.constructor.instances[uri] = this;
  }

  _createClass(Import, [{
    key: "attach",
    value: function attach() {
      var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.attached) {
        return;
      }

      parent = parent || document.head;
      parent.append(this.tag);
      this.attached = true;
    }
  }]);

  return Import;
}();

exports.Import = Import;
Import.instances = {};
  })();
});

require.register("curvature/base/Model.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;

var _Cache = require("./Cache");

var _Bindable = require("./Bindable");

var _Repository = require("./Repository");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Model = /*#__PURE__*/function () {
  function Model(repository) {
    _classCallCheck(this, Model);

    this.repository = repository;
  }

  _createClass(Model, [{
    key: "consume",
    value: function consume(values) {
      for (var property in values) {
        var value = values[property];

        if (values[property] instanceof Object && values[property]["class"] && values[property].publicId) {
          var cacheKey = "".concat(values[property]["class"], "::").concat(values[property].publidId);

          var cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo');

          value = _Bindable.Bindable.makeBindable(new Model(this.repository));

          if (cached) {
            value = cached;
          }

          value.consume(values[property]);

          _Cache.Cache.store(cacheKey, value, 0, 'model-type-repo');
        }

        this[property] = value;
      }
    }
  }]);

  return Model;
}();

exports.Model = Model;
  })();
});

require.register("curvature/base/Repository.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Repository = void 0;

var _Bindable = require("./Bindable");

var _Router = require("./Router");

var _Cache = require("./Cache");

var _Model = require("./Model");

var _Bag = require("./Bag");

var _Form = require("../form/Form");

var _FormWrapper = require("../form/multiField/FormWrapper");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var objects = {};

var Repository = /*#__PURE__*/function () {
  function Repository(uri) {
    _classCallCheck(this, Repository);

    this.uri = uri;
  }

  _createClass(Repository, [{
    key: "get",
    value: function get(id) {
      var _this = this;

      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var resourceUri = this.uri + '/' + id;

      var cached = _Cache.Cache.load(resourceUri + _Router.Router.queryToString(_Router.Router.queryOver(args), true), false, 'model-uri-repo');

      if (!refresh && cached) {
        return Promise.resolve(cached);
      }

      return Repository.request(resourceUri, args).then(function (response) {
        return _this.extractModel(response.body);
      });
    }
  }, {
    key: "page",
    value: function page() {
      var _this2 = this;

      var _page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var args = arguments.length > 1 ? arguments[1] : undefined;
      return Repository.request(this.uri, args).then(function (response) {
        var records = [];

        for (var i in response.body) {
          var record = response.body[i];
          records.push(_this2.extractModel(record));
        }

        response.body = records;
        return response;
      });
    }
  }, {
    key: "edit",
    value: function edit() {
      var publicId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var resourceUri = this.uri + '/create';

      if (publicId) {
        resourceUri = this.uri + '/' + publicId + '/edit';
      } // console.log(resourceUri);


      if (!data) {
        return Repository.request(resourceUri).then(function (response) {
          var form = new _Form.Form(response.meta.form, customFields); // let model = this.extractModel(response.body);

          return new _FormWrapper.FormWrapper(form, resourceUri, 'POST', customFields);
        });
      } else {
        return Repository.request(resourceUri, {
          api: 'json'
        }, data).then(function (response) {
          return response.body;
        });
      }
    }
  }, {
    key: "extractModel",
    value: function extractModel(rawData) {
      var model = _Bindable.Bindable.makeBindable(new _Model.Model(this));

      model.consume(rawData);
      var resourceUri = this.uri + '/' + model.publicId; // Cache.store(
      // 	resourceUri
      // 	, model
      // 	, 10
      // 	, 'model-uri-repo'
      // );

      if (model["class"]) {
        var cacheKey = "".concat(model["class"], "::").concat(model.publidId);

        var cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo'); // if(cached)
        // {
        // 	cached.consume(rawData);
        // 	return cached;
        // }
        // Cache.store(
        // 	cacheKey
        // 	, model
        // 	, 10
        // 	, 'model-type-repo'
        // );

      }

      return model;
    } // static get xhrs(){
    // 	return this.xhrs = this.xhrs || [];
    // }

  }], [{
    key: "loadPage",
    value: function loadPage() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.request(this.uri, args).then(function (response) {
        return response; // return response.map((skeleton) => new Model(skeleton));
      });
    }
  }, {
    key: "domCache",
    value: function domCache(uri, content) {// console.log(uri, content);
    }
  }, {
    key: "load",
    value: function load(id) {
      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.objects = this.objects || {};
      this.objects[this.uri] = this.objects[this.uri] || {};

      if (this.objects[this.uri][id]) {
        return Promise.resolve(this.objects[this.uri][id]);
      }

      return this.request(this.uri + '/' + id).then(function (response) {// let model = new Model(response);
        // return this.objects[this.uri][id] = model;
      });
    }
  }, {
    key: "form",
    value: function form() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var uri = this.uri + '/' + 'create';

      if (id) {
        uri = this.uri + '/' + id + '/edit';
      }

      return this.request(uri).then(function (skeleton) {
        return skeleton;
      });
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      if (this.objects && this.objects[this.uri]) {
        this.objects[this.uri] = {};
      }
    }
  }, {
    key: "encode",
    value: function encode(obj) {
      var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!formData) {
        formData = new FormData();
      }

      for (var i in obj) {
        var ns = i;

        if (namespace) {
          ns = "".concat(namespace, "[").concat(ns, "]");
        }

        if (obj[i] && _typeof(obj[i]) !== 'object') {
          formData.append(ns, obj[i]);
        } else {
          this.encode(obj[i], ns, formData);
        }
      }

      return formData;
    }
  }, {
    key: "onResponse",
    value: function onResponse(callback) {
      if (!this._onResponse) {
        this._onResponse = new _Bag.Bag();
      }

      return this._onResponse.add(callback);
    }
  }, {
    key: "request",
    value: function request(uri) {
      var _this3 = this;

      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var post = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var type = 'GET';
      var queryString = '';
      var formData = null;
      var queryArgs = {};

      if (args) {
        queryArgs = args;
      }

      if (!this._onResponse) {
        this._onResponse = new _Bag.Bag();
      }

      if (!this.runningRequests) {
        this.runningRequests = {};
      }

      queryArgs.api = queryArgs.api || 'json';
      queryString = Object.keys(queryArgs).map(function (arg) {
        return encodeURIComponent(arg) + '=' + encodeURIComponent(queryArgs[arg]);
      }).join('&');
      var fullUri = uri; // let postString = '';

      fullUri = uri + '?' + queryString;

      if (!post && this.runningRequests[fullUri]) {
        return this.runningRequests[fullUri];
      }

      if (post) {
        cache = false;
        type = 'POST';

        if (post instanceof FormData) {
          formData = post;
        } else {
          formData = this.encode(post);
        } // postString = Object.keys(post).map((arg) => {
        // 	return encodeURIComponent(arg)
        // 	+ '='
        // 	+ encodeURIComponent(post[arg])
        // }).join('&');

      }

      var xhr = new XMLHttpRequest();

      if ('responseType' in options) {
        xhr.responseType = options.responseType;
      }

      if (!post && cache && this.cache && this.cache[fullUri]) {
        return Promise.resolve(this.cache[fullUri]);
      }

      var tagCacheSelector = 'script[data-uri="' + fullUri + '"]';
      var tagCache = document.querySelector(tagCacheSelector);

      if (!post && cache && tagCache) {
        var tagCacheContent = JSON.parse(tagCache.innerText);
        return Promise.resolve(tagCacheContent);
      }

      xhr.withCredentials = 'withCredentials' in options ? options.withCredentials : true;
      var link = document.createElement("a");
      link.href = fullUri;

      if (!post) {
        xhr.timeout = options.timeout || 15000;
        this.xhrs[fullUri] = xhr;
      }

      var reqPromise = new Promise(function (resolve, reject) {
        if (post) {
          if ('progressUp' in options) {
            xhr.upload.onprogress = options.progressUp;
          }
        }

        if ('progressDown' in options) {
          xhr.onprogress = options.progressDown;
        }

        xhr.onreadystatechange = function () {
          var DONE = 4;
          var OK = 200;
          var response;

          if (xhr.readyState === DONE) {
            delete _this3.xhrs[fullUri];
            delete _this3.runningRequests[fullUri];

            if (!_this3.cache) {
              _this3.cache = {};
            }

            if (xhr.getResponseHeader("Content-Type") == 'application/json' || xhr.getResponseHeader("Content-Type") == 'application/json; charset=utf-8' || xhr.getResponseHeader("Content-Type") == 'text/json' || xhr.getResponseHeader("Content-Type") == 'text/json; charset=utf-8') {
              response = JSON.parse(xhr.responseText);

              if (response && response.code == 0) {
                // Repository.lastResponse = response;
                if (!post && cache) {// this.cache[fullUri] = response;
                }

                var _tagCache = document.querySelector('script[data-uri="' + fullUri + '"]');

                var prerendering = window.prerenderer || navigator.userAgent.match(/prerender/i);

                if (prerendering) {
                  if (!_tagCache) {
                    _tagCache = document.createElement('script');
                    _tagCache.type = 'text/json';

                    _tagCache.setAttribute('data-uri', fullUri);

                    document.head.appendChild(_tagCache);
                  } // console.log(JSON.stringify(response));


                  _tagCache.innerText = JSON.stringify(response);
                }

                var onResponse = _this3._onResponse.items();

                for (var i in onResponse) {
                  onResponse[i](response, true);
                }

                response._http = xhr.status;

                if (xhr.status === OK) {
                  resolve(response);
                } else {
                  reject(response);
                }
              } else {
                if (!post && cache) {// this.cache[fullUri] = response;
                }

                var _onResponse = _this3._onResponse.items();

                for (var _i in _onResponse) {
                  _onResponse[_i](response, true);
                }

                reject(response);
              }
            } else {
              // Repository.lastResponse = xhr.responseText;
              if (!post && cache) {// this.cache[fullUri] = xhr.responseText;
              }

              var _onResponse2 = _this3._onResponse.items();

              for (var _i2 in _onResponse2) {
                _onResponse2[_i2](xhr, true);
              }

              if (xhr.status === OK) {
                resolve(xhr);
              } else {
                reject(xhr);
              }
            }
          }
        };

        xhr.open(type, fullUri, true);

        if (options.headers) {
          for (var header in options.headers) {
            xhr.setRequestHeader(header, options.headers[header]);
          }
        }

        xhr.send(formData);
      });

      if (!post) {
        this.runningRequests[fullUri] = reqPromise;
      }

      return reqPromise;
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var regex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^.$/;

      for (var i in this.xhrs) {
        if (!this.xhrs[i]) {
          continue;
        }

        if (i.match(regex)) {
          this.xhrs[i].abort();
          delete this.xhrs[i];
        }
      } // this.xhrs = [];

    }
  }]);

  return Repository;
}();

exports.Repository = Repository;
Repository.xhrs = []; // Repository.lastResponse = null;
  })();
});

require.register("curvature/base/Router.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = void 0;

var _View = require("./View");

var _Cache = require("./Cache");

var _Config = require("Config");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Router = /*#__PURE__*/function () {
  function Router() {
    _classCallCheck(this, Router);
  }

  _createClass(Router, null, [{
    key: "wait",
    value: function wait(view) {
      var _this = this;

      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DOMContentLoaded';
      var node = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      node.addEventListener(event, function () {
        _this.listen(view);
      });
    }
  }, {
    key: "listen",
    value: function listen(mainView) {
      var _this2 = this;

      var routeHistory = [location.toString()];
      var prevHistoryLength = history.length;
      var route = location.pathname + location.search;

      if (location.hash) {
        route += location.hash;
      }

      Object.assign(Router.query, Router.queryOver({}));
      window.addEventListener('popstate', function (event) {
        event.preventDefault();

        if (routeHistory.length && prevHistoryLength == history.length) {
          if (location.toString() == routeHistory[routeHistory.length - 2]) {
            routeHistory.pop();
          } else {
            routeHistory.push(location.toString());
          }
        } else {
          routeHistory.push(location.toString());
          prevHistoryLength = history.length;
        }

        _this2.match(location.pathname, mainView);

        for (var i in _this2.query) {
          delete _this2.query[i];
        }

        Object.assign(Router.query, Router.queryOver({}));
      });
      this.go(route);
    }
  }, {
    key: "go",
    value: function go(route, silent) {
      var _this3 = this;

      document.title = _Config.Config ? _Config.Config.title : 'Curvature 2';
      setTimeout(function () {
        if (silent === 2) {
          history.replaceState(null, null, route);
        } else {
          history.pushState(null, null, route);
        }

        if (!silent) {
          if (silent === false) {
            _this3.path = null;
          }

          window.dispatchEvent(new Event('popstate'));

          if (route.substring(0, 1) === '#') {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          }
        }

        for (var i in _this3.query) {
          delete _this3.query[i];
        }

        Object.assign(Router.query, Router.queryOver({}));
      }, 0);
    }
  }, {
    key: "match",
    value: function match(path, view) {
      var _this4 = this;

      var forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (this.path === path && !forceRefresh) {
        return;
      }

      var eventStart = new CustomEvent('cvRouteStart', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          view: view
        }
      });
      var current = view.args.content;
      var routes = view.routes;
      this.path = path; // this.query  = {};

      for (var i in this.query) {
        delete this.query[i];
      }

      var query = new URLSearchParams(location.search);
      this.queryString = location.search;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = query[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var pair = _step.value;
          this.query[pair[0]] = pair[1];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var args = {},
          selected = false,
          result = '';
      path = path.substr(1).split('/');

      for (var _i in this.query) {
        args[_i] = this.query[_i];
      }

      L1: for (var _i2 in routes) {
        var route = _i2.split('/');

        if (route.length < path.length && route[route.length - 1] !== '*') {
          continue;
        }

        L2: for (var j in route) {
          if (route[j].substr(0, 1) == '%') {
            var argName = null;
            var groups = /^%(\w+)\??/.exec(route[j]);

            if (groups && groups[1]) {
              argName = groups[1];
            }

            if (!argName) {
              throw new Error("".concat(route[j], " is not a valid argument segment in route \"").concat(_i2, "\""));
            }

            if (!path[j]) {
              if (route[j].substr(route[j].length - 1, 1) == '?') {
                args[argName] = '';
              } else {
                continue L1;
              }
            } else {
              args[argName] = path[j];
            }
          } else if (route[j] !== '*' && path[j] !== route[j]) {
            continue L1;
          }
        }

        if (!forceRefresh && current && routes[_i2] instanceof Object && current instanceof routes[_i2] && !(routes[_i2] instanceof Promise) && current.update(args)) {
          view.args.content = current;
          return true;
        }

        selected = _i2;
        result = routes[_i2];

        if (route[route.length - 1] === '*') {
          args.pathparts = path.slice(route.length - 1);
        }

        break;
      }

      document.dispatchEvent(eventStart);

      if (selected in routes && routes[selected] instanceof Object && routes[selected].isView && routes[selected].isView()) {
        result = new routes[selected](args);

        result.root = function () {
          return view;
        };
      } else if (routes[selected] instanceof Function) {
        result = '';

        var _result = routes[selected](args);

        if (_result instanceof Promise) {
          result = false;

          _result.then(function (x) {
            _this4.update(view, path, x);
          })["catch"](function (x) {
            _this4.update(view, path, x);
          });
        } else {
          result = _result;
        }
      } else if (routes[selected] instanceof Promise) {
        result = false;
        routes[selected].then(function (x) {
          _this4.update(view, path, x);
        })["catch"](function (x) {
          _this4.update(view, path, x);
        });
      } else if (routes[selected] instanceof Object) {
        result = new routes[selected](args);
      } else if (typeof routes[selected] == 'string') {
        result = routes[selected];
      }

      this.update(view, path, result); // if(view.args.content instanceof View)
      // {
      // 	// view.args.content.pause(true);
      // 	view.args.content.remove();
      // }
      // if(result !== false)
      // {
      // 	if(document.dispatchEvent(event))
      // 	{
      // 		view.args.content = result;
      // 	}
      // }

      if (result instanceof _View.View) {
        result.pause(false);
        result.update(args, forceRefresh);
      }

      return selected !== false;
    }
  }, {
    key: "update",
    value: function update(view, path, result) {
      var event = new CustomEvent('cvRoute', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          view: view
        }
      });
      var eventEnd = new CustomEvent('cvRouteEnd', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          view: view
        }
      });

      if (result !== false) {
        if (view.args.content instanceof _View.View) {
          // view.args.content.pause(true);
          view.args.content.remove();
        }

        if (document.dispatchEvent(event)) {
          view.args.content = result;
        }

        document.dispatchEvent(eventEnd);
      }
    }
  }, {
    key: "clearCache",
    value: function clearCache() {// this.cache = {};
    }
  }, {
    key: "queryOver",
    value: function queryOver() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var params = new URLSearchParams(location.search);
      var finalArgs = {};
      var query = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = params[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var pair = _step2.value;
          query[pair[0]] = pair[1];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      for (var i in query) {
        finalArgs[i] = query[i];
      }

      for (var _i3 in args) {
        finalArgs[_i3] = args[_i3];
      }

      delete finalArgs['api'];
      return finalArgs;
    }
  }, {
    key: "queryToString",
    value: function queryToString() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var fresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var parts = [],
          finalArgs = args;

      if (!fresh) {
        finalArgs = this.queryOver(args);
      }

      for (var i in finalArgs) {
        if (finalArgs[i] === '') {
          continue;
        }

        parts.push(i + '=' + encodeURIComponent(finalArgs[i]));
      }

      return parts.join('&');
    }
  }, {
    key: "setQuery",
    value: function setQuery(name, value, silent) {
      var args = this.queryOver();
      args[name] = value;

      if (value === undefined) {
        delete args[name];
      }

      var queryString = this.queryToString(args, true);
      this.go(location.pathname + (queryString ? '?' + queryString : ''), silent);
    }
  }]);

  return Router;
}();

exports.Router = Router;
Object.defineProperty(Router, 'query', {
  configurable: false,
  writeable: false,
  value: {}
});
  })();
});

require.register("curvature/base/RuleSet.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleSet = void 0;

var _Dom = require("./Dom");

var _Tag = require("./Tag");

var _View = require("./View");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RuleSet = /*#__PURE__*/function () {
  function RuleSet() {
    _classCallCheck(this, RuleSet);
  }

  _createClass(RuleSet, [{
    key: "add",
    value: function add(selector, callback) {
      this.rules = this.rules || {};
      this.rules[selector] = this.rules[selector] || [];
      this.rules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply() {
      var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      RuleSet.apply(doc, view);

      for (var selector in this.rules) {
        for (var i in this.rules[selector]) {
          var callback = this.rules[selector][i];
          var wrapped = RuleSet.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var node = _step.value;
              wrapped(node);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }
  }], [{
    key: "add",
    value: function add(selector, callback) {
      this.globalRules = this.globalRules || {};
      this.globalRules[selector] = this.globalRules[selector] || [];
      this.globalRules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply() {
      var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      for (var selector in this.globalRules) {
        for (var i in this.globalRules[selector]) {
          var callback = this.globalRules[selector][i];
          var wrapped = this.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var node = _step2.value;
              wrapped(node);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }
    }
  }, {
    key: "wait",
    value: function wait() {
      var _this = this;

      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DOMContentLoaded';
      var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

      var listener = function (event, node) {
        return function () {
          node.removeEventListener(event, listener);
          return _this.apply();
        };
      }(event, node);

      node.addEventListener(event, listener);
    }
  }, {
    key: "wrap",
    value: function wrap(doc, callback) {
      var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (callback instanceof _View.View || callback && callback.prototype && callback.prototype instanceof _View.View) {
        callback = function (callback) {
          return function () {
            return callback;
          };
        }(callback);
      }

      return function (element) {
        if (!element.___cvApplied___) {
          Object.defineProperty(element, '___cvApplied___', {
            enumerable: false,
            writable: true
          });
          element.___cvApplied___ = [];
        }

        for (var i in element.___cvApplied___) {
          if (callback == element.___cvApplied___[i]) {
            return;
          }
        }

        var direct, parentView;

        if (view) {
          direct = parentView = view;

          if (view.viewList) {
            parentView = view.viewList.parent;
          }
        }

        var tag = new _Tag.Tag(element, parentView, null, undefined, direct);
        var parent = tag.element.parentNode;
        var sibling = tag.element.nextSibling;
        var result = callback(tag);

        if (result !== false) {
          element.___cvApplied___.push(callback);
        }

        if (result instanceof HTMLElement) {
          result = new _Tag.Tag(result);
        }

        if (result instanceof _Tag.Tag) {
          if (!result.element.contains(tag.element)) {
            while (tag.element.firstChild) {
              result.element.appendChild(tag.element.firstChild);
            }

            tag.remove();
          }

          if (sibling) {
            parent.insertBefore(result.element, sibling);
          } else {
            parent.appendChild(result.element);
          }
        }

        if (result && result.prototype && result.prototype instanceof _View.View) {
          result = new result();
        }

        if (result instanceof _View.View) {
          if (view) {
            view.cleanup.push(function (r) {
              return function () {
                r.remove();
              };
            }(result));
            result.parent = view;
            view.cleanup.push(view.args.bindTo(function (v, k, t) {
              t[k] = v;
              result.args[k] = v;
            }));
            view.cleanup.push(result.args.bindTo(function (v, k, t, d) {
              t[k] = v;
              view.args[k] = v;
            }));
          }

          tag.clear();
          result.render(tag.element);
        }
      };
    }
  }]);

  return RuleSet;
}();

exports.RuleSet = RuleSet;
  })();
});

require.register("curvature/base/Tag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tag = void 0;

var _Bindable = require("./Bindable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tag = /*#__PURE__*/function () {
  function Tag(element, parent, ref, index, direct) {
    _classCallCheck(this, Tag);

    this.element = _Bindable.Bindable.makeBindable(element);
    this.parent = parent;
    this.direct = direct;
    this.ref = ref;
    this.index = index;
    this.cleanup = [];
    this.proxy = _Bindable.Bindable.makeBindable(this); // this.detachListener = (event) => {
    // 	return;
    // 	if(event.target != this.element)
    // 	{
    // 		return;
    // 	}
    // 	if(event.path[event.path.length -1] !== window)
    // 	{
    // 		return;
    // 	}
    // 	this.element.removeEventListener('cvDomDetached', this.detachListener);
    // 	this.remove();
    // };
    // this.element.addEventListener('cvDomDetached', this.detachListener);
    // return this.proxy;
  }

  _createClass(Tag, [{
    key: "remove",
    value: function remove() {
      _Bindable.Bindable.clearBindings(this);

      var cleanup;

      while (cleanup = this.cleanup.shift()) {
        cleanup();
      }

      this.clear();

      if (!this.element) {
        return;
      }

      var detachEvent = new Event('cvDomDetached');
      this.element.dispatchEvent(detachEvent);
      this.element.remove();
      this.element = this.ref = this.parent = null;
    }
  }, {
    key: "clear",
    value: function clear() {
      if (!this.element) {
        return;
      }

      var detachEvent = new Event('cvDomDetached');

      while (this.element.firstChild) {
        this.element.firstChild.dispatchEvent(detachEvent);
        this.element.removeChild(this.element.firstChild);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    }
  }]);

  return Tag;
}();

exports.Tag = Tag;
  })();
});

require.register("curvature/base/View.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Bindable = require("./Bindable");

var _ViewList = require("./ViewList");

var _Router = require("./Router");

var _Dom = require("./Dom");

var _Tag = require("./Tag");

var _Bag = require("./Bag");

var _RuleSet = require("./RuleSet");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var dontParse = Symbol('dontParse');
var moveIndex = 0;

var View = /*#__PURE__*/function () {
  _createClass(View, [{
    key: "_id",
    get: function get() {
      if (!this.__id) {
        Object.defineProperty(this, '__id', {
          configurable: false,
          writable: false,
          value: this.uuid()
        });
      }

      return this.__id;
    }
  }]);

  function View() {
    var _this2 = this;

    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var mainView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, View);

    Object.defineProperty(this, '___VIEW___', {
      enumerable: false,
      writable: true
    });
    this.___VIEW___ = View;
    Object.defineProperty(this, 'args', {
      configurable: false,
      writable: false,
      value: _Bindable.Bindable.makeBindable(args)
    });

    var _this = this;

    if (!this.args._id) {
      Object.defineProperty(this.args, '_id', {
        configurable: false,
        get: function get() {
          return _this._id;
        }
      });
    }

    this.template = "";
    this.document = "";
    this.firstNode = null;
    this.lastNode = null;
    this.nodes = null;
    this.mainView = null;
    this.cleanup = [];
    this._onRemove = new _Bag.Bag(function (i, s, a) {// console.log('View _onRemove', i, s, a);
    });
    this.attach = new _Bag.Bag(function (i, s, a) {});
    this.detach = new _Bag.Bag(function (i, s, a) {});
    this.eventCleanup = [];
    this.parent = null;
    this.viewList = null;
    this.viewLists = {};
    this.withViews = {};
    this.tags = _Bindable.Bindable.makeBindable({});
    this.intervals = [];
    this.timeouts = [];
    this.frames = [];
    this.ruleSet = new _RuleSet.RuleSet();
    this.preRuleSet = new _RuleSet.RuleSet();
    this.subBindings = {};
    this.subTemplates = {};
    this.removed = false;
    this.preserve = false;
    this.interpolateRegex = /(\[\[((?:\$+)?[\w\.\|]+)\]\])/g;
    this.rendered = new Promise(function (accept, reject) {
      Object.defineProperty(_this2, 'renderComplete', {
        configurable: false,
        writable: false,
        value: accept
      });
    });
  }

  _createClass(View, [{
    key: "onFrame",
    value: function onFrame(callback) {
      var _this3 = this;

      var stopped = false;

      var cancel = function cancel() {
        stopped = true;
      };

      var c = function c(timestamp) {
        if (_this3.removed || stopped) {
          return;
        }

        callback(Date.now());
        requestAnimationFrame(c);
      };

      requestAnimationFrame(function () {
        return c(Date.now());
      });
      return cancel;
    }
  }, {
    key: "onNextFrame",
    value: function onNextFrame(callback) {
      return requestAnimationFrame(function () {
        return callback(Date.now());
      });
    }
  }, {
    key: "onIdle",
    value: function onIdle(callback) {
      return requestIdleCallback(function () {
        return callback(Date.now());
      });
    }
  }, {
    key: "onTimeout",
    value: function onTimeout(time, callback) {
      var _this4 = this;

      var wrappedCallback = function wrappedCallback() {
        _this4.timeouts[index].fired = true;
        _this4.timeouts[index].callback = null;
        callback();
      };

      var timeout = setTimeout(wrappedCallback, time);
      var index = this.timeouts.length;
      this.timeouts.push({
        timeout: timeout,
        callback: wrappedCallback,
        time: time,
        fired: false,
        created: new Date().getTime(),
        paused: false
      });
      return timeout;
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout(_x) {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function (timeout) {
      for (var i in this.timeouts) {
        if (timeout === this.timeouts[i].timeout) {
          clearTimeout(this.timeouts[i].timeout);
          delete this.timeouts[i];
        }
      }
    })
  }, {
    key: "onInterval",
    value: function onInterval(time, callback) {
      var timeout = setInterval(callback, time);
      this.intervals.push({
        timeout: timeout,
        callback: callback,
        time: time,
        paused: false
      });
      return timeout;
    }
  }, {
    key: "clearInterval",
    value: function (_clearInterval) {
      function clearInterval(_x2) {
        return _clearInterval.apply(this, arguments);
      }

      clearInterval.toString = function () {
        return _clearInterval.toString();
      };

      return clearInterval;
    }(function (timeout) {
      for (var i in this.intervals) {
        if (timeout === this.intervals[i].timeout) {
          clearInterval(this.intervals[i].timeout);
          delete this.intervals[i];
        }
      }
    })
  }, {
    key: "pause",
    value: function pause() {
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (paused === undefined) {
        this.paused = !this.paused;
      }

      this.paused = paused;

      if (this.paused) {
        for (var i in this.timeouts) {
          if (this.timeouts[i].fired) {
            delete this.timeouts[i];
            continue;
          }

          clearTimeout(this.timeouts[i].timeout);
        }

        for (var _i in this.intervals) {
          clearInterval(this.intervals[_i].timeout);
        }
      } else {
        for (var _i2 in this.timeouts) {
          if (!this.timeouts[_i2].timeout.paused) {
            continue;
          }

          if (this.timeouts[_i2].fired) {
            delete this.timeouts[_i2];
            continue;
          }

          this.timeouts[_i2].timeout = setTimeout(this.timeouts[_i2].callback, this.timeouts[_i2].time);
        }

        for (var _i3 in this.intervals) {
          if (!this.intervals[_i3].timeout.paused) {
            continue;
          }

          this.intervals[_i3].timeout.paused = false;
          this.intervals[_i3].timeout = setInterval(this.intervals[_i3].callback, this.intervals[_i3].time);
        }
      }

      for (var _i4 in this.viewLists) {
        if (!this.viewLists[_i4]) {
          return;
        }

        this.viewLists[_i4].pause(!!paused);
      }

      for (var _i5 in this.tags) {
        if (Array.isArray(this.tags[_i5])) {
          for (var j in this.tags[_i5]) {
            this.tags[_i5][j].pause(!!paused);
          }

          continue;
        }

        this.tags[_i5].pause(!!paused);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$nodes;

      var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var insertPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (parentNode instanceof View) {
        parentNode = parentNode.firstNode.parentNode;
      }

      if (insertPoint instanceof View) {
        insertPoint = insertPoint.firstNode;
      }

      if (this.firstNode) {
        return this.reRender(parentNode, insertPoint);
      }

      var templateParsed = this.template instanceof DocumentFragment ? this.template.cloneNode(true) : View.templates.has(this.template);
      var subDoc = templateParsed ? this.template instanceof DocumentFragment ? templateParsed : View.templates.get(this.template).cloneNode(true) : document.createRange().createContextualFragment(this.template);

      if (!templateParsed && !(this.template instanceof DocumentFragment)) {
        View.templates.set(this.template, subDoc.cloneNode(true));
      }

      this.mainView || this.preRuleSet.apply(subDoc, this);
      this.mapTags(subDoc);
      this.mainView || this.ruleSet.apply(subDoc, this);
      this.nodes = [];

      if (window['devmode'] === true) {
        this.firstNode = document.createComment("Template ".concat(this._id, " Start"));
        this.lastNode = document.createComment("Template ".concat(this._id, " End"));
      } else {
        this.firstNode = document.createTextNode('');
        this.lastNode = document.createTextNode('');
      }

      (_this$nodes = this.nodes).push.apply(_this$nodes, [this.firstNode].concat(_toConsumableArray(Array.from(subDoc.childNodes)), [this.lastNode]));

      if (parentNode) {
        var rootNode = parentNode.getRootNode();
        var toRoot = false;
        var moveType = 'internal';

        if (rootNode === document) {
          toRoot = true;
          moveType = 'external';
        }

        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }

        parentNode.insertBefore(subDoc, this.lastNode);
        moveIndex++;

        if (toRoot) {
          this.attached(rootNode, parentNode);
          var attach = this.attach.items();

          for (var i in attach) {
            attach[i](rootNode, parentNode);
          }

          this.nodes.filter(function (n) {
            return n.nodeType !== Node.COMMENT_NODE;
          }).map(function (child) {
            child.dispatchEvent(new Event('cvDomAttached', {
              bubbles: true,
              target: child
            }));
          });
        }
      }

      this.renderComplete(this.nodes);
      this.postRender(parentNode);
      return this.nodes;
    }
  }, {
    key: "reRender",
    value: function reRender(parentNode, insertPoint) {
      var subDoc = new DocumentFragment();

      if (this.firstNode.getRootNode() === document) {
        for (var i in this.detach) {
          this.detach[i]();
        }

        this.nodes.filter(function (n) {
          return n.nodeType === Node.ELEMENT_NODE;
        }).map(function (child) {
          child.dispatchEvent(new Event('cvDomDetached', {
            bubbles: true,
            target: child
          }));
        });
      }

      subDoc.append.apply(subDoc, _toConsumableArray(this.nodes)); // subDoc.appendChild(this.firstNode);
      // subDoc.appendChild(this.lastNode);

      if (parentNode) {
        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }

        parentNode.insertBefore(subDoc, this.lastNode);
        var rootNode = parentNode.getRootNode();

        if (rootNode === document) {
          this.nodes.filter(function (n) {
            return n.nodeType === Node.ELEMENT_NODE;
          }).map(function (child) {
            child.dispatchEvent(new Event('cvDomAttached', {
              bubbles: true,
              target: child
            }));
          });
          var attach = this.attach.items();

          for (var _i6 in attach) {
            attach[_i6](rootNode, parentNode);
          }
        }
      }

      return this.nodes;
    }
  }, {
    key: "mapTags",
    value: function mapTags(subDoc) {
      var _this5 = this;

      _Dom.Dom.mapTags(subDoc, false, function (tag, walker) {
        if (tag[dontParse]) {
          return;
        }

        if (tag.matches) {
          tag = _this5.mapInterpolatableTag(tag);
          tag = tag.matches('[cv-template]') && _this5.mapTemplateTag(tag) || tag;
          tag = tag.matches('[cv-slot]') && _this5.mapSlotTag(tag) || tag;
          tag = tag.matches('[cv-prerender]') && _this5.mapPrendererTag(tag) || tag;
          tag = tag.matches('[cv-link]') && _this5.mapLinkTag(tag) || tag;
          tag = tag.matches('[cv-attr]') && _this5.mapAttrTag(tag) || tag;
          tag = tag.matches('[cv-expand]') && _this5.mapExpandableTag(tag) || tag;
          tag = tag.matches('[cv-ref]') && _this5.mapRefTag(tag) || tag;
          tag = tag.matches('[cv-on]') && _this5.mapOnTag(tag) || tag;
          tag = tag.matches('[cv-each]') && _this5.mapEachTag(tag) || tag;
          tag = tag.matches('[cv-bind]') && _this5.mapBindTag(tag) || tag;
          tag = tag.matches('[cv-if]') && _this5.mapIfTag(tag) || tag;
          tag = tag.matches('[cv-with]') && _this5.mapWithTag(tag) || tag;
        } else {
          tag = _this5.mapInterpolatableTag(tag);
        }

        if (tag !== walker.currentNode) {
          walker.currentNode = tag;
        }
      });
    }
  }, {
    key: "mapExpandableTag",
    value: function mapExpandableTag(tag) {
      var _this6 = this;

      /*/
      const tagCompiler = this.compileExpandableTag(tag);
      	const newTag = tagCompiler(this);
      	tag.replaceWith(newTag);
      	return newTag;
      /*/
      var expandProperty = tag.getAttribute('cv-expand');

      var expandArg = _Bindable.Bindable.makeBindable(this.args[expandProperty] || {});

      tag.removeAttribute('cv-expand');

      var _loop = function _loop(i) {
        if (i === 'name' || i === 'type') {
          return "continue";
        }

        var debind = expandArg.bindTo(i, function (tag, i) {
          return function (v) {
            tag.setAttribute(i, v);
          };
        }(tag, i));

        _this6.onRemove(function () {
          debind();

          if (expandArg.isBound()) {
            _Bindable.Bindable.clearBindings(expandArg);
          }
        });
      };

      for (var i in expandArg) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
      }

      return tag; //*/
    }
  }, {
    key: "compileExpandableTag",
    value: function compileExpandableTag(sourceTag) {
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);
        var expandProperty = tag.getAttribute('cv-expand');

        var expandArg = _Bindable.Bindable.makeBindable(bindingView.args[expandProperty] || {});

        tag.removeAttribute('cv-expand');

        var _loop2 = function _loop2(i) {
          if (i === 'name' || i === 'type') {
            return "continue";
          }

          var debind = expandArg.bindTo(i, function (tag, i) {
            return function (v) {
              tag.setAttribute(i, v);
            };
          }(tag, i));
          bindingView.onRemove(function () {
            debind();

            if (expandArg.isBound()) {
              _Bindable.Bindable.clearBindings(expandArg);
            }
          });
        };

        for (var i in expandArg) {
          var _ret2 = _loop2(i);

          if (_ret2 === "continue") continue;
        }

        return tag;
      };
    }
  }, {
    key: "mapAttrTag",
    value: function mapAttrTag(tag) {
      //*/
      var tagCompiler = this.compileAttrTag(tag);
      var newTag = tagCompiler(this);
      tag.replaceWith(newTag);
      return newTag;
      /*/
      	let attrProperty = tag.getAttribute('cv-attr');
      	tag.removeAttribute('cv-attr');
      	let pairs = attrProperty.split(',');
      let attrs = pairs.map((p) => p.split(':'));
      	for (let i in attrs)
      {
      	let proxy        = this.args;
      	let bindProperty = attrs[i][1];
      	let property     = bindProperty;
      		if(bindProperty.match(/\./))
      	{
      		[proxy, property] = Bindable.resolve(
      			this.args
      			, bindProperty
      			, true
      		);
      	}
      		let attrib = attrs[i][0];
      		this.onRemove(proxy.bindTo(
      		property
      		, (v)=>{
      			if(v == null)
      			{
      				tag.setAttribute(attrib, '');
      				return;
      			}
      			tag.setAttribute(attrib, v);
      		}
      	));
      }
      	return tag;
      	//*/
    }
  }, {
    key: "compileAttrTag",
    value: function compileAttrTag(sourceTag) {
      var attrProperty = sourceTag.getAttribute('cv-attr');
      var pairs = attrProperty.split(',');
      var attrs = pairs.map(function (p) {
        return p.split(':');
      });
      sourceTag.removeAttribute('cv-attr');
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);

        var _loop3 = function _loop3(i) {
          var bindProperty = attrs[i][1];

          var _Bindable$resolve = _Bindable.Bindable.resolve(bindingView.args, bindProperty, true),
              _Bindable$resolve2 = _slicedToArray(_Bindable$resolve, 2),
              proxy = _Bindable$resolve2[0],
              property = _Bindable$resolve2[1];

          var attrib = attrs[i][0];
          bindingView.onRemove(proxy.bindTo(property, function (v) {
            if (v == null) {
              tag.setAttribute(attrib, '');
              return;
            }

            tag.setAttribute(attrib, v);
          }));
        };

        for (var i in attrs) {
          _loop3(i);
        }

        return tag;
      };
    }
  }, {
    key: "mapInterpolatableTag",
    value: function mapInterpolatableTag(tag) {
      var _this7 = this;

      var regex = this.interpolateRegex;

      if (tag.nodeType === Node.TEXT_NODE) {
        var original = tag.nodeValue;

        if (!this.interpolatable(original)) {
          return tag;
        }

        var header = 0;
        var match;

        var _loop4 = function _loop4() {
          var bindProperty = match[2];
          var unsafeHtml = false;
          var unsafeView = false;
          var propertySplit = bindProperty.split('|');
          var transformer = false;

          if (propertySplit.length > 1) {
            transformer = _this7.stringTransformer(propertySplit.slice(1));
            bindProperty = propertySplit[0];
          }

          if (bindProperty.substr(0, 2) === '$$') {
            unsafeHtml = true;
            unsafeView = true;
            bindProperty = bindProperty.substr(2);
          }

          if (bindProperty.substr(0, 1) === '$') {
            unsafeHtml = true;
            bindProperty = bindProperty.substr(1);
          }

          if (bindProperty.substr(0, 3) === '000') {
            expand = true;
            bindProperty = bindProperty.substr(3);
            return "continue";
          }

          var staticPrefix = original.substring(header, match.index);
          header = match.index + match[1].length;
          var staticNode = document.createTextNode(staticPrefix);
          staticNode[dontParse] = true;
          tag.parentNode.insertBefore(staticNode, tag);
          var dynamicNode = void 0;

          if (unsafeHtml) {
            dynamicNode = document.createElement('div');
          } else {
            dynamicNode = document.createTextNode('');
          }

          dynamicNode[dontParse] = true;
          var proxy = _this7.args;
          var property = bindProperty;

          if (bindProperty.match(/\./)) {
            var _Bindable$resolve3 = _Bindable.Bindable.resolve(_this7.args, bindProperty, true);

            var _Bindable$resolve4 = _slicedToArray(_Bindable$resolve3, 2);

            proxy = _Bindable$resolve4[0];
            property = _Bindable$resolve4[1];
          }

          tag.parentNode.insertBefore(dynamicNode, tag);
          var debind = proxy.bindTo(property, function (v, k, t) {
            if (t[k] instanceof View && t[k] !== v) {
              if (!t[k].preserve) {
                t[k].remove();
              }
            }

            dynamicNode.nodeValue = '';

            if (unsafeView && !(v instanceof View)) {
              var unsafeTemplate = v;
              console.log(unsafeTemplate);
              v = new View(_this7.args, _this7);
              v.template = unsafeTemplate;
            }

            if (v instanceof View) {
              var onAttach = function onAttach(parentNode) {
                v.attached(parentNode);
              };

              _this7.attach.add(onAttach);

              v.render(tag.parentNode, dynamicNode);

              var cleanup = function cleanup() {
                if (!v.preserve) {
                  v.remove();
                }
              };

              _this7.onRemove(cleanup);

              v.onRemove(function () {
                _this7.attach.remove(onAttach);

                _this7._onRemove.remove(cleanup);
              });
            } else {
              if (transformer) {
                v = transformer(v);
              }

              if (v instanceof Object && v.__toString instanceof Function) {
                v = v.__toString();
              }

              if (unsafeHtml) {
                dynamicNode.innerHTML = v;
              } else {
                dynamicNode.nodeValue = v;
              }

              dynamicNode[dontParse] = true;
            }
          });

          _this7.onRemove(function () {
            debind();

            if (!proxy.isBound()) {
              _Bindable.Bindable.clearBindings(proxy);
            }
          });
        };

        while (match = regex.exec(original)) {
          var _ret3 = _loop4();

          if (_ret3 === "continue") continue;
        }

        var staticSuffix = original.substring(header);
        var staticNode = document.createTextNode(staticSuffix);
        staticNode[dontParse] = true;
        tag.parentNode.insertBefore(staticNode, tag);
        tag.nodeValue = '';
      }

      if (tag.nodeType === Node.ELEMENT_NODE) {
        var _loop5 = function _loop5(i) {
          if (!_this7.interpolatable(tag.attributes[i].value)) {
            // console.log('!!', tag.attributes[i].value);
            return "continue";
          } // console.log(tag.attributes[i].value);


          var header = 0;
          var match = void 0;
          var original = tag.attributes[i].value;
          var attribute = tag.attributes[i];
          var bindProperties = {};
          var segments = [];

          while (match = regex.exec(original)) {
            segments.push(original.substring(header, match.index));

            if (!bindProperties[match[2]]) {
              bindProperties[match[2]] = [];
            }

            bindProperties[match[2]].push(segments.length);
            segments.push(match[1]);
            header = match.index + match[1].length;
          }

          segments.push(original.substring(header));

          var _loop6 = function _loop6(j) {
            var proxy = _this7.args;
            var property = j;
            var propertySplit = j.split('|');
            var transformer = false;
            var longProperty = j;

            if (propertySplit.length > 1) {
              transformer = _this7.stringTransformer(propertySplit.slice(1));
              property = propertySplit[0];
            }

            if (property.match(/\./)) {
              var _Bindable$resolve5 = _Bindable.Bindable.resolve(_this7.args, property, true);

              var _Bindable$resolve6 = _slicedToArray(_Bindable$resolve5, 2);

              proxy = _Bindable$resolve6[0];
              property = _Bindable$resolve6[1];
            } // if(property.match(/\./))
            // {
            // 	[proxy, property] = Bindable.resolve(
            // 		this.args
            // 		, property
            // 		, true
            // 	);
            // }
            // console.log(this.args, property);


            var matching = [];
            var bindProperty = j;
            var matchingSegments = bindProperties[longProperty];

            _this7.onRemove(proxy.bindTo(property, function (v, k, t, d) {
              if (transformer) {
                v = transformer(v);
              }

              for (var _i7 in bindProperties) {
                for (var _j in bindProperties[longProperty]) {
                  segments[bindProperties[longProperty][_j]] = t[_i7];

                  if (k === property) {
                    segments[bindProperties[longProperty][_j]] = v;
                  }
                }
              }

              tag.setAttribute(attribute.name, segments.join(''));
            }));

            _this7.onRemove(function () {
              if (!proxy.isBound()) {
                _Bindable.Bindable.clearBindings(proxy);
              }
            });
          };

          for (var j in bindProperties) {
            _loop6(j);
          }
        };

        for (var i = 0; i < tag.attributes.length; i++) {
          var _ret4 = _loop5(i);

          if (_ret4 === "continue") continue;
        }
      }

      return tag;
    }
  }, {
    key: "mapRefTag",
    value: function mapRefTag(tag) {
      var refAttr = tag.getAttribute('cv-ref');

      var _refAttr$split = refAttr.split(':'),
          _refAttr$split2 = _slicedToArray(_refAttr$split, 3),
          refProp = _refAttr$split2[0],
          refClassname = _refAttr$split2[1],
          refKey = _refAttr$split2[2];

      if (!refClassname) {
        refClassname = 'curvature/base/Tag';
      }

      var refClass = this.stringToClass(refClassname);
      tag.removeAttribute('cv-ref');
      Object.defineProperty(tag, '___tag___', {
        enumerable: false,
        writable: true
      });
      this.onRemove(function () {
        tag.___tag___ = null;
        tag.remove();
      });
      var parent = this;
      var direct = this;

      if (this.viewList) {
        parent = this.viewList.parent; // if(!this.viewList.parent.tags[refProp])
        // {
        // 	this.viewList.parent.tags[refProp] = [];
        // }
        // let refKeyVal = this.args[refKey];
        // this.viewList.parent.tags[refProp][refKeyVal] = new refClass(
        // 	tag, this, refProp, refKeyVal
        // );
      } else {// this.tags[refProp] = new refClass(
          // 	tag, this, refProp
          // );
        }

      var tagObject = new refClass(tag, this, refProp, undefined, direct);
      tag.___tag___ = tagObject;
      this.tags[refProp] = tag;

      while (parent) {
        if (!parent.parent) {}

        var refKeyVal = this.args[refKey];

        if (refKeyVal !== undefined) {
          if (!parent.tags[refProp]) {
            parent.tags[refProp] = [];
          }

          parent.tags[refProp][refKeyVal] = tagObject;
        } else {
          parent.tags[refProp] = tagObject;
        }

        parent = parent.parent;
      }

      return tag;
    }
  }, {
    key: "mapBindTag",
    value: function mapBindTag(tag) {
      var _this8 = this;

      var bindArg = tag.getAttribute('cv-bind');
      var proxy = this.args;
      var property = bindArg;
      var top = null;

      if (bindArg.match(/\./)) {
        var _Bindable$resolve7 = _Bindable.Bindable.resolve(this.args, bindArg, true);

        var _Bindable$resolve8 = _slicedToArray(_Bindable$resolve7, 3);

        proxy = _Bindable$resolve8[0];
        property = _Bindable$resolve8[1];
        top = _Bindable$resolve8[2];
      }

      if (proxy !== this.args) {
        this.subBindings[bindArg] = this.subBindings[bindArg] || [];
        this.onRemove(this.args.bindTo(top, function () {
          while (_this8.subBindings.length) {
            _this8.subBindings.shift()();
          }
        }));
      }

      var unsafeHtml = false;

      if (property.substr(0, 1) === '$') {
        property = property.substr(1);
        unsafeHtml = true;
      }

      var debind = proxy.bindTo(property, function (v, k, t, d, p) {
        if (p instanceof View && p !== v) {
          p.remove();
        }

        var autoChangedEvent = new CustomEvent('cvAutoChanged', {
          bubbles: true
        });

        if (tag.tagName === 'INPUT' || tag.tagName === 'SELECT' || tag.tagName === 'TEXTAREA') {
          var _type = tag.getAttribute('type');

          if (_type && _type.toLowerCase() === 'checkbox') {
            tag.checked = !!v;
            tag.dispatchEvent(autoChangedEvent);
          } else if (_type && _type.toLowerCase() === 'radio') {
            tag.checked = v == tag.value;
            tag.dispatchEvent(autoChangedEvent);
          } else if (_type !== 'file') {
            if (tag.tagName === 'SELECT') {
              // console.log(k, v, tag.outerHTML, tag.options.length);
              for (var i in tag.options) {
                var option = tag.options[i];

                if (option.value == v) {
                  tag.selectedIndex = i;
                }
              }
            }

            tag.value = v == null ? '' : v;
            tag.dispatchEvent(autoChangedEvent);
          }
        } else {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = tag.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var node = _step.value;
              node.remove();
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          if (v instanceof View) {
            var onAttach = function onAttach(parentNode) {
              v.attached(parentNode);
            };

            _this8.attach.add(onAttach);

            v.render(tag);
            v.onRemove(function () {
              return _this8.attach.remove(onAttach);
            });
          } else if (unsafeHtml) {
            tag.innerHTML = v;
          } else {
            tag.textContent = v;
          }
        }
      });

      if (proxy !== this.args) {
        this.subBindings[bindArg].push(debind);
      }

      this.onRemove(debind);
      var type = tag.getAttribute('type');
      var multi = tag.getAttribute('multiple');

      var inputListener = function inputListener(event) {
        // console.log(event, proxy, property, event.target.value);
        if (event.target !== tag) {
          return;
        }

        if (type && type.toLowerCase() === 'checkbox') {
          if (tag.checked) {
            proxy[property] = event.target.getAttribute('value');
          } else {
            proxy[property] = false;
          }
        } else if (type === 'file' && multi) {
          var files = Array.from(event.target.files);
          var current = proxy[property] || proxy.___deck___[property];

          if (!current || !files.length) {
            proxy[property] = files;
          } else {
            var _loop7 = function _loop7(i) {
              if (files[i] !== current[i]) {
                files[i].toJSON = function () {
                  return {
                    name: file[i].name,
                    size: file[i].size,
                    type: file[i].type,
                    date: file[i].lastModified
                  };
                };

                current[i] = files[i];
                return "break";
              }
            };

            for (var i in files) {
              var _ret5 = _loop7(i);

              if (_ret5 === "break") break;
            }
          }
        } else if (type === 'file' && !multi) {
          var _file = event.target.files.item(0);

          _file.toJSON = function () {
            return {
              name: _file.name,
              size: _file.size,
              type: _file.type,
              date: _file.lastModified
            };
          };

          proxy[property] = _file;
        } else {
          proxy[property] = event.target.value;
        }
      };

      if (type === 'file' || type === 'radio') {
        tag.addEventListener('change', inputListener);
      } else {
        tag.addEventListener('input', inputListener);
        tag.addEventListener('change', inputListener);
        tag.addEventListener('value-changed', inputListener);
      }

      this.onRemove(function (tag, eventListener) {
        return function () {
          if (type === 'file' || type === 'radio') {
            tag.removeEventListener('change', inputListener);
          } else {
            tag.removeEventListener('input', inputListener);
            tag.removeEventListener('change', inputListener);
            tag.removeEventListener('value-changed', inputListener);
          }

          tag = undefined;
          eventListener = undefined;
        };
      }(tag, inputListener));
      tag.removeAttribute('cv-bind');
      return tag;
    }
  }, {
    key: "mapOnTag",
    value: function mapOnTag(tag) {
      var _this9 = this;

      var referent = String(tag.getAttribute('cv-on'));
      var action = referent.split(';').map(function (a) {
        return a.split(':');
      }).map(function (a) {
        a = a.map(function (a) {
          return a.trim();
        });
        var eventName = a[0].trim();

        if (!eventName) {
          return;
        }

        var callbackName = a[1];
        var eventFlags = String(a[2] || '');
        var argList = [];
        var groups = /(\w+)(?:\(([$\w\s'",]+)\))?/.exec(callbackName);

        if (!groups) {
          throw new Error('Invalid event method referent: ' + tag.getAttribute('cv-on'));
        }

        if (groups.length) {
          callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');

          if (groups[2]) {
            argList = groups[2].split(',').map(function (s) {
              return s.trim();
            });
          }
        }

        var eventMethod;
        var parent = _this9;

        while (parent) {
          if (typeof parent[callbackName] === 'function') {
            var _ret6 = function () {
              var _parent = parent;
              var _callBackName = callbackName;

              eventMethod = function eventMethod() {
                _parent[_callBackName].apply(_parent, arguments);
              };

              return "break";
            }();

            if (_ret6 === "break") break;
          }

          if (parent.viewList && parent.viewList.parent) {
            parent = parent.viewList.parent;
          } else if (parent.parent) {
            parent = parent.parent;
          } else {
            break;
          }
        }

        var eventListener = function eventListener(event) {
          var argRefs = argList.map(function (arg) {
            var match;

            if (parseInt(arg) == arg) {
              return arg;
            } else if (arg === 'event' || arg === '$event') {
              return event;
            } else if (arg === '$view') {
              return parent;
            } else if (arg === '$tag') {
              return tag;
            } else if (arg === '$parent') {
              return _this9.parent;
            } else if (arg === '$subview') {
              return _this9;
            } else if (arg in _this9.args) {
              return _this9.args[arg];
            } else if (match = /^['"](\w+?)["']$/.exec(arg)) {
              return match[1];
            }
          });

          if (!(typeof eventMethod === 'function')) {
            throw new Error("".concat(callbackName, " is not defined on View object.") + "\n" + "Tag:" + "\n" + "".concat(tag.outerHTML));
          }

          eventMethod.apply(void 0, _toConsumableArray(argRefs));
        };

        var eventOptions = {};

        if (eventFlags.includes('p')) {
          eventOptions.passive = true;
        } else if (eventFlags.includes('P')) {
          eventOptions.passive = false;
        }

        if (eventFlags.includes('c')) {
          eventOptions.capture = true;
        } else if (eventFlags.includes('C')) {
          eventOptions.capture = false;
        }

        if (eventFlags.includes('o')) {
          eventOptions.once = true;
        } else if (eventFlags.includes('O')) {
          eventOptions.once = false;
        }

        switch (eventName) {
          case '_init':
            eventListener();
            break;

          case '_attach':
            _this9.attach.add(eventListener);

            break;

          case '_detach':
            _this9.detach.add(eventListener);

            break;

          default:
            tag.addEventListener(eventName, eventListener, eventOptions);

            _this9.onRemove(function () {
              tag.removeEventListener(eventName, eventListener, eventOptions);
            });

            break;
        }

        return [eventName, callbackName, argList];
      });
      tag.removeAttribute('cv-on');
      return tag;
    }
  }, {
    key: "mapLinkTag",
    value: function mapLinkTag(tag) {
      /*/
      const tagCompiler = this.compileLinkTag(tag);
      	const newTag = tagCompiler(this);
      	tag.replaceWith(newTag);
      	return newTag;
      /*/
      var linkAttr = tag.getAttribute('cv-link');
      tag.setAttribute('href', linkAttr);

      var linkClick = function linkClick(event) {
        event.preventDefault();

        if (linkAttr.substring(0, 4) === 'http' || linkAttr.substring(0, 2) === '//') {
          window.open(tag.getAttribute('href', linkAttr));
          return;
        }

        _Router.Router.go(tag.getAttribute('href'));
      };

      tag.addEventListener('click', linkClick);
      this.onRemove(function (tag, eventListener) {
        return function () {
          tag.removeEventListener('click', eventListener);
          tag = undefined;
          eventListener = undefined;
        };
      }(tag, linkClick));
      tag.removeAttribute('cv-link');
      return tag; //*/
    }
  }, {
    key: "compileLinkTag",
    value: function compileLinkTag(sourceTag) {
      var linkAttr = sourceTag.getAttribute('cv-link');
      sourceTag.removeAttribute('cv-link');
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);
        tag.setAttribute('href', linkAttr);
        tag.addEventListener('click', View.linkClicked);
        bindingView.onRemove(function () {
          return tag.removeEventListener(View.linkClicked);
        });
        return tag;
      };
    }
  }, {
    key: "mapPrendererTag",
    value: function mapPrendererTag(tag) {
      var prerenderAttr = tag.getAttribute('cv-prerender');
      var prerendering = window.prerenderer || navigator.userAgent.match(/prerender/i);

      if (prerenderAttr === 'never' && prerendering || prerenderAttr === 'only' && !prerendering) {
        tag.parentNode.removeChild(tag);
      }

      return tag;
    }
  }, {
    key: "mapWithTag",
    value: function mapWithTag(tag) {
      var _this10 = this;

      var withAttr = tag.getAttribute('cv-with');
      var carryAttr = tag.getAttribute('cv-carry');
      tag.removeAttribute('cv-with');
      tag.removeAttribute('cv-carry');
      var subTemplate = new DocumentFragment();
      Array.from(tag.childNodes).map(function (n) {
        return subTemplate.appendChild(n);
      });
      var carryProps = [];

      if (carryAttr) {
        carryProps = carryAttr.split(',').map(function (s) {
          return s.trim();
        });
      }

      var debind = this.args.bindTo(withAttr, function (v, k, t, d) {
        if (_this10.withViews[k]) {
          _this10.withViews[k].remove();
        }

        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }

        var view = new View({}, _this10);

        _this10.onRemove(function (view) {
          return function () {
            view.remove();
          };
        }(view));

        view.template = subTemplate;
        view.parent = _this10;

        var _loop8 = function _loop8(i) {
          var debind = _this10.args.bindTo(carryProps[i], function (v, k) {
            view.args[k] = v;
          });

          view.onRemove(debind);

          _this10.onRemove(function () {
            debind();
            view.remove();
          });
        };

        for (var i in carryProps) {
          _loop8(i);
        }

        var _loop9 = function _loop9(_i8) {
          var debind = v.bindTo(_i8, function (v, k) {
            view.args[k] = v;
          });

          _this10.onRemove(function () {
            debind();

            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }

            view.remove();
          });

          view.onRemove(function () {
            debind();

            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }
          });
        };

        for (var _i8 in v) {
          _loop9(_i8);
        }

        view.render(tag);
        _this10.withViews[k] = view;
      });
      this.onRemove(debind);
      return tag;
    }
  }, {
    key: "mapEachTag",
    value: function mapEachTag(tag) {
      var _this11 = this;

      var eachAttr = tag.getAttribute('cv-each');
      tag.removeAttribute('cv-each');
      var subTemplate = new DocumentFragment();
      Array.from(tag.childNodes).map(function (n) {
        return subTemplate.appendChild(n);
      });

      var _eachAttr$split = eachAttr.split(':'),
          _eachAttr$split2 = _slicedToArray(_eachAttr$split, 3),
          eachProp = _eachAttr$split2[0],
          asProp = _eachAttr$split2[1],
          keyProp = _eachAttr$split2[2];

      var debind = this.args.bindTo(eachProp, function (v, k, t, d, p) {
        if (_this11.viewLists[eachProp]) {
          _this11.viewLists[eachProp].remove();
        }

        var viewList = new _ViewList.ViewList(subTemplate, asProp, v, _this11, keyProp);

        var viewListRemover = function viewListRemover() {
          return viewList.remove();
        };

        _this11.onRemove(viewListRemover);

        viewList.onRemove(function () {
          return _this11._onRemove.remove(viewListRemover);
        });

        var debindA = _this11.args.bindTo(function (v, k, t, d) {
          if (k === '_id') {
            return;
          }

          viewList.args.subArgs[k] = v;
        });

        var debindB = viewList.args.bindTo(function (v, k, t, d, p) {
          if (k === '_id' || k === 'value' || k.substring(0, 3) === '___') {
            return;
          }

          if (k in _this11.args) {
            _this11.args[k] = v;
          }
        });

        _this11.onRemove(debindA);

        _this11.onRemove(debindB);

        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }

        _this11.viewLists[eachProp] = viewList;
        viewList.render(tag);
      });
      this.onRemove(debind);
      return tag;
    }
  }, {
    key: "mapIfTag",
    value: function mapIfTag(tag) {
      /*/
      const tagCompiler = this.compileIfTag(tag);
      	const newTag = tagCompiler(this);
      	tag.replaceWith(newTag);
      	return newTag;
      	/*/
      var sourceTag = tag;
      var ifProperty = sourceTag.getAttribute('cv-if');
      var inverted = false;
      sourceTag.removeAttribute('cv-if');

      if (ifProperty.substr(0, 1) === '!') {
        ifProperty = ifProperty.substr(1);
        inverted = true;
      }

      var subTemplate = new DocumentFragment();
      Array.from(sourceTag.childNodes).map(function (n) {
        return subTemplate.appendChild(n);
      } // n => subTemplate.appendChild(n.cloneNode(true))
      );
      var bindingView = this;
      var ifDoc = new DocumentFragment();
      var view = new View(this.args, bindingView);
      view.template = subTemplate;
      view.parent = bindingView; // bindingView.syncBind(view);

      var proxy = bindingView.args;
      var property = ifProperty;

      if (ifProperty.match(/\./)) {
        var _Bindable$resolve9 = _Bindable.Bindable.resolve(bindingView.args, ifProperty, true);

        var _Bindable$resolve10 = _slicedToArray(_Bindable$resolve9, 2);

        proxy = _Bindable$resolve10[0];
        property = _Bindable$resolve10[1];
      }

      var hasRendered = false;
      var propertyDebind = proxy.bindTo(property, function (v, k) {
        if (!hasRendered) {
          var initValue = proxy[property];
          var renderDoc = !!initValue ^ !!inverted ? tag : ifDoc;
          view.render(renderDoc);
          hasRendered = true;
          return;
        }

        if (Array.isArray(v)) {
          v = !!v.length;
        }

        if (inverted) {
          v = !v;
        }

        if (v) {
          tag.appendChild(ifDoc);
        } else {
          view.nodes.map(function (n) {
            return ifDoc.appendChild(n);
          });
        }
      }); // const propertyDebind = this.args.bindChain(property, onUpdate);

      bindingView.onRemove(propertyDebind);

      var bindableDebind = function bindableDebind() {
        if (!proxy.isBound()) {
          _Bindable.Bindable.clearBindings(proxy);
        }
      };

      var viewDebind = function viewDebind() {
        propertyDebind();
        bindableDebind();

        bindingView._onRemove.remove(propertyDebind);

        bindingView._onRemove.remove(bindableDebind);
      };

      bindingView.onRemove(viewDebind);
      return tag; //*/
    }
  }, {
    key: "compileIfTag",
    value: function compileIfTag(sourceTag) {
      var ifProperty = sourceTag.getAttribute('cv-if');
      var inverted = false;
      sourceTag.removeAttribute('cv-if');

      if (ifProperty.substr(0, 1) === '!') {
        ifProperty = ifProperty.substr(1);
        inverted = true;
      }

      var subTemplate = new DocumentFragment();
      Array.from(sourceTag.childNodes).map(function (n) {
        return subTemplate.appendChild(n.cloneNode(true));
      });
      return function (bindingView) {
        var tag = sourceTag.cloneNode();
        var ifDoc = new DocumentFragment();
        var view = new View({}, bindingView);
        view.template = subTemplate;
        view.parent = bindingView;
        bindingView.syncBind(view);
        var proxy = bindingView.args;
        var property = ifProperty;

        if (ifProperty.match(/\./)) {
          var _Bindable$resolve11 = _Bindable.Bindable.resolve(bindingView.args, ifProperty, true);

          var _Bindable$resolve12 = _slicedToArray(_Bindable$resolve11, 2);

          proxy = _Bindable$resolve12[0];
          property = _Bindable$resolve12[1];
        }

        var hasRendered = false;
        var propertyDebind = proxy.bindTo(property, function (v, k) {
          if (!hasRendered) {
            var renderDoc = bindingView.args[property] || inverted ? tag : ifDoc;
            view.render(renderDoc);
            hasRendered = true;
            return;
          }

          if (Array.isArray(v)) {
            v = !!v.length;
          }

          if (inverted) {
            v = !v;
          }

          if (v) {
            tag.appendChild(ifDoc);
          } else {
            view.nodes.map(function (n) {
              return ifDoc.appendChild(n);
            });
          }
        }); // let cleaner = bindingView;
        // while(cleaner.parent)
        // {
        // 	cleaner = cleaner.parent;
        // }

        bindingView.onRemove(propertyDebind);

        var bindableDebind = function bindableDebind() {
          if (!proxy.isBound()) {
            _Bindable.Bindable.clearBindings(proxy);
          }
        };

        var viewDebind = function viewDebind() {
          propertyDebind();
          bindableDebind();

          bindingView._onRemove.remove(propertyDebind);

          bindingView._onRemove.remove(bindableDebind);
        };

        view.onRemove(viewDebind);
        return tag;
      };
    }
  }, {
    key: "mapTemplateTag",
    value: function mapTemplateTag(tag) {
      var templateName = tag.getAttribute('cv-template');
      tag.removeAttribute('cv-template');

      this.subTemplates[templateName] = function () {
        return tag.tagName === 'TEMPLATE' ? tag.content.cloneNode(true) : new DocumentFragment(tag.innerHTML);
      };

      return tag;
    }
  }, {
    key: "mapSlotTag",
    value: function mapSlotTag(tag) {
      var templateName = tag.getAttribute('cv-slot');
      var getTemplate = this.subTemplates[templateName];

      if (!getTemplate) {
        return;
      }

      var template = getTemplate();
      tag.removeAttribute('cv-slot');

      while (tag.firstChild) {
        tag.firstChild.remove();
      }

      tag.appendChild(template);
      return tag;
    } // compileTag(sourceTag)
    // {
    // 	return (bindingView) => {
    // 		const tag = sourceTag.cloneNode(true);
    // 		return tag;
    // 	};
    // }

  }, {
    key: "syncBind",
    value: function syncBind(subView) {
      var _this12 = this;

      var debindA = this.args.bindTo(function (v, k, t, d) {
        if (k === '_id') {
          return;
        }

        if (subView.args[k] !== v) {
          subView.args[k] = v;
        }
      }); // for(let i in this.args)
      // {
      // 	if(i == '_id')
      // 	{
      // 		continue;
      // 	}
      // 	subView.args[i] = this.args[i];
      // }

      var debindB = subView.args.bindTo(function (v, k, t, d, p) {
        if (k === '_id') {
          return;
        }

        var newRef = v;
        var oldRef = p;

        if (newRef instanceof View) {
          newRef = newRef.___ref___;
        }

        if (oldRef instanceof View) {
          oldRef = oldRef.___ref___;
        }

        if (newRef !== oldRef && oldRef instanceof View) {
          p.remove();
        }

        if (k in _this12.args) {
          _this12.args[k] = v;
        }
      });
      this.onRemove(debindA);
      this.onRemove(debindB);
      subView.onRemove(function () {
        _this12._onRemove.remove(debindA);

        _this12._onRemove.remove(debindB);
      });
    }
  }, {
    key: "postRender",
    value: function postRender(parentNode) {}
  }, {
    key: "attached",
    value: function attached(parentNode) {}
  }, {
    key: "interpolatable",
    value: function interpolatable(str) {
      return !!String(str).match(this.interpolateRegex);
    }
  }, {
    key: "uuid",
    value: function uuid() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this13 = this;

      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var remover = function remover() {
        _this13.firstNode = _this13.lastNode = undefined;

        for (var _i9 in _this13.nodes) {
          _this13.nodes[_i9].dispatchEvent(new Event('cvDomDetached'));

          _this13.nodes[_i9].remove();
        } // Bindable.clearBindings(this.args);

      };

      if (now) {
        remover();
      } else {
        requestAnimationFrame(remover);
      }

      var callbacks = this._onRemove.items();

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var callback = _step2.value;

          this._onRemove.remove(callback);

          callback();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var cleanup;

      while (cleanup = this.cleanup.shift()) {
        cleanup && cleanup();
      }

      for (var _i10 in this.viewLists) {
        if (!this.viewLists[_i10]) {
          continue;
        }

        this.viewLists[_i10].remove();
      }

      this.viewLists = [];

      for (var _i11 in this.timeouts) {
        clearInterval(this.timeouts[_i11].timeout);
        delete this.timeouts[_i11];
      }

      for (var i in this.intervals) {
        clearInterval(this.intervals[i].timeout);
        delete this.intervals[i];
      }

      this.removed = true;
    }
  }, {
    key: "findTag",
    value: function findTag(selector) {
      for (var i in this.nodes) {
        var result = void 0;

        if (!this.nodes[i].querySelector) {
          continue;
        }

        if (this.nodes[i].matches(selector)) {
          return this.nodes[i];
        }

        if (result = this.nodes[i].querySelector(selector)) {
          return result;
        }
      }
    }
  }, {
    key: "findTags",
    value: function findTags(selector) {
      return this.nodes, map(function (n) {
        return n.querySelectorAll(selector);
      }).flat();
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      this._onRemove.add(callback);
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "beforeUpdate",
    value: function beforeUpdate(args) {}
  }, {
    key: "afterUpdate",
    value: function afterUpdate(args) {}
  }, {
    key: "stringTransformer",
    value: function stringTransformer(methods) {
      var _this14 = this;

      return function (x) {
        for (var m in methods) {
          var parent = _this14;
          var method = methods[m];

          while (parent && !parent[method]) {
            parent = parent.parent;
          }

          if (!parent) {
            return;
          }

          x = parent[methods[m]](x);
        }

        return x;
      };
    }
  }, {
    key: "stringToClass",
    value: function stringToClass(refClassname) {
      if (View.refClasses.has(refClassname)) {
        return View.refClasses.get(refClassname);
      }

      var refClassSplit = refClassname.split('/');
      var refShortClassname = refClassSplit[refClassSplit.length - 1];

      var refClass = require(refClassname);

      View.refClasses.set(refClassname, refClass[refShortClassname]);
      return refClass[refShortClassname];
    }
  }, {
    key: "preventParsing",
    value: function preventParsing(node) {
      node[dontParse] = true;
    }
  }], [{
    key: "isView",
    value: function isView() {
      return View;
    }
  }]);

  return View;
}();

exports.View = View;
Object.defineProperty(View, 'templates', {
  enumerable: false,
  writable: false,
  value: new Map()
});
Object.defineProperty(View, 'refClasses', {
  enumerable: false,
  writable: false,
  value: new Map()
});
Object.defineProperty(View, 'linkClicked', function (event) {
  event.preventDefault();
  var href = event.target.getAttribute('href');

  if (href.substring(0, 4) === 'http' || href.substring(0, 2) === '//') {
    window.open(href);
    return;
  }

  _Router.Router.go(href);
});
  })();
});

require.register("curvature/base/ViewList.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewList = void 0;

var _Bindable = require("./Bindable");

var _View = require("./View");

var _Bag = require("./Bag");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ViewList = /*#__PURE__*/function () {
  function ViewList(template, subProperty, list, parent) {
    var _this = this;

    var keyProperty = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, ViewList);

    this.args = _Bindable.Bindable.makeBindable({});
    this.args.value = _Bindable.Bindable.makeBindable(list || {});
    this.args.subArgs = _Bindable.Bindable.makeBindable({});
    this.views = [];
    this.cleanup = [];
    this._onRemove = new _Bag.Bag();
    this.template = template;
    this.subProperty = subProperty;
    this.keyProperty = keyProperty;
    this.tag = null;
    this.paused = false;
    this.parent = parent;
    this.rendered = new Promise(function (accept, reject) {
      Object.defineProperty(_this, 'renderComplete', {
        configurable: false,
        writable: true,
        value: accept
      });
    });
    this.willReRender = false;

    this.args.___before(function (t) {
      if (t.___executing___ == 'bindTo') {
        return;
      }

      _this.paused = true;
    });

    this.args.___after(function (t) {
      if (t.___executing___ == 'bindTo') {
        return;
      }

      _this.paused = t.___stack___.length > 1;

      _this.reRender();
    });

    var debind = this.args.value.bindTo(function (v, k, t, d) {
      if (_this.paused) {
        return;
      }

      var kk = k;

      if (isNaN(k)) {
        kk = '_' + k;
      }

      if (d) {
        if (_this.views[kk]) {
          _this.views[kk].remove();
        }

        delete _this.views[kk]; // this.views.splice(k,1);

        for (var i in _this.views) {
          if (typeof i === 'string') {
            _this.views[i].args[_this.keyProperty] = i.substr(1);
            continue;
          }

          _this.views[i].args[_this.keyProperty] = i;
        }
      } else if (!_this.views[kk] && !_this.willReRender) {
        _this.willReRender = requestAnimationFrame(function () {
          _this.reRender();
        });
      } else if (_this.views[kk] && _this.views[kk].args) {
        _this.views[kk].args[_this.keyProperty] = k;
        _this.views[kk].args[_this.subProperty] = v;
      }
    });

    this._onRemove.add(debind);
  }

  _createClass(ViewList, [{
    key: "render",
    value: function render(tag) {
      var _this2 = this;

      var renders = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var view = _step.value;
          view.render(tag);
          renders.push(view.rendered.then(function () {
            return view;
          }));
        };

        for (var _iterator = this.views[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.tag = tag;
      Promise.all(renders).then(function (views) {
        return _this2.renderComplete(views);
      });
    }
  }, {
    key: "reRender",
    value: function reRender() {
      var _this3 = this;

      if (this.paused || !this.tag) {
        return;
      }

      var views = [];

      for (var i in this.views) {
        views[i] = this.views[i];
      }

      var finalViews = [];

      for (var _i in this.args.value) {
        var found = false;
        var k = _i;

        if (isNaN(k)) {
          k = '_' + _i;
        }

        for (var j in views) {
          if (views[j] && this.args.value[_i] !== undefined && this.args.value[_i] === views[j].args[this.subProperty]) {
            found = true;
            finalViews[k] = views[j];
            finalViews[k].args[this.keyProperty] = _i;
            delete views[j];
            break;
          }
        }

        if (!found) {
          (function () {
            var viewArgs = {};
            var view = finalViews[k] = new _View.View(viewArgs);
            finalViews[k].template = _this3.template instanceof Object ? _this3.template : _this3.template;
            finalViews[k].parent = _this3.parent;
            finalViews[k].viewList = _this3;
            finalViews[k].args[_this3.keyProperty] = _i;
            finalViews[k].args[_this3.subProperty] = _this3.args.value[_i];
            var upDebind = viewArgs.bindTo(_this3.subProperty, function (v, k) {
              var index = viewArgs[_this3.keyProperty];
              _this3.args.value[index] = v;
            });

            var downDebind = _this3.args.subArgs.bindTo(function (v, k, t, d) {
              viewArgs[k] = v;
            });

            view.onRemove(function () {
              upDebind();
              downDebind();

              _this3._onRemove.remove(upDebind);

              _this3._onRemove.remove(downDebind);
            });

            _this3._onRemove.add(upDebind);

            _this3._onRemove.add(downDebind);

            viewArgs[_this3.subProperty] = _this3.args.value[_i];
          })();
        }
      }

      for (var _i2 in views) {
        var _found = false;

        for (var _j in finalViews) {
          if (views[_i2] === finalViews[_j]) {
            _found = true;
            break;
          }
        }

        if (!_found) {
          views[_i2].remove();
        }
      }

      if (Array.isArray(this.args.value)) {
        var renderRecurse = function renderRecurse() {
          var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var ii = finalViews.length - i - 1;

          if (!finalViews[ii]) {
            return Promise.resolve();
          }

          if (finalViews[ii] === _this3.views[ii]) {
            if (!finalViews[ii].firstNode) {
              finalViews[ii].render(_this3.tag, finalViews[ii + 1]);
              return finalViews[ii].rendered.then(function () {
                return renderRecurse(i + 1);
              });
            }

            return renderRecurse(i + 1);
          }

          finalViews[ii].render(_this3.tag, finalViews[ii + 1]);

          _this3.views.splice(ii, 0, finalViews[ii]);

          return finalViews[ii].rendered.then(function () {
            return renderRecurse(i + 1);
          });
        };

        this.rendered = renderRecurse();
      } else {
        var renders = [];
        var leftovers = Object.assign({}, finalViews);

        var _loop2 = function _loop2(_i3) {
          delete leftovers[_i3];

          if (finalViews[_i3].firstNode && finalViews[_i3] === _this3.views[_i3]) {
            return "continue";
          }

          finalViews[_i3].render(_this3.tag);

          renders.push(finalViews[_i3].rendered.then(function () {
            return finalViews[_i3];
          }));
        };

        for (var _i3 in finalViews) {
          var _ret = _loop2(_i3);

          if (_ret === "continue") continue;
        }

        for (var _i4 in leftovers) {
          delete this.args.views[_i4];
          leftovers.remove();
        }

        this.rendered = Promise.all(renders);
      }

      this.views = finalViews;

      for (var _i5 in finalViews) {
        if (isNaN(_i5)) {
          finalViews[_i5].args[this.keyProperty] = _i5.substr(1);
          continue;
        }

        finalViews[_i5].args[this.keyProperty] = _i5;
      }

      this.willReRender = false;
    }
  }, {
    key: "pause",
    value: function pause() {
      var _pause = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      for (var i in this.views) {
        this.views[i].pause(_pause);
      }
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      this._onRemove.add(callback);
    }
  }, {
    key: "remove",
    value: function remove() {
      for (var i in this.views) {
        this.views[i].remove();
      }

      var onRemove = this._onRemove.items();

      for (var _i6 in onRemove) {
        this._onRemove.remove(onRemove[_i6]);

        onRemove[_i6]();
      }

      var cleanup;

      while (this.cleanup.length) {
        cleanup = this.cleanup.pop();
        cleanup();
      }

      this.views = [];

      while (this.tag && this.tag.firstChild) {
        this.tag.removeChild(this.tag.firstChild);
      }

      _Bindable.Bindable.clearBindings(this.args.subArgs);

      _Bindable.Bindable.clearBindings(this.args);

      if (!this.args.value.isBound()) {
        _Bindable.Bindable.clearBindings(this.args.value);
      }
    }
  }]);

  return ViewList;
}();

exports.ViewList = ViewList;
  })();
});

require.register("curvature/form/ButtonField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ButtonField = /*#__PURE__*/function (_Field) {
  _inherits(ButtonField, _Field);

  function ButtonField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, ButtonField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ButtonField).call(this, values, form, parent, key));
    _this.args.title = _this.args.title || _this.args.value;
    _this._onClick = [];
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || _this.args.type;
    _this.args.name = attrs.name = _this.args.name || key;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype      = \"").concat(attrs.type, "\"\n\t\t\t\t\tvalue     = \"[[value]]\"\n\t\t\t\t\tcv-on     = \"click:clicked(event)\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(ButtonField, [{
    key: "clicked",
    value: function clicked(event) {
      var cancels = this._onClick.map(function (callback) {
        return callback(event) === false;
      }).filter(function (r) {
        return r;
      });

      if (cancels.length) {
        if (this.args.attrs.type == 'submit') {
          event.preventDefault();
          event.stopPropagation();
        }

        return;
      }

      if (this.args.attrs.type == 'submit') {
        event.preventDefault();
        event.stopPropagation();
        this.form.tags.formTag.element.dispatchEvent(new Event('submit', {
          'cancelable': true,
          'bubbles': true
        }));
      }
    }
  }, {
    key: "onClick",
    value: function onClick(callback) {
      this._onClick.push(callback);
    }
  }]);

  return ButtonField;
}(_Field2.Field);

exports.ButtonField = ButtonField;
  })();
});

require.register("curvature/form/Field.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = void 0;

var _View2 = require("../base/View");

var _Bindable = require("../base/Bindable");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Field = /*#__PURE__*/function (_View) {
  _inherits(Field, _View);

  function Field(values, form, parent, key) {
    var _this$args$title, _this$args$value, _this$args$value2;

    var _this;

    _classCallCheck(this, Field);

    var skeleton = Object.assign({}, values);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Field).call(this, skeleton));
    _this.args.title = (_this$args$title = _this.args.title) !== null && _this$args$title !== void 0 ? _this$args$title : key;
    _this.args.value = (_this$args$value = _this.args.value) !== null && _this$args$value !== void 0 ? _this$args$value : '';
    _this.value = (_this$args$value2 = _this.args.value) !== null && _this$args$value2 !== void 0 ? _this$args$value2 : '';
    _this.skeleton = skeleton;
    _this.disabled = null;
    _this.args.valueString = '';
    _this.form = form;
    _this.parent = parent;
    _this.key = key;
    _this.ignore = _this.args.attrs ? _this.args.attrs['data-cv-ignore'] || false : false;
    var extra = '';
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || skeleton.type || null;
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;

    if (attrs.type == 'checkbox') {
      extra = 'value = "1"';
    }

    _this.template = "\n\t\t\t<label\n\t\t\t\tfor           = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type     = \"").concat(attrs.type || 'text', "\"\n\t\t\t\tcv-ref        = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype      = \"").concat(attrs.type || 'text', "\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t").concat(extra, "\n\t\t\t\t/>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t"); //type    = "${this.args.attrs.type||'text'}"
    // let key     = this.key;

    var setting = null;

    _this.args.bindTo('value', function (v, k) {
      if (!isNaN(v) && v.length && v == Number(v) && v.length === String(Number(v)).length) {
        v = Number(v);
      }

      _this.value = v;

      if (setting == k) {
        return;
      }

      setting = key;
      _this.args.valueString = JSON.stringify(v || '', null, 4);
      _this.valueString = _this.args.valueString;

      if (attrs.type == 'file' && _this.tags.input && _this.tags.input.element.files && _this.tags.input.element.length) {
        if (!attrs.multiple) {
          _this.parent.args.value[key] = _this.tags.input.element.files[0];
        } else {
          var files = Array.from(_this.tags.input.element.files);

          if (!_this.parent.args.value[k] || !files.length) {
            _this.parent.args.value[key] = files;
          } else {
            for (var i in files) {
              if (files[i] !== _this.parent.args.value[key][i]) {
                _this.parent.args.value[key] = files;
              }
            }

            _this.parent.args.value.splice(files.length);
          }
        }
      } else {
        if (!_this.parent.args.value) {
          _this.parent.args.value = {};
        }

        _this.parent.args.value[key] = v;
      }

      _this.args.errors = [];
      setting = null;
    }); // this.parent.args.value = Bindable.makeBindable(this.parent.args.value);


    _this.parent.args.value[_this.key] = _this.args.value;

    _this.parent.args.value.bindTo(key, function (v, k) {
      if (setting == k) {
        return;
      }

      setting = k;

      if (attrs.type == 'file') {
        if (_this.tags.input && _this.tags.input.element.files && _this.tags.input.element.files.length) {
          if (!attrs.multiple) {
            _this.parent.args.value[key] = _this.tags.input.element.files[0];
          } else {
            var files = Array.from(_this.tags.input.element.files);

            if (!_this.parent.args.value[key] || !files.length) {
              _this.parent.args.value[key] = files;
            } else {
              for (var i in files) {
                if (files[i] !== _this.parent.args.value[key][i]) {
                  _this.parent.args.value[key] = files;
                }
              }

              _this.parent.args.value[key].splice(files.length);
            }
          }
        } else {
          _this.args.value = v;
        }
      } else {
        _this.args.value = v;
      }

      setting = null;
    });

    return _this;
  }

  _createClass(Field, [{
    key: "disable",
    value: function disable() {
      if (this.hasChildren()) {// for(let i in this.args.fields)
        // {
        // 	this.args.fields[i].disable();
        // }
      }

      this.disabled = 'disabled';
    }
  }, {
    key: "enable",
    value: function enable() {
      if (this.hasChildren()) {// for(let i in this.args.fields)
        // {
        // 	this.args.fields[i].disable();
        // }
      }

      this.disabled = false;
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return false;
    }
  }, {
    key: "getName",
    value: function getName() {
      var cascadeIfPossible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.tags.input) {
        return this.tags.input.element.getAttribute('name');
      }

      var name = this.key;

      if (cascadeIfPossible) {
        var parent = this.parent;
        var names = [name];

        while (parent && parent.array && typeof parent.key !== 'undefined') {
          names.unshift(parent.key);
          parent = parent.parent;
        }

        name = names.shift();

        if (names.length) {
          name += "[".concat(names.join(']['), "]");
        }
      }

      return name;
    }
  }]);

  return Field;
}(_View2.View);

exports.Field = Field;
  })();
});

require.register("curvature/form/FieldSet.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldSet = void 0;

var _Field2 = require("./Field");

var _Form = require("./Form");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FieldSet = /*#__PURE__*/function (_Field) {
  _inherits(FieldSet, _Field);

  function FieldSet(values, form, parent, key) {
    var _this;

    _classCallCheck(this, FieldSet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FieldSet).call(this, values, form, parent, key));
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || 'fieldset';
    _this.array = false;

    if (values.array || attrs['data-array'] || attrs['data-multi']) {
      _this.array = attrs['data-array'] = true;
    }

    _this.args.value = {};
    _this.args.fields = _Form.Form.renderFields(values.children, _assertThisInitialized(_this));
    _this.fields = _this.args.fields;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor        = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type  = \"").concat(attrs.type, "\"\n\t\t\t\tdata-multi = \"").concat(attrs['data-multi'] ? 'true' : 'false', "\"\n\t\t\t\tcv-ref     = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<fieldset\n\t\t\t\t\tname   = \"").concat(_this.getName(), "\"\n\t\t\t\t\tcv-ref = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand=\"attrs\"\n\t\t\t\t\tcv-each = \"fields:field\"\n\t\t\t\t>\n\t\t\t\t\t[[field]]\n\t\t\t\t</fieldset>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(FieldSet, [{
    key: "hasChildren",
    value: function hasChildren() {
      return !!Object.keys(this.args.fields).length;
    }
  }, {
    key: "wrapSubfield",
    value: function wrapSubfield(field) {
      return field;
    }
  }]);

  return FieldSet;
}(_Field2.Field);

exports.FieldSet = FieldSet;
  })();
});

require.register("curvature/form/Form.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _View2 = require("../base/View");

var _Field = require("./Field");

var _FieldSet = require("./FieldSet");

var _SelectField = require("./SelectField");

var _RadioField = require("./RadioField");

var _HtmlField = require("./HtmlField");

var _HiddenField = require("./HiddenField");

var _ButtonField = require("./ButtonField");

var _TextareaField = require("./TextareaField");

var _View3 = require("./multiField/View");

var _Bindable = require("../base/Bindable");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import { Router           } from 'Router';
// import { Repository       } from '../Repository';
// import { FieldSet         } from './FieldSet';
// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';
var Form = /*#__PURE__*/function (_View) {
  _inherits(Form, _View);

  function Form(skeleton) {
    var _this2;

    var customFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Form);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Form).call(this, {}));
    _this2.args.flatValue = _this2.args.flatValue || {};
    _this2.args.value = _this2.args.value || {};
    _this2.args.method = skeleton._method || 'GET';
    _this2.args.classes = _this2.args.classes || [];
    _this2.skeleton = skeleton;

    _this2.args.bindTo('classes', function (v) {
      _this2.args._classes = v.join(' ');
    });

    _this2._onSubmit = [];
    _this2._onRender = [];
    _this2.action = '';
    _this2.template = "\n\t\t\t<form\n\t\t\t\tclass     = \"[[_classes]]\"\n\t\t\t\tmethod    = \"[[method]]\"\n\t\t\t\tenctype   = \"multipart/form-data\"\n\t\t\t\tcv-on     = \"submit:submit(event)\"\n\t\t\t\tcv-ref    = \"formTag:curvature/base/Tag\"\n\t\t\t\tcv-each   = \"fields:field\"\n\t\t\t\tcv-expand = \"attrs\"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t";
    _this2.args.fields = Form.renderFields(skeleton, _assertThisInitialized(_this2), customFields);
    _this2.fields = _this2.args.fields;

    var _this = _Bindable.Bindable.makeBindable(_assertThisInitialized(_this2));

    _this2.args.bindTo('value', function (v) {
      _this.value = v;
    });

    _this2.args.bindTo('valueString', function (v) {
      _this.json = v;
    });

    return _possibleConstructorReturn(_this2, _this);
  }

  _createClass(Form, [{
    key: "submitHandler",
    value: function submitHandler(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, {
    key: "submit",
    value: function submit(event) {
      this.args.valueString = JSON.stringify(this.args.value, null, 4);

      for (var i in this._onSubmit) {
        this._onSubmit[i](this, event);
      }
    }
  }, {
    key: "buttonClick",
    value: function buttonClick(event) {// console.log(event);
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(callback) {
      this._onSubmit.push(callback);
    }
  }, {
    key: "onRender",
    value: function onRender(callback) {
      if (this.nodes) {
        callback(this);
        return;
      }

      this._onRender.push(callback);
    }
  }, {
    key: "formData",
    value: function formData() {
      var append = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var field = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var chain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      if (!append) {
        append = new FormData();
      }

      if (!field) {
        field = this;
      }

      var parts = [];

      for (var i in field.args.fields) {
        if (field.args.fields[i] && field.args.fields[i].disabled) {
          continue;
        }

        var subchain = chain.slice(0);
        subchain.push(i);

        if (field.args.fields[i] && field.args.fields[i].hasChildren()) {
          this.formData(append, field.args.fields[i], subchain);
        } else if (field.args.fields[i]) {
          // let fieldName = field.args.fields[i].args.name;
          var fieldName = field.args.fields[i].getName();

          if (field.args.fields[i].args.type == 'file' && field.args.fields[i].tags.input.element.files.length) {
            if (field.args.fields[i].args.attrs.multiple) {
              var files = field.args.fields[i].tags.input.element.files;

              for (var _i = 0; _i < files.length; _i++) {
                if (!files[_i]) {
                  continue;
                }

                append.append(fieldName + '[]', files[_i]);
              }
            } else if (field.args.fields[i].tags.input.element.files[0]) {
              append.append(fieldName, field.args.fields[i].tags.input.element.files[0]);
            }
          } else if (field.args.fields[i].args.type !== 'file' || field.args.fields[i].args.value) {
            append.append(fieldName, field.args.fields[i].args.value === undefined ? '' : field.args.fields[i].args.value);
          }
        }
      }

      return append;
    }
  }, {
    key: "queryString",
    value: function queryString() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var parts = [];

      for (var i in this.args.flatValue) {
        args[i] = args[i] || this.args.flatValue[i];
      }

      for (var _i2 in args) {
        parts.push(_i2 + '=' + encodeURIComponent(args[_i2]));
      }

      return parts.join('&');
    }
  }, {
    key: "populate",
    value: function populate(values) {
      // console.log(values);
      for (var i in values) {
        this.args.value[i] = values[i];
      }
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return !!Object.keys(this.args.fields).length;
    }
  }, {
    key: "postRender",
    value: function postRender() {
      for (var i in this._onRender) {
        this._onRender[i](this);
      }
    }
  }], [{
    key: "renderFields",
    value: function renderFields(skeleton) {
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fields = {};

      var _loop = function _loop(i) {
        if (fields[i]) {
          return "continue";
        }

        if (i.substr(0, 1) == '_') {
          return "continue";
        }

        var field = null;
        var form = null;

        if (parent) {
          if (parent instanceof Form) {
            form = parent;
          } else {
            form = parent.form;
          }
        } // console.log(customFields);


        if (customFields && skeleton[i].name in customFields) {
          field = new customFields[skeleton[i].name](skeleton[i], form, parent, i);
        } else {
          switch (skeleton[i].type) {
            case 'fieldset':
              if (skeleton[i].attrs && skeleton[i].attrs['data-multi']) {
                field = new _View3.View(skeleton[i], form, parent, i);
              } else {
                field = new _FieldSet.FieldSet(skeleton[i], form, parent, i);
              }

              break;

            case 'select':
              field = new _SelectField.SelectField(skeleton[i], form, parent, i);
              break;

            case 'radios':
              field = new _RadioField.RadioField(skeleton[i], form, parent, i);
              break;

            case 'html':
              field = new _HtmlField.HtmlField(skeleton[i], form, parent, i);
              break;

            case 'submit':
            case 'button':
              field = new _ButtonField.ButtonField(skeleton[i], form, parent, i);
              break;

            case 'hidden':
              field = new _HiddenField.HiddenField(skeleton[i], form, parent, i);
              break;

            case 'textarea':
              field = new _TextareaField.TextareaField(skeleton[i], form, parent, i);
              break;

            default:
              field = new _Field.Field(skeleton[i], form, parent, i);
              break;
          }
        }

        fields[i] = field;
        var fieldName = field.key; //field.getName();

        field.args.bindTo('value', function (v, k, t, d) {
          if (!isNaN(v) && v.length && v == Number(v) && v.length === String(Number(v)).length) {
            v = Number(v);
          } // console.log(t,v);


          if (t.type == 'html' && !t.contentEditable || t.type == 'fieldset') {
            return;
          } // let fieldName = field.args.name;


          if (t.disabled) {
            delete form.args.flatValue[fieldName];
            return;
          }

          t.attrs = t.attrs || {};
          var multiple = t.attrs.multiple;
          var newArray = Array.isArray(v);
          var oldArray = parent.args.value[fieldName];
          var exists = t.attrs.multiple && newArray && Array.isArray(oldArray);

          if (exists) {
            for (var _i3 in v) {
              if (v[_i3] !== parent.args.value[fieldName][_i3]) {
                parent.args.value[fieldName][_i3] = v[_i3];
              }

              parent.args.value[fieldName].splice(v.length);
            }
          } else {
            parent.args.value[fieldName] = v;
          }

          form.args.flatValue[fieldName] = v;
          form.args.valueString = JSON.stringify(form.args.value, null, 4);
          console.log();
        });
      };

      for (var i in skeleton) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
      }

      return fields;
    }
  }, {
    key: "_updateFields",
    value: function _updateFields(parent, skeleton) {
      for (var i in parent.args.fields) {
        var field = parent.args.fields[i]; // console.log(i, field, skeleton[i]);

        if (skeleton[i]) {
          if (skeleton[i].value) {
            field.args.value = skeleton[i].value;
          }

          if (skeleton[i].errors) {
            field.args.errors = skeleton[i].errors;
          }

          if (skeleton[i].title) {
            field.args.title = skeleton[i].title;
          }

          if (skeleton[i].options) {
            field.args.options = skeleton[i].options;
          }

          if (skeleton[i].attrs) {
            field.args.attrs = skeleton[i].attrs;
          }

          if (field.children && skeleton[i].children) {
            this._updateFields(field, skeleton[i].children);
          }
        }
      }
    }
  }]);

  return Form;
}(_View2.View);

exports.Form = Form;
  })();
});

require.register("curvature/form/HiddenField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HiddenField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HiddenField = /*#__PURE__*/function (_Field) {
  _inherits(HiddenField, _Field);

  function HiddenField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, HiddenField);

    values.type = 'hidden';
    _this = _possibleConstructorReturn(this, _getPrototypeOf(HiddenField).call(this, values, form, parent, key));
    var attrs = _this.args.attrs || {};
    _this.args.type = attrs.type = attrs.type || _this.args.type || 'hidden';
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tstyle     = \"display:none\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\t\ttype      = \"hidden\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t<span cv-if = \"value\">[[[value]]]</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  return HiddenField;
}(_Field2.Field);

exports.HiddenField = HiddenField;
  })();
});

require.register("curvature/form/HtmlField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HtmlField = /*#__PURE__*/function (_Field) {
  _inherits(HtmlField, _Field);

  function HtmlField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, HtmlField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HtmlField).call(this, values, form, parent, key));
    _this.key = key;
    _this.args.displayValue = _this.args.value;
    _this.args.fragment = new DocumentFragment();

    _this.args.bindTo('value', function (v) {
      if (_this.tags.input) {
        if (_this.tags.input.element === document.activeElement) {
          return;
        }
      } else {
        return;
      }

      var element = _this.tags.input.element;
      var nodes = Array.from(element.childNodes).filter(function (node) {
        return node.length > 0 || node.nodeType !== node.TEXT_NODE;
      });
      var value = nodes.map(function (n) {
        return n.outerHTML;
      }).join("\n");
      _this.args.displayValue = value;
    });

    _this.args.attrs = _this.args.attrs || {};
    _this.ignore = _this.args.attrs['data-cv-ignore'] || false;
    _this.args.contentEditable = _this.args.attrs.contenteditable || false;
    _this.template = "<div\n\t\t\tname            = \"".concat(_this.getName(), "\"\n\t\t\tcv-ref          = \"input:curvature/base/Tag\"\n\t\t\tcontenteditable = \"[[contentEditable]]\"\n\t\t\tcv-expand       = \"attrs\"\n\t\t\tcv-bind         = \"$displayValue\"\n\t\t\tcv-on           = \"\n\t\t\t\tblur:inputProvided(event);\n\t\t\t\tinput:inputProvided(event);\n\t\t\t\tchanged:inputProvided(event);\n\t\t\t\"\n\t\t></div>");
    return _this;
  }

  _createClass(HtmlField, [{
    key: "inputProvided",
    value: function inputProvided(event) {
      var inputTag = this.tags.input.element;

      if (inputTag !== event.target) {
        return;
      }

      if (this.tags.input && this.tags.input.element.matches('[contenteditable]')) {
        if (this.tags.input.element === document.activeElement) {
          return;
        }
      }

      this.args.value = event.target.innerHTML;
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return false;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.args.disabled = 'disabled';
    }
  }, {
    key: "getName",
    value: function getName() {
      var name = this.key;

      if (this.tags.input) {// return this.tags.input.element.getAttribute('name');
      }

      return name;
    }
  }]);

  return HtmlField;
}(_Field2.Field);

exports.HtmlField = HtmlField;
  })();
});

require.register("curvature/form/RadioField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RadioField = /*#__PURE__*/function (_Field) {
  _inherits(RadioField, _Field);

  function RadioField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, RadioField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RadioField).call(this, values, form, parent, key));
    var attrs = _this.args.attrs || {};
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;
    _this.args.value = _this.args.value || '';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each  = \"options:option:optionText\"/>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tname      = \"").concat(_this.args.name, "\"\n\t\t\t\t\t\t\ttype      = \"radio\"\n\t\t\t\t\t\t\tvalue     = \"[[option]]\"\n\t\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t\t\tcv-on     = \"change:changed(event)\"\n\t\t\t\t\t/>\n\t\t\t\t\t\t[[optionText]]\n\t\t\t\t\t</label>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(RadioField, [{
    key: "getLabel",
    value: function getLabel() {
      for (var i in this.args.options) {
        if (this.args.options[i] == this.args.value) {
          return i;
        }
      }
    }
  }, {
    key: "changed",
    value: function changed(event) {
      this.args.value = event.target.value;
    }
  }]);

  return RadioField;
}(_Field2.Field);

exports.RadioField = RadioField;
  })();
});

require.register("curvature/form/SelectField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SelectField = /*#__PURE__*/function (_Field) {
  _inherits(SelectField, _Field);

  function SelectField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, SelectField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectField).call(this, values, form, parent, key));
    var attrs = _this.args.attrs || {};
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type || 'select', "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<select\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-each   = \"options:option:optionText\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t\t<option value = \"[[option]]\">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(SelectField, [{
    key: "postRender",
    value: function postRender() {
      var _this2 = this;

      this.args.bindTo('value', function (v) {
        return _this2.selectOptionByValue(v);
      });
      this.args.bindTo('options', function (v) {
        var optionsList = _this2.viewLists.options;
        optionsList.rendered.then(function (rendered) {
          _this2.selectOptionByValue(_this2.args.value);
        });
      }, {
        frame: true
      });
    }
  }, {
    key: "selectOptionByValue",
    value: function selectOptionByValue(value) {
      var tag = this.tags.input.element;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = tag.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var option = _step.value;

          if (option.value == value) {
            tag.selectedIndex = option.index;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "getLabel",
    value: function getLabel() {
      for (var i in this.args.options) {
        if (this.args.options[i] == this.args.value) {
          return i;
        }
      }
    }
  }]);

  return SelectField;
}(_Field2.Field);

exports.SelectField = SelectField;
  })();
});

require.register("curvature/form/TextareaField.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextareaField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TextareaField = /*#__PURE__*/function (_Field) {
  _inherits(TextareaField, _Field);

  function TextareaField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, TextareaField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextareaField).call(this, values, form, parent, key));
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || 'textarea';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<textarea\n\t\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t></textarea>\n\t\t\t\t<cv-template cv-if = \"attrs.data-caption\">\n\t\t\t\t\t<p>[[attrs.data-caption]]</p>\n\t\t\t\t</cv-template>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  return TextareaField;
}(_Field2.Field);

exports.TextareaField = TextareaField;
  })();
});

require.register("curvature/form/multiField/CreateForm.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateForm = void 0;

var _FormWrapper2 = require("./FormWrapper");

var _HiddenField = require("../../form/HiddenField");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CreateForm = /*#__PURE__*/function (_FormWrapper) {
  _inherits(CreateForm, _FormWrapper);

  function CreateForm(args, path) {
    var _this;

    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, CreateForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateForm).call(this, args, path, 'POST', customFields || {// title: HiddenField
    }));
    _this.creating = !!args.publicId;
    return _this;
  }

  _createClass(CreateForm, [{
    key: "onLoad",
    value: function onLoad(form) {
      for (var i in form.args.fields) {
        if (!form.args.fields[i].tags.input) {
          continue;
        }

        if (form.args.fields[i].args.attrs.type == 'hidden') {
          continue;
        }

        var element = form.args.fields[i].tags.input.element;
        element.focus();
        break;
      }

      _get(_getPrototypeOf(CreateForm.prototype), "onLoad", this).call(this, form);
    }
  }, {
    key: "onRequest",
    value: function onRequest() {
      this.args.view.args.loading = true;
      this.args.view.args.classes += ' loading';
      return _get(_getPrototypeOf(CreateForm.prototype), "onRequest", this).call(this);
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      this.args.view.args.loading = false;
      this.args.view.args.classes = '';

      if (!this.args.wrapper) {
        this.args.view.addRecord(response.body);
      } else {
        this.args.wrapper.refresh(response.body);
      }

      this.args.view.args.creating = '';

      _get(_getPrototypeOf(CreateForm.prototype), "onResponse", this).call(this, response);
    }
  }]);

  return CreateForm;
}(_FormWrapper2.FormWrapper);

exports.CreateForm = CreateForm;
  })();
});

require.register("curvature/form/multiField/FormWrapper.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormWrapper = void 0;

var _Repository = require("../../base/Repository");

var _Form = require("../../form/Form");

var _Toast = require("../../toast/Toast");

var _ToastAlert = require("../../toast/ToastAlert");

var _View2 = require("../../base/View");

var _Router = require("../../base/Router");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FormWrapper = /*#__PURE__*/function (_View) {
  _inherits(FormWrapper, _View);

  function FormWrapper(args, path) {
    var _this;

    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, FormWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormWrapper).call(this, args));
    _this.path = path;
    _this.args.method = method;
    _this.args.action = _this.args.action || null;
    _this.args.form = null;
    _this.args.title = null;
    _this.args["class"] = '';
    _this.template = "\n\t\t\t<div class = \"form constrict [[class]]\">\n\t\t\t\t<div cv-if = \"title\"><label>[[title]]</label></div>\n\t\t\t\t[[form]]\n\t\t\t</div>\n\t\t";
    _this._onLoad = [];
    _this._onSubmit = [];
    _this._onRender = [];
    _this._onRequest = [];
    _this._onError = [];
    _this._onResponse = [];

    if (path instanceof _Form.Form) {
      _this.loadForm(form, customFields);
    } else {
      _Repository.Repository.request(path).then(function (resp) {
        if (!resp || !resp.meta || !resp.meta.form || !(resp.meta.form instanceof Object)) {
          console.log('Cannot render form with ', resp); // Router.go('/');

          return;
        }

        _this.loadForm(new _Form.Form(resp.meta.form, customFields));

        _this.onLoad(_this.args.form, resp.body);
      });
    }

    return _this;
  }

  _createClass(FormWrapper, [{
    key: "loadForm",
    value: function loadForm(form) {
      var _this2 = this;

      this.args.form = form;
      this.args.form.onSubmit(function (form, event) {
        if (_this2.onSubmit(form, event) === false) {
          return;
        }

        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        var formElement = form.tags.formTag.element;

        var uri = formElement.getAttribute('action') || _this2.args.action || _this2.path;

        var method = formElement.getAttribute('method') || _this2.args.method;

        var query = form.args.flatValue;
        method = method.toUpperCase(); // console.log(method, uri);

        if (method == 'GET') {
          var _query = {};

          if (_this2.args.content && _this2.args.content.args) {
            _this2.args.content.args.page = 0;
          }

          _query.page = 0;

          for (var i in query) {
            if (i === 'api') {
              continue;
            }

            _query[i] = query[i];
          }

          var promises = _this2.onRequest(_query);

          promises.then(function () {
            _this2.onResponse({});

            _Router.Router.go(uri + '?' + _Router.Router.queryToString(_query));

            _this2.update(_query);
          })["catch"](function (error) {
            _this2.onRequestError(error);
          });
        } else if (method == 'POST') {
          var formData = form.formData();
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {// console.log(pair[0]+ ', ' + pair[1]);

              var pair = _step.value;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var _promises = _this2.onRequest(formData);

          if (_promises) {
            _promises.then(function () {
              _Repository.Repository.request(uri, {
                api: 'json'
              }, formData, false, {
                progressDown: function progressDown(event) {
                  _this2.progressDown(event);
                },
                progressUp: function progressUp(event) {
                  _this2.progressUp(event);
                }
              }).then(function (response) {
                _this2.onResponse(response);
              })["catch"](function (error) {
                _this2.onRequestError(error);
              });
            });
          }
        }
      });
    }
  }, {
    key: "onRequest",
    value: function onRequest(requestData) {
      var promises = [];

      for (var i in this._onRequest) {
        var onReq = this._onRequest[i](requestData, this);

        if (onReq) {
          promises.push(onReq);
        }
      }

      if (promises.length == 0) {
        return Promise.resolve();
      }

      return Promise.all(promises);
    }
  }, {
    key: "onRequestError",
    value: function onRequestError(error) {
      for (var i in this._onError) {
        this._onError[i](error, this);
      }

      if (error.messages) {
        for (var _i in error.messages) {
          _Toast.Toast.instance().alert(error.body && error.body.id ? 'Success!' : 'Error!', error.messages[_i], 3500);
        }
      }
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      for (var i in this._onResponse) {
        this._onResponse[i](response, this);
      }

      if (response.messages) {
        for (var _i2 in response.messages) {
          _Toast.Toast.instance().alert(response.body && response.body.id ? 'Success!' : 'Error!', response.messages[_i2], 3500);
        }
      }
    }
  }, {
    key: "onLoad",
    value: function onLoad(form, model) {
      for (var i in this._onLoad) {
        this._onLoad[i](this, form, model);
      }
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(form, event) {
      for (var i in this._onSubmit) {
        this._onSubmit[i](this, event);
      }
    }
  }, {
    key: "postRender",
    value: function postRender() {
      for (var i in this._onRender) {
        this._onRender[i](this.args.form);
      }
    }
  }, {
    key: "customFields",
    value: function customFields() {
      return {};
    }
  }, {
    key: "submit",
    value: function submit() {// console.log(this);
    }
  }, {
    key: "progressUp",
    value: function progressUp(event) {
      console.log(event.loaded, event.total, event.loaded / event.total);
    }
  }, {
    key: "progressDown",
    value: function progressDown(event) {
      console.log(event.loaded, event.total, event.loaded / event.total);
    }
  }]);

  return FormWrapper;
}(_View2.View);

exports.FormWrapper = FormWrapper;
  })();
});

require.register("curvature/form/multiField/SearchForm.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchForm = void 0;

var _Config = require("Config");

var _FormWrapper2 = require("./FormWrapper");

var _HiddenField = require("../../form/HiddenField");

var _Repository = require("../../base/Repository");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var backend = _Config.Config ? _Config.Config.backend : '//';

var SearchForm = /*#__PURE__*/function (_FormWrapper) {
  _inherits(SearchForm, _FormWrapper);

  function SearchForm(args, path) {
    var _this;

    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, SearchForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchForm).call(this, args, path, 'POST', {
      search: _HiddenField.HiddenField
    }));
    _this.superTemplate = _this.template;
    _this.args.records = [];
    _this.selected = null;
    _this.template = "\n\t\t\t".concat(_this.superTemplate, "\n\t\t\t<div cv-each = \"records:record:r\" class = \"dropdown-results\">\n\t\t\t\t<div\n\t\t\t\t\tcv-on         = \"click:select(event)\"\n\t\t\t\t\tdata-index    = \"[[r]]\"\n\t\t\t\t\tdata-publicId = \"[[record.publicId]]\"\n\t\t\t\t\tclass         = \"[[record.classes]]\"\n\t\t\t\t>\n\t\t\t\t\t[[record.title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
    return _this;
  }

  _createClass(SearchForm, [{
    key: "onLoad",
    value: function onLoad(form) {
      var _this2 = this;

      for (var i in form.args.fields) {
        if (!form.args.fields[i].tags.input) {
          continue;
        }

        if (form.args.fields[i].args.attrs.type == 'hidden') {
          continue;
        }

        var element = form.args.fields[i].tags.input.element;
        element.focus();
        break;
      }

      form.args.flatValue.bindTo('keyword', function (v) {
        _this2.args.records = [];
        _this2.selected = null;

        if (!v) {
          return;
        }

        console.log(_this2.path, v);

        _Repository.Repository.request(backend + _this2.path, {
          keyword: v
        }).then(function (response) {
          console.log(response.body);

          if (!response.body) {
            return;
          }

          _this2.args.records = response.body.map(function (r) {
            r.classes = '';

            if (r.title == v) {
              r.classes = 'selected';
              _this2.selected = r;
            }

            return r;
          });
        });
      });

      _get(_getPrototypeOf(SearchForm.prototype), "onLoad", this).call(this, form);
    }
  }, {
    key: "onRequest",
    value: function onRequest() {
      // this.args.view.args.loading = true;
      // this.args.view.args.classes += ' loading';
      return _get(_getPrototypeOf(SearchForm.prototype), "onRequest", this).call(this);
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      // this.args.view.args.loading = false;
      // this.args.view.args.classes = '';
      // if(!this.args.wrapper)
      // {
      // 	this.args.view.addRecord(response.body);
      // }
      // else
      // {
      // 	this.args.wrapper.refresh(response.body);
      // }
      // this.args.view.addButtonClicked();
      _get(_getPrototypeOf(SearchForm.prototype), "onResponse", this).call(this, response);
    }
  }, {
    key: "select",
    value: function select(event) {
      var _this3 = this;

      var index = event.target.getAttribute('data-index');
      var publicId = event.target.getAttribute('data-publicId');
      var record = this.args.records[index];
      console.log(record);
      this.args.view.addRecord(record);
      this.args.view.addButtonClicked();
      return;

      _Repository.Repository.request(backend + this.path + '/' + publicId).then(function (response) {
        console.log(response.body);

        if (!response.body) {
          return;
        }

        _this3.args.view.addRecord(response.body);

        _this3.args.view.addButtonClicked();
      });
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(form, event) {
      event.preventDefault();
      event.stopPropagation();

      if (this.selected) {
        this.args.view.addRecord(this.selected);
        this.args.view.addButtonClicked();
      }

      return false;
    }
  }]);

  return SearchForm;
}(_FormWrapper2.FormWrapper);

exports.SearchForm = SearchForm;
  })();
});

require.register("curvature/form/multiField/View.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Config = require("Config");

var _Form = require("../../form/Form");

var _FieldSet2 = require("../../form/FieldSet");

var _CreateForm = require("./CreateForm");

var _SearchForm = require("./SearchForm");

var _FormWrapper = require("./FormWrapper");

var _Wrapper = require("./Wrapper");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import { Loader     } from '../Ui/ZZ';
var View = /*#__PURE__*/function (_FieldSet) {
  _inherits(View, _FieldSet);

  function View(values, form, parent, key) {
    var _this;

    _classCallCheck(this, View);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(View).call(this, values, form, parent, key));
    _this.args._fields = [];
    _this.dragging = false;
    _this.dropping = false;

    for (var i in _this.args.fields) {
      _this.args._fields[i] = _this.wrapSubfield(_this.args.fields[i]);
    }

    _this.args.fields[-1].disable();

    _this.args.creating = '';
    _this.args.fieldType = '';
    _this.args.createForm = _this.args.createForm || '';
    _this.args.searchForm = _this.args.searchForm || '';
    _this.args.createFormReady = false;

    _this.setCreateForm({
      view: _assertThisInitialized(_this)
    });

    _this.args.loader = '...';
    _this.args.addIcon = '&#215;';
    _this.args.addIcon = 'a';
    _this.args.addIcon = '+';
    _this.args.draggable = 'true';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor        = \"".concat(_this.args.name, "\"\n\t\t\t\tdata-type  = \"").concat(_this.args.attrs.type, "\"\n\t\t\t\tdata-multi = \"").concat(_this.args.attrs['data-multi'] ? 'true' : 'false', "\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\n\t\t\t\t<fieldset\n\t\t\t\t\tname  = \"").concat(_this.args.name, "\"\n\t\t\t\t\tclass = \"multi-field [[creating]] [[fieldType]]\"\n\t\t\t\t>\n\n\t\t\t\t\t<div class = \"record-list\" cv-each = \"_fields:field:f\">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tclass     = \"single-record\"\n\t\t\t\t\t\t\tdata-for  = \"[[f]]\"\n\t\t\t\t\t\t\tdraggable = \"[[draggable]]\"\n\t\t\t\t\t\t\tcv-on     = \"\n\t\t\t\t\t\t\t\tdrop:drop(event);\n\t\t\t\t\t\t\t\tdragstart:drag(event);\n\t\t\t\t\t\t\t\tdragend:dragStop(event);\n\t\t\t\t\t\t\t\tdragover:dragOver(event);\n\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t[[field]]\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = \"overlay create\">\n\t\t\t\t\t\t<div class = \"form constrict\">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tcv-on = \"click:addButtonClicked(event)\"\n\t\t\t\t\t\t\t\tclass = \"bubble bottom left-margin close\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t&#215;\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t[[createForm]]\n\t\t\t\t\t\t[[searchForm]]\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = \"overlay loading\">\n\t\t\t\t\t\t[[loader]]\n\t\t\t\t\t</div>\n\t\t\t\t\t<div cv-if = \"createFormReady\" class=\"add-button-holder\">\n\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tcv-on = \"click:addButtonClicked(event)\"\n\t\t\t\t\t\t\tclass = \"bubble bottom left-margin add\"\n\t\t\t\t\t\t\ttab-index = \"0\"\n\t\t\t\t\t\t>[[addIcon]]</div>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t</fieldset>\n\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(View, [{
    key: "setCreateForm",
    value: function setCreateForm(args) {
      var _this2 = this;

      var origin = '';

      if (_Config.Config && _Config.Config.backend) {
        origin = _Config.Config.backend;
      }

      if (this.args.attrs['data-create-endpoint'] !== false) {
        this.args.createForm = new _CreateForm.CreateForm(Object.assign({}, args), this.args.attrs['data-create-endpoint'] ? origin + this.args.attrs['data-create-endpoint'] : args.publicId ? origin + "".concat(this.args.attrs['data-endpoint'], "/").concat(args.publicId, "/edit") : origin + "".concat(this.args.attrs['data-endpoint'], "/create"));

        this.args.createForm._onLoad.push(function (wrap, form) {
          _this2.args.createFormReady = true;
        });
      } else {
        this.args.createFormReady = true;
      }

      console.log(this.args.createFormReady);
      this.args.searchForm = new _SearchForm.SearchForm(Object.assign({}, args), origin + this.args.attrs['data-endpoint']);
    }
  }, {
    key: "wrapSubfield",
    value: function wrapSubfield(field) {
      return new _Wrapper.Wrapper({
        field: field,
        parent: this
      });
    }
  }, {
    key: "addButtonClicked",
    value: function addButtonClicked() {
      if (!this.args.creating) {
        this.args.creating = 'creating';
      }
    }
  }, {
    key: "addRecord",
    value: function addRecord(record) {
      this.args.creating = '';

      if (!Array.isArray(record)) {
        record = [record];
      }

      for (var i in record) {
        var _skeleton$attrs;

        var fieldClass = this.args.fields[-1].constructor;
        var skeleton = Object.assign({}, this.args.fields[-1].skeleton);
        var name = Object.values(this.args.fields).length - 1;
        skeleton = this.cloneSkeleton(skeleton);
        skeleton = this.correctNames(skeleton, name);
        skeleton.attrs = (_skeleton$attrs = skeleton.attrs) !== null && _skeleton$attrs !== void 0 ? _skeleton$attrs : {};
        skeleton.attrs['data-array'] = true;
        var superSkeleton = {};
        superSkeleton[name] = skeleton;

        var newField = _Form.Form.renderFields(superSkeleton, this)[name];

        this.args.fields[name] = newField;
        var newWrap = this.wrapSubfield(newField);
        newField.args.value.id = record[i].id || '';
        newField.args.value["class"] = record[i]["class"] || '';
        newField.args.value.title = record[i].title || '';

        this.args._fields.push(newWrap);

        newWrap.refresh(record[i]);
      }
    }
  }, {
    key: "editRecord",
    value: function editRecord(record, wrapper) {
      this.setCreateForm({
        view: this,
        publicId: record.publicId,
        wrapper: wrapper
      });
      this.args.creating = this.args.creating ? '' : 'creating';
    }
  }, {
    key: "deleteImage",
    value: function deleteImage(index) {
      console.log(index, this.args.fields);
      this.args.fields[index].disable();
      this.args._fields[index].args.classes = 'deleted';
    }
  }, {
    key: "undeleteImage",
    value: function undeleteImage(index) {
      this.args.fields[index].enable(); // console.log(this.args.fields[index]);
      // console.log(this.args._fields[index]);
      // console.log('===============');

      this.args._fields[index].args.classes = '';
    }
  }, {
    key: "cloneSkeleton",
    value: function cloneSkeleton(object) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var _object = {};

      if (Array.isArray(object)) {
        _object = [];
      }

      for (var i in object) {
        if (i == 'fields') {
          continue;
        }

        if (!object[i] || _typeof(object[i]) !== 'object') {
          _object[i] = object[i];
          continue;
        }

        _object[i] = Object.assign({}, this.cloneSkeleton(object[i], level + 1));
      }

      return _object;
    }
  }, {
    key: "correctNames",
    value: function correctNames(skeleton, id) {
      skeleton.name = skeleton.name.replace(/\[-1\]/, "[".concat(id, "]"));
      skeleton.attrs.name = skeleton.name;

      if ('children' in skeleton) {
        for (var i in skeleton.children) {
          skeleton.children[i] = this.correctNames(skeleton.children[i], id);
        }
      }

      return skeleton;
    }
  }, {
    key: "drag",
    value: function drag(event) {
      this.dragging = event.target;
    }
  }, {
    key: "dragOver",
    value: function dragOver(event) {
      if (!this.dragging) {
        return false;
      }

      var dropping = event.target;

      while (dropping && !dropping.matches('[draggable="true"]')) {
        dropping = dropping.parentNode;
      }

      if (dropping) {
        this.dropping = dropping;
        event.preventDefault();
      }
    }
  }, {
    key: "drop",
    value: function drop(event) {
      event.stopPropagation();
      var dragLabel = this.dragging.querySelector('label');
      var dropLabel = this.dropping.querySelector('label');
      var dragName = dragLabel.getAttribute('for');
      var dropName = dropLabel.getAttribute('for');
      var dragIndex = this.extractIndex(dragName);
      var dropIndex = this.extractIndex(dropName);

      if (dragIndex == dropIndex || dragIndex == dropIndex - 1) {
        this.dragging = false;
        this.dropping = false;
        return;
      }

      var dragFields = dragLabel.querySelectorAll('[name^="' + dragName + '"]');
      var dragLabels = dragLabel.querySelectorAll('[for^="' + dragName + '"]');
      var dropFields = dropLabel.querySelectorAll('[name^="' + dropName + '"]');
      var dropLabels = dropLabel.querySelectorAll('[for^="' + dropName + '"]');
      var dropBefore = this.dropping;
      var offset = 0;
      var dragField, dropField;

      for (var i in this.args.fields) {
        var currentFieldSet = this.args.fields[i].tags.input.element;
        var currentLabel = this.args.fields[i].tags.label.element;
        var currentName = currentFieldSet.getAttribute('name');

        if (dragLabel == currentLabel) {
          dragField = this.args.fields[i];
        }

        if (dropLabel == currentLabel) {
          dropField = this.args.fields[i];
        }

        var currentIndex = this.extractIndex(currentName);
        var newName = false;

        if (currentIndex < 0) {
          continue;
        }

        if (dragIndex > dropIndex && currentIndex >= dropIndex && currentIndex <= dragIndex) {
          newName = this.changeIndex(currentName, currentIndex + 1);
          offset = -1;
        } else if (dragIndex < dropIndex && currentIndex <= dropIndex && currentIndex >= dragIndex) {
          newName = this.changeIndex(currentName, currentIndex - 1);
          offset = 0;
        }

        if (newName !== false) {
          this.changeAttributePrefix(currentLabel, 'for', currentName, newName);
          this.args.fields[i].args.fieldName = newName;
          this.changeAttributePrefix(currentFieldSet, 'name', currentName, newName);
          var currentFields = currentFieldSet.parentNode.querySelectorAll('[name^="' + currentName + '"]');

          for (var _i = 0; _i < currentFields.length; _i++) {
            this.changeAttributePrefix(currentFields[_i], 'name', currentName, newName);
          }

          var currentLabels = currentFieldSet.parentNode.querySelectorAll('[for^="' + currentName + '"]');

          for (var _i2 = 0; _i2 < currentLabels.length; _i2++) {
            this.changeAttributePrefix(currentLabels[_i2], 'for', currentName, newName);
          }
        }
      }

      dragName = dragLabel.getAttribute('for');
      dropName = dropLabel.getAttribute('for');
      dragIndex = this.extractIndex(dragName);
      dropIndex = this.extractIndex(dropName);
      this.changeAttributePrefix(dragLabel, 'for', dragName, this.changeIndex(dragName, dropIndex + offset));

      for (var _i3 = 0; _i3 < dragFields.length; _i3++) {
        this.changeAttributePrefix(dragFields[_i3], 'name', dragName, this.changeIndex(dragName, dropIndex + offset));
      }

      for (var _i4 = 0; _i4 < dragLabels.length; _i4++) {
        this.changeAttributePrefix(dragLabels[_i4], 'for', dragName, this.changeIndex(dragName, dropIndex + offset));
      }

      dragField.args.fieldName = dragLabel.getAttribute('for');
      this.changeAttributePrefix(dropLabel, 'for', dropName, this.changeIndex(dropName, dropIndex + offset + 1));

      for (var _i5 = 0; _i5 < dropFields.length; _i5++) {
        this.changeAttributePrefix(dropFields[_i5], 'name', dropName, this.changeIndex(dropName, dropIndex + offset + 1));
      }

      for (var _i6 = 0; _i6 < dropLabels.length; _i6++) {
        this.changeAttributePrefix(dropLabels[_i6], 'for', dropName, this.changeIndex(dropName, dropIndex + offset + 1));
      }

      dropField.args.fieldName = dropLabel.getAttribute('for');
      this.dragging.parentNode.insertBefore(this.dragging, dropBefore);
      this.dragging = false;
      this.dropping = false;
    }
  }, {
    key: "dragStop",
    value: function dragStop() {
      this.dragging = false;
      this.dropping = false;
    }
  }, {
    key: "changeAttributePrefix",
    value: function changeAttributePrefix(node, attribute, oldPrefix, newPrefix) {
      var oldName = node.getAttribute(attribute);
      var newName = newPrefix + node.getAttribute(attribute).substring(oldPrefix.length);
      node.setAttribute(attribute, newName);
    }
  }, {
    key: "extractIndex",
    value: function extractIndex(name) {
      var groups;

      if (groups = /\[(-?\d+)\]$/.exec(name)) {
        return parseInt(groups[1]);
      }

      return false;
    }
  }, {
    key: "changeIndex",
    value: function changeIndex(name, index) {
      var newName = name.replace(/\[(-?\d+)\]$/, '[' + index + ']');
      return newName;
    }
  }, {
    key: "cancel",
    value: function cancel(event) {
      event.stopPropagation();
    }
  }]);

  return View;
}(_FieldSet2.FieldSet);

exports.View = View;
  })();
});

require.register("curvature/form/multiField/Wrapper.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = void 0;

var _Config = require("Config");

var _View2 = require("../../base/View");

var _Repository = require("../../base/Repository");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Wrapper = /*#__PURE__*/function (_View) {
  _inherits(Wrapper, _View);

  function Wrapper(args) {
    var _this;

    _classCallCheck(this, Wrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Wrapper).call(this, args));
    _this.template = "\n\t\t\t<div\n\t\t\t\tclass = \"wrapped-field [[classes]]\"\n\t\t\t\tcv-on = \"click:editRecord(event, key)\"\n\t\t\t\ttitle = \"[[fieldName]]: [[id]]\"\n\t\t\t>\n\t\t\t\t<div\n\t\t\t\t\tcv-on = \"click:deleteImage(event, key)\"\n\t\t\t\t\tstyle = \"display: inline; cursor:pointer;\"\n\t\t\t\t>\n\t\t\t\t\t[[icon]]\n\t\t\t\t</div>\n\t\t\t\t<div class = \"field-content\">\n\t\t\t\t\t[[title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div style = \"display:none\">[[field]]</div>\n\t\t"; // console.log(this.args.field);

    _this.args.field = _this.args.field || '!';
    _this.args.keyword = '';
    _this.args.title = '';
    _this.args.record = {};
    _this.args.key = _this.args.field.key;
    _this.args.classes = '';
    _this.args.icon = '×';
    _this.deleted = false;

    _this.args.field.args.bindTo('fieldName', function (v) {
      _this.args.fieldName = v;
    });

    _this.args.fieldName = _this.args.field.args.name;
    _this.args.id = _this.args.field.args.value.id;

    _this.args.bindTo('id', function (v) {
      _this.args.field.args.value.id = v;
    });

    _this.args.field.args.value.bindTo('id', function (v, k) {
      if (!v) {
        return;
      }

      _Repository.Repository.request(_this.backendPath(), {
        id: v
      }).then(function (response) {
        _this.args.id = v;
        var record = response.body[0];

        if (!record) {
          _this.args.publicId = null;
          _this.args.title = null;
          return;
        }

        _this.refresh(record);
      });
    }, {
      wait: 0
    });

    _this.args.field.args.value.bindTo('keyword', function (v) {
      _this.args.keyword = v;
    });

    return _this;
  }

  _createClass(Wrapper, [{
    key: "editRecord",
    value: function editRecord() {
      this.args.parent.editRecord(this.args.record, this);
    }
  }, {
    key: "deleteImage",
    value: function deleteImage(event, index) {
      event.stopPropagation();

      if (!this.deleted) {
        this.args.icon = '↺';
        this.args.parent.deleteImage(index);
        this.deleted = true;
      } else {
        this.args.icon = '×';
        this.args.parent.undeleteImage(index);
        this.deleted = false;
      }
    }
  }, {
    key: "backendPath",
    value: function backendPath() {
      var backend = _Config.Config ? _Config.Config.backend : '//';
      return backend + this.args.parent.args.attrs['data-endpoint'];
    }
  }, {
    key: "getRecordTitle",
    value: function getRecordTitle(record) {
      if (record._titleField) {
        return record[record._titleField];
      }

      return record.title || record.publicId || record.id;
    }
  }, {
    key: "refresh",
    value: function refresh(model) {
      for (var i in model) {
        this.args[i] = model[i];
      }

      this.args.record = model;
      this.args.title = this.getRecordTitle(model);
    }
  }]);

  return Wrapper;
}(_View2.View);

exports.Wrapper = Wrapper;
  })();
});

require.register("curvature/input/Keyboard.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keyboard = void 0;

var _Bindable = require("../base/Bindable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Keyboard = /*#__PURE__*/function () {
  _createClass(Keyboard, null, [{
    key: "get",
    value: function get() {
      return this.instance = this.instance || new this();
    }
  }]);

  function Keyboard() {
    var _this = this;

    _classCallCheck(this, Keyboard);

    this.maxDecay = 120;
    this.listening = true;
    this.keys = _Bindable.Bindable.makeBindable({});
    this.codes = _Bindable.Bindable.makeBindable({});
    document.addEventListener('keyup', function (event) {
      _this.keys[event.key] = -1;
      _this.codes[event.code] = -1;
    });
    document.addEventListener('keydown', function (event) {
      if (_this.keys[event.key] > 0) {
        return;
      }

      _this.keys[event.key] = 1;
      _this.codes[event.code] = 1;
    });
    window.addEventListener('blur', function (event) {
      for (var i in _this.keys) {
        _this.keys[i] = -1;
      }

      for (var _i in _this.codes) {
        _this.codes[_i] = -1;
      }
    });
  }

  _createClass(Keyboard, [{
    key: "getKey",
    value: function getKey(key) {
      if (!this.keys[key]) {
        return 0;
      }

      return this.keys[key];
    }
  }, {
    key: "getKeyCode",
    value: function getKeyCode(code) {
      if (!this.codes[code]) {
        return 0;
      }

      return this.codes[code];
    }
  }, {
    key: "update",
    value: function update() {
      for (var i in this.keys) {
        if (this.keys[i] > 0) {
          this.keys[i]++;
        } else {
          this.keys[i]--;

          if (this.keys[i] < -this.maxDecay) {
            delete this.keys[i];
          }
        }
      }

      for (var i in this.codes) {
        if (this.codes[i] > 0) {
          this.codes[i]++;
        } else {
          this.codes[i]--;

          if (this.codes[i] < -this.maxDecay) {
            delete this.keys[i];
          }
        }
      }
    }
  }]);

  return Keyboard;
}();

exports.Keyboard = Keyboard;
  })();
});

require.register("curvature/toast/Toast.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toast = void 0;

var _View2 = require("../base/View");

var _ToastAlert = require("./ToastAlert");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Toast = /*#__PURE__*/function (_View) {
  _inherits(Toast, _View);

  _createClass(Toast, null, [{
    key: "instance",
    value: function instance() {
      if (!this.inst) {
        this.inst = new this();
      }

      return this.inst;
    }
  }]);

  function Toast() {
    var _this;

    _classCallCheck(this, Toast);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Toast).call(this));
    _this.template = "\n\t\t\t<div id = \"[[_id]]\" cv-each = \"alerts:alert\" class = \"toast\">\n\t\t\t\t[[alert]]\n\t\t\t</div>\n\t\t"; // this.style = {
    // 	'': {
    // 		position:   'fixed'
    // 		, top:      '0px'
    // 		, right:    '0px'
    // 		, padding:  '8px'
    // 		, 'z-index':'999999'
    // 		, display:  'flex'
    // 		, 'flex-direction': 'column-reverse'
    // 	}
    // };

    _this.args.alerts = []; // this.args.alerts.bindTo((v) => { console.log(v) });

    return _this;
  }

  _createClass(Toast, [{
    key: "pop",
    value: function pop(alert) {
      var _this2 = this;

      var index = this.args.alerts.length;
      this.args.alerts.push(alert);
      alert.decay(function (alert) {
        return function () {
          for (var i in _this2.args.alerts) {
            if (_this2.args.alerts[i].___ref___ === alert.___ref___) {
              alert.remove();
              delete _this2.args.alerts[i];
              return;
            }
          }
        };
      }(alert));
    }
  }, {
    key: "alert",
    value: function alert(title, body, time) {
      return this.pop(new _ToastAlert.ToastAlert({
        title: title,
        body: body,
        time: time
      }));
    }
  }]);

  return Toast;
}(_View2.View);

exports.Toast = Toast;
  })();
});

require.register("curvature/toast/ToastAlert.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToastAlert = void 0;

var _View2 = require("../base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ToastAlert = /*#__PURE__*/function (_View) {
  _inherits(ToastAlert, _View);

  function ToastAlert(args) {
    var _this;

    _classCallCheck(this, ToastAlert);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ToastAlert).call(this, args));
    _this.args.running = false;
    _this.args.time = _this.args.time || 16000;
    _this.init = _this.args.time;
    _this.args.title = _this.args.title || 'Standard alert';
    _this.args.status = 'new';
    _this.args.body = _this.args.body || 'This is a standard alert.';
    _this.template = "\n\t\t\t<div id = \"[[_id]]\" class = \"alert toast-[[status]]\">\n\t\t\t\t<h3>[[title]]</h3>\n\t\t\t\t<p>[[body]]</p>\n\t\t\t</div>\n\t\t";
    return _this;
  }

  _createClass(ToastAlert, [{
    key: "decay",
    value: function decay(complete) {
      var _this2 = this;

      this.args.running = true;
      this.onTimeout(50, function () {
        _this2.args.status = '';
      });
      this.onTimeout(300, function () {
        _this2.args.status = 'decaying';
      });
      this.onTimeout(2400, function () {
        _this2.args.status = 'imminent';
      });
      this.onTimeout(3500, function () {
        _this2.remove();
      });
    }
  }]);

  return ToastAlert;
}(_View2.View);

exports.ToastAlert = ToastAlert;
  })();
});
require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=curvature.js.map