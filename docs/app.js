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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FormWrapper = /*#__PURE__*/function (_View) {
  _inherits(FormWrapper, _View);

  var _super = _createSuper(FormWrapper);

  function FormWrapper(args, path) {
    var _this;

    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, FormWrapper);

    _this = _super.call(this, args);
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

          var _iterator = _createForOfIteratorHelper(formData.entries()),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {// console.log(pair[0]+ ', ' + pair[1]);

              var pair = _step.value;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
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

require.register("curvature/form/multiField/Wrapper.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = void 0;

var _Config = require("../../base/Config");

var _View2 = require("../../base/View");

var _Repository = require("../../base/Repository");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Wrapper = /*#__PURE__*/function (_View) {
  _inherits(Wrapper, _View);

  var _super = _createSuper(Wrapper);

  function Wrapper(args) {
    var _this;

    _classCallCheck(this, Wrapper);

    _this = _super.call(this, args);
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
      var backend = _Config.Config.get('backend') || '//';
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
require.register("ArrayDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    _this.z = 0;
    _this.routes = {};
    _this.args.list = [0, 1, 2, 3, 4, 5];
    _this.args.obj = {
      a: 1,
      b: 2,
      c: 3
    };
    return _this;
  }

  _createClass(View, [{
    key: "splice",
    value: function splice(position, del, item) {
      this.args.list.splice(position, del, item);
    }
  }, {
    key: "arrayUnshift",
    value: function arrayUnshift() {
      this.args.list.unshift(this.z++ + 'new_shift');
    }
  }, {
    key: "arrayShift",
    value: function arrayShift() {
      this.args.list.shift();
    }
  }, {
    key: "arrayPush",
    value: function arrayPush() {
      this.args.list.push(this.z++ + ' new_push');
    }
  }, {
    key: "arrayPop",
    value: function arrayPop() {
      this.args.list.pop();
    }
  }, {
    key: "arraySort",
    value: function arraySort() {
      this.args.list.sort();
    }
  }, {
    key: "arrayReverse",
    value: function arrayReverse() {
      this.args.list = this.args.list.reverse();
    }
  }, {
    key: "setIndex",
    value: function setIndex(key, value) {
      this.args.list[key] = value;
    }
  }, {
    key: "delIndex",
    value: function delIndex(key) {
      delete this.args.list[key];
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ArrayDemo/template.html", function(exports, require, module) {
module.exports = "<h2>Array Binding Demo</h2>\n\n<div class = \"row\">\n\t<fieldset>\n\t\t<label>set</label>\n\t\t<input cv-bind = \"setIndex\" />\n\t\t<input cv-bind = \"setIndexValue\" />\n\t\t<button cv-on = \"click:setIndex(setIndex,setIndexValue)\">set</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<label>delete</label>\n\t\t<input cv-bind = \"delIndex\" />\n\t\t<button cv-on = \"click:delIndex(delIndex)\">set</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<label>splice</label>\n\t\t<input cv-bind = \"splicePosition\" />\n\t\t<input cv-bind = \"spliceDelete\" />\n\t\t<input cv-bind = \"spliceItem\" />\n\t\t<button cv-on = \"click:splice(splicePosition,spliceDelete,spliceItem)\">Splice</button>\n\t</fieldset>\n</div>\n\n<div class = \"row\">\n\t<fieldset>\n\t\t<button cv-on = \"click:arrayUnshift\">Unshift</button>\n\t\t<button cv-on = \"click:arrayShift\">Shift</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<button cv-on = \"click:arrayPush\">Push</button>\n\t\t<button cv-on = \"click:arrayPop\">Pop</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<button cv-on = \"click:arraySort\">Sort</button>\n\t\t<button cv-on = \"click:arrayReverse\">Reverse</button>\n\t</fieldset>\n</div>\n\n<div cv-each = \"list:item:i\">\n\t<p>[[item]]</p>\n</div>\n"
});

;require.register("ChainDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _View2 = require("../ArrayDemo/View");

var _View3 = require("../ObjectDemo/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    _this.current = null;
    _this.args.objects = [];
    _this.args.input = {};
    _this.args.selectedJson = '{}';

    _this.args.objects.push({}, {}, {}, {});

    _this.args.input.bindTo(function (v, k, t, d) {
      var selectedId = _this.args.selectedId;
      var current = _this.current;

      if (!current) {
        return;
      }

      current[k] = v;
      _this.args.selectedJson = JSON.stringify(current, null, 2);
    });

    _this.args.bindTo('selectedId', function (v, k) {
      if (!_this.args.objects[v]) {
        return;
      }

      var selected = _this.args.objects[v];
      console.log(selected);
      _this.current = null;

      for (var i in _this.args.input) {
        _this.args.input[i] = null;
      }

      _this.current = selected;

      for (var _i in selected) {
        _this.args.input[_i] = selected[_i];
      }

      _this.args.selectedJson = JSON.stringify(_this.current, null, 2);
    });

    _this.args.selectedId = 0;
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ChainDemo/template.html", function(exports, require, module) {
module.exports = "<h2>Chain Binding Demo</h2>\n\n<pre>objects[[[selectedId]]] === [[selectedJson]];</pre>\n\n<p>input.a: <input cv-bind = \"input.a\"> : [[input.a]]</p>\n<p>input.b: <input cv-bind = \"input.b\"> : [[input.b]]</p>\n<p>input.c: <input cv-bind = \"input.c\"> : [[input.c]]</p>\n\n<button>add</button>\n<button>remove</button>\n\n<br />\n\n<select\n\tsize = \"10\"\n\tcv-bind = \"selectedId\"\n\tcv-each = \"objects:object:o\"\n>\n\t<option value = \"[[o]]\">object [[o]]</option>\n</select>\n"
});

;require.register("Config.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;
var Config = {
  title: 'cv-playground',
  theme: 'alpha'
};
exports.Config = Config;
});

;require.register("ConfigDemo/Samples/Config.jss", function(exports, require, module) {
module.exports = "const View   = require('curvature/base/View').View;\nconst Config = require('curvature/base/Config').Config;\nconst TopLvl = require('Config').Config;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tConfig.init({'foo':'FOO'});\n\t\tConfig.init('{\"bar\":\"BAR\"}');\n\t\tConfig.set('baz', 'BAZ');\n\t\tTopLvl.quz = 'QUZ';\n\n\t\tthis.args.configFoo = Config.get('foo');\n\t\tthis.args.topLvlFoo = TopLvl.foo;\n\n\t\tthis.args.configBar = Config.get('bar');\n\t\tthis.args.topLvlBar = TopLvl.bar;\n\n\t\tthis.args.configBaz = Config.get('baz');\n\t\tthis.args.topLvlBaz = TopLvl.baz;\n\n\t\tthis.args.configQuz = Config.get('quz');\n\t\tthis.args.topLvlQuz = TopLvl.quz;\n\t}\n}\n"
});

;require.register("ConfigDemo/Samples/template.html", function(exports, require, module) {
module.exports = "<pre>\nConfig Foo: [[configFoo]]\nTopLvl Foo: [[topLvlFoo]]\n\nConfig Bar: [[configBar]]\nTopLvl Bar: [[topLvlBar]]\n\nConfig Baz: [[configBaz]]\nTopLvl Baz: [[topLvlBaz]]\n\nConfig Quz: [[configQuz]]\nTopLvl Quz: [[topLvlQuz]]\n\n</pre>\n"
});

;require.register("ConfigDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Config = require("curvature/base/Config");

var _Import = require("curvature/base/Import");

var _View = require("curvature/base/View");

var _View2 = require("../Editor/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Legacy = require('Config');

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    _this.args.theme = _Config.Config.get('theme');
    console.log(Legacy);
    var editor = new _View2.View();
    editor.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Config.jss'),
      mode: 'ace/mode/javascript'
    };
    editor.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/template.html'),
      mode: 'ace/mode/html'
    };
    editor.refreshCode();
    _this.args.editor = editor;
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ConfigDemo/template.html", function(exports, require, module) {
module.exports = "<h2>config</h2>\n\n<p>Configuration may be set in a few ways:</p>\n\n<ul>\n\t<li>Calling <code>Config.set('name', 'value')</code> on <code>curvature/base/Config</code>.</li>\n\t<li>Calling <code>Config.init({name: value, ...})</code> on <code>curvature/base/Config</code>.</li>\n\t<li>Creating a top-level <code>Config</code> class and setting static properties on it.</li>\n</ul>\n\n<p>Configs may be read in two ways:</p>\n\n<ul>\n\t<li>Calling <code>Config.get('name')</code> on <code>curvature/base/Config</code>.</li>\n\t<li>Reading a static property from a top level <code>Config</code> class.\n</ul>\n\n[[editor]]\n"
});

;require.register("CookieDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Config = require("curvature/base/Config");

var _Cookie = require("curvature/base/Cookie");

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Legacy = require('Config');

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');

    _Cookie.Cookie.jar.bindTo('test-cookie-a', function (v) {
      _this.args.testCookieA = v || '';
    });

    _Cookie.Cookie.jar.bindTo('test-cookie-b', function (v) {
      _this.args.testCookieB = v || '';
    });

    _Cookie.Cookie.jar.bindTo('test-cookie-c', function (v) {
      _this.args.testCookieC = v || '';
    });

    return _this;
  }

  _createClass(View, [{
    key: "click",
    value: function click(event, cookieName) {
      _Cookie.Cookie.set(cookieName, (0xFFFFFF * Math.random()).toString(36));
    }
  }, {
    key: "get",
    value: function get(event, cookieName, output) {
      this.args[output] = _Cookie.Cookie.get(cookieName, (0xFFFFFF * Math.random()).toString(36));
    }
  }, {
    key: "del",
    value: function del(event, cookieName) {
      _Cookie.Cookie["delete"](cookieName);
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("CookieDemo/template.html", function(exports, require, module) {
module.exports = "<h2>cookies</h2>\n\n<p>The editor used in the other demos doesn't support cookies, since it doesn't use an http origin, however you can view  the source of the controls below.</p>\n\n<p><b>test-cookie-a</b>: [[testCookieA]]</p>\n\n<div class = \"row\">\n\t<button cv-on = \"click(event, 'test-cookie-a')\">set</button>\n\t<button cv-on = \"click:get(event, 'test-cookie-a', 'aa')\">get [[aa]]</button>\n\t<button cv-on = \"click:del(event, 'test-cookie-a')\">del</button>\n</div>\n\n<p><b>test-cookie-b</b>: [[testCookieB]]</p>\n\n<div class = \"row\">\n\t<button cv-on = \"click(event, 'test-cookie-b')\">set</button>\n\t<button cv-on = \"click:get(event, 'test-cookie-b', 'bb')\">get [[bb]]</button>\n\t<button cv-on = \"click:del(event, 'test-cookie-b')\">del</button>\n</div>\n\n<p><b>test-cookie-c</b>: [[testCookieC]]</p>\n\n<div class = \"row\">\n\t<button cv-on = \"click(event, 'test-cookie-c')\">set</button>\n\t<button cv-on = \"click:get(event, 'test-cookie-c', 'cc')\">get [[cc]]</button>\n\t<button cv-on = \"click:del(event, 'test-cookie-c')\">del</button>\n</div>\n\n<p><b>@TODO: Add source with hljs</b></p>\n"
});

;require.register("Editor/PhpEditor.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhpEditor = void 0;

var _Php = require("php-wasm/Php");

var _View = require("../Editor/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PhpEditor = /*#__PURE__*/function (_Editor) {
  _inherits(PhpEditor, _Editor);

  var _super = _createSuper(PhpEditor);

  function PhpEditor(args) {
    var _this;

    _classCallCheck(this, PhpEditor);

    _this = _super.call(this, args);
    _this.args.subframe = false;
    _this.messageQueue = [];

    var onMessage = function onMessage(event) {
      return _this.onMessage(event);
    };

    window.addEventListener('message', onMessage);

    _this.onRemove(function () {
      return window.removeEventListener('message', onMessage);
    });

    var php = new _Php.Php();
    php.addEventListener('ready', function (event) {});
    php.addEventListener('output', function (event) {
      if (!event.detail) {
        return;
      }

      var frame = _this.tags.result.element;
      var doc = frame.contentWindow.document;
      doc.write(event.detail.join(''));
    });
    _this.php = php;

    _this.onRemove(function () {
      return _this.php = false;
    });

    return _this;
  }

  _createClass(PhpEditor, [{
    key: "refreshCode",
    value: function refreshCode(event) {
      var _this2 = this;

      this.rendered.then(function () {
        var phpCode = _this2.args.tabs.php.body;
        var frame = _this2.tags.result.element;
        var doc = frame.contentWindow.document;
        doc.body.innerHTML = '';

        _this2.php.run(phpCode);

        _this2.args.editorStatus = "Last ran at ".concat(new Date().toISOString());
        _this2.args.editorRefresh = 'refresh-disabled';
      });
    }
  }]);

  return PhpEditor;
}(_View.View);

exports.PhpEditor = PhpEditor;
});

;require.register("Editor/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _Keyboard = require("curvature/input/Keyboard");

var _View2 = require("../ArrayDemo/View");

var _View3 = require("../ObjectDemo/View");

var ace = _interopRequireWildcard(require("brace"));

require("brace/mode/html");

require("brace/mode/javascript");

require("brace/theme/monokai");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.multi = false;

    var kbDebind = _Keyboard.Keyboard.get().keys.bindTo('Control', function (v) {
      _this.multi = v > 0;
      _this.args.multiselect = _this.multi ? 'multiselect' : 'select';
    });

    _this.onRemove(kbDebind);

    _this.template = require('./template');
    _this.args.showJs = true;
    _this.args.showHtml = true;
    _this.args.showResult = true;
    _this.args.location = location;
    _this.args.orientation = _this.args.orientation || 'vertical'; //'horizontal';

    _this.args.tabs = {};
    _this.args.resultTabs = {};

    _this.args.tabs.bindTo(function (v, k) {
      return v.name = k;
    });

    _this.args.resultTabs.bindTo(function (v, k) {
      return v.name = k;
    });

    _this.args.time = new Date().toISOString();

    _this.onFrame(function () {
      _this.args.time = new Date().toISOString();
    });

    _this.args.showClasses = ['showSplit'];
    _this.args.showSplit = 'active';
    _this.args.frameSource = '...';
    return _this;
  }

  _createClass(View, [{
    key: "postRender",
    value: function postRender(x) {
      var _this2 = this;

      this.tags.edit = {};
      this.editors = {};
      var frame = this.tags.result.element;
      this.tags.edit.bindTo(function (tag, prop) {
        if (!tag || _this2.editors[prop]) {
          return;
        }

        var tab = _this2.args.tabs[prop] || _this2.args.resultTabs[prop];
        var editor = ace.edit(tag.element);
        _this2.editors[prop] = editor;
        editor.setValue(tab.body || '', -1);
        editor.session.setMode(tab.mode || 'ace/mode/javascript');
        editor.setTheme('ace/theme/monokai');
        editor.setOptions({
          autoScrollEditorIntoView: true,
          printMargin: false,
          readOnly: tab.readonly || false,
          scrollbarWidth: 6
        });

        var aceChanged = function aceChanged(newValue) {
          if (tab.readonly) {
            return;
          }

          tab.body = editor.getValue();
          _this2.args.editorStatus = "Code updated at ".concat(new Date().toISOString());
          _this2.args.editorRefresh = 'refresh-enabled';
        };

        editor.session.on('change', aceChanged);

        _this2.onRemove(function () {
          editor.session.off('change', aceChanged);
          editor.destroy();
          delete _this2.editors[prop];
        });

        tab.bindTo('body', function (v) {
          if (!tab.readonly) {
            return;
          }

          editor.setValue(v, -1);

          if (tab.readonly) {
            return;
          }

          _this2.refreshCode();
        });
        editor.resize();
      });
    }
  }, {
    key: "attached",
    value: function attached() {}
  }, {
    key: "frameLoaded",
    value: function frameLoaded(event) {}
  }, {
    key: "refreshCode",
    value: function refreshCode(event) {
      var resultTemplate = require('./results');

      resultTemplate = resultTemplate.replace(/\[ORIGIN\]/g, location.origin);
      var js = this.args.tabs.js ? this.args.tabs.js.body : '';
      var html = this.args.tabs.html ? this.args.tabs.html.body : '';
      var css = this.args.tabs.css ? this.args.tabs.css.body : '';
      resultTemplate = resultTemplate.replace(/\[SCRIPT\]/g, js);
      resultTemplate = resultTemplate.replace(/\[TEMPLATE\]/g, html);
      resultTemplate = resultTemplate.replace(/\[STYLE\]/g, css);
      this.args.frameSource = resultTemplate;
      this.args.editorStatus = "Last ran at ".concat(new Date().toISOString());
      this.args.editorRefresh = 'refresh-disabled';
    }
  }, {
    key: "showResult",
    value: function showResult() {
      if (this.args.showSplit) {
        for (var tabName in this.args.tabs) {
          var tab = this.args.tabs[tabName];
          var tag = this.tags.edit[tabName].element.parentNode.parentNode;
          tab.active = '';
          tag.classList.add('hide');
        }

        for (var _tabName in this.args.resultTabs) {
          var _tab = this.args.resultTabs[_tabName];
          var _tag = this.tags.edit[_tabName].element.parentNode.parentNode;
          _tab.active = '';

          _tag.classList.add('hide');
        }

        this.hideResult();
      }

      if (!this.multi) {
        for (var _tabName2 in this.args.tabs) {
          var _tab2 = this.args.tabs[_tabName2];
          var _tag2 = this.tags.edit[_tabName2].element.parentNode.parentNode;
          _tab2.active = '';

          _tag2.classList.add('hide');
        }

        for (var _tabName3 in this.args.resultTabs) {
          var _tab3 = this.args.resultTabs[_tabName3];
          var _tag3 = this.tags.edit[_tabName3].element.parentNode.parentNode;
          _tab3.active = '';

          _tag3.classList.add('hide');
        }
      }

      if (this.multi && this.args.showResult && this.args.showResult !== 'hide') {
        this.args.showSplit = '';
        this.args.showResult = 'hide';
      } else {
        this.args.showSplit = '';
        this.args.showResult = 'active';
      }

      for (var _tab4 in this.args.tabs) {
        this.editors[_tab4].resize();

        this.args[_tab4] = true;
      }
    }
  }, {
    key: "hideResult",
    value: function hideResult() {
      this.args.showSplit = 'hide';
      this.args.showResult = 'hide';
    }
  }, {
    key: "showTab",
    value: function showTab() {
      for (var _len = arguments.length, tabs = new Array(_len), _key = 0; _key < _len; _key++) {
        tabs[_key] = arguments[_key];
      }

      if (!this.multi || !tabs.length) {
        for (var tabName in this.args.tabs) {
          var tag = this.tags.edit[tabName].element.parentNode.parentNode;
          var tab = this.args.tabs[tabName];
          tab.active = '';
          tag.classList.add('hide');
        }

        for (var _tabName4 in this.args.resultTabs) {
          var _tag4 = this.tags.edit[_tabName4].element.parentNode.parentNode;
          var _tab5 = this.args.resultTabs[_tabName4];
          _tab5.active = '';

          _tag4.classList.add('hide');
        }
      }

      this.args.showClasses = [];

      if (!tabs.length) {
        this.args.showResult = '';
        this.args.showSplit = 'active';

        for (var _tabName5 in this.args.tabs) {
          var _tag5 = this.tags.edit[_tabName5].element.parentNode.parentNode;
          var _tab6 = this.args.tabs[_tabName5];

          _tag5.classList.remove('hide');
        }

        for (var _tabName6 in this.args.resultTabs) {
          var _tag6 = this.tags.edit[_tabName6].element.parentNode.parentNode;
          var _tab7 = this.args.resultTabs[_tabName6];

          _tag6.classList.remove('hide');
        }

        this.args.showClasses = ['showSplit'];
      } else {
        if (this.args.showSplit) {
          for (var _tabName7 in this.args.tabs) {
            var _tag7 = this.tags.edit[_tabName7].element.parentNode.parentNode;
            var _tab8 = this.args.tabs[_tabName7];
            _tab8.active = '';

            _tag7.classList.add('hide');
          }

          for (var _tabName8 in this.args.resultTabs) {
            var _tag8 = this.tags.edit[_tabName8].element.parentNode.parentNode;
            var _tab9 = this.args.resultTabs[_tabName8];
            _tab9.active = '';

            _tag8.classList.add('hide');
          }

          this.hideResult();
        }

        if (!this.multi) {
          this.hideResult();
        }

        this.args.showClasses = [];
        this.args.showSplit = '';
      }

      for (var _i = 0, _tabs = tabs; _i < _tabs.length; _i++) {
        var _tab10 = _tabs[_i];
        var _tag9 = this.tags.edit[_tab10.name].element.parentNode.parentNode;

        if (_tab10.active) {
          _tab10.active = '';

          _tag9.classList.add('hide');
        } else {
          _tab10.active = 'active';

          _tag9.classList.remove('hide');
        }
      }

      for (var _i2 = 0, _tabs2 = tabs; _i2 < _tabs2.length; _i2++) {
        var _tab11 = _tabs2[_i2];

        this.editors[_tab11.name].resize();

        this.args[_tab11.name] = true;
      }
    }
  }, {
    key: "changeOrientation",
    value: function changeOrientation() {
      this.args.orientation = this.args.orientation == 'horizontal' ? 'vertical' : 'horizontal';
      this.resizeEditor();
    }
  }, {
    key: "resizeEditor",
    value: function resizeEditor(event) {
      for (var tab in this.args.tabs) {
        this.editors[tab].resize();
      }

      for (var _tab12 in this.args.resultTabs) {
        this.editors[_tab12].resize();
      }
    }
  }, {
    key: "clear",
    value: function clear(clearVar) {
      this.args[clearVar] = '';
    }
  }, {
    key: "joinClass",
    value: function joinClass(input) {
      return (input || []).join(' ');
    }
  }, {
    key: "expand",
    value: function expand(event) {
      this.args.expanded = this.args.expanded ? '' : 'expanded';

      if (this.args.expanded) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }

      this.resizeEditor(event);
    }
  }, {
    key: "escapeQuotes",
    value: function escapeQuotes(input) {
      return String(input).replace(/"/g, '&quot;');
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Editor/results.html", function(exports, require, module) {
module.exports = "<!DOCTYPE HTML>\n<head>\n<style>[STYLE]</style>\n<script src = \"[ORIGIN]/vendor.js\"></script>\n<script>require.register('Config', (exports, require, module)=>{ return module.exports = {Config:{}}});</script>\n\n<script>require.register('template', (exports, require, module)=>{ return module.exports = `[TEMPLATE]`});</script>\n\n<script src = \"[ORIGIN]/curvature.js\"></script>\n\n<script>\n\nwindow.addEventListener('submit', (event) => {\n\n\tconsole.log(event);\n\n\tconst error = event.message;\n\n\twindow.parent.parent.postMessage(\n\t\tJSON.stringify({'@error': error}, null, 2)\n\t, '*');\n\n}, false);\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\n\t[SCRIPT]\n\n\tif(typeof DemoView !== 'undefined')\n\t{\n\t\tconst view = new DemoView;\n\n\t\tview.render(document.body);\n\t}\n\n\tconsole.debug()\n\n});\n\n</script>\n</head>\n<body>\n</body>\n"
});

;require.register("Editor/template.html", function(exports, require, module) {
module.exports = "<div class = \"editor-window [[expanded]]\" cv-on = \"mouseup:resizeEditor(event)\" data-orientation = \"[[orientation]]\" data-multiselect=\"[[multiselect]]\">\n\n\t<div class = \"row full tabs [[showClasses|joinClass]]\">\n\n\t\t<span cv-each = \"tabs:tab:t\" class = \"row dcontent\">\n\t\t\t<div class = \"tab [[tab.active]]\" cv-on = \"click:showTab(tab)\">[[tab.title]]</div>\n\t\t</span>\n\n\t\t<div class = \"tab [[showResult]]\" cv-on = \"click:showResult()\">result</div>\n\n\t\t<span cv-each = \"resultTabs:tab:t\" class = \"row dcontent\">\n\t\t\t<div class = \"tab [[tab.active]]\" cv-on = \"click:showTab(tab)\">[[tab.title]]</div>\n\t\t</span>\n\n\t\t<div class = \"tab [[showSplit]]\" cv-on = \"click:showTab()\">all</div>\n\n\t\t<span class = \"hint\">\n\t\t\t<div data-icon = \"check\"></div>\n\t\t\thold ctrl / ⌘ to select multiple tabs.\n\t\t</span>\n\n\t</div>\n\n\t<div class = \"row full editors [[showClasses|joinClass]]\">\n\n\t\t<p>Select a tab.</p>\n\n\t\t<span cv-each = \"tabs:tab:t\" class = \"dcontent\">\n\t\t\t<div cv-carry = \"t\" class = \"half\">\n\t\t\t\t<p>[[tab.file]]</p>\n\t\t\t\t<div class = \"box\"><div class = \"editor\" cv-ref = \"edit::t\"><textarea cv-bind = \"tab.body\"></textarea></div></div>\n\t\t\t</div>\n\t\t</span>\n\n\t\t<div class = \"half [[showResult]]\">\n\t\t\t<p>Result</p>\n\t\t\t<div class = \"result\">\n\t\t\t\t<iframe\n\t\t\t\t\tcv-ref = \"result\"\n\t\t\t\t\tcv-on  = \"load:frameLoaded(event)\"\n\t\t\t\t\tsrcdoc = '\n\t\t\t\t<meta http-equiv=\"Content-Security-Policy\" content=\"default-src [[location.origin]]/curvature.js ws://[[location.hostname]]:9485\n\t\t\t\t[[location.origin]]/vendor.js &apos;unsafe-inline&apos; connect-src: https://api.dictionaryapi.dev\">\n\t\t\t\t<style>\n\t\t\t\t\tiframe {\n\t\t\t\t\t\tposition: absolute;\n\t\t\t\t\t\ttop: 0px;\n\t\t\t\t\t\tleft: 0px;\n\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\theight: 100%;\n\t\t\t\t\t\tborder: none;\n\t\t\t\t\t}\n\t\t\t\t</style>\n\t\t\t\t<iframe\n\t\t\t\t\tsandbox = \"allow-scripts\"\n\t\t\t\t\tsrc     = \"about:blank\"\n\t\t\t\t\tsrcdoc  = \"[[frameSource|escapeQuotes]]\"\n\t\t\t\t></iframe>\n\t\t\t\t'></iframe>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<span cv-each = \"resultTabs:tab:t\" class = \"dcontent\">\n\t\t\t<div cv-carry = \"t\" class = \"half\">\n\t\t\t\t<p>[[tab.file]]</p>\n\t\t\t\t<div class = \"box\"><div class = \"editor\" cv-ref = \"edit::t\"><textarea cv-bind = \"tab.body\"></textarea></div></div>\n\t\t\t</div>\n\t\t</span>\n\n\t\t<div class = \"buttons\">\n\n\t\t\t<div cv-on = \"click:changeOrientation(event)\" class = \"button orientation\">\n\t\t\t\t<span class = \"label\">vert/horiz</span>\n\t\t\t\t<div data-icon = \"orientation\"></div>\n\t\t\t</div>\n\n\t\t\t<div cv-on = \"click:expand(event)\" class = \"button expand\">\n\t\t\t\t<span class = \"label\">expand/contract</span>\n\t\t\t\t<div data-icon = \"expand\"></div>\n\t\t\t</div>\n\n\t\t</div>\n\n\t</div>\n\n\t<div class = \"row full status\">\n\t\t<div class = \"[[editorRefresh]]\">\n\t\t\t<span>[[editorStatus]]</span>\n\t\t\t<button cv-on = \"click:refreshCode(event)\">⟳</button>\n\t\t</div>\n\t</div>\n\n</div>\n"
});

;require.register("Experiments/GridResizer/DragDrop.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragDrop = void 0;

var _View2 = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DragDrop = /*#__PURE__*/function (_View) {
  _inherits(DragDrop, _View);

  var _super = _createSuper(DragDrop);

  function DragDrop(args, parent, callback) {
    var _this;

    _classCallCheck(this, DragDrop);

    _this = _super.call(this, args, parent);
    _this.template = require('./drag-drop');
    _this.dragging = false;
    _this.callback = callback;
    _this.originalCursor = document.documentElement.style.cursor;

    _this.onRemove(function () {
      document.documentElement.style.cursor = _this.originalCursor;
    });

    return _this;
  }

  _createClass(DragDrop, [{
    key: "setCursor",
    value: function setCursor(cursor) {
      document.documentElement.style.cursor = cursor;

      if (cursor) {
        document.documentElement.style.userSelect = 'none';
      } else {
        document.documentElement.style.userSelect = null;
      }
    }
  }, {
    key: "attached",
    value: function attached() {
      this.tags.frame.style({
        position: 'absolute',
        transform: 'translate(-50%,-100%)'
      });
      this.tags.stage.style({
        pointerEvents: 'none',
        position: 'fixed',
        width: '100%',
        height: '100%'
      });
    }
  }, {
    key: "grab",
    value: function grab(event, parent, index) {
      var _this2 = this;

      if (this.dragging) {
        return;
      }

      var nodes = parent.childNodes;
      var cvDragDrop = new CustomEvent('cvDragGrab', {
        cancelable: true
      });

      if (!parent.dispatchEvent(cvDragDrop)) {
        this.setCursor(null);
        return false;
      }

      this.setCursor('grabbing');
      this.grabIndex = index;
      this.dragging = true;
      var stage = this.tags.stage;
      var frame = this.tags.frame;
      frame.style({
        left: "".concat(event.x, "px"),
        top: "".concat(event.y, "px")
      });

      _toConsumableArray(nodes).map(function (node) {
        return frame.element.appendChild(node);
      });

      this.stop = this.listen(document, 'mousemove', function (e) {
        return _this2.drag(e);
      });
    }
  }, {
    key: "drag",
    value: function drag(event) {
      this.tags.frame.style({
        left: "".concat(event.clientX, "px"),
        top: "".concat(event.clientY, "px")
      });
      var hovering = document.elementFromPoint(event.clientX, event.clientY);

      if (hovering && hovering !== this.hovering) {
        if (this.hovering && !this.hovering.contains(hovering)) {
          this.hovering.dispatchEvent(new CustomEvent('cvDragUnhover', {
            bubbles: true
          }));
        }

        hovering.dispatchEvent(new CustomEvent('cvDragHover', {
          bubbles: true
        }));
      }

      this.hovering = hovering;
    }
  }, {
    key: "drop",
    value: function drop(event, newParent, index) {
      var frame = this.tags.frame.element;

      if (!this.hovering) {
        return false;
      }

      var cvDragDrop = new CustomEvent('cvDragDrop', {
        cancelable: true
      });
      newParent.dispatchEvent(new CustomEvent('cvDragUnhover'));

      if (!newParent.dispatchEvent(cvDragDrop)) {
        return false;
      }

      while (frame.firstChild) {
        this.dragFrom.appendChild(frame.firstChild);
      }

      this.callback && this.callback(this.grabIndex, index);
      this.stop && this.stop();
      this.grabIndex = this.stop = this.dragging = false;
      this.setCursor('');
      return true;
    }
  }, {
    key: "containerMousedown",
    value: function containerMousedown(event, tag, index) {
      var _this3 = this;

      if (this.dragging) {
        return;
      }

      if (event.button !== 0) {
        return;
      }

      this.dragFrom = tag;
      this.grab(event, tag, index);
      this.listen(document, 'mouseup', function (event) {
        if (_this3.dragFrom) {
          _this3.drop(event, _this3.dragFrom, _this3.grabIndex);
        }
      }, {
        once: true
      });
    }
  }, {
    key: "containerMouseup",
    value: function containerMouseup(event, tag, index) {
      if (!this.dragging) {
        return;
      }

      var existing = _toConsumableArray(tag.childNodes);

      var frame = this.tags.frame.element;

      if (this.drop(event, tag, index)) {
        this.dragFrom = false;
      } else if (this.dragFrom) {
        this.drop(event, this.dragFrom, this.grabIndex);
      }

      this.setCursor(null);
    }
  }]);

  return DragDrop;
}(_View2.View);

exports.DragDrop = DragDrop;
});

;require.register("Experiments/GridResizer/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _DragDrop = require("./DragDrop");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var parent = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, View);

    _this = _super.call(this, args, parent);
    _this.template = require('./template.html');
    _this.dragger = new _DragDrop.DragDrop({}, _assertThisInitialized(_this), function (start, finish) {
      var list = _this.args.list;
      var a = _this.args.list[start];
      var b = _this.args.list[finish];
      console.log(a, b);
      var _ref = [a, b];
      list[finish] = _ref[0];
      list[start] = _ref[1];
    });

    _this.dragger.bindTo('dragging', function (v) {
      _this.args.dragging = v ? 'dragging' : '';
    });

    _this.dragger.render(document.body);

    _this.args.trackSize = 16;
    _this.args.xsize = _this.args.xsize || 9;
    _this.args.ysize = _this.args.ysize || 9;
    _this.args.hGrab = Array(-1 + _this.args.xsize).fill(0);
    _this.args.vGrab = Array(-1 + _this.args.ysize).fill(0);
    _this.args.cols = [];
    _this.args.rows = [];
    _this.args.colTemplate = '';
    _this.args.rowTemplate = '';

    _this.args.cols.bindTo(function () {
      return requestAnimationFrame(function () {
        _this.args.colTemplate = _this.args.cols.map(function (c) {
          return isNaN(c) ? c : "".concat(c, "px");
        }).join(' var(--tracksize) ');
      });
    });

    _this.args.rows.bindTo(function () {
      return requestAnimationFrame(function () {
        _this.args.rowTemplate = _this.args.rows.map(function (c) {
          return isNaN(c) ? c : "".concat(c, "px");
        }).join(' var(--tracksize) ');
      });
    }); // this.args.auto = {x: 1, y: 0}


    _this.args.auto = _this.args.auto || {
      x: Math.floor(_this.args.xsize / 2),
      y: Math.floor(_this.args.ysize / 2)
    };

    for (var x = 0; x < _this.args.xsize; x++) {
      if (x === args.auto.x) {
        _this.args.cols.push('auto');

        continue;
      }

      _this.args.cols.push(30);
    }

    for (var y = 0; y < _this.args.ysize; y++) {
      if (y === args.auto.y) {
        _this.args.rows.push('auto');

        continue;
      }

      _this.args.rows.push(30);
    }

    _this.resizing = false;

    var timer = _View.View.from('<b>[[time]]</b>');

    timer.args.time = 0;
    timer.preserve = true;
    timer.onFrame(function () {
      return timer.args.time = new Date().toISOString();
    });

    var face = _View.View.from('<img src = "/player-head-180.png" />');

    face.preserve = true;
    _this.args.list = [1, 2 //timer
    , 3, 4, 5, 6 //face
    , 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, null, null, null, null, null, null, null, null, null].map(function (v, k) {
      return {
        label: v ? String.fromCharCode(96 + v) : '',
        index: k
      };
    }); // .map(x=> x && String.fromCharCode(96 + x));

    return _this;
  }

  _createClass(View, [{
    key: "mousedown",
    value: function mousedown(startEvent) {
      var _this2 = this;

      this.resizing = true;
      var track = Number(event.target.style.getPropertyValue('--track')) / 2;
      var mouseProp = 'clientX';
      var trackType = 'cols';
      var trackCount = this.args.xsize - 1;
      var max = null;
      startEvent.target.style.pointerEvents = 'none';
      var otherElement = document.elementFromPoint(event.clientX, event.clientY);

      if (otherElement.matches('[data-resize]') && otherElement.getAttribute('data-resize') !== startEvent.target.getAttribute('data-resize')) {
        var repeatEvent = new Event('mousedown', {
          bubbles: true
        });
        repeatEvent.clientX = startEvent.clientX;
        repeatEvent.clientY = startEvent.clientY;
        otherElement.dispatchEvent(repeatEvent);
      }

      if (startEvent.target.matches('[data-resize="v"]')) {
        mouseProp = 'clientY';
        trackType = 'rows';
        max = event.target.parentNode.parentNode.clientHeight;
        trackCount = this.args.ysize - 1;
      } else if (startEvent.target.matches('[data-resize="h"]')) {
        max = event.target.parentNode.parentNode.clientWidth;
      } else {
        startEvent.target.style.pointerEvents = null;
        return;
      }

      max -= this.args.trackSize * trackCount;
      var prevOld = this.args[trackType][track - 1];
      var nextOld = this.args[trackType][track + 0];
      var stopMoveListener = this.listen(document, 'mousemove', function (moveEvent) {
        var sweep = moveEvent[mouseProp] - startEvent[mouseProp];
        var prevNew = prevOld;
        var nextOver = 0;
        var prevOver = 0;

        if (!isNaN(prevOld)) {
          prevNew = prevOld + sweep;

          if (prevNew <= 0) {
            prevOver = prevNew;
            prevNew = 0;
          }
        }

        var nextNew = nextOld;

        if (!isNaN(nextOld)) {
          nextNew = nextOld - sweep;

          if (nextNew <= 0) {
            nextOver = nextNew;
            nextNew = 0;
          }
        }

        var sizeTester = [];
        Object.assign(sizeTester, _this2.args[trackType]);
        sizeTester[track - 1] = prevNew;
        sizeTester[track + 0] = nextNew;
        var sizedTo = sizeTester.filter(function (x) {
          return !isNaN(x);
        }).reduce(function (a, b) {
          return a + b;
        }, 0);

        if (sizedTo >= max) {
          var diff = sizedTo - max;

          if (!isNaN(prevOld)) {
            var prevDiff = prevNew - diff;
            sizeTester[track - 1] = prevDiff > 0 ? prevDiff : 0;
          }

          if (!isNaN(nextOld)) {
            var nextDiff = nextNew - diff;
            sizeTester[track + 0] = nextDiff > 0 ? nextDiff : 0;
          }
        }

        if (!isNaN(prevNew) && !isNaN(nextNew)) {
          if (prevNew <= 0) {
            sizeTester[track - 1] = 0;
            sizeTester[track + 0] = nextNew + prevOver;
          }

          if (nextNew <= 0) {
            sizeTester[track - 1] = prevNew + nextOver;
            sizeTester[track + 0] = 0;
          }
        }

        Object.assign(_this2.args[trackType], sizeTester);
      });
      this.listen(document, 'mouseup', function (endEvent) {
        startEvent.target.style.pointerEvents = '';
        stopMoveListener();
        _this2.resizing = false;
      }, {
        once: true
      });
    }
  }, {
    key: "mousemove",
    value: function mousemove(startEvent) {
      startEvent.target.style.pointerEvents = 'none';
      var otherElement = document.elementFromPoint(startEvent.clientX, startEvent.clientY);
      startEvent.target.style.pointerEvents = null;

      if (otherElement.matches('[data-resize]') && otherElement.getAttribute('data-resize') !== startEvent.target.getAttribute('data-resize')) {
        if (!startEvent.repeated) {
          var repeatEvent = new Event('mousemove', {
            bubbles: true
          });
          repeatEvent.clientX = startEvent.clientX;
          repeatEvent.clientY = startEvent.clientY;
          repeatEvent.repeated = true;
          repeatEvent.original = startEvent;
          otherElement.dispatchEvent(repeatEvent);
        }
      }
    }
  }, {
    key: "drag",
    value: function drag(event, tag, index) {
      if (event.target === event.currentTarget) {
        return;
      }

      this.dragger.containerMousedown(event, tag, index);
    }
  }, {
    key: "drop",
    value: function drop(event, tag, index) {
      this.dragger.containerMouseup(event, tag, index);
    }
  }, {
    key: "hover",
    value: function hover(event, tag, index) {
      if (index > 14 && index < 19) {
        tag.style.backgroundColor = '#FCC';
        return;
      }

      tag.style.backgroundColor = '#CFC';
      this.dragger.setCursor('grabbing');
    }
  }, {
    key: "unhover",
    value: function unhover(event, tag) {
      tag.style.backgroundColor = null;
      this.dragger.setCursor('no-drop');
    }
  }, {
    key: "stopdrop",
    value: function stopdrop(event, tag, index) {
      if (index > 14 && index < 19) {
        event.preventDefault();
      }
    }
  }, {
    key: "trackNumber",
    value: function trackNumber(x) {
      return 2 + parseInt(x) * 2;
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Experiments/GridResizer/drag-drop.html", function(exports, require, module) {
module.exports = "<div class = \"drag-drop-stage\" cv-ref = \"stage\">\n\t<div class = \"drag-drop-frame\" cv-ref = \"frame\"></div>\n</div>\n"
});

;require.register("Experiments/GridResizer/template.html", function(exports, require, module) {
module.exports = "<h2>grid-tools</h2>\n\n<p>Grid tools implements one dimensional resize on tracks and two-dimensional on intersections. It also re-sorts its source array on drag & drop.</p>\n\n<p>The order of these black squares will change as you drag & drop the items in the grid below.\n\n<p class = \"list-preview\">\n\t<span class = \"contents\" cv-each = \"list:item:index\">\n\t\t<span class = \"invert\" cv-with = \"item\">\n\t\t\t[[label]]\n\t\t\t<span cv-if = \"!label\">×</span>\n\t\t</span>\n\t</span>\n</p>\n\n<p class = \"row\">track width: <input type = \"range\" min = \"0\" max = \"100\" cv-bind = \"trackSize\"/> [[trackSize]]px</p>\n\n<div\n\tclass = \"grid-resize [[dragging]]\"\n\tstyle = \"\n\t\t--xsize:       calc([[xsize]] * 2);\n\t\t--ysize:       calc([[ysize]] * 2);\n\t\t--tracksize:   [[trackSize]]px;\n\t\t--colTemplate: [[colTemplate]];\n\t\t--rowTemplate: [[rowTemplate]];\n\t\">\n\n\t<span class = \"contents\" cv-each = \"list:item:index\">\n\t\t<div\n\t\t\tclass = \"box box-[[index]]\"\n\t\t\tcv-on = \"\n\t\t\t\tcvDragDrop:stopdrop(event, $tag, index)c;\n\t\t\t\tcvDragGrab:stopdrop(event, $tag, index);\n\t\t\t\tcvDragHover:hover(event, $tag, index);\n\t\t\t\tcvDragUnhover:unhover(event, $tag, index);\n\t\t\t\tmousedown:drag(event, $tag, index)c;\n\t\t\t\tmouseup:drop(event, $tag, index)c;\n\t\t\t\"\n\t\t>\n\t\t\t<div style = \"--index:[[index]]\" cv-with = \"item\">[[label]]</div>\n\t\t</div>\n\t</span>\n\n\t<span class = \"contents\" cv-each = \"hGrab::h\" cv-on = \"mousedown(event);mousemove(event)c;\">\n\t\t<div style = \"--track:[[h|trackNumber]]\" data-resize = \"h\" class = \"resizer resizer-h\"></div>\n\t</span>\n\n\t<span class = \"contents\" cv-each = \"vGrab::v\" cv-on = \"mousedown(event);mousemove(event)c;\">\n\t\t<div style = \"--track:[[v|trackNumber]]\" data-resize = \"v\" class = \"resizer resizer-v\">\n\t\t\t<span class = \"contents\" cv-each = \"hGrab::vh\">\n\t\t\t\t<div style = \"--track:[[vh|trackNumber]]\" data-resize = \"vh\" class = \"resizer resizer-vh\"></div>\n\t\t\t</span>\n\t\t</div>\n\t</span>\n\n\n</div>\n\n<p>[[rowTemplate]]</p>\n<p>[[colTemplate]]</p>\n"
});

;require.register("Experiments/HtmlEditor/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.args.source = "<h1>Hello, world!</h1>\n<p>this is a double-bound HTML editor!</p>\n<p><img src = \"/player-head-180.png\" width = \"180\" height = \"180\" /></p><div><p>Nested tags should auto indent when either field blurs.</p></div>";
    _this.template = require('./template.html');
    _this.args.selections = [];
    _this.args.selected = false;
    _this.editorArgs = {
      xx: 0
    };

    _this.onInterval(1, function () {
      return _this.editorArgs.xx++;
    }); // this.onInterval(10, () => this.editorArgs.xx = (new Date).toISOString());


    return _this;
  }

  _createClass(View, [{
    key: "attached",
    value: function attached() {
      var _this2 = this;

      this.args.bindTo('source', function (v) {
        _this2.args.vv = _View.View.from(v, _this2.editorArgs, _this2);
      });
      this.blur(event);
    }
  }, {
    key: "blur",
    value: function blur() {
      this.format(); // this.args.selected = false;
      // delete this.args.selections[0];
    }
  }, {
    key: "format",
    value: function format() {
      var element = this.tags.html.element;

      var nodes = _toConsumableArray(element.childNodes).filter(function (node) {
        return node.length > 0 || node.nodeType !== node.TEXT_NODE;
      });

      this.args.source = this.formatNodes(nodes, 0);
    }
  }, {
    key: "formatNodes",
    value: function formatNodes(nodes) {
      var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var indent = ' '.repeat(depth * 4);
      var formatted = [];

      for (var i in nodes) {
        var node = nodes[i];
        var line = void 0;

        if (node.hasChildNodes()) {
          var open = node.cloneNode(false).outerHTML.replace(/\<\/.+/, '');
          var close = "</".concat(node.tagName.toLowerCase(), ">");
          var child = this.formatNodes(_toConsumableArray(node.childNodes), depth + 1);

          if (node.querySelector('*')) {
            child = "\n" + "\t".repeat(depth + 1) + child.trim() + "\n" + "\t".repeat(depth + 0);
          } else {
            child = child.trim();
          }

          line = open + child + close + "\n";
        } else {
          line = String(node.outerHTML || node.textContent).trim();
        }

        if (line) {
          formatted.push(indent + line + "\n");
        }
      }

      console.log(formatted);
      return formatted.join('');
    }
  }, {
    key: "click",
    value: function click(event) {
      var _this3 = this;

      var target = event ? event.target : this.args.selected;
      this.args.selected = target;
      this.args.tagName = String(target.tagName).toLowerCase();
      delete this.args.selections[0];
      this.onNextFrame(function () {
        _this3.args.selections[0] = {
          left: target.offsetLeft,
          top: target.offsetTop,
          width: target.clientWidth,
          height: target.clientHeight
        };
        _this3.args.attributes = [];

        var _loop = function _loop(i) {
          var attrControl = {
            value: target.attributes[i].value,
            name: target.attributes[i].name,
            index: i
          };

          _this3.args.attributes.push(attrControl);

          attrControl.bindTo('value', function (v) {
            target.attributes[i].value = v;

            _this3.format();
          });
        };

        for (var i = 0; i < target.attributes.length; i++) {
          _loop(i);
        }
      });
    }
  }, {
    key: "newAttribute",
    value: function newAttribute() {
      this.args.adding = true;
    }
  }, {
    key: "addAttribute",
    value: function addAttribute() {
      this.args.adding = false;
      this.args.selected.setAttribute(this.args.newAttrName, this.args.newAttrValue);
      this.format();
      this.click();
    }
  }, {
    key: "removeAttr",
    value: function removeAttr(_ref) {
      var name = _ref.name;
      this.args.selected.removeAttribute(name);
      this.format();
      this.click();
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Experiments/HtmlEditor/template.html", function(exports, require, module) {
module.exports = "<h2>html editor</h2>\n\n<div class = \"html-editor\">\n\t<textarea\n\t\tclass   = \"editable\"\n\t\tcv-on   = \"blur(event)\"\n\t\tcv-bind = \"source\"\n\t\tcv-ref  = \"source\"\n\t></textarea>\n\n\t<div class = \"selections\" cv-each = \"selections:selection:s\">\n\t\t<div style = \"\n\t\t\tposition: absolute;\n\t\t\tleft: [[selection.left]]px;\n\t\t\ttop: [[selection.top]]px;\n\t\t\twidth: [[selection.width]]px;\n\t\t\theight: [[selection.height]]px;\n\t\t\tbackground-color: rgba(255,0,0,0.25);\n\t\t\tpointer-events: none;\n\t\t\"></div>\n\t</div>\n\n\t<div\n\t\tclass   = \"editable\"\n\t\tcv-on   = \"blur(event);click(event)\"\n\t\tcv-bind = \"$source\"\n\t\tcv-ref  = \"html\"\n\t\tcontenteditable = \"true\"\n\t></div>\n\n\t<div class = \"html-editor-live editable\">\n\t\t[[vv]]\n\t</div>\n\n\t<div class = \"properties\" cv-if = \"selected\">\n\t\t<h3>Tag Name</h3>\n\t\t[[tagName]]<br />\n\t\t<h3>Attributes</h3>\n\t\t<ul>\n\t\t\t<span class = \"contents\" cv-each = \"attributes:attribute:a\">\n\t\t\t\t<li>\n\t\t\t\t\t[[attribute.name]]: <input cv-bind = \"attribute.value\">\n\t\t\t\t\t<button cv-on = \"click:removeAttr(attribute)\">✘</button>\n\t\t\t\t</li>\n\t\t\t</span>\n\t\t\t<li>\n\t\t\t\t<span cv-if = \"!adding\">\n\t\t\t\t\t<button cv-on = \"click:newAttribute()\">+</button>\n\t\t\t\t</span>\n\t\t\t\t<span cv-if = \"adding\">\n\t\t\t\t\t<input cv-bind = \"newAttrName\" placeholder=\"new attribute name...\">\n\t\t\t\t\t<input cv-bind = \"newAttrValue\" placeholder=\"new attribute name...\">\n\t\t\t\t\t<button cv-on = \"click:addAttribute()\">✔</button>\n\t\t\t\t</span>\n\t\t\t</li>\n\t\t</ul>\n\n\t</div>\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _InfiniteScroller = require("./lib/InfiniteScroller");

var _Records = require("./views/Records");

var _Records2 = require("./strings/Records");

var _Scroller = require("./sliders/Scroller");

var _SliderRecords = require("./sliders/SliderRecords");

var _Ease = require("curvature/animate/Ease");

var _Linear = require("curvature/animate/ease/Linear");

var _GeoIn = require("curvature/animate/ease/GeoIn");

var _GeoOut = require("curvature/animate/ease/GeoOut");

var _SineIn = require("curvature/animate/ease/SineIn");

var _SineOut = require("curvature/animate/ease/SineOut");

var _SineInOut = require("curvature/animate/ease/SineInOut");

var _QuadIn = require("curvature/animate/ease/QuadIn");

var _QuadOut = require("curvature/animate/ease/QuadOut");

var _QuadInOut = require("curvature/animate/ease/QuadInOut");

var _CubicIn = require("curvature/animate/ease/CubicIn");

var _CubicOut = require("curvature/animate/ease/CubicOut");

var _CubicInOut = require("curvature/animate/ease/CubicInOut");

var _QuartIn = require("curvature/animate/ease/QuartIn");

var _QuartOut = require("curvature/animate/ease/QuartOut");

var _QuartInOut = require("curvature/animate/ease/QuartInOut");

var _QuintIn = require("curvature/animate/ease/QuintIn");

var _QuintOut = require("curvature/animate/ease/QuintOut");

var _QuintInOut = require("curvature/animate/ease/QuintInOut");

var _ElasticOut = require("curvature/animate/ease/ElasticOut");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    _this.args.rows = 10;
    _this.args.rows = 1000001;
    _this.args.rowHeight = 33;
    var gridScroller = new _Scroller.Scroller();
    _this.args.gridScroller = gridScroller;

    _this.args.bindTo('rowHeight', function (v) {
      return gridScroller.args.rowHeight = v;
    });

    var recordSet = new _SliderRecords.SliderRecords();
    gridScroller.args.content = recordSet;

    _this.args.bindTo('rows', function (v) {
      return recordSet.changed(v);
    });

    _this.args.simpleRows = 1000001;
    _this.args.arrayScroller = new _InfiniteScroller.InfiniteScroller({
      rowHeight: 33
    });
    _this.args.arrayScroller.args.content = Array(_this.args.simpleRows).fill(1).map(function (v, k) {
      return _this.thousands(k);
    });
    _this.args.stringScroller = new _InfiniteScroller.InfiniteScroller({
      rowHeight: 33
    });
    _this.args.stringScroller.args.content = new _Records2.Records();
    _this.args.viewScroller = new _InfiniteScroller.InfiniteScroller({
      rowHeight: 33
    });
    _this.args.viewScroller.args.content = new _Records.Records();
    return _this;
  }

  _createClass(View, [{
    key: "thousands",
    value: function thousands(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }, {
    key: "leftPad",
    value: function leftPad(x) {
      return String(x).padStart(4, 0);
    }
  }, {
    key: "round",
    value: function round(input) {
      return Math.round(input);
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Experiments/InfiniteScroll/lib/InfiniteScroller.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfiniteScroller = void 0;

var _View = require("curvature/base/View");

var _Mixin = require("curvature/base/Mixin");

var _Tag = require("curvature/base/Tag");

var _GeoIn = require("curvature/animate/ease/GeoIn");

var _GeoOut = require("curvature/animate/ease/GeoOut");

var _ElasticOut = require("curvature/animate/ease/ElasticOut");

var _Row = require("./Row");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var InfiniteScroller = /*#__PURE__*/function (_Mixin$from) {
  _inherits(InfiniteScroller, _Mixin$from);

  var _super = _createSuper(InfiniteScroller);

  function InfiniteScroller(args, parent) {
    var _this;

    _classCallCheck(this, InfiniteScroller);

    _this = _super.call(this, args, parent);
    _this.template = require('./infinite-scroller');

    _this.preRuleSet.add('[cv-ref="list"]', function (_ref) {
      var element = _ref.element;
      element.setAttribute('tabindex', -1);
      element.setAttribute('cv-each', 'visible:row:r');
      element.setAttribute('cv-view', 'Experiments/InfiniteScroll/lib/Row');
    });

    _this.args.visible = [];
    _this.args.content = undefined;
    _this.first = null;
    _this.last = null;
    _this.changing = false;
    _this.lastScroll = false;
    _this.topSpeed = 0;
    _this.speed = 0;
    _this.args.width = '100%';
    _this.args.height = '100%';
    _this.args.scrollTop = 0;
    _this.args.scrollDir = 0;
    _this.args.rowHeight = _this.args.rowHeight || 32;

    _this.args.bindTo('scrollTop', function (v, k, t) {
      _this.args.scrollDir = 0;

      if (v > t[k]) {
        _this.args.scrollDir = 1;
      } else if (v < t[k]) {
        _this.args.scrollDir = -1;
      }
    });

    return _this;
  }

  _createClass(InfiniteScroller, [{
    key: "attached",
    value: function attached() {
      var _this2 = this;

      var container = this.container = this.tags.list;
      var shim = new _Tag.Tag('<div data-tag = "shim">');
      container.style({
        overflowY: 'scroll',
        position: 'relative',
        display: 'block',
        width: '100%'
      });
      shim.style({
        pointerEvents: 'none',
        position: 'absolute',
        opacity: 0,
        height: 'var(--shimHeight)',
        width: '1px'
      });
      container.append(shim.element);

      var setHeights = function setHeights(v, k) {
        return container.style(_defineProperty({}, "--".concat(k), "".concat(v, "px")));
      };

      this.args.bindTo('height', function (v) {
        return container.style({
          height: v
        });
      });
      this.args.bindTo('width', function (v) {
        return container.style({
          width: v
        });
      });
      this.args.bindTo('rowHeight', setHeights);
      this.args.bindTo('shimHeight', setHeights);
      this.args.bindTo('rowHeight', function (v, k, t) {
        t[k] = parseInt(v);
        var headerRow = _this2.header() ? 1 : 0;
        var rows = headerRow + _this2.args.content.length;
        _this2.args.shimHeight = rows * _this2.args.rowHeight;
        _this2.container.scrollTop = _this2.first * _this2.args.rowHeight;

        _this2.updateViewport();
      });
      this.contentDebind = this.args.bindTo('content', function (v, k, t) {
        var headerRow = _this2.header() ? 1 : 0;
        var rows = headerRow + v.length;
        _this2.args.shimHeight = rows * _this2.args.rowHeight;

        _this2.onNextFrame(function () {
          return _this2.updateViewport();
        });

        _this2.lengthDebind && _this2.lengthDebind();
        _this2.lengthDebind = v.bindTo('length', function (v) {
          v = Number(v);
          _this2.args.shimHeight = (v + headerRow) * _this2.args.rowHeight;

          _this2.onNextFrame(function () {
            return _this2.updateViewport();
          });
        });

        _this2.updateViewport();
      });
      this.listen('scroll', function (event) {
        return _this2.updateViewport(event);
      });
      this.updateViewport();
    }
  }, {
    key: "updateViewport",
    value: function updateViewport() {
      var _this3 = this;

      this.snapper && this.snapper.cancel();

      if (this.changing) {
        return;
      }

      var container = this.container;
      var start = this.args.scrollTop = container.scrollTop;
      var depth = this.args.scrollHeight = container.scrollHeight;
      var space = container.offsetHeight;
      var fold = start + space;
      this.args.scrollMax = depth - space;
      var first = Math.floor(start / this.args.rowHeight);
      var last = Math.ceil(fold / this.args.rowHeight);
      var lastScroll = {
        time: Date.now(),
        pos: start
      };

      if (!this.speedTimer) {
        this.speedTimer = this.onTimeout(100, function () {
          var timeDiff = Date.now() - lastScroll.time;
          var posDiff = container.scrollTop - start;
          _this3.speed = posDiff / timeDiff * 1000;
          var absSpeed = Math.abs(_this3.speed);

          if (absSpeed > Math.abs(_this3.topSpeed)) {
            _this3.topSpeed = _this3.speed;
          }

          if (!_this3.speed) {
            _this3.topSpeed = _this3.speed;
          }

          _this3.args.speed = _this3.speed.toFixed(2);
        });
        this.speedTimer = false;
      }

      if (first > this.args.content.length) {
        first = this.args.content.length - 1;
      }

      if (last > this.args.content.length) {
        last = this.args.content.length - 1;
      }

      this.setVisible(first, last);

      if (start === 0 || fold === depth) {
        container.style({
          '--inertiaOffset': "0px"
        });
        container.style({
          '--snapperOffset': "0px"
        });
        return;
      }

      var closeRow = Math.round(start / this.args.rowHeight);
      var groove = closeRow * this.args.rowHeight;
      var diff = groove - start;
      var duration = Math.abs(diff * this.args.rowHeight / 2);

      if (duration > 192) {
        duration = 192;
      }
      /*/
      const snapper = new GeoIn(duration, {power: 5});
      /*/


      var snapper = new _ElasticOut.ElasticOut(duration * 13, {
        friction: 0.15
      }); //*/

      this.snapperDone && this.snapperDone();
      this.snapperDone = this.onFrame(function () {
        var offset = snapper.current() * diff;
        container.style({
          '--snapperOffset': "".concat(-1 * offset, "px")
        });
      });
      snapper.then(function (elapsed) {
        _this3.onNextFrame(function () {
          container.style({
            '--snapperOffset': 0
          });
          container.node.scrollTop = groove;
        });

        _this3.snapperDone();

        event.preventDefault();
      })["catch"](function (elapsed) {
        var offset = _this3.snapper.current() * diff;
        container.style({
          '--snapperOffset': "".concat(-1 * offset, "px")
        });
      });
      this.scrollFrame && cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = requestAnimationFrame(function () {
        return snapper.start();
      });
      this.snapper = snapper;
    }
  }, {
    key: "setVisible",
    value: function setVisible(first, last) {
      if (this.changing) {
        return;
      }

      if (this.first === first && this.last === last) {
        return;
      }

      if (!this.tags.list) {
        return;
      }

      var listTag = this.tags.list;
      var visibleList = this.viewLists.get(listTag.element);
      this.changing = true;
      var visible = visibleList.views;
      var del = [];

      for (var i in visible) {
        var index = parseInt(i);
        var entry = visible[index];

        if (first === last && last === 0) {
          del.unshift(index);
          continue;
        }

        if (index < first || index > last) {
          del.unshift(index);
          continue;
        }

        if (entry && (!entry.visible || entry.removed)) {
          del.unshift(index);
          continue;
        }
      }

      for (var _i = 0, _del = del; _i < _del.length; _i++) {
        var d = _del[_i];

        if (d === 0) {
          continue;
        }

        visible[d].remove();
        delete visible[d];
        delete this.args.visible[d];
      }

      for (var _i2 = first; _i2 <= last; _i2++) {
        if (visible[_i2] && !visible[_i2].removed && visible[_i2].firstNode && visible[_i2].firstNode.getRootNode() === document) {
          continue;
        }

        if (this.args.content.length <= _i2) {
          continue;
        }

        this.args.visible[_i2] = this.args.content[_i2];
      }

      ;
      this.first = first;
      this.last = last;
      this.changing = false;
    }
  }, {
    key: "header",
    value: function header() {
      if (!this.args.content) {
        return false;
      }

      if (typeof this.args.content.header !== 'function') {
        return false;
      }

      return this.args.content.header();
    }
  }, {
    key: "leftPad",
    value: function leftPad(x) {
      return String(x).padStart(4, 0);
    }
  }]);

  return InfiniteScroller;
}(_Mixin.Mixin.from(_View.View));

exports.InfiniteScroller = InfiniteScroller;
});

;require.register("Experiments/InfiniteScroll/lib/RecordSet.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecordSet = void 0;

var _Bindable = require("curvature/base/Bindable");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Fetch = Symbol('_Fetch');

var RecordSet = /*#__PURE__*/function () {
  function RecordSet() {
    var _this = this;

    _classCallCheck(this, RecordSet);

    _defineProperty(this, "length", 0);

    this.length = 1000000;

    var get = function get(t, k) {
      if (k === 'length') {
        return _this.count();
      }

      if (_typeof(k) === 'symbol' || parseInt(k) !== Number(k)) {
        return t[k];
      }

      return _this[_Fetch](Number(k));
    };

    var set = function set(t, k, v) {
      if (_typeof(k) === 'symbol' || parseInt(k) !== Number(k)) {
        return true;
      }

      return true;
    };

    var del = function del(t, k) {
      return true;
    };

    return new Proxy(_Bindable.Bindable.make(this), {
      get: get,
      set: set,
      "delete": del
    });
  }

  _createClass(RecordSet, [{
    key: "count",
    value: function count() {
      var offset = this.header() ? -1 : 0;
      return this.length - offset;
    }
  }, {
    key: "header",
    value: function header() {
      return false;
    }
  }, {
    key: _Fetch,
    value: function value(k) {
      var header = this.header();

      if (k === 0 && header) {
        header.___header = 'is-header';
        return header;
      }

      var offset = header ? -1 : 0;

      if (!this.content) {
        this.content = [];
      }

      if (this.content[k + offset]) {
        return this.content[k + offset];
      }

      return this.content[k + offset] = this.fetch(k + offset);
    }
  }, {
    key: "fetch",
    value: function fetch(k) {
      return undefined;
    }
  }]);

  return RecordSet;
}();

exports.RecordSet = RecordSet;
});

;require.register("Experiments/InfiniteScroll/lib/Row.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Row = void 0;

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Row = /*#__PURE__*/function (_BaseView) {
  _inherits(Row, _BaseView);

  var _super = _createSuper(Row);

  function Row(args, parent) {
    var _this;

    _classCallCheck(this, Row);

    _this = _super.call(this, args, parent);
    _this.visible = true;
    _this.preserve = true;
    return _this;
  }

  _createClass(Row, [{
    key: "attached",
    value: function attached() {
      var _this2 = this;

      var rowTag = this.tags.row;
      rowTag.style.setProperty('--index', this.args.r);
      rowTag.style.position = 'absolute';
      rowTag.style.height = 'var(--rowHeight)';
      rowTag.style.transform = "translateY(calc( var(--snapperOffset) + var(--inertiaOffset) ))";
      rowTag.style.top = 'calc( var(--rowHeight) * var(--index)';
      var observer = new IntersectionObserver(function (e, o) {
        return _this2.scrollObserved(e, o);
      }, {
        root: this.parent.container.node
      });
      observer.observe(rowTag);
    }
  }, {
    key: "scrollObserved",
    value: function scrollObserved(entries, observer) {
      var visible = false;

      var _iterator = _createForOfIteratorHelper(entries),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;

          if (entry.intersectionRatio) {
            visible = true;
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.visible = visible;
    }
  }]);

  return Row;
}(_View.View);

exports.Row = Row;
});

;require.register("Experiments/InfiniteScroll/lib/infinite-scroller.html", function(exports, require, module) {
module.exports = "<div class = \"cv-hyperscroller\" cv-ref  = \"list\">\n\t<div class = \"cv-hyperscroller-row\" cv-ref = \"row\">[[row]]</div>\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/sliders/Scroller.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scroller = void 0;

var _InfiniteScroller2 = require("../lib/InfiniteScroller");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Scroller = /*#__PURE__*/function (_InfiniteScroller) {
  _inherits(Scroller, _InfiniteScroller);

  var _super = _createSuper(Scroller);

  function Scroller() {
    var _this;

    _classCallCheck(this, Scroller);

    _this = _super.call(this);
    _this.template = require('./scroller');
    return _this;
  }

  return Scroller;
}(_InfiniteScroller2.InfiniteScroller);

exports.Scroller = Scroller;
});

;require.register("Experiments/InfiniteScroll/sliders/SliderRecords.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SliderRecords = void 0;

var _RecordSet2 = require("../lib/RecordSet");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SliderRecords = /*#__PURE__*/function (_RecordSet) {
  _inherits(SliderRecords, _RecordSet);

  var _super = _createSuper(SliderRecords);

  function SliderRecords() {
    _classCallCheck(this, SliderRecords);

    return _super.apply(this, arguments);
  }

  _createClass(SliderRecords, [{
    key: "changed",
    value: function changed(length) {
      this.length = length;
    }
  }, {
    key: "header",
    value: function header() {
      return {
        id: 'id',
        title: 'title',
        value: 'value'
      };
    }
  }, {
    key: "fetch",
    value: function fetch(k) {
      var id = k + 1;
      var title = ((k + 0xFF * 0xFF + 30) / 77).toString(36);
      var value = k % 100;
      return {
        index: k,
        id: id,
        title: title,
        value: value
      };
    }
  }]);

  return SliderRecords;
}(_RecordSet2.RecordSet);

exports.SliderRecords = SliderRecords;
});

;require.register("Experiments/InfiniteScroll/sliders/scroller.html", function(exports, require, module) {
module.exports = "<div cv-ref = \"list\" class = \"table\">\n\n\t<div\n\t\tcv-ref  = \"row\"\n\t\tcv-with = \"row\"\n\t\tclass   = \"table-row [[row.___header]]\">\n\n\t\t<div>[[id]]</div>\n\n\t\t<div>\n\t\t\t<span cv-if = \"___header\">\n\t\t\t\ttitle\n\t\t\t</span>\n\t\t\t<span cv-if = \"!___header\">\n\t\t\t\t<input type = \"text\" cv-bind = \"title\" placeholder = \"input a title\">\n\t\t\t</span>\n\t\t</div>\n\n\t\t<div>[[value]]</div>\n\n\t\t<div cv-if = \"!___header\">\n\n\t\t\t<input\n\t\t\t\ttype    = \"range\"\n\t\t\t\tmin     = \"0\"\n\t\t\t\tmax     = \"100\"\n\t\t\t\tcv-bind = \"value\">\n\n\t\t</div>\n\n\t\t<div>\n\t\t\t<span cv-if = \"!?index\">Row</span>\n\t\t\t<span cv-if = \"?index\">[[index]]</span>\n\t\t</div>\n\n\t</div>\n\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/strings/Records.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Records = void 0;

var _RecordSet2 = require("../lib/RecordSet");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Records = /*#__PURE__*/function (_RecordSet) {
  _inherits(Records, _RecordSet);

  var _super = _createSuper(Records);

  function Records() {
    var _this;

    _classCallCheck(this, Records);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "length", 1000001);

    return _this;
  }

  _createClass(Records, [{
    key: "fetch",
    value: function fetch(k) {
      return "String #".concat(k, "!");
    }
  }]);

  return Records;
}(_RecordSet2.RecordSet);

exports.Records = Records;
});

;require.register("Experiments/InfiniteScroll/template.html", function(exports, require, module) {
module.exports = "<h2>Experimental Scrollers</h2>\n\n<p>These scroll boxes automatically remove any DOM elements that are no longer visible to the user. This allows us to make large scrollable boxes without wasting large amounts of computing power on DOM calculations for records that may never become visible.</p>\n\n<div class = \"row wide line-up\">\n\n\t<div class = \"wide\">\n\t\t<h3>Simple Scroller</h3>\n\n\t\t<p>This scroller uses an array of <b>[[simpleRows|thousands]]</b> integers.</p>\n\t\t<p>Arrays and RecordSets are interchangeable here.</p>\n\n\t\t<div class = \"simple scroller\">\n\t\t\t[[arrayScroller]]\n\t\t</div>\n\n\t</div>\n\n\t<div class = \"wide\">\n\n\t\t<h3>String Scroller</h3>\n\n\t\t<p>This scroller uses a RecordSet that returns strings.</p>\n\t\t<p>An array of strings could easily have been used instead of a RecordSet.</p>\n\n\t\t<div class = \"string scroller\">\n\t\t\t[[stringScroller]]\n\t\t</div>\n\n\t</div>\n\n\t<div class = \"wide\">\n\n\t\t<h3>View Scroller</h3>\n\n\t\t<p>This scroller uses a RecordSet that returns curvature View objects.</p>\n\t\t<p>There is a 250ms simulated load time when the view is first accessed.</p>\n\n\t\t<div class = \"views scroller\">\n\t\t\t[[viewScroller]]\n\t\t</div>\n\n\t</div>\n\n</div>\n\n<h3>Grid Scroller</h3>\n\n<p>This scroller uses CSS grid, and a custom template to simulate a table. Its RecordSet returns plain objects.</p>\n\n<p>The number (<b>[[rows|thousands]]</b>) of records and row height can be altered on the fly as well, this is common to all Scrollers.</p>\n\n<p>Counting both the texboxes & sliders, there are 2,000,002 input fields avaiable below, each mapped to an object in memory.</p>\n\n<p><b>NOTE:</b> This is currently limited by the scroll-height limit of <u>33,554,400 pixels</u> imposed by webkit.</p>\n\n<div class = \"row wide\">\n\t<div class = \"row wide\">\n\t\t<label>\n\t\t\t<p>Rows:&nbsp;<input cv-bind = \"rows\" type = \"number\" min = \"0\" /></p>\n\t\t</label>\n\t</div>\n\t<div class = \"row wide\">\n\t\t<label>\n\t\t\t<p>\n\t\t\t\tRow Height [[rowHeight|leftPad]]px\n\t\t\t\t<input cv-bind = \"rowHeight\" type = \"range\" max = \"100\" />\n\t\t\t</p>\n\t\t</label>\n\t</div>\n</div>\n\n<div class = \"grid scroller\">\n\t[[gridScroller]]\n</div>\n\n<div class = \"row wide\">\n\t<div class = \"row wide\">\n\t\tPosition: [[gridScroller.args.scrollTop]] / [[gridScroller.args.scrollMax]]\n\t</div>\n\t<div class = \"row wide\">\n\t\tSpeed: [[gridScroller.args.speed]] px/s\n\t</div>\n</div>\n\n"
});

;require.register("Experiments/InfiniteScroll/views/Records.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Records = void 0;

var _RecordSet2 = require("../lib/RecordSet");

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Records = /*#__PURE__*/function (_RecordSet) {
  _inherits(Records, _RecordSet);

  var _super = _createSuper(Records);

  function Records() {
    var _this;

    _classCallCheck(this, Records);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "length", 1000001);

    return _this;
  }

  _createClass(Records, [{
    key: "fetch",
    value: function fetch(k) {
      var view = _View.View.from("<div class = \"contents\">\n\t\t\t\t<span cv-if = \"ready\" class = \"contents\">\n\t\t\t\t\t<i>#[[k]]</i>\n\t\t\t\t\t<div class = \"input\">\n\t\t\t\t\t\t<input placeholder = \"type here\" cv-bind = \"val\">\n\t\t\t\t\t\t<div>[[val]]</div>\n\t\t\t\t\t</div>\n\t\t\t\t</span>\n\t\t\t\t<span cv-if = \"!ready\">\n\t\t\t\t\tloading...\n\t\t\t\t</span>\n\t\t\t</div>", {
        k: k
      });

      setTimeout(function () {
        return view.args.ready = true;
      }, 250);
      return view;
    }
  }]);

  return Records;
}(_RecordSet2.RecordSet);

exports.Records = Records;
});

;require.register("Experiments/Php/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _PhpEditor = require("../../Editor/PhpEditor");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    var editor = _this.args.editor = new _PhpEditor.PhpEditor();
    editor.args.tabs.php = {
      title: 'php',
      file: 'HelloWorld.php',
      body: require('./phpinfo.php'),
      mode: 'ace/mode/php'
    };

    _this.onNextFrame(function () {
      return editor.refreshCode();
    });

    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Experiments/Php/phpinfo.php", function(exports, require, module) {
module.exports = "<?php\n\nphpinfo();\n"
});

;require.register("Experiments/Php/template.html", function(exports, require, module) {
module.exports = "<h2>Basic PHP Integration</h2>\n\nPHP is running in-browser here. Open your dev tools and watch your network tab to verify that no server communication is happening here.\n\n[[editor]]\n"
});

;require.register("FormsDemo/FormEditor.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormEditor = void 0;

var _View = require("../Editor/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FormEditor = /*#__PURE__*/function (_Editor) {
  _inherits(FormEditor, _Editor);

  var _super = _createSuper(FormEditor);

  function FormEditor(args) {
    var _this;

    _classCallCheck(this, FormEditor);

    _this = _super.call(this, args);
    _this.args.subframe = false;
    _this.messageQueue = [];
    _this.args.resultTabs.output = {
      title: 'json',
      file: 'Result JSON',
      body: '{}',
      mode: 'ace/mode/javascript',
      readonly: true
    };

    var onMessage = function onMessage(event) {
      return _this.onMessage(event);
    };

    window.addEventListener('message', onMessage);

    _this.onRemove(function () {
      return window.removeEventListener('message', onMessage);
    });

    return _this;
  }

  _createClass(FormEditor, [{
    key: "frameLoaded",
    value: function frameLoaded(event) {
      this.args.subframe = event.target.contentWindow.frames[0];

      while (event = this.messageQueue.shift()) {
        this.onMessage(event);
      }
    }
  }, {
    key: "onMessage",
    value: function onMessage(event) {
      if (!this.args.subframe) {
        this.messageQueue.push(event);
        return;
      }

      if (event.source === this.args.subframe) {
        this.args.resultTabs.output.body = event.data + "\n" || '';
      }
    }
  }]);

  return FormEditor;
}(_View.View);

exports.FormEditor = FormEditor;
});

;require.register("FormsDemo/Samples/Basic.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tthis.args.form = new Form({\n\t\t\t_method: 'POST'\n\t\t\t, id: {type:'number', value: 1}\n\t\t\t, name: {}\n\t\t\t, submit: {type: 'submit', value: 'submit'}\n\t\t});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/ButtonField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {type: 'button', value: 'this is a button'};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/Checkbox.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'Checkbox Field'\n\t\t\t, type:  'checkbox'\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/FileField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'File field'\n\t\t\t, type:  'file'\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/Form.html", function(exports, require, module) {
module.exports = "<style>\nlabel,input:not([type=\"radio\"]),select,textarea{display: block; margin: 0.5em;}\n</style>\n\n[[form]]\n"
});

;require.register("FormsDemo/Samples/Form.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst commentField = {\n\t\t\ttype: 'fieldset'\n\t\t\t, array: true\n\t\t\t, children: {\n\t\t\t\tid:        {type: 'number'}\n\t\t\t\t, content: {type: 'textarea'}\n\t\t\t}\n\t\t};\n\n\t\tconst formSkeleton = {\n\n\t\t\t_method: 'POST'\n\n\t\t\t, hidden: {type:'hidden', value: 'hidden value'}\n\n\t\t\t, id: {type:'number', value: 1000}\n\t\t\t, name: {}\n\n\t\t\t, access: {\n\t\t\t\ttype:    'radios'\n\t\t\t\t, options: {\n\n\t\t\t\t\t'private':  0\n\t\t\t\t\t, 'public': 1\n\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t, image: {type: 'file'}\n\n\t\t\t, type: {\n\t\t\t\ttype:    'select'\n\t\t\t\t, value: 300\n\t\t\t\t, options: {\n\n\t\t\t\t\t'-select-': null\n\t\t\t\t\t, 'image':  100\n\t\t\t\t\t, 'text':   200\n\t\t\t\t\t, 'video':  300\n\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t, comments: {\n\t\t\t\tname:   'comments'\n\t\t\t\t, type: 'fieldset'\n\t\t\t\t, array: true\n\t\t\t\t, children: [\n\n\t\t\t\t\tcommentField\n\t\t\t\t\t, commentField\n\n\t\t\t\t]\n\t\t\t}\n\n\t\t\t, submit: {\n\t\t\t\ttype: 'submit'\n\t\t\t}\n\t\t};\n\n\t\tconst form = new Form(formSkeleton);\n\n\t\tform.bindTo('json', v => {\n\t\t\tconst output = v;\n\n\t\t\tthis.args.output = output;\n\n\t\t\twindow.parent.parent.postMessage(output, 'http://localhost:3333');\n\t\t});\n\n\t\tthis.args.form = form;\n\t\tthis.args.formSkeleton = formSkeleton;\n\t}\n\n\ttoJson(input)\n\t{\n\t\treturn JSON.stringify(input, null, 2);\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/Groups.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst personField = {\n\t\t\ttype:    'fieldset'\n\t\t\t, title: 'Person'\n\t\t\t, array: true\n\t\t\t, children: {\n\t\t\t\tid: {type:'number'}\n\t\t\t\t, name:  {}\n\t\t\t}\n\t\t};\n\n\t\tconst peopleField = {\n\t\t\ttype:    'fieldset'\n\t\t\t, title: 'People'\n\t\t\t, array: true\n\t\t\t, children: [\n\t\t\t\tpersonField\n\t\t\t\t, personField\n\t\t\t\t, personField\n\t\t\t]\n\t\t};\n\n\t\tthis.args.form = new Form({\n\t\t\t_method:  'POST'\n\t\t\t, field:  peopleField\n\t\t\t, submit: {type: 'submit', value: 'submit'}\n\t\t});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/HiddenField.html", function(exports, require, module) {
module.exports = "<style>\nlabel,input:not([type=\"radio\"]),select,textarea{display: block; margin: 0.5em;}\n</style>\n\nHidden fields are invisible:\n\n[[form]]\n"
});

;require.register("FormsDemo/Samples/HiddenField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'Hidden field'\n\t\t\t, type:  'hidden'\n\t\t\t, value: 'You cant see me.'\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/Html5.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tthis.args.form = new Form({\n\t\t\t_method: 'POST'\n\t\t\t, id:        {type:'number', value: 1}\n\t\t\t, name:      {}\n\t\t\t, phone:     {type:'tel',attrs:{pattern:'[0-9]{3}-[0-9]{2}-[0-9]{3}'}}\n\t\t\t, favColor:  {type:'color', title: 'Favorite Color'}\n\t\t\t, birthday:  {type:'date'}\n\t\t\t, available: {type:'time'}\n\t\t\t, week:      {type:'week'}\n\t\t\t, email:     {type:'email'}\n\t\t\t, homepage:  {type:'url'}\n\t\t\t, submit:    {type: 'submit', value: 'submit'}\n\t\t});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/Html5Form.html", function(exports, require, module) {
module.exports = "<style>\nlabel,input:not([type=\"radio\"]),select,textarea{display: block; margin: 0.5em;}\ninput:invalid { background-color: pink; }\n</style>\n\n[[form]]\n"
});

;require.register("FormsDemo/Samples/HtmlField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst staticHtml = {\n\t\t\ttitle:   'Static HTML Field'\n\t\t\t, type:  'html'\n\t\t\t, value: '<li><b><u>This is static HTML</u></b></li>'\n\t\t};\n\n\t\tconst editableHtml = {\n\t\t\ttitle:   'Editable HTML Field'\n\t\t\t, type:  'html'\n\t\t\t, attrs: { contenteditable: true }\n\t\t\t, value: `<li><b>These</b></li>\n<li><b>Items</b></li>\n<li><b>Are</b></li>\n<li><b>Editable</b></li>\n<li onclick = \"this.remove()\"><b>This one removes on click!</b></li>`\n\t\t};\n\n\t\tthis.args.form = new Form({staticHtml, editableHtml});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/HtmlForm.html", function(exports, require, module) {
module.exports = "<style>\nul div {display: content};\nlabel,input,textarea {display: block; margin: 0.5em;}\ntextarea {width: 100%;}\n</style>\n\n<small>HTML</small>\n<ul>\n    [[form]]\n</ul>\n\n<small>Source</small>\n<textarea rows = \"7\" cv-bind = \"form.fields.editableHtml.args.value\"></textarea>\n\n<pre>\n<b>ctrl / ⌘ + b</b>\n<i>ctrl / ⌘ + i</i>\n<u>ctrl / ⌘ + u</u>\n</pre>\n"
});

;require.register("FormsDemo/Samples/RadioField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'Radio Field'\n\t\t\t, type:  'radios'\n\t\t\t, value: 2\n\t\t\t, options: {\n\t\t\t\t'Red':     1\n\t\t\t\t, 'Blue':  2\n\t\t\t\t, 'Green': 3\n\t\t\t}\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/SelectField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'Select Field'\n\t\t\t, type:  'select'\n\t\t\t, value: 3\n\t\t\t, options: {\n\t\t\t\t'Select One': null\n\t\t\t\t, 'Red':   1\n\t\t\t\t, 'Blue':  2\n\t\t\t\t, 'Green': 3\n\t\t\t}\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/SubmitField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {type: 'submit', value: 'submit'};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/TextAreaField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:  'TextArea Field'\n\t\t\t, type: 'textarea'\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/TextField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:  'Text Field'\n\t\t\t, type: 'text'\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _FormEditor = require("./FormEditor");

var ace = _interopRequireWildcard(require("brace"));

require("brace/mode/html");

require("brace/mode/javascript");

require("brace/theme/monokai");

var _Form = require("curvature/form/Form");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    var basic = _this.args.basic = new _FormEditor.FormEditor();
    basic.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Basic.jss'),
      mode: 'ace/mode/javascript'
    };
    basic.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    basic.refreshCode();
    var group = _this.args.group = new _FormEditor.FormEditor();
    group.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Groups.jss'),
      mode: 'ace/mode/javascript'
    };
    group.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    group.refreshCode();
    var textField = _this.args.textField = new _FormEditor.FormEditor();
    textField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/TextField.jss'),
      mode: 'ace/mode/javascript'
    };
    textField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    textField.refreshCode();
    var textareaField = _this.args.textareaField = new _FormEditor.FormEditor();
    textareaField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/TextAreaField.jss'),
      mode: 'ace/mode/javascript'
    };
    textareaField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    textareaField.refreshCode();
    var fileField = _this.args.fileField = new _FormEditor.FormEditor();
    fileField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/FileField.jss'),
      mode: 'ace/mode/javascript'
    };
    fileField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    fileField.refreshCode();
    var submitField = _this.args.submitField = new _FormEditor.FormEditor();
    submitField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/SubmitField.jss'),
      mode: 'ace/mode/javascript'
    };
    submitField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    submitField.refreshCode();
    var buttonField = _this.args.buttonField = new _FormEditor.FormEditor();
    buttonField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/ButtonField.jss'),
      mode: 'ace/mode/javascript'
    };
    buttonField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    buttonField.refreshCode();
    var checkboxField = _this.args.checkboxField = new _FormEditor.FormEditor();
    checkboxField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Checkbox.jss'),
      mode: 'ace/mode/javascript'
    };
    checkboxField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    checkboxField.refreshCode();
    var selectField = _this.args.selectField = new _FormEditor.FormEditor();
    selectField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/SelectField.jss'),
      mode: 'ace/mode/javascript'
    };
    selectField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    selectField.refreshCode();
    var radioField = _this.args.radioField = new _FormEditor.FormEditor();
    radioField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/RadioField.jss'),
      mode: 'ace/mode/javascript'
    };
    radioField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Form.html'),
      mode: 'ace/mode/html'
    };
    radioField.refreshCode();
    var hiddenField = _this.args.hiddenField = new _FormEditor.FormEditor();
    hiddenField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/HiddenField.jss'),
      mode: 'ace/mode/javascript'
    };
    hiddenField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/HiddenField.html'),
      mode: 'ace/mode/html'
    };
    hiddenField.refreshCode();
    var htmlField = _this.args.htmlField = new _FormEditor.FormEditor();
    htmlField.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/HtmlField.jss'),
      mode: 'ace/mode/javascript'
    };
    htmlField.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/HtmlForm.html'),
      mode: 'ace/mode/html'
    };
    htmlField.refreshCode();
    var html5Fields = _this.args.html5Fields = new _FormEditor.FormEditor();
    html5Fields.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Html5.jss'),
      mode: 'ace/mode/javascript'
    };
    html5Fields.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Html5Form.html'),
      mode: 'ace/mode/html'
    };
    html5Fields.refreshCode();
    return _this;
  }

  _createClass(View, [{
    key: "postRender",
    value: function postRender() {}
  }, {
    key: "toJson",
    value: function toJson(input) {
      return JSON.stringify(input, null, 2);
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("FormsDemo/template.html", function(exports, require, module) {
module.exports = "<h2>forms</h2>\n\n<p>Forms can be generated by passing an object describing the desired fields & properties. Keys prefixed with \"_\" will affect the form itself rather than generating fields. Other keys will map to fields.</p>\n\n<ul>\n\t<li><b>_method</b> - The \"method\" attribute of the form element.</li>\n\t<li><b>_action</b> - The \"action\" attribute of the form element.</li>\n</ul>\n\n<p>Fields are object with 0 or more of the following keys</p>\n\n<ul>\n\t<li><b>name</b> - Field name attribute (key will be used if not provided.)</li>\n\t<li><b>title</b> - Field title (key will be used if not provided.)</li>\n\t<li><b>type</b> - Field Type</li>\n\t<li><b>attrs</b> - Additional attributes for field tag (k/v object)</li>\n</ul>\n\n<p><i>Note: form submisions are disabled in the editor</i></p>\n\n[[basic]]\n\n<h3>Field Groupings</h3>\n\n<p>Fields may be grouped with the <b>fieldset</b> field type.</p>\n\n<p>Fieldset definitions may have the following keys in additions to the standard keys:</p>\n\n<ul>\n\t<li><b>children</b> - Array or object listing child field.</li>\n\t<li><b>array</b> - Boolean determining if field names should cascade.</li>\n</ul>\n\n<p>Array field names will appear normal in output JSON but will have their name attributs in the form fieldset[fieldname]. Nested fieldsets can cascade this property to produce names like fieldset[subset][fieldname].</p>\n\n[[group]]\n\n<h3>Traditional Field Types</h3>\n\n<h4>Text Field</h4>\n\n[[textField]]\n\n<h4>Textarea</h4>\n\n[[textareaField]]\n\n<h4>File Field</h4>\n\n[[fileField]]\n\n\n<h4>Submit</h4>\n\n[[submitField]]\n\n<h4>Button</h4>\n\n[[buttonField]]\n\n<h4>Checkbox Field</h4>\n\n[[checkboxField]]\n\n<h4>Select Field</h4>\n\n[[selectField]]\n\n<h4>Radio Button Field</h4>\n\n[[radioField]]\n\n<h4>Hidden Field</h4>\n\nHidden fields have no user-visible representation. Not even the title will render, but the field will be present.\n\n[[hiddenField]]\n\n<h4>HTML Field</h4>\n\n[[htmlField]]\n\n<h3>HTML5 Input Types</h3>\n\nIf the input type is not recognized, it will be passed through and treated like any other input. It is up to the browser at that point to do any specialized rendering and/or validation.\n\n[[html5Fields]]\n\n<h3>Custom Fields</h3>\n\n<p>@TODO: Document the custom fields API.</p>\n"
});

;require.register("Home/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Database = require("curvature/model/Database");

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Home/template.html", function(exports, require, module) {
module.exports = "<h2>curvature</h2>\n\n<p>curvature is a lightweight javascript framework with an emphasis on straightforwardness.</p>\n\n<h4>npm</h4>\n\n<p>the recommended way to get curvature is via <a cv-link = \"https://github.com/seanmorris/curvature-2\">npm</a>:</p>\n\n<pre>$ npm i curvature</pre>\n\n<br />\n\n<h4>cdn</h4>\n\n<p>curvature is also available from unpkg:</p>\n\n<p><a cv-link = \"https://unpkg.com/curvature@0.0.66/dist/curvature.min.js\">minified:</a></p>\n<pre>&lt;script src = \"https://unpkg.com/curvature@0.0.66/dist/curvature.min.js\"&gt;&lt;/script&gt;</pre>\n\n<p><a cv-link = \"https://unpkg.com/curvature@0.0.66/dist/curvature.js\">uncompressed:</a></p>\n<pre>&lt;script src = \"https://unpkg.com/curvature@0.0.66/dist/curvature.js\"&gt;&lt;/script&gt;</pre>\n\n<br />\n\n<h4>source</h4>\n\n<p>the curvature source code is available on github:</p>\n\n<pre>$ git clone https://github.com/seanmorris/curvature-2</pre>\n\n<a cv-link = \"https://github.com/seanmorris/curvature-2\">curvature source</a>\n\n<br />\n\n<h4>demo source</h4>\n\n<p>the demo source code is also on github:</p>\n\n<pre>$ git clone https://github.com/seanmorris/cv2-demo</pre>\n\n<a cv-link = \"https://github.com/seanmorris/cv2-demo\">demo source</a>\n\n<br />\n"
});

;require.register("Layout/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Layout/template.html", function(exports, require, module) {
module.exports = "<div class = \"header\">\n\t<div class = \"title\">\n\t\t<h1><a cv-link = \"/\">curvature</a></h1>\n\t</div>\n\t<div class = \"menu\">\n\t\t<ul>\n\t\t\t<li><a href = \"/about-sean\">sean morris</a></li>\n\t\t\t<li><a href = \"/github\">source</a></li>\n\t\t\t<li><a href = \"/npm\">npm</a></li>\n\t\t\t<li><a href = \"/github\">license</a></li>\n\t\t</ul>\n\t</div>\n</div>\n<div class = \"layout\">\n\t<div class = \"navigation\">\n\t\t<ul>\n\t\t\t<li>navigation\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/\">home</a></li>\n\t\t\t\t\t<li><a cv-link = \"/about-sean\">about the dev</a></li>\n\t\t\t\t\t<li><a cv-link = \"/license\">license</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>base system\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/views\">views</a></li>\n\t\t\t\t\t<li><a cv-link = \"/config\">config</a></li>\n\t\t\t\t\t<li><a cv-link = \"/routes\">routes</a></li>\n\t\t\t\t\t<li><a cv-link = \"/mixins\">mixins</a></li>\n\t\t\t\t\t<li><a cv-link = \"/rules\">rules</a></li>\n\t\t\t\t\t<li><a cv-link = \"/cookies\">cookies</a></li>\n\t\t\t\t\t<li><a cv-link = \"/themes\">themes</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>forms\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/forms\">forms</a></li>\n\t\t\t\t\t<li><a cv-link = \"/forms\">fields</a></li>\n\t\t\t\t\t<li><a cv-link = \"/forms\">extending</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>input\n\t\t\t\t<ul>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/keyboard\">keyboard</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/mouse\">mouse</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/gamepad\">gamepad</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>data\n\t\t\t\t<ul>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/models\">models</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/database\">database</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/record-set\">record source</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>extras\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/cv-markdown\">cv2-markdown</a></li>\n\t\t\t\t\t<li><a cv-link = \"/cv-markdown\">cv2-documentor</a></li>\n\t\t\t\t\t<!-- <li><a cv-link = \"/cv-markdown\">cv3-inject</a></li> -->\n\t\t\t\t\t<!-- <li><a cv-link = \"/cv-markdown\">cv-stringtools</a></li> -->\n\t\t\t\t</ul>\n\t\t\t</li>\n\n<!-- \t\t\t<li>binding:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/scalars\">Scalars</a></li>\n\t\t\t\t\t<li><a cv-link = \"/arrays\">Arrays</a></li>\n\t\t\t\t\t<li><a cv-link = \"/objects\">Objects</a></li>\n\t\t\t\t\t<li><a cv-link = \"/chains\">Chain Binding</a></li>\n\t\t\t\t</ul>\n\t\t\t</li> -->\n\n\t\t\t<li>experiments:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/infinite-scroll\">scrollers</a></li>\n\t\t\t\t\t<li><a cv-link = \"/html-editor\">html editor</a></li>\n\t\t\t\t\t<li><a cv-link = \"/grid-resizer\">grid resizer</a></li>\n\t\t\t\t\t<li><a cv-link = \"/php\">php (really)</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>projects:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/nynex95\">nynex 95</a></li>\n\t\t\t\t\t<li><a cv-link = \"/eventi\">eventi</a></li>\n\t\t\t\t\t<li><a cv-link = \"/subspace\">tigl-2d</a></li>\n\t\t\t\t\t<li><a cv-link = \"/subspace\">subspace</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t</ul>\n\t</div>\n\n\t<div class = \"col full\">\n\n\t\t<div class = \"row full\">\n\t\t\t<div class = \"content\">[[content]]</div>\n\t\t\t<!-- <div class = \"right-bar\"></div> -->\n\t\t</div>\n\n\t\t<div class = \"footer\">\n\t\t\t<span>&copy 2019 - 2020 Sean Morris.</span>\n\t\t</div>\n\n\t</div>\n\n</div>\n"
});

;require.register("ModelsDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Model = require("curvature/model/Model");

var _Database2 = require("curvature/model/Database");

var _View = require("curvature/base/View");

var _codemirror = _interopRequireDefault(require("codemirror"));

require("codemirror/mode/javascript/javascript");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ExampleDatabase = /*#__PURE__*/function (_Database) {
  _inherits(ExampleDatabase, _Database);

  var _super = _createSuper(ExampleDatabase);

  function ExampleDatabase() {
    _classCallCheck(this, ExampleDatabase);

    return _super.apply(this, arguments);
  }

  _createClass(ExampleDatabase, null, [{
    key: "_version_1",
    value: function _version_1(database) {
      var eventLog = database.createObjectStore('models-store', {
        keyPath: 'id'
      });
      eventLog.createIndex('id', 'id', {
        unique: false
      });
      eventLog.createIndex('class', 'class', {
        unique: false
      });
    }
  }]);

  return ExampleDatabase;
}(_Database2.Database);

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super2 = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super2.call(this);
    _this.template = require('./template');
    _this.args.newClass = 'Fake';
    _this.args.newId = 1;
    _this.args.models = [];
    _this.modelCount = 0;
    ExampleDatabase.open('models-db', 1).then(function (db) {
      var store = 'models-store';
      var index = 'id';
      var query = {
        store: store,
        index: index,
        type: _Model.Model
      };
      Promise.all(Array(10).fill().map(function (x, y) {
        var id = 1 + y;
        var qq = Object.assign({}, query, {
          range: id
        });
        var select = db.select(qq);
        return select.one().then(function (_ref) {
          var record = _ref.record,
              index = _ref.index;

          if (!record) {
            return db.insert(store, _Model.Model.from({
              id: id,
              "class": 'Mock',
              created: Date.now()
            }));
          }
        });
      })).then(function () {
        return db.select(query).each(function (record, index) {
          if (record.id > 6) {
            record.consume({
              updated: Date.now()
            });
            return db.update(record);
          } else {
            return db["delete"](record);
          }
        });
      }).then(function () {// db.select(query).each((record, index) => console.log(record, index));
      });
    });
    return _this;
  }

  _createClass(View, [{
    key: "postRender",
    value: function postRender() {
      this.edit = _codemirror["default"].fromTextArea(this.tags.txt.element, {
        theme: "elegant"
      });
      console.log(_codemirror["default"].modes);
      console.log(this.edit);
      this.listen(this, 'focusin', function (event) {
        return event.srcElement.select && event.srcElement.select();
      });
    }
  }, {
    key: "removeKey",
    value: function removeKey(key, index) {
      if (['id', 'class'].includes(key)) {
        return;
      }

      delete this.args.models[index][key];
    }
  }, {
    key: "addKey",
    value: function addKey(event, key, index) {
      event.preventDefault();
      this.args.models[index][key] = this.args.models[index][key] || '';
    }
  }, {
    key: "closeModel",
    value: function closeModel(event, index) {
      this.args.models.splice(index, 1);
    }
  }, {
    key: "loadModel",
    value: function loadModel() {
      this.args.models.push(_Model.Model.from({
        id: String(this.args.newId).trim(),
        "class": this.args.newClass
      }));
    }
  }, {
    key: "fieldAttached",
    value: function fieldAttached(event) {
      if (!event.target.matches('[data-property=id],[data-property=class]')) {
        return;
      }

      event.target.setAttribute('disabled', 'disabled');
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ModelsDemo/template.html", function(exports, require, module) {
module.exports = "<div class=\"models-demo\">\n\n\t<h2>models</h2>\n\n\t<p>Models are simple objects, with some light tooling to make them simple to populate. They will also use the <b>class</b> and <b>id</b> properties to ensure that each model only gets a single reference. If you load the same model multiple times, the input fields should remain synced.</p>\n\n\t<textarea cv-ref = \"txt\">\nfunction findSequence(goal) {\n  function find(start, history) {\n    if (start == goal)\n      return history;\n    else if (start > goal)\n      return null;\n    else\n      return find(start + 5, \"(\" + history + \" + 5)\") ||\n             find(start * 3, \"(\" + history + \" * 3)\");\n  }\n  return find(1, \"1\");\n}</textarea>\n\n\t<div class = \"row wrap\">\n\n\t\t<div class = \"model-editor model-loader\">\n\n\t\t\t<div class = \"model-editor-title\">\n\t\t\t\t<span class = \"title\">Model Loader</span>\n\t\t\t\t<span class = \"buttons\">✕</span>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class = \"model-editor-eyebrow\">Load an instance of a record with the given ID and type. If no record is found, one will be created.</div>\n\n<pre>model = Model.from({\n<div class = \"property-edit\"><span>  id: </span><input cv-bind = \"newId\" />,</div>\n<div class = \"property-edit\"><span>  class: </span><input cv-bind = \"newClass\" />,</div>});</pre>\t\t\t\n\t\t\t<div class = \"buttons\">\n\t\t\t\t<button cv-on = \"click:loadModel\">load</button>\n\t\t\t</div>\n\t\t\n\t\t</div>\n\t\t<div cv-each = \"models:model:m\" cv-ref = \"models\" class = \"contents\">\n\t\t\t<div class = \"model-editor\">\n\t\t\t\t\n\t\t\t\t<div class = \"model-editor-title\">\n\t\t\t\t\t<span class = \"title\">Model Editor</span>\n\t\t\t\t\t<span class = \"buttons\">\n\t\t\t\t\t\t<span tabindex=\"-1\" cv-on = \"click:closeModel(event, m)\">✕</span>\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\n\t\t\t\t<div class = \"model-editor-eyebrow\">When you modify the properties below, the in-memory values will be updated as you type.</div>\n\n<pre><span class = \"firstline row\">model = { <img src = \"/save.svg\" data-icon tabindex=\"-1\"></span>\n<div cv-each = \"model:value:property\"><div class = \"property-edit\"><span class = \"prop-remove remove-[[property]]\" cv-on = \"click:removeKey(property, m);\">  ✕ </span> [[property]]: <input data-property = \"[[property]]\" cv-bind = \"value\" cv-on = \"cvDomAttached:fieldAttached(event)\" />,\n</div></div>};</pre>\n\n\t\t\t\t<div class = \"model-editor-eyebrow\">Add a new key:</div>\n\n\t\t\t\t<div class = \"new-property\">\n\t\t\t\t\t<form class = \"contents\" cv-on = \"submit:addKey(event, newField, m)\">\n\t\t\t\t\t\t<input cv-bind = \"newField\" placeholder=\"new property\">\n\t\t\t\t\t\t<button cv-on = \"click:addKey(event, newField, m)\" class = \"tight\">+</button>\n\t\t\t\t\t</form>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n\n\t<h3>databases & stores</h3>\n\n\t<div class = \"databases\">\n\n\t\t<div class = \"database-editor\">\n\t\t\t<div class = \"model-editor-title\">\n\t\t\t\tDatabases Explorer\n\t\t\t</div>\n\t\t\t<div class = \"model-editor-eyebrow\">\n\t\t\t\tsomething\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n\n\t<h3>record sets</h3>\n\n</div>\n"
});

;require.register("ObjectDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    _this.z = 0;
    _this.args.obj = {
      a: 1,
      b: 2,
      c: 3
    };
    return _this;
  }

  _createClass(View, [{
    key: "setKey",
    value: function setKey(key, value) {
      this.args.obj[key] = value;
    }
  }, {
    key: "delKey",
    value: function delKey(key) {
      delete this.args.obj[key];
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ObjectDemo/template.html", function(exports, require, module) {
module.exports = "<h2>Object Binding Demo</h2>\n\n<div class = \"row\">\n\t<fieldset>\n\t\t<label>set</label>\n\t\t<input cv-bind = \"setKey\" />\n\t\t<input cv-bind = \"seyValue\" />\n\t\t<button cv-on = \"click:setKey(setKey,seyValue)\">set</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<label>delete</label>\n\t\t<input cv-bind  = \"delKey\" />\n\t\t<button cv-on = \"click:delKey(delKey)\">set</button>\n\t</fieldset>\n</div>\n\n<div cv-each = \"obj:item:i\">\n\t<p>[[i]] [[item]]</p>\n</div>\n"
});

;require.register("PHP.js", function(exports, require, module) {
// const PhpWebBin = require('php-wasm/php-web');
// // const PhpCliBin = require('php-wasm/php-shell');
// export class PHP extends EventTarget
// {
// 	constructor()
// 	{
// 		super();
// 		const FLAGS = {};
// 		this.returnValue = -1;
// 		this.onerror  = function () { console.log('READY!!!') };
// 		this.onoutput = function () {};
// 		this.onready  = function () {};
// 		this.binary = PhpWebBin({
// 			postRun:  () => {
// 				const event = new CustomEvent('ready');
// 				this.dispatchEvent(event);
// 				this.onready(event)
// 			},
// 			print: (...chunks) =>{
// 				const event = new CustomEvent('output', {detail: chunks});
// 				this.dispatchEvent(event);
// 				this.onoutput(event);
// 			},
// 			printErr: (...chunks) => {
// 				const event = new CustomEvent('error', {detail: chunks});
// 				// this.onerror(event);
// 				this.dispatchEvent(event);
// 			}
// 		});
// 	}
// 	run(phpCode)
// 	{
// 		return new Promise(accept => this.binary.then(php => {
// 			const retVal = php.ccall(
// 				'pib_eval'
// 				, 'number'
// 				, ["string"]
// 				, [`?>${phpCode}`]
// 			);
// 			php.ccall(
// 				'pib_eval'
// 				, 'number'
// 				, ["string"]
// 				, [`echo "\n"`]
// 			);
// 			console.log(phpCode, retVal);
// 			accept(retVal);
// 		}));
// 	}
// }
"use strict";
});

;require.register("Routes.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = void 0;

var _View = require("curvature/base/View");

var _View2 = require("Home/View");

var _View3 = require("ViewDemo/View");

var _View4 = require("FormsDemo/View");

var _View5 = require("ThemeDemo/View");

var _View6 = require("ConfigDemo/View");

var _View7 = require("CookieDemo/View");

var _View8 = require("RulesDemo/View");

var _View9 = require("ScalarDemo/View");

var _View10 = require("ChainDemo/View");

var _View11 = require("ArrayDemo/View");

var _View12 = require("ObjectDemo/View");

var _View13 = require("ModelsDemo/View");

var _View14 = require("Experiments/InfiniteScroll/View");

var _View15 = require("Experiments/HtmlEditor/View");

var _View16 = require("Experiments/GridResizer/View");

var _View17 = require("Experiments/Php/View");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Routes = _defineProperty({
  '': function _() {
    return new _View2.View();
  },
  'about-sean': function aboutSean() {
    return _View.View.from(require('pages/about.html'));
  },
  'github': function github() {
    return _View.View.from(require('pages/github.html'));
  },
  views: function views() {
    return new _View3.View();
  },
  forms: function forms() {
    return new _View4.View();
  },
  config: function config() {
    return new _View6.View();
  },
  cookies: function cookies() {
    return new _View7.View();
  },
  rules: function rules() {
    return new _View8.View();
  },
  themes: function themes() {
    return new _View5.View();
  },
  scalars: function scalars() {
    return new _View9.View();
  },
  chains: function chains() {
    return new _View10.View();
  },
  arrays: function arrays() {
    return new _View11.View();
  },
  objects: function objects() {
    return new _View12.View();
  },
  models: function models() {
    return new _View13.View();
  },
  'php': function php() {
    return new _View17.View();
  },
  'infinite-scroll': function infiniteScroll() {
    return new _View14.View();
  },
  'html-editor': function htmlEditor() {
    return new _View15.View();
  },
  'grid-resizer': function gridResizer() {
    return new _View16.View();
  }
}, false, function _false() {
  return _View.View.from(require('pages/404.html'));
});

exports.Routes = Routes;
});

require.register("RulesDemo/Samples/BasicRule.html", function(exports, require, module) {
module.exports = "<style>\ntextarea,input,progress { display: block; width: 100%; padding: 0.5em; margin-top: 0.5em;  margin-bottom: 0.25em; box-sizing: border-box;}\np { font-size: 0.5em; text-align: right; margin: 0.25em; }\n</style>\n\n<textarea maxlength = \"140\">Typing here will update the elements below.</textarea>\n\n<input maxlength = \"35\" value = \"It works for inputs as well.\" />\n"
});

;require.register("RulesDemo/Samples/BasicRule.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tthis.ruleSet.add('textarea,input[maxlength]', tag => {\n\n\t\t\tconst element = tag.element;\n\t\t\tconst parent  = element.parentNode;\n\n\t\t\tconst max = element.getAttribute('maxlength');\n\t\t\tconst bar = document.createElement('progress');\n\t\t\tconst ind = document.createElement('p');\n\n\t\t\tconst length = element.value.length;\n\n\t\t\tind.innerText = `${length} / ${max}`;\n\n\t\t\tbar.setAttribute('max', max);\n\t\t\tbar.setAttribute('value', length);\n\n\t\t\telement.addEventListener('input', event => {\n\n\t\t\t\tconst length = event.target.value.length;\n\n\t\t\t\tbar.setAttribute('value', length);\n\n\t\t\t\tind.innerText = `${length} / ${max}`;\n\n\t\t\t});\n\n\t\t\tconst next = element.nextSibling;\n\n\t\t\tparent.insertBefore(bar, next);\n\t\t\tparent.insertBefore(ind, next);\n\t\t});\n\t}\n}\n"
});

;require.register("RulesDemo/Samples/Mapper.html", function(exports, require, module) {
module.exports = "<custom-tag>this maps to a div tag.</custom-tag>\n"
});

;require.register("RulesDemo/Samples/Mapper.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tthis.ruleSet.add('custom-tag', tag => {\n\n\t\t\tconst div = document.createElement('div');\n\t\t\tconst element = tag.element;\n\n\t\t\twhile(element.firstChild)\n\t\t\t{\n\t\t\t\tdiv.append('The tag that contained \"');\n\t\t\t\tdiv.append(element.firstChild);\n\t\t\t\tdiv.append('\" has been replaced with this div tag.');\n\t\t\t}\n\n\t\t\treturn div;\n\n\t\t});\n\t}\n}\n"
});

;require.register("RulesDemo/Samples/Preproc.html", function(exports, require, module) {
module.exports = "<h1>Editable title</h1>\n\n<p>Editable body</p>\n"
});

;require.register("RulesDemo/Samples/Preproc.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst selector = 'h1,p';\n\n\t\tconst nodes = [];\n\t\tconst index = new WeakMap();\n\n\t\tconst nodeIndex = (node) => {\n\n\t\t\tif(index[node] !== undefined)\n\t\t\t{\n\t\t\t\treturn index[node];\n\t\t\t}\n\n\t\t\tindex[node] = nodes.length;\n\t\t\tnodes.push(node);\n\n\t\t\treturn index[node];\n\t\t};\n\n\t\tthis.preRuleSet.add(selector, tag => {\n\n\t\t\tconst element  = tag.element;\n\t\t\tconst view     = tag.parent;\n\t\t\tconst parent   = element.parentNode;\n\t\t\tconst tagIndex = nodeIndex(element);\n\t\t\tconst refName  = `node_${ tagIndex }`;\n\n\t\t\telement.setAttribute('tabindex', -1);\n\n\t\t\tconst input = document.createElement('input');\n\n\t\t\tinput.setAttribute('cv-bind', refName);\n\t\t\telement.setAttribute('cv-bind', refName);\n\n\t\t\tview.args[refName] = element.innerText;\n\n\t\t\telement.addEventListener('focus', () => {\n\t\t\t\tinput.style.display = '';\n\t\t\t\tinput.focus();\n\t\t\t\tinput.select();\n\t\t\t});\n\n\t\t\tinput.addEventListener('blur', () => {\n\t\t\t\tinput.style.display = 'none';\n\t\t\t});\n\n\t\t\tparent.insertBefore(input, element.nextSibling);\n\t\t\tinput.style.display = 'none';\n\t\t});\n\t}\n}\n"
});

;require.register("RulesDemo/Samples/Static.html", function(exports, require, module) {
module.exports = "<p>This <define>text</define> has allows you to get the <define>definition</define> of words by <define>clicking</define> on them.</p>\n\n<p>Simply <define>surround</define> a word with <code>define</code> tags and the <define>functionality</define> will be applied.</p>\n"
});

;require.register("RulesDemo/Samples/Static.jss", function(exports, require, module) {
module.exports = "const RuleSet = require('curvature/base/RuleSet').RuleSet;\nconst View    = require('curvature/base/View').View;\nconst Tip     = Symbol();\n\nRuleSet.add('define', tag => {\n\tconst final = document.createElement('span');\n\tconst word  = tag.element.innerText;\n\n\tfinal.style.display = 'content';\n\tfinal.style.cursor  = 'help';\n\n\tfinal.style.borderBottom = '1px purple solid';\n\n\tfinal.setAttribute('tabindex', '-1');\n\n\tconst url = `https://api.dictionaryapi.dev/api/v1/entries/en/${word}`;\n\n\tfinal.onclick = () => {\n\n\t\tif(final[Tip])\n\t\t{\n\t\t\tfinal[Tip].remove();\n\n\t\t\tdelete final[Tip];\n\t\t}\n\n\t\tconst tip = document.createElement('div');\n\n\t\ttip.innerText = '&nbsp;';\n\n\t\ttip.style.pointerEvents = 'none';\n\n\t\ttip.style.border     = '1px #ccc solid';\n\t\ttip.style.fontSize   = '0.5em';\n\t\ttip.style.padding    = '0.25em';\n\t\ttip.style.minWidth   = '1em';\n\t\ttip.style.maxWidth   = '15em';\n\t\ttip.style.position   = 'absolute';\n\t\ttip.style.background = 'white';\n\t\ttip.style.left       = `${event.pageX}px`;\n\t\ttip.style.top        = `${event.pageY}px`;\n\n\t\tfinal[Tip] = tip;\n\n\t\tconst loader = setInterval(\n\t\t\t() => tip.innerText = '.'.repeat(1 + e++ % 3)\n\t\t\t, 250\n\t\t);\n\n\t\tfinal.append(tip);\n\n\t\tlet e = 0;\n\n\t\tfetch(url).then(r=>r.json()).then(r=>{\n\n\t\t\tclearInterval(loader);\n\n\t\t\tif(!r || !r[0] || !r[0].meaning)\n\t\t\t{\n\t\t\t\ttip.innerText = 'Definition Not found.';\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tconst defs = Object.values(r[0].meaning)[0];\n\n\t\t\tif(!defs || !defs[0] || !defs[0].definition)\n\t\t\t{\n\t\t\t\ttip.innerText = 'Definition Not found.';\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\ttip.innerText = defs[0].definition;\n\t\t});\n\t};\n\n\tfinal.onblur  = () => {\n\n\t\tif(!final[Tip])\n\t\t{\n\t\t\treturn;\n\t\t}\n\n\t\tconst tip = final[Tip];\n\n\t\ttip.remove();\n\n\t\tdelete final[Tip];\n\n\t};\n\n\treturn final;\n});\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\t}\n}\n"
});

;require.register("RulesDemo/Samples/ViewMapper.html", function(exports, require, module) {
module.exports = "<p>Class:</p>\n<div data-class>this maps to a view class.</div>\n\n<p>Object:</p>\n<div data-object>this maps to a view object.</div>\n"
});

;require.register("RulesDemo/Samples/ViewMapper.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tthis.ruleSet.add('[data-class]', Clock);\n\n\t\tconst clock = new Clock();\n\n\t\tthis.ruleSet.add('[data-object]', clock);\n\t}\n}\n\nclass Clock extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = `\n\t\t\t<p><progress max = \"24\"   value = \"[[h]]\"></progress>[[h]]</p>\n\t\t\t<p><progress max = \"60\"   value = \"[[m]]\"></progress>[[m]]</p>\n\t\t\t<p><progress max = \"60\"   value = \"[[s]]\"></progress>[[s]]</p>\n\t\t\t<p><progress max = \"1000\" value = \"[[n]]\"></progress>[[n]]</p>\n\t\t`;\n\n\t\tthis.onFrame(() => {\n\n\t\t\tconst d = new Date();\n\n\t\t\tthis.args.h = d.getHours();\n\t\t\tthis.args.m = d.getMinutes();\n\t\t\tthis.args.s = d.getSeconds();\n\t\t\tthis.args.n = d.getMilliseconds();\n\n\t\t});\n\t}\n}\n"
});

;require.register("RulesDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _View2 = require("../Editor/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    var globalRules = new _View2.View();
    globalRules.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Static.jss'),
      mode: 'ace/mode/javascript'
    };
    globalRules.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Static.html'),
      mode: 'ace/mode/html'
    };
    globalRules.refreshCode();
    _this.args.globalRules = globalRules;
    var basic = new _View2.View();
    basic.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/BasicRule.jss'),
      mode: 'ace/mode/javascript'
    };
    basic.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/BasicRule.html'),
      mode: 'ace/mode/html'
    };
    basic.refreshCode();
    _this.args.basic = basic;
    var preproc = new _View2.View();
    preproc.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Preproc.jss'),
      mode: 'ace/mode/javascript'
    };
    preproc.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Preproc.html'),
      mode: 'ace/mode/html'
    };
    preproc.refreshCode();
    _this.args.preproc = preproc;
    var mapper = new _View2.View();
    mapper.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Mapper.jss'),
      mode: 'ace/mode/javascript'
    };
    mapper.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Mapper.html'),
      mode: 'ace/mode/html'
    };
    mapper.refreshCode();
    _this.args.mapper = mapper;
    var viewMapper = new _View2.View();
    viewMapper.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/ViewMapper.jss'),
      mode: 'ace/mode/javascript'
    };
    viewMapper.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/ViewMapper.html'),
      mode: 'ace/mode/html'
    };
    viewMapper.refreshCode();
    _this.args.viewMapper = viewMapper;
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("RulesDemo/template.html", function(exports, require, module) {
module.exports = "<h2>rules</h2>\n\n<p>The most basic rules simply map CSS selectors to callbacks. Whenever a tag matching a rule is encountered, the callback is applied.</p>\n\n<p>Every View comes with a RuleSet, so you can add Rules by calling <code>this.ruleSet.add</code>.</p>\n\n[[basic]]\n\n<h3>Global Rules</h3>\n\n<p>The <code>RuleSet.add</code> method may be called statically to add global rules.</p>\n\n[[globalRules]]\n\n<h3>Preprocessing</h3>\n\n<p>If <code>this.preRuleSet.add</code> is used rather than <code>this.ruleSet.add</code>, the rules will be appled BEFORE the template is processed, rather than after.</p>\n\n<p>This allows the use of cv-* attributes.</p>\n\n[[preproc]]\n\n<h3>Mapping tags to tags</h3>\n\n<p>If the callback returns an HTMLElement, the original tag will be replaced.</p>\n\n[[mapper]]\n\n<h3>Mapping tags to views</h3>\n\n<p>View classes, or instances of them may both be passed instead of a callback. In this case, the view will be rendered <b>inside</b> the existing tag.</p>\n\n[[viewMapper]]\n\n<!-- <h3>The RuleSet class <i>per se</i></h3> -->\n"
});

;require.register("ScalarDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _View2 = require("../ArrayDemo/View");

var _View3 = require("../ObjectDemo/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    return _this;
  }

  _createClass(View, [{
    key: "clear",
    value: function clear(clearVar) {
      this.args[clearVar] = '';
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ScalarDemo/template.html", function(exports, require, module) {
module.exports = "<h2>Scalar Binding Demo</h2>\n\n<p>\n\ta:\n\t<input cv-bind = \"a\">\n\t<button cv-on = \"click:clear('a')\">x</button> : \"[[a]]\"\n</p>\n\n<p>\n\tb:\n\t<input cv-bind = \"b\">\n\t<button cv-on = \"click:clear('b')\">x</button> : \"[[b]]\"\n</p>\n\n<p>\n\tc:\n\t<input cv-bind = \"c\">\n\t<button cv-on = \"click:clear('c')\">x</button> : \"[[c]]\"\n</p>\n"
});

;require.register("ThemeDemo/Theme.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Theme = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ThemeList = /*#__PURE__*/function () {
  function ThemeList(themes) {
    var _this$themes;

    _classCallCheck(this, ThemeList);

    _defineProperty(this, "themes", []);

    (_this$themes = this.themes).push.apply(_this$themes, _toConsumableArray(themes));
  }

  _createClass(ThemeList, [{
    key: "getTemplate",
    value: function getTemplate(object) {
      for (var i in this.themes) {
        var theme = this.themes[i].getTemplate(object);

        if (theme) {
          return theme;
        }
      }
    }
  }, {
    key: "getView",
    value: function getView(object) {
      for (var i in this.themes) {
        var theme = this.themes[i].getView(object);

        if (theme) {
          return theme;
        }
      }
    }
  }]);

  return ThemeList;
}();

var Theme = /*#__PURE__*/function () {
  _createClass(Theme, null, [{
    key: "get",
    value: function get() {
      for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      if (keys.length <= 1) {
        var key = String(keys[0] || '');

        if (!this.instances[key]) {
          this.instances[key] = new this(key);
        }

        return this.instances[key];
      }

      var themes = [];

      for (var i in keys) {
        themes.push(this.get(keys[i]));
      }

      return new ThemeList(themes);
    }
  }]);

  function Theme(key) {
    _classCallCheck(this, Theme);

    this.key = key;
    this.viewMap = new Map();
    this.templateMap = new Map();
    this.fallbacks = [];
  }

  _createClass(Theme, [{
    key: "setFallback",
    value: function setFallback() {
      var _this$fallbacks;

      (_this$fallbacks = this.fallbacks).push.apply(_this$fallbacks, arguments);

      return this;
    }
  }, {
    key: "setView",
    value: function setView(type, viewType) {
      this.viewMap.set(type, viewType);
      return this;
    }
  }, {
    key: "getView",
    value: function getView(object) {
      var type = this.resolve(object, 'viewMap');

      if (!type) {
        return null;
      }

      var view = new type(object);
      return view;
    }
  }, {
    key: "setTemplate",
    value: function setTemplate(type, template) {
      this.templateMap.set(type, template);
      return this;
    }
  }, {
    key: "getTemplate",
    value: function getTemplate(object) {
      return this.resolve(object, 'templateMap');
    }
  }, {
    key: "resolve",
    value: function resolve(object, whichMap) {
      if (object.___object___ && object.isBound) {
        object = object.___object___;
      }

      var type = object.__proto__.constructor;
      var map = this[whichMap];

      if (map.has(type, object)) {
        return map.get(type);
      }

      var result = null;

      var _iterator = _createForOfIteratorHelper(map),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          if (object instanceof key) {
            result = value;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (!result) {
        var _iterator2 = _createForOfIteratorHelper(this.fallbacks),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var theme = _step2.value;

            if (result = theme.resolve(object, whichMap)) {
              return result;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      if (result) {
        map.set(type, result);
      }

      return result;
    }
  }]);

  return Theme;
}();

exports.Theme = Theme;

_defineProperty(Theme, "instances", {});
});

;require.register("ThemeDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Theme = require("./Theme");

var _View = require("curvature/base/View");

var _XyzTheme = require("./themes/XyzTheme");

var _TypeX = require("./types/TypeX");

var _TypeY = require("./types/TypeY");

var _TypeZ = require("./types/TypeZ");

var _TypeZAlpha = require("./types/TypeZAlpha");

var _ViewZAlpha = require("./views/ViewZAlpha");

var _Config = require("curvature/base/Config");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View(args) {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this, args);
    _this.template = require('./template');
    var theme = _XyzTheme.XyzTheme;
    console.log(theme);

    var alpha = _Theme.Theme.get('alpha');

    alpha.setTemplate(_ViewZAlpha.ViewZAlpha, require('./views/templateZAlpha')).setFallback(_Theme.Theme.get()).setView(_TypeZAlpha.TypeZAlpha, _ViewZAlpha.ViewZAlpha);
    var x = new _TypeX.TypeX(_assertThisInitialized(_this));
    var y = new _TypeY.TypeY(_assertThisInitialized(_this));
    var z = new _TypeZ.TypeZ(_assertThisInitialized(_this));
    var z𝛼 = new _TypeZAlpha.TypeZAlpha(_assertThisInitialized(_this));
    _this.args.views = [x, y, z, z𝛼].map(function (v) {
      var view = alpha.getView(v);
      return view;
    });
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ThemeDemo/template.html", function(exports, require, module) {
module.exports = "<h2>theme</h2>\n\n<div cv-each = \"views:view:v\">[[view]]</div>\n"
});

;require.register("ThemeDemo/themes/XyzTheme.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XyzTheme = void 0;

var _Theme = require("../Theme");

var _View = require("curvature/base/View");

var _TypeX = require("../types/TypeX");

var _TypeY = require("../types/TypeY");

var _TypeZ = require("../types/TypeZ");

var _ViewX = require("../views/ViewX");

var _ViewY = require("../views/ViewY");

var _ViewZ = require("../views/ViewZ");

var _TypeZAlpha = require("../types/TypeZAlpha");

var _ViewZAlpha = require("../views/ViewZAlpha");

_Theme.Theme.get().setTemplate(_ViewX.ViewX, require('../views/templateX')).setTemplate(_ViewY.ViewY, require('../views/templateY')).setTemplate(_ViewZ.ViewZ, require('../views/templateZ')).setView(_TypeX.TypeX, _ViewX.ViewX).setView(_TypeY.TypeY, _ViewY.ViewY).setView(_TypeZ.TypeZ, _ViewZ.ViewZ);

var XyzTheme = _Theme.Theme.get();

exports.XyzTheme = XyzTheme;
});

require.register("ThemeDemo/types/TypeX.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeX = void 0;

var _Bindable = require("curvature/base/Bindable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TypeX = function TypeX(mainView) {
  _classCallCheck(this, TypeX);

  var _this = _Bindable.Bindable.makeBindable(this);

  this.type = 'X';
  this.value = 1 / Math.random();
  this.interval = mainView.onInterval(100, function () {
    _this.value = '0x' + Math.floor(Math.random() * 10000).toString(16).padStart(4, 0);
  });
};

exports.TypeX = TypeX;
});

;require.register("ThemeDemo/types/TypeY.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeY = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TypeY = function TypeY() {
  _classCallCheck(this, TypeY);

  this.type = 'Y';
  this.value = 1 / Math.random();
};

exports.TypeY = TypeY;
});

;require.register("ThemeDemo/types/TypeZ.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeZ = void 0;

var _Bindable = require("curvature/base/Bindable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TypeZ = function TypeZ(mainView) {
  _classCallCheck(this, TypeZ);

  var _this = _Bindable.Bindable.makeBindable(this);

  this.type = 'Z';
  this.value = 0;
  this.interval = mainView.onInterval(250, function () {
    _this.value++;
  });
  return _this;
};

exports.TypeZ = TypeZ;
});

;require.register("ThemeDemo/types/TypeZAlpha.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeZAlpha = void 0;

var _TypeZ2 = require("./TypeZ");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var TypeZAlpha = /*#__PURE__*/function (_TypeZ) {
  _inherits(TypeZAlpha, _TypeZ);

  var _super = _createSuper(TypeZAlpha);

  function TypeZAlpha(mainView) {
    var _this;

    _classCallCheck(this, TypeZAlpha);

    _this = _super.call(this, mainView);
    _this.type = 'Z𝛼';
    clearInterval(_this.interval);
    _this.interval = mainView.onInterval(20, function () {
      _this.value++;
    });
    return _this;
  }

  return TypeZAlpha;
}(_TypeZ2.TypeZ);

exports.TypeZAlpha = TypeZAlpha;
});

;require.register("ThemeDemo/views/ViewX.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewX = void 0;

var _Config = require("curvature/base/Config");

var _View = require("curvature/base/View");

var _Theme = require("../Theme");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ViewX = /*#__PURE__*/function (_BaseView) {
  _inherits(ViewX, _BaseView);

  var _super = _createSuper(ViewX);

  function ViewX(args) {
    var _this;

    _classCallCheck(this, ViewX);

    _this = _super.call(this, args);
    var themeName = _Config.Config.get('theme') || '';

    var themeList = _Theme.Theme.get(themeName // App config theme
    , '' // App default theme
    , 'app/cv2playground' // App specific theme
    , 'lib/curvature' // Library-specific theme
    , 'base' // Base theme
    );

    _this.template = themeList.getTemplate(_assertThisInitialized(_this));
    return _this;
  }

  return ViewX;
}(_View.View);

exports.ViewX = ViewX;
});

;require.register("ThemeDemo/views/ViewY.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewY = void 0;

var _Theme = require("../Theme");

var _Config = require("curvature/base/Config");

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ViewY = /*#__PURE__*/function (_BaseView) {
  _inherits(ViewY, _BaseView);

  var _super = _createSuper(ViewY);

  function ViewY(args) {
    var _this;

    _classCallCheck(this, ViewY);

    _this = _super.call(this, args);
    var themeName = _Config.Config.get('theme') || '';

    var theme = _Theme.Theme.get(theme);

    _this.template = theme.getTemplate(_assertThisInitialized(_this));
    return _this;
  }

  return ViewY;
}(_View.View);

exports.ViewY = ViewY;
});

;require.register("ThemeDemo/views/ViewZ.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewZ = void 0;

var _Theme = require("../Theme");

var _Config = require("curvature/base/Config");

var _View = require("curvature/base/View");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ViewZ = /*#__PURE__*/function (_BaseView) {
  _inherits(ViewZ, _BaseView);

  var _super = _createSuper(ViewZ);

  function ViewZ(args) {
    var _this;

    _classCallCheck(this, ViewZ);

    _this = _super.call(this, args);
    var themeName = _Config.Config.get('theme') || '';

    var theme = _Theme.Theme.get(theme);

    _this.args.vName = 'Z';
    _this.template = theme.getTemplate(_assertThisInitialized(_this));
    return _this;
  }

  return ViewZ;
}(_View.View);

exports.ViewZ = ViewZ;
});

;require.register("ThemeDemo/views/ViewZAlpha.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewZAlpha = void 0;

var _ViewZ2 = require("./ViewZ");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ViewZAlpha = /*#__PURE__*/function (_ViewZ) {
  _inherits(ViewZAlpha, _ViewZ);

  var _super = _createSuper(ViewZAlpha);

  function ViewZAlpha(args) {
    var _this;

    _classCallCheck(this, ViewZAlpha);

    _this = _super.call(this, args);
    _this.args.vName = 'Z𝛼';
    return _this;
  }

  return ViewZAlpha;
}(_ViewZ2.ViewZ);

exports.ViewZAlpha = ViewZAlpha;
});

;require.register("ThemeDemo/views/templateX.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">View X; Template X; Type [[type]]: [[value]]</div>\n"
});

;require.register("ThemeDemo/views/templateY.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">View Y; Template Y; Type [[type]]: [[value]]</div>\n"
});

;require.register("ThemeDemo/views/templateZ.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">View [[vName]]; Template Z; Type: [[type]]  [[value]]</div>\n"
});

;require.register("ThemeDemo/views/templateZAlpha.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">View [[vName]]; Template Z𝛼; Type: [[type]] [[value]]</div>\n"
});

;require.register("ViewDemo/Samples/Array.html", function(exports, require, module) {
module.exports = "<p>List:</p>\n\n<ul cv-each = \"list:item:i\">\n\t<li>[[item]]</li>\n</ul>\n"
});

;require.register("ViewDemo/Samples/Array.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tthis.args.list = ['Milk','Eggs','Bread'];\n\t}\n\n\ttoJson(input)\n\t{\n\t\treturn JSON.stringify(input);\n\t}\n}\n"
});

;require.register("ViewDemo/Samples/ArrayJson.html", function(exports, require, module) {
module.exports = "<p>Json:</p>\n<pre>[[list|toJson]]</pre>\n"
});

;require.register("ViewDemo/Samples/Escape.html", function(exports, require, module) {
module.exports = "<p>[[time|addItalicTags]]</p>\n<p>[[$time|addItalicTags]]</p>\n"
});

;require.register("ViewDemo/Samples/HelloWorld.php", function(exports, require, module) {
module.exports = "<?php\n\necho \"???\\n\";\n"
});

;require.register("ViewDemo/Samples/Reuse.html", function(exports, require, module) {
module.exports = "<template cv-template = \"item\">\n\t<li><label><input type = \"checkbox\">[[item]]</label></li>\n</template>\n\n<ol cv-each = \"list:item:i\" cv-slot = \"item\"></ol>\n<ul cv-each = \"list:item:i\" cv-slot = \"item\"></ul>\n"
});

;require.register("ViewDemo/Samples/Reverse.html", function(exports, require, module) {
module.exports = "<p>[[time|reverseString]]</p>\n"
});

;require.register("ViewDemo/Samples/Scalar.html", function(exports, require, module) {
module.exports = "<p>[[time]]</p>\n"
});

;require.register("ViewDemo/Samples/Scalar.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tthis.args.time = (new Date()).toISOString();\n\n\t\tthis.onFrame(() => {\n\n\t\t\tthis.args.time = (new Date()).toISOString();\n\n\t\t});\n\t}\n\n\taddItalicTags(input)\n\t{\n\t\treturn `<i>${input}</i>`;\n\t}\n\n\treverseString(input = '')\n\t{\n\t\treturn input.split('').reverse().join('');\n\t}\n}\n"
});

;require.register("ViewDemo/Samples/TwoWay.html", function(exports, require, module) {
module.exports = "<input cv-bind = \"val\" placeholder = \"type here...\">\n\n<button cv-on = \"click:random('val')\">random</button>\n\n<button cv-on = \"click:clear('val')\">clear</button>\n\n<p>[[val]]</p>\n"
});

;require.register("ViewDemo/Samples/TwoWay.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\t\tthis.template = require('template');\n\t\tthis.args.val = '';\n\t}\n\n\trandom()\n\t{\n\t\tthis.args.val = (0xFFFFFF * Math.random()).toString(36);\n\t}\n\n\tclear()\n\t{\n\t\tthis.args.val = '';\n\t}\n}\n"
});

;require.register("ViewDemo/Samples/document.html", function(exports, require, module) {
module.exports = "<!DOCTYPE HTML>\n<head>\n\t<style>\n\t\tbody { font-family: courier-new, monospace; line-height: 1.5em; }\n\t</style>\n\t<script src = \"[ORIGIN]/vendor.js\"></script>\n\t<script>require.register('Config', function(exports, require, module) { return module.exports = {}});</script>\n\t<script>require.register('template.html', function(exports, require, module) { return module.exports = `[TEMPLATE]`});</script>\n\t<script src = \"[ORIGIN]/curvature.js\"></script>\n\t<script>document.addEventListener('DOMContentLoaded', () => {\n\t\tconst View = require('curvature/base/View').View;\n\n\t\t[SCRIPT]\n\n\t\tif(typeof DemoView !== 'undefined')\n\t\t{\n\t\t\tconst view = new DemoView;\n\n\t\t\tview.render(document.body);\n\t\t}\n\n\t});</script>\n</head>\n<body>\n</body>\n"
});

;require.register("ViewDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _View2 = require("../ArrayDemo/View");

var _View3 = require("../ObjectDemo/View");

var _View4 = require("../Editor/View");

var ace = _interopRequireWildcard(require("brace"));

require("brace/mode/html");

require("brace/mode/php");

require("brace/mode/javascript");

require("brace/theme/monokai");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Module = {
  onRuntimeInitialized: function onRuntimeInitialized() {
    console.log('WASM Loaded');
  }
};

var View = /*#__PURE__*/function (_BaseView) {
  _inherits(View, _BaseView);

  var _super = _createSuper(View);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this);
    _this.template = require('./template');
    window.addEventListener('message', onMessage);

    _this.onRemove(function () {
      window.removeEventListener('message', onMessage);
    });

    var editor = _this.args.editor = new _View4.View();
    editor.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Scalar.jss'),
      mode: 'ace/mode/javascript'
    };
    editor.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Scalar.html'),
      mode: 'ace/mode/html'
    };
    editor.refreshCode();
    var editorTwoWay = _this.args.editorTwoWay = new _View4.View();
    editorTwoWay.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/TwoWay.jss'),
      mode: 'ace/mode/javascript'
    };
    editorTwoWay.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/TwoWay.html'),
      mode: 'ace/mode/html'
    };
    editorTwoWay.refreshCode();

    var onMessage = function onMessage(event) {
      console.log(event);
    };

    var editorReverse = _this.args.editorReverse = new _View4.View();
    editorReverse.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Scalar.jss'),
      mode: 'ace/mode/javascript'
    };
    editorReverse.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Reverse.html'),
      mode: 'ace/mode/html'
    };
    editorReverse.refreshCode();
    var editorEscape = _this.args.editorEscape = new _View4.View();
    editorEscape.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Scalar.jss'),
      mode: 'ace/mode/javascript'
    };
    editorEscape.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Escape.html'),
      mode: 'ace/mode/html'
    };
    editorEscape.refreshCode();
    var editorArray = _this.args.editorArray = new _View4.View();
    editorArray.args.orientation = 'vertical';
    editorArray.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Array.jss'),
      mode: 'ace/mode/javascript'
    };
    editorArray.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Array.html'),
      mode: 'ace/mode/html'
    };
    editorArray.refreshCode();
    var editorJson = _this.args.editorJson = new _View4.View();
    editorJson.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Array.jss'),
      mode: 'ace/mode/javascript'
    };
    editorJson.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/ArrayJson.html'),
      mode: 'ace/mode/html'
    };
    editorJson.refreshCode();
    var editorReuse = _this.args.editorReuse = new _View4.View();
    editorReuse.args.tabs.js = {
      title: 'js',
      file: 'DemoView.js',
      body: require('./Samples/Array.jss'),
      mode: 'ace/mode/javascript'
    };
    editorReuse.args.tabs.html = {
      title: 'html',
      file: 'template.html',
      body: require('./Samples/Reuse.html'),
      mode: 'ace/mode/html'
    };
    editorReuse.refreshCode();
    return _this;
  }

  _createClass(View, [{
    key: "addItalicTags",
    value: function addItalicTags(input) {
      return "<i>".concat(input, "</i>");
    }
  }, {
    key: "reverseString",
    value: function reverseString() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return input.split('').reverse().join('');
    }
  }, {
    key: "clear",
    value: function clear(clearVar) {
      this.args[clearVar] = '';
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ViewDemo/template.html", function(exports, require, module) {
module.exports = "<h2>views</h2>\n<!--\n<h3>PHP</h3>\n\n[[editorPhp]]\n -->\n<h3>Scalar Binding</h3>\n\n<p>Scalars can be bound with double square brackets:</p>\n\n[[editor]]\n\n<h3>Two way binding, Events & Methods</h3>\n\n<p>Two way binding is also supported.</p>\n\n<p>Methods can be bound to events with cv-on.</p>\n\n[[editorTwoWay]]\n\n<h3>Transformations</h3>\n\n<p>Values can also be transformed with methods:</p>\n\n[[editorReverse]]\n\n<h3>Escaping</h3>\n\n<p>HTML is automatically escaped unless \"$\" is used:</p>\n\n[[editorEscape]]\n\n<h3>Arrays & Objects</h3>\n\n<p>Arrays and objects may be looped over with the cv-each attribute:</p>\n\n[[editorArray]]\n\n<h3>Methods</h3>\n\n<p>Values of any type may be transformed by methods:</p>\n\n[[editorJson]]\n\n<h3>Templates</h3>\n\n<p>Reusable templates can be created with the cv-template attribute.</p>\n\n<p>Templates may be reused within the same view with the cv-slot attribute.</p>\n\n[[editorReuse]]\n\n<h2>Lifecycle</h2>\n\n<h4>Construct</h3>\n<h4>On Render</h3>\n<h4>On Attachment</h3>\n<h4>On Detachment</h3>\n<h4>On Final Removal</h3>\n"
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";

var _Router = require("curvature/base/Router");

var _RuleSet = require("curvature/base/RuleSet");

var _View = require("./Layout/View");

document.addEventListener('DOMContentLoaded', function () {
  var view = new _View.View();

  _RuleSet.RuleSet.add('body', view);

  _RuleSet.RuleSet.apply();

  _Router.Router.listen(view);
});
});

require.register("pages/404.html", function(exports, require, module) {
module.exports = "<h2>page not found</h2>\n<p>the page you requested could not be found</p>\n<p>you can <a cv-link = \"/back\">go back</a> or <a cv-link = \"/\">view the homepage</a>.\n"
});

;require.register("pages/about.html", function(exports, require, module) {
module.exports = "<img src = \"player-head-180.png\">\n"
});

;require.register("pages/github.html", function(exports, require, module) {
module.exports = "<h2>github</h2>\n\n\n<p>the curvature source code is available on github:</p>\n\n<pre>$ git clone https://github.com/seanmorris/curvature-2</pre>\n\n<a cv-link = \"https://github.com/seanmorris/curvature-2\">\n\thttps://github.com/seanmorris/curvature-2\n</a>\n\n<h3>alternatives</h3>\n\n<p>curvature is also available from alternative hosts:</p>\n\n<h4>gitlab</h4>\n\n<p>the curvature source code can also be found on gitlab:</p>\n\n<pre>$ git clone https://github.com/seanmorris/curvature-2</pre>\n\n<a cv-link = \"https://gitlab.com/seanmorris/curvature-2\">\n\thttps://gitlab.com/seanmorris/curvature-2\n</a>\n\n<h4>bitbucket</h4>\n\n<p>for extra certainty, bitbucket is also an option:</p>\n\n<pre>$ git clone https://bitbucket.org/seanmorris227/curvature-2</pre>\n\n<a cv-link = \"https://gitlab.com/seanmorris/curvature-2\">\n\thttps://gitlab.com/seanmorris/curvature-2\n</a>\n"
});

;require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map