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
"use strict";var _View=require("curvature/base/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a.z=0,a.routes={},a.args.list=[0,1,2,3,4,5],a.args.obj={a:1,b:2,c:3},a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"splice",value:function splice(a,b,c){this.args.list.splice(a,b,c)}},{key:"arrayUnshift",value:function arrayUnshift(){this.args.list.unshift(this.z++ +"new_shift")}},{key:"arrayShift",value:function arrayShift(){this.args.list.shift()}},{key:"arrayPush",value:function arrayPush(){this.args.list.push(this.z++ +" new_push")}},{key:"arrayPop",value:function arrayPop(){this.args.list.pop()}},{key:"arraySort",value:function arraySort(){this.args.list.sort()}},{key:"arrayReverse",value:function arrayReverse(){this.args.list=this.args.list.reverse()}},{key:"setIndex",value:function setIndex(a,b){this.args.list[a]=b}},{key:"delIndex",value:function delIndex(a){delete this.args.list[a]}}]),b}(_View.View);exports.View=View;
});

;require.register("ArrayDemo/template.html", function(exports, require, module) {
module.exports = "<h2>Array Binding Demo</h2>\n\n<div class = \"row\">\n\t<fieldset>\n\t\t<label>set</label>\n\t\t<input cv-bind = \"setIndex\" />\n\t\t<input cv-bind = \"setIndexValue\" />\n\t\t<button cv-on = \"click:setIndex(setIndex,setIndexValue)\">set</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<label>delete</label>\n\t\t<input cv-bind = \"delIndex\" />\n\t\t<button cv-on = \"click:delIndex(delIndex)\">set</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<label>splice</label>\n\t\t<input cv-bind = \"splicePosition\" />\n\t\t<input cv-bind = \"spliceDelete\" />\n\t\t<input cv-bind = \"spliceItem\" />\n\t\t<button cv-on = \"click:splice(splicePosition,spliceDelete,spliceItem)\">Splice</button>\n\t</fieldset>\n</div>\n\n<div class = \"row\">\n\t<fieldset>\n\t\t<button cv-on = \"click:arrayUnshift\">Unshift</button>\n\t\t<button cv-on = \"click:arrayShift\">Shift</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<button cv-on = \"click:arrayPush\">Push</button>\n\t\t<button cv-on = \"click:arrayPop\">Pop</button>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<button cv-on = \"click:arraySort\">Sort</button>\n\t\t<button cv-on = \"click:arrayReverse\">Reverse</button>\n\t</fieldset>\n</div>\n\n<div cv-each = \"list:item:i\">\n\t<p>[[item]]</p>\n</div>\n"
});

;require.register("ChainDemo/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_View2=require("../ArrayDemo/View"),_View3=require("../ObjectDemo/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a.current=null,a.args.objects=[],a.args.input={},a.args.selectedJson="{}",a.args.objects.push({},{},{},{}),a.args.input.bindTo(function(b,c){var d=a.args.selectedId,e=a.current;e&&(e[c]=b,a.args.selectedJson=JSON.stringify(e,null,2))}),a.args.bindTo("selectedId",function(b){if(a.args.objects[b]){var c=a.args.objects[b];for(var d in console.log(c),a.current=null,a.args.input)a.args.input[d]=null;for(var e in a.current=c,c)a.args.input[e]=c[e];a.args.selectedJson=JSON.stringify(a.current,null,2)}}),a.args.selectedId=0,a}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.View=View;
});

;require.register("ChainDemo/template.html", function(exports, require, module) {
module.exports = "<h2>Chain Binding Demo</h2>\n\n<pre>objects[[[selectedId]]] === [[selectedJson]];</pre>\n\n<p>input.a: <input cv-bind = \"input.a\"> : [[input.a]]</p>\n<p>input.b: <input cv-bind = \"input.b\"> : [[input.b]]</p>\n<p>input.c: <input cv-bind = \"input.c\"> : [[input.c]]</p>\n\n<button>add</button>\n<button>remove</button>\n\n<br />\n\n<select\n\tsize = \"10\"\n\tcv-bind = \"selectedId\"\n\tcv-each = \"objects:object:o\"\n>\n\t<option value = \"[[o]]\">object [[o]]</option>\n</select>\n"
});

;require.register("Config.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Config=void 0;var Config={title:"cv-playground",theme:"alpha"};exports.Config=Config;
});

;require.register("ConfigDemo/Samples/Config.jss", function(exports, require, module) {
module.exports = "const View   = require('curvature/base/View').View;\nconst Config = require('curvature/base/Config').Config;\nconst TopLvl = require('Config').Config;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tConfig.init({'foo':'FOO'});\n\t\tConfig.init('{\"bar\":\"BAR\"}');\n\t\tConfig.set('baz', 'BAZ');\n\t\tTopLvl.quz = 'QUZ';\n\n\t\tthis.args.configFoo = Config.get('foo');\n\t\tthis.args.topLvlFoo = TopLvl.foo;\n\n\t\tthis.args.configBar = Config.get('bar');\n\t\tthis.args.topLvlBar = TopLvl.bar;\n\n\t\tthis.args.configBaz = Config.get('baz');\n\t\tthis.args.topLvlBaz = TopLvl.baz;\n\n\t\tthis.args.configQuz = Config.get('quz');\n\t\tthis.args.topLvlQuz = TopLvl.quz;\n\t}\n}\n"
});

;require.register("ConfigDemo/Samples/template.html", function(exports, require, module) {
module.exports = "<pre>\nConfig Foo: [[configFoo]]\nTopLvl Foo: [[topLvlFoo]]\n\nConfig Bar: [[configBar]]\nTopLvl Bar: [[topLvlBar]]\n\nConfig Baz: [[configBaz]]\nTopLvl Baz: [[topLvlBaz]]\n\nConfig Quz: [[configQuz]]\nTopLvl Quz: [[topLvlQuz]]\n\n</pre>\n"
});

;require.register("ConfigDemo/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _Config=require("curvature/base/Config"),_Import=require("curvature/base/Import"),_View=require("curvature/base/View"),_View2=require("../Editor/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Legacy=require("Config"),View=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a.args.theme=_Config.Config.get("theme"),console.log(Legacy);var d=new _View2.View;return d.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Config.jss"),mode:"ace/mode/javascript"},d.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/template.html"),mode:"ace/mode/html"},d.refreshCode(),a.args.editor=d,a}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.View=View;
});

;require.register("ConfigDemo/template.html", function(exports, require, module) {
module.exports = "<h2>config</h2>\n\n<p>Configuration may be set in a few ways:</p>\n\n<ul>\n\t<li>Calling <code>Config.set('name', 'value')</code> on <code>curvature/base/Config</code>.</li>\n\t<li>Calling <code>Config.init({name: value, ...})</code> on <code>curvature/base/Config</code>.</li>\n\t<li>Creating a top-level <code>Config</code> class and setting static properties on it.</li>\n</ul>\n\n<p>Configs may be read in two ways:</p>\n\n<ul>\n\t<li>Calling <code>Config.get('name')</code> on <code>curvature/base/Config</code>.</li>\n\t<li>Reading a static property from a top level <code>Config</code> class.\n</ul>\n\n[[editor]]\n"
});

;require.register("CookieDemo/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _Config=require("curvature/base/Config"),_Cookie=require("curvature/base/Cookie"),_View=require("curvature/base/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Legacy=require("Config"),View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),_Cookie.Cookie.jar.bindTo("test-cookie-a",function(b){a.args.testCookieA=b||""}),_Cookie.Cookie.jar.bindTo("test-cookie-b",function(b){a.args.testCookieB=b||""}),_Cookie.Cookie.jar.bindTo("test-cookie-c",function(b){a.args.testCookieC=b||""}),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"click",value:function click(a,b){_Cookie.Cookie.set(b,(16777215*Math.random()).toString(36))}},{key:"get",value:function get(a,b,c){this.args[c]=_Cookie.Cookie.get(b,(16777215*Math.random()).toString(36))}},{key:"del",value:function del(a,b){_Cookie.Cookie["delete"](b)}}]),b}(_View.View);exports.View=View;
});

;require.register("CookieDemo/template.html", function(exports, require, module) {
module.exports = "<h2>cookies</h2>\n\n<p>The editor used in the other demos doesn't support cookies, since it doesn't use an http origin, however you can view  the source of the controls below.</p>\n\n<p><b>test-cookie-a</b>: [[testCookieA]]</p>\n\n<div class = \"row\">\n\t<button cv-on = \"click(event, 'test-cookie-a')\">set</button>\n\t<button cv-on = \"click:get(event, 'test-cookie-a', 'aa')\">get [[aa]]</button>\n\t<button cv-on = \"click:del(event, 'test-cookie-a')\">del</button>\n</div>\n\n<p><b>test-cookie-b</b>: [[testCookieB]]</p>\n\n<div class = \"row\">\n\t<button cv-on = \"click(event, 'test-cookie-b')\">set</button>\n\t<button cv-on = \"click:get(event, 'test-cookie-b', 'bb')\">get [[bb]]</button>\n\t<button cv-on = \"click:del(event, 'test-cookie-b')\">del</button>\n</div>\n\n<p><b>test-cookie-c</b>: [[testCookieC]]</p>\n\n<div class = \"row\">\n\t<button cv-on = \"click(event, 'test-cookie-c')\">set</button>\n\t<button cv-on = \"click:get(event, 'test-cookie-c', 'cc')\">get [[cc]]</button>\n\t<button cv-on = \"click:del(event, 'test-cookie-c')\">del</button>\n</div>\n\n<p><b>@TODO: Add source with hljs</b></p>\n"
});

;require.register("Editor/PhpEditor.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PhpEditor=void 0;var _Php=require("php-wasm/Php"),_View=require("../Editor/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var PhpEditor=/*#__PURE__*/function(a){function b(a){var d;_classCallCheck(this,b),d=c.call(this,a),d.args.subframe=!1,d.messageQueue=[];var e=function(a){return d.onMessage(a)};window.addEventListener("message",e),d.onRemove(function(){return window.removeEventListener("message",e)});var f=new _Php.Php;return f.addEventListener("ready",function(){}),f.addEventListener("output",function(a){if(a.detail){var b=d.tags.result.element,c=b.contentWindow.document;c.write(a.detail.join(""))}}),d.php=f,d.onRemove(function(){return d.php=!1}),d}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"refreshCode",value:function refreshCode(){var a=this;this.rendered.then(function(){var b=a.args.tabs.php.body,c=a.tags.result.element,d=c.contentWindow.document;d.body.innerHTML="",a.php.run(b),a.args.editorStatus="Last ran at ".concat(new Date().toISOString()),a.args.editorRefresh="refresh-disabled"})}}]),b}(_View.View);exports.PhpEditor=PhpEditor;
});

;require.register("Editor/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_Keyboard=require("curvature/input/Keyboard"),_View2=require("../ArrayDemo/View"),_View3=require("../ObjectDemo/View"),ace=_interopRequireWildcard(require("brace"));require("brace/mode/html"),require("brace/mode/javascript"),require("brace/theme/monokai");function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var a=new WeakMap;return _getRequireWildcardCache=function(){return a},a}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;if(null===a||"object"!==_typeof(a)&&"function"!=typeof a)return{default:a};var b=_getRequireWildcardCache();if(b&&b.has(a))return b.get(a);var c={},d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var e in a)if(Object.prototype.hasOwnProperty.call(a,e)){var f=d?Object.getOwnPropertyDescriptor(a,e):null;f&&(f.get||f.set)?Object.defineProperty(c,e,f):c[e]=a[e]}return c["default"]=a,b&&b.set(a,c),c}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b),a=c.call(this),a.multi=!1;var d=_Keyboard.Keyboard.get().keys.bindTo("Control",function(b){a.multi=0<b,a.args.multiselect=a.multi?"multiselect":"select"});return a.onRemove(d),a.template=require("./template"),a.args.showJs=!0,a.args.showHtml=!0,a.args.showResult=!0,a.args.location=location,a.args.orientation=a.args.orientation||"vertical",a.args.tabs={},a.args.resultTabs={},a.args.tabs.bindTo(function(a,b){return a.name=b}),a.args.resultTabs.bindTo(function(a,b){return a.name=b}),a.args.time=new Date().toISOString(),a.onFrame(function(){a.args.time=new Date().toISOString()}),a.args.showClasses=["showSplit"],a.args.showSplit="active",a.args.frameSource="...",a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"postRender",value:function postRender(){var a=this;this.tags.edit={},this.editors={};this.tags.result.element;this.tags.edit.bindTo(function(b,c){if(b&&!a.editors[c]){var d=a.args.tabs[c]||a.args.resultTabs[c],e=ace.edit(b.element);a.editors[c]=e,e.setValue(d.body||"",-1),e.session.setMode(d.mode||"ace/mode/javascript"),e.setTheme("ace/theme/monokai"),e.setOptions({autoScrollEditorIntoView:!0,printMargin:!1,readOnly:d.readonly||!1,scrollbarWidth:6});var f=function(){d.readonly||(d.body=e.getValue(),a.args.editorStatus="Code updated at ".concat(new Date().toISOString()),a.args.editorRefresh="refresh-enabled")};e.session.on("change",f),a.onRemove(function(){e.session.off("change",f),e.destroy(),delete a.editors[c]}),d.bindTo("body",function(b){d.readonly&&(e.setValue(b,-1),d.readonly||a.refreshCode())}),e.resize()}})}},{key:"attached",value:function attached(){}},{key:"frameLoaded",value:function frameLoaded(){}},{key:"refreshCode",value:function refreshCode(){var a=require("./results");a=a.replace(/\[ORIGIN\]/g,location.origin);var b=this.args.tabs.js?this.args.tabs.js.body:"",c=this.args.tabs.html?this.args.tabs.html.body:"",d=this.args.tabs.css?this.args.tabs.css.body:"";a=a.replace(/\[SCRIPT\]/g,b),a=a.replace(/\[TEMPLATE\]/g,c),a=a.replace(/\[STYLE\]/g,d),this.args.frameSource=a,this.args.editorStatus="Last ran at ".concat(new Date().toISOString()),this.args.editorRefresh="refresh-disabled"}},{key:"showResult",value:function showResult(){if(this.args.showSplit){for(var i in this.args.tabs){var a=this.args.tabs[i],b=this.tags.edit[i].element.parentNode.parentNode;a.active="",b.classList.add("hide")}for(var j in this.args.resultTabs){var c=this.args.resultTabs[j],d=this.tags.edit[j].element.parentNode.parentNode;c.active="",d.classList.add("hide")}this.hideResult()}if(!this.multi){for(var k in this.args.tabs){var e=this.args.tabs[k],f=this.tags.edit[k].element.parentNode.parentNode;e.active="",f.classList.add("hide")}for(var l in this.args.resultTabs){var g=this.args.resultTabs[l],h=this.tags.edit[l].element.parentNode.parentNode;g.active="",h.classList.add("hide")}}for(var m in this.multi&&this.args.showResult&&"hide"!==this.args.showResult?(this.args.showSplit="",this.args.showResult="hide"):(this.args.showSplit="",this.args.showResult="active"),this.args.tabs)this.editors[m].resize(),this.args[m]=!0}},{key:"hideResult",value:function hideResult(){this.args.showSplit="hide",this.args.showResult="hide"}},{key:"showTab",value:function showTab(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];if(!this.multi||!b.length){for(var w in this.args.tabs){var d=this.tags.edit[w].element.parentNode.parentNode,e=this.args.tabs[w];e.active="",d.classList.add("hide")}for(var x in this.args.resultTabs){var f=this.tags.edit[x].element.parentNode.parentNode,g=this.args.resultTabs[x];g.active="",f.classList.add("hide")}}if(this.args.showClasses=[],!b.length){for(var y in this.args.showResult="",this.args.showSplit="active",this.args.tabs){var h=this.tags.edit[y].element.parentNode.parentNode,i=this.args.tabs[y];h.classList.remove("hide")}for(var z in this.args.resultTabs){var j=this.tags.edit[z].element.parentNode.parentNode,k=this.args.resultTabs[z];j.classList.remove("hide")}this.args.showClasses=["showSplit"]}else{if(this.args.showSplit){for(var A in this.args.tabs){var l=this.tags.edit[A].element.parentNode.parentNode,m=this.args.tabs[A];m.active="",l.classList.add("hide")}for(var B in this.args.resultTabs){var n=this.tags.edit[B].element.parentNode.parentNode,o=this.args.resultTabs[B];o.active="",n.classList.add("hide")}this.hideResult()}this.multi||this.hideResult(),this.args.showClasses=[],this.args.showSplit=""}for(var p=0,q=b;p<q.length;p++){var r=q[p],s=this.tags.edit[r.name].element.parentNode.parentNode;r.active?(r.active="",s.classList.add("hide")):(r.active="active",s.classList.remove("hide"))}for(var t,u=0,v=b;u<v.length;u++)t=v[u],this.editors[t.name].resize(),this.args[t.name]=!0}},{key:"changeOrientation",value:function changeOrientation(){this.args.orientation="horizontal"==this.args.orientation?"vertical":"horizontal",this.resizeEditor()}},{key:"resizeEditor",value:function resizeEditor(){for(var a in this.args.tabs)this.editors[a].resize();for(var b in this.args.resultTabs)this.editors[b].resize()}},{key:"clear",value:function clear(a){this.args[a]=""}},{key:"joinClass",value:function joinClass(a){return(a||[]).join(" ")}},{key:"expand",value:function expand(a){this.args.expanded=this.args.expanded?"":"expanded",this.args.expanded?document.body.classList.add("no-scroll"):document.body.classList.remove("no-scroll"),this.resizeEditor(a)}},{key:"escapeQuotes",value:function escapeQuotes(a){return(a+"").replace(/"/g,"&quot;")}}]),b}(_View.View);exports.View=View;
});

;require.register("Editor/results.html", function(exports, require, module) {
module.exports = "<!DOCTYPE HTML>\n<head>\n<style>[STYLE]</style>\n<script src = \"[ORIGIN]/vendor.js\"></script>\n<script>require.register('Config', (exports, require, module)=>{ return module.exports = {Config:{}}});</script>\n\n<script>require.register('template', (exports, require, module)=>{ return module.exports = `[TEMPLATE]`});</script>\n\n<script src = \"[ORIGIN]/curvature.js\"></script>\n\n<script>\n\nwindow.addEventListener('submit', (event) => {\n\n\tconsole.log(event);\n\n\tconst error = event.message;\n\n\twindow.parent.parent.postMessage(\n\t\tJSON.stringify({'@error': error}, null, 2)\n\t, '*');\n\n}, false);\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\n\t[SCRIPT]\n\n\tif(typeof DemoView !== 'undefined')\n\t{\n\t\tconst view = new DemoView;\n\n\t\tview.render(document.body);\n\t}\n\n\tconsole.debug()\n\n});\n\n</script>\n</head>\n<body>\n</body>\n"
});

;require.register("Editor/template.html", function(exports, require, module) {
module.exports = "<div class = \"editor-window [[expanded]]\" cv-on = \"mouseup:resizeEditor(event)\" data-orientation = \"[[orientation]]\" data-multiselect=\"[[multiselect]]\">\n\n\t<div class = \"row full tabs [[showClasses|joinClass]]\">\n\n\t\t<span cv-each = \"tabs:tab:t\" class = \"row dcontent\">\n\t\t\t<div class = \"tab [[tab.active]]\" cv-on = \"click:showTab(tab)\">[[tab.title]]</div>\n\t\t</span>\n\n\t\t<div class = \"tab [[showResult]]\" cv-on = \"click:showResult()\">result</div>\n\n\t\t<span cv-each = \"resultTabs:tab:t\" class = \"row dcontent\">\n\t\t\t<div class = \"tab [[tab.active]]\" cv-on = \"click:showTab(tab)\">[[tab.title]]</div>\n\t\t</span>\n\n\t\t<div class = \"tab [[showSplit]]\" cv-on = \"click:showTab()\">all</div>\n\n\t\t<span class = \"hint\">\n\t\t\t<div data-icon = \"check\"></div>\n\t\t\thold ctrl / ⌘ to select multiple tabs.\n\t\t</span>\n\n\t</div>\n\n\t<div class = \"row full editors [[showClasses|joinClass]]\">\n\n\t\t<p>Select a tab.</p>\n\n\t\t<span cv-each = \"tabs:tab:t\" class = \"dcontent\">\n\t\t\t<div cv-carry = \"t\" class = \"half\">\n\t\t\t\t<p>[[tab.file]]</p>\n\t\t\t\t<div class = \"box\"><div class = \"editor\" cv-ref = \"edit::t\"><textarea cv-bind = \"tab.body\"></textarea></div></div>\n\t\t\t</div>\n\t\t</span>\n\n\t\t<div class = \"half [[showResult]]\">\n\t\t\t<p>Result</p>\n\t\t\t<div class = \"result\">\n\t\t\t\t<iframe\n\t\t\t\t\tcv-ref = \"result\"\n\t\t\t\t\tcv-on  = \"load:frameLoaded(event)\"\n\t\t\t\t\tsrcdoc = '\n\t\t\t\t<meta http-equiv=\"Content-Security-Policy\" content=\"default-src [[location.origin]]/curvature.js ws://[[location.hostname]]:9485\n\t\t\t\t[[location.origin]]/vendor.js &apos;unsafe-inline&apos; connect-src: https://api.dictionaryapi.dev\">\n\t\t\t\t<style>\n\t\t\t\t\tiframe {\n\t\t\t\t\t\tposition: absolute;\n\t\t\t\t\t\ttop: 0px;\n\t\t\t\t\t\tleft: 0px;\n\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\theight: 100%;\n\t\t\t\t\t\tborder: none;\n\t\t\t\t\t}\n\t\t\t\t</style>\n\t\t\t\t<iframe\n\t\t\t\t\tsandbox = \"allow-scripts\"\n\t\t\t\t\tsrc     = \"about:blank\"\n\t\t\t\t\tsrcdoc  = \"[[frameSource|escapeQuotes]]\"\n\t\t\t\t></iframe>\n\t\t\t\t'></iframe>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<span cv-each = \"resultTabs:tab:t\" class = \"dcontent\">\n\t\t\t<div cv-carry = \"t\" class = \"half\">\n\t\t\t\t<p>[[tab.file]]</p>\n\t\t\t\t<div class = \"box\"><div class = \"editor\" cv-ref = \"edit::t\"><textarea cv-bind = \"tab.body\"></textarea></div></div>\n\t\t\t</div>\n\t\t</span>\n\n\t\t<div class = \"buttons\">\n\n\t\t\t<div cv-on = \"click:changeOrientation(event)\" class = \"button orientation\">\n\t\t\t\t<span class = \"label\">vert/horiz</span>\n\t\t\t\t<div data-icon = \"orientation\"></div>\n\t\t\t</div>\n\n\t\t\t<div cv-on = \"click:expand(event)\" class = \"button expand\">\n\t\t\t\t<span class = \"label\">expand/contract</span>\n\t\t\t\t<div data-icon = \"expand\"></div>\n\t\t\t</div>\n\n\t\t</div>\n\n\t</div>\n\n\t<div class = \"row full status\">\n\t\t<div class = \"[[editorRefresh]]\">\n\t\t\t<span>[[editorStatus]]</span>\n\t\t\t<button cv-on = \"click:refreshCode(event)\">⟳</button>\n\t\t</div>\n\t</div>\n\n</div>\n"
});

;require.register("Experiments/GridResizer/DragDrop.js", function(exports, require, module) {
"use strict";var _View2=require("curvature/base/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.DragDrop=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var DragDrop=/*#__PURE__*/function(a){function b(a,d,e){var f;return _classCallCheck(this,b),f=c.call(this,a,d),f.template=require("./drag-drop"),f.dragging=!1,f.callback=e,f.originalCursor=document.documentElement.style.cursor,f.onRemove(function(){document.documentElement.style.cursor=f.originalCursor}),f}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"setCursor",value:function setCursor(a){document.documentElement.style.cursor=a,document.documentElement.style.userSelect=a?"none":null}},{key:"attached",value:function attached(){this.tags.frame.style({position:"absolute",transform:"translate(-50%,-100%)"}),this.tags.stage.style({pointerEvents:"none",position:"fixed",width:"100%",height:"100%"})}},{key:"grab",value:function grab(a,b,c){var d=this;if(!this.dragging){var e=b.childNodes,f=new CustomEvent("cvDragGrab",{cancelable:!0});if(!b.dispatchEvent(f))return this.setCursor(null),!1;this.setCursor("grabbing"),this.grabIndex=c,this.dragging=!0;var g=this.tags.stage,h=this.tags.frame;h.style({left:"".concat(a.x,"px"),top:"".concat(a.y,"px")}),_toConsumableArray(e).map(function(a){return h.element.appendChild(a)}),this.stop=this.listen(document,"mousemove",function(a){return d.drag(a)})}}},{key:"drag",value:function drag(a){this.tags.frame.style({left:"".concat(a.clientX,"px"),top:"".concat(a.clientY,"px")});var b=document.elementFromPoint(a.clientX,a.clientY);b&&b!==this.hovering&&(this.hovering&&!this.hovering.contains(b)&&this.hovering.dispatchEvent(new CustomEvent("cvDragUnhover",{bubbles:!0})),b.dispatchEvent(new CustomEvent("cvDragHover",{bubbles:!0}))),this.hovering=b}},{key:"drop",value:function drop(a,b,c){var d=this.tags.frame.element;if(!this.hovering)return!1;var e=new CustomEvent("cvDragDrop",{cancelable:!0});if(b.dispatchEvent(new CustomEvent("cvDragUnhover")),!b.dispatchEvent(e))return!1;for(;d.firstChild;)this.dragFrom.appendChild(d.firstChild);return this.callback&&this.callback(this.grabIndex,c),this.stop&&this.stop(),this.grabIndex=this.stop=this.dragging=!1,this.setCursor(""),!0}},{key:"containerMousedown",value:function containerMousedown(a,b,c){var d=this;this.dragging||0!==a.button||(this.dragFrom=b,this.grab(a,b,c),this.listen(document,"mouseup",function(a){d.dragFrom&&d.drop(a,d.dragFrom,d.grabIndex)},{once:!0}))}},{key:"containerMouseup",value:function containerMouseup(a,b,c){if(this.dragging){var d=_toConsumableArray(b.childNodes),e=this.tags.frame.element;this.drop(a,b,c)?this.dragFrom=!1:this.dragFrom&&this.drop(a,this.dragFrom,this.grabIndex),this.setCursor(null)}}}]),b}(_View2.View);exports.DragDrop=DragDrop;
});

;require.register("Experiments/GridResizer/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_DragDrop=require("./DragDrop");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var d,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},f=1<arguments.length?arguments[1]:void 0;_classCallCheck(this,b),d=c.call(this,e,f),d.template=require("./template.html"),d.dragger=new _DragDrop.DragDrop({},_assertThisInitialized(d),function(c,e){var f=d.args.list,g=d.args.list[c],a=d.args.list[e],b=[g,a];f[e]=b[0],f[c]=b[1]}),d.dragger.bindTo("dragging",function(a){d.args.dragging=a?"dragging":""}),d.dragger.render(document.body),d.args.trackSize=16,d.args.xsize=d.args.xsize||7,d.args.ysize=d.args.ysize||7,d.args.hGrab=Array(-1+d.args.xsize).fill(0),d.args.vGrab=Array(-1+d.args.ysize).fill(0),d.args.cols=[],d.args.rows=[],d.args.colTemplate="",d.args.rowTemplate="",d.args.cols.bindTo(function(){return requestAnimationFrame(function(){d.args.colTemplate=d.args.cols.map(function(a){return isNaN(a)?a:"".concat(a,"px")}).join(" var(--tracksize) ")})}),d.args.rows.bindTo(function(){return requestAnimationFrame(function(){d.args.rowTemplate=d.args.rows.map(function(a){return isNaN(a)?a:"".concat(a,"px")}).join(" var(--tracksize) ")})}),d.args.auto=d.args.auto||{x:Math.floor(d.args.xsize/2),y:Math.floor(d.args.ysize/2)};for(var j=0;j<d.args.xsize;j++){if(j===e.auto.x){d.args.cols.push("auto");continue}d.args.cols.push(50)}for(var a=0;a<d.args.ysize;a++){if(a===e.auto.y){d.args.rows.push("auto");continue}d.args.rows.push(50)}d.resizing=!1;var g=_View.View.from("<b>[[time]]</b>");g.args.time=0,g.preserve=!0,g.onFrame(function(){return g.args.time=new Date().toISOString()});// const face = BaseView.from('<img src = "/player-head-180.png" />');
// face.preserve = true;
var h=Array(23).fill("1"),i=[];return h.length<d.args.xsize*d.args.xsize&&(i=Array(d.args.xsize*d.args.xsize-h.length).fill(null)),d.args.list=[h,i].flat().map(function(a,b){return 0===b?{label:"<img src = \"/player-head.png\" />",index:b}:{label:(null!==a&&void 0!==a?a:a)?String.fromCharCode(9774+b):a,index:b}}),d}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"mousedown",value:function mousedown(a){var b=this;this.resizing=!0;var c=+event.target.style.getPropertyValue("--track")/2,d="clientX",e="cols",f=this.args.xsize-1,g=null;a.target.style.pointerEvents="none";var h=document.elementFromPoint(event.clientX,event.clientY);if(h.matches("[data-resize]")&&h.getAttribute("data-resize")!==a.target.getAttribute("data-resize")){var l=new Event("mousedown",{bubbles:!0});l.clientX=a.clientX,l.clientY=a.clientY,h.dispatchEvent(l)}if(a.target.matches("[data-resize=\"v\"]"))d="clientY",e="rows",g=event.target.parentNode.parentNode.clientHeight,f=this.args.ysize-1;else if(a.target.matches("[data-resize=\"h\"]"))g=event.target.parentNode.parentNode.clientWidth;else return void(a.target.style.pointerEvents=null);g-=this.args.trackSize*f;var i=this.args[e][c-1],j=this.args[e][c+0],k=this.listen(document,"mousemove",function(f){var h=f[d]-a[d],k=i,l=0,m=0;isNaN(i)||(k=i+h,0>=k&&(m=k,k=0));var n=j;isNaN(j)||(n=j-h,0>=n&&(l=n,n=0));var o=[];Object.assign(o,b.args[e]),o[c-1]=k,o[c+0]=n;var p=o.filter(function(a){return!isNaN(a)}).reduce(function(c,a){return c+a},0);if(p>=g){var q=p-g;if(!isNaN(i)){var r=k-q;o[c-1]=0<r?r:0}if(!isNaN(j)){var s=n-q;o[c+0]=0<s?s:0}}isNaN(k)||isNaN(n)||(0>=k&&(o[c-1]=0,o[c+0]=n+m),0>=n&&(o[c-1]=k+l,o[c+0]=0)),Object.assign(b.args[e],o)});this.listen(document,"mouseup",function(){a.target.style.pointerEvents="",k(),b.resizing=!1},{once:!0})}},{key:"mousemove",value:function mousemove(a){a.target.style.pointerEvents="none";var b=document.elementFromPoint(a.clientX,a.clientY);if(a.target.style.pointerEvents=null,b.matches("[data-resize]")&&b.getAttribute("data-resize")!==a.target.getAttribute("data-resize")&&!a.repeated){var c=new Event("mousemove",{bubbles:!0});c.clientX=a.clientX,c.clientY=a.clientY,c.repeated=!0,c.original=a,b.dispatchEvent(c)}}},{key:"drag",value:function drag(a,b,c){a.target===a.currentTarget||this.dragger.containerMousedown(a,b,c)}},{key:"drop",value:function drop(a,b,c){this.dragger.containerMouseup(a,b,c)}},{key:"hover",value:function hover(a,b,c){return 14<c&&19>c?void(b.style.backgroundColor="#FCC"):void(b.style.backgroundColor="#CFC",this.dragger.setCursor("grabbing"))}},{key:"unhover",value:function unhover(a,b){b.style.backgroundColor=null,this.dragger.setCursor("no-drop")}},{key:"stopdrop",value:function stopdrop(a,b,c){14<c&&19>c&&a.preventDefault()}},{key:"trackNumber",value:function trackNumber(a){return 2+2*parseInt(a)}}]),b}(_View.View);exports.View=View;
});

;require.register("Experiments/GridResizer/drag-drop.html", function(exports, require, module) {
module.exports = "<div class = \"drag-drop-stage\" cv-ref = \"stage\">\n\t<div class = \"drag-drop-frame\" cv-ref = \"frame\"></div>\n</div>\n"
});

;require.register("Experiments/GridResizer/template.html", function(exports, require, module) {
module.exports = "<h2>grid-tools</h2>\n\n<p>Grid tools implements one dimensional resize on tracks and two-dimensional on intersections.</p>\n\n<p>It will re-sort its source array on drag & drop.</p>\n\n<p>The order of these black circles will change as you drag & drop the items in the grid below.\n\n<div class = \"list-preview\">\n\t<span class = \"contents\" cv-each = \"list:item:index\">\n\t\t<span cv-with = \"item\">\n\t\t\t<span cv-if = \"label\">\n\t\t\t\t<span class = \"invert\">[[$label]]</span>\n\t\t\t</span>\n\t\t</span>\n\t</span>\n</div>\n\n<p class = \"row\">track width: <input type = \"range\" min = \"0\" max = \"100\" cv-bind = \"trackSize\"/> [[trackSize]]px</p>\n\n<div\n\tclass = \"grid-resize [[dragging]]\"\n\tstyle = \"\n\t\t--xsize:       calc([[xsize]] * 2);\n\t\t--ysize:       calc([[ysize]] * 2);\n\t\t--tracksize:   [[trackSize]]px;\n\t\t--colTemplate: [[colTemplate]];\n\t\t--rowTemplate: [[rowTemplate]];\n\t\">\n\n\t<span class = \"contents\" cv-each = \"list:item:index\">\n\t\t<div\n\t\t\tclass   = \"box box-[[index]]\"\n\t\t\tstyle   = \"--index:[[index]]\"\n\t\t\tcv-with = \"item\"\n\t\t\tcv-on   = \"\n\t\t\t\tcvDragDrop:stopdrop(event, $tag, index)c;\n\t\t\t\tcvDragGrab:stopdrop(event, $tag, index);\n\t\t\t\tcvDragHover:hover(event, $tag, index);\n\t\t\t\tcvDragUnhover:unhover(event, $tag, index);\n\t\t\t\tmousedown:drag(event, $tag, index)c;\n\t\t\t\tmouseup:drop(event, $tag, index)c;\n\t\t\t\"\n\t\t>[[$label]]</div>\n\t</span>\n\n\t<span class = \"contents\" cv-each = \"hGrab::h\" cv-on = \"mousedown(event);mousemove(event)c;\">\n\t\t<div style = \"--track:[[h|trackNumber]]\" data-resize = \"h\" class = \"resizer resizer-h\"></div>\n\t</span>\n\n\t<span class = \"contents\" cv-each = \"vGrab::v\" cv-on = \"mousedown(event);mousemove(event)c;\">\n\t\t<div style = \"--track:[[v|trackNumber]]\" data-resize = \"v\" class = \"resizer resizer-v\">\n\t\t\t<span class = \"contents\" cv-each = \"hGrab::vh\">\n\t\t\t\t<div style = \"--track:[[vh|trackNumber]]\" data-resize = \"vh\" class = \"resizer resizer-vh\"></div>\n\t\t\t</span>\n\t\t</div>\n\t</span>\n\n\n</div>\n\n<p>[[rowTemplate]]</p>\n<p>[[colTemplate]]</p>\n"
});

;require.register("Experiments/HtmlEditor/View.js", function(exports, require, module) {
"use strict";var _View=require("curvature/base/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.args.source="<h1>Hello, world!</h1>\n<p>this is a double-bound HTML editor!</p>\n<p><img src = \"/player-head-180.png\" width = \"180\" height = \"180\" /></p><div><p>Nested tags should auto indent when either field blurs.</p></div>",a.template=require("./template.html"),a.args.selections=[],a.args.selected=!1,a.editorArgs={xx:0},a.onInterval(1,function(){return a.editorArgs.xx++}),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"attached",value:function attached(){var a=this;this.args.bindTo("source",function(b){a.args.vv=_View.View.from(b,a.editorArgs,a)}),this.blur(event)}},{key:"blur",value:function blur(){this.format()}},{key:"format",value:function format(){var a=this.tags.html.element,b=_toConsumableArray(a.childNodes).filter(function(a){return 0<a.length||a.nodeType!==a.TEXT_NODE});this.args.source=this.formatNodes(b,0)}},{key:"formatNodes",value:function formatNodes(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,c=" ".repeat(4*b),d=[];for(var k in a){var e=a[k],f=void 0;if(e.hasChildNodes()){var g=e.cloneNode(!1).outerHTML.replace(/\<\/.+/,""),h="</".concat(e.tagName.toLowerCase(),">"),j=this.formatNodes(_toConsumableArray(e.childNodes),b+1);j=e.querySelector("*")?"\n"+"\t".repeat(b+1)+j.trim()+"\n"+"\t".repeat(b+0):j.trim(),f=g+j+h+"\n"}else f=((e.outerHTML||e.textContent)+"").trim();f&&d.push(c+f+"\n")}return console.log(d),d.join("")}},{key:"click",value:function click(a){var b=this,c=a?a.target:this.args.selected;this.args.selected=c,this.args.tagName=(c.tagName+"").toLowerCase(),delete this.args.selections[0],this.onNextFrame(function(){b.args.selections[0]={left:c.offsetLeft,top:c.offsetTop,width:c.clientWidth,height:c.clientHeight},b.args.attributes=[];for(var a=function(a){var d={value:c.attributes[a].value,name:c.attributes[a].name,index:a};b.args.attributes.push(d),d.bindTo("value",function(d){c.attributes[a].value=d,b.format()})},d=0;d<c.attributes.length;d++)a(d)})}},{key:"newAttribute",value:function newAttribute(){this.args.adding=!0}},{key:"addAttribute",value:function addAttribute(){this.args.adding=!1,this.args.selected.setAttribute(this.args.newAttrName,this.args.newAttrValue),this.format(),this.click()}},{key:"removeAttr",value:function removeAttr(a){var b=a.name;this.args.selected.removeAttribute(b),this.format(),this.click()}}]),b}(_View.View);exports.View=View;
});

;require.register("Experiments/HtmlEditor/template.html", function(exports, require, module) {
module.exports = "<h2>html editor</h2>\n\n<div class = \"html-editor\">\n\t<textarea\n\t\tclass   = \"editable\"\n\t\tcv-on   = \"blur(event)\"\n\t\tcv-bind = \"source\"\n\t\tcv-ref  = \"source\"\n\t></textarea>\n\n\t<div class = \"selections\" cv-each = \"selections:selection:s\">\n\t\t<div style = \"\n\t\t\tposition: absolute;\n\t\t\tleft: [[selection.left]]px;\n\t\t\ttop: [[selection.top]]px;\n\t\t\twidth: [[selection.width]]px;\n\t\t\theight: [[selection.height]]px;\n\t\t\tbackground-color: rgba(255,0,0,0.25);\n\t\t\tpointer-events: none;\n\t\t\"></div>\n\t</div>\n\n\t<div\n\t\tclass   = \"editable\"\n\t\tcv-on   = \"blur(event);click(event)\"\n\t\tcv-bind = \"$source\"\n\t\tcv-ref  = \"html\"\n\t\tcontenteditable = \"true\"\n\t></div>\n\n\t<div class = \"html-editor-live editable\">\n\t\t[[vv]]\n\t</div>\n\n\t<div class = \"properties\" cv-if = \"selected\">\n\t\t<h3>Tag Name</h3>\n\t\t[[tagName]]<br />\n\t\t<h3>Attributes</h3>\n\t\t<ul>\n\t\t\t<span class = \"contents\" cv-each = \"attributes:attribute:a\">\n\t\t\t\t<li>\n\t\t\t\t\t[[attribute.name]]: <input cv-bind = \"attribute.value\">\n\t\t\t\t\t<button cv-on = \"click:removeAttr(attribute)\">✘</button>\n\t\t\t\t</li>\n\t\t\t</span>\n\t\t\t<li>\n\t\t\t\t<span cv-if = \"!adding\">\n\t\t\t\t\t<button cv-on = \"click:newAttribute()\">+</button>\n\t\t\t\t</span>\n\t\t\t\t<span cv-if = \"adding\">\n\t\t\t\t\t<input cv-bind = \"newAttrName\" placeholder=\"new attribute name...\">\n\t\t\t\t\t<input cv-bind = \"newAttrValue\" placeholder=\"new attribute name...\">\n\t\t\t\t\t<button cv-on = \"click:addAttribute()\">✔</button>\n\t\t\t\t</span>\n\t\t\t</li>\n\t\t</ul>\n\n\t</div>\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_InfiniteScroller=require("./lib/InfiniteScroller"),_Records=require("./views/Records"),_Records2=require("./strings/Records"),_Scroller=require("./sliders/Scroller"),_SliderRecords=require("./sliders/SliderRecords"),_Ease=require("curvature/animate/Ease"),_Linear=require("curvature/animate/ease/Linear"),_GeoIn=require("curvature/animate/ease/GeoIn"),_GeoOut=require("curvature/animate/ease/GeoOut"),_SineIn=require("curvature/animate/ease/SineIn"),_SineOut=require("curvature/animate/ease/SineOut"),_SineInOut=require("curvature/animate/ease/SineInOut"),_QuadIn=require("curvature/animate/ease/QuadIn"),_QuadOut=require("curvature/animate/ease/QuadOut"),_QuadInOut=require("curvature/animate/ease/QuadInOut"),_CubicIn=require("curvature/animate/ease/CubicIn"),_CubicOut=require("curvature/animate/ease/CubicOut"),_CubicInOut=require("curvature/animate/ease/CubicInOut"),_QuartIn=require("curvature/animate/ease/QuartIn"),_QuartOut=require("curvature/animate/ease/QuartOut"),_QuartInOut=require("curvature/animate/ease/QuartInOut"),_QuintIn=require("curvature/animate/ease/QuintIn"),_QuintOut=require("curvature/animate/ease/QuintOut"),_QuintInOut=require("curvature/animate/ease/QuintInOut"),_ElasticOut=require("curvature/animate/ease/ElasticOut");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a.args.rows=0,a.args.rowHeight=33;var d=new _Scroller.Scroller;a.args.gridScroller=d,a.args.bindTo("rowHeight",function(a){return d.args.rowHeight=a});var e=new _SliderRecords.SliderRecords;return d.args.content=e,a.args.bindTo("rows",function(a){return e.changed(a)}),a.args.simpleRows=1e3,a.args.arrayScroller=new _InfiniteScroller.InfiniteScroller({rowHeight:33}),a.args.stringScroller=new _InfiniteScroller.InfiniteScroller({rowHeight:33}),a.args.viewScroller=new _InfiniteScroller.InfiniteScroller({rowHeight:33}),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"attached",value:function attached(){var a=this;this.args.viewScroller.args.content=new _Records.Records,this.args.stringScroller.args.content=new _Records2.Records,this.args.arrayScroller.args.content=Array(this.args.simpleRows).fill(1).map(function(b,c){return a.thousands(c)}),this.args.rows=1000001}},{key:"thousands",value:function thousands(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}},{key:"leftPad",value:function leftPad(a){return(a+"").padStart(4,0)}},{key:"round",value:function round(a){return Math.round(a)}},{key:"increase",value:function increase(){var a=this;this.args.simpleRows=1e6,this.args.arrayScroller.args.content=Array(1e6).fill(1).map(function(b,c){return a.thousands(c)})}}]),b}(_View.View);exports.View=View;
});

;require.register("Experiments/InfiniteScroll/lib/InfiniteScroller.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.InfiniteScroller=void 0;var _View=require("curvature/base/View"),_Mixin=require("curvature/base/Mixin"),_Tag=require("curvature/base/Tag"),_GeoIn=require("curvature/animate/ease/GeoIn"),_GeoOut=require("curvature/animate/ease/GeoOut"),_ElasticOut=require("curvature/animate/ease/ElasticOut"),_Row=require("./Row");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var InfiniteScroller=/*#__PURE__*/function(a){function b(a,d){var e;return _classCallCheck(this,b),e=c.call(this,a,d),e.template=require("./infinite-scroller"),e.preRuleSet.add("[cv-ref=\"list\"]",function(a){var b=a.element;b.setAttribute("tabindex",-1),b.setAttribute("cv-each","visible:row:r"),b.setAttribute("cv-view","Experiments/InfiniteScroll/lib/Row")}),e.args.visible=[],e.args.content=void 0,e.first=null,e.last=null,e.changing=!1,e.lastScroll=!1,e.topSpeed=0,e.speed=0,e.args.width="100%",e.args.height="100%",e.args.scrollTop=0,e.args.scrollDir=0,e.args.snapOffset=0,e.args.rowHeight=e.args.rowHeight||32,e.args.bindTo("scrollTop",function(a,b,c){e.args.scrollDir=0,a>c[b]?e.args.scrollDir=1:a<c[b]&&(e.args.scrollDir=-1)}),e}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"attached",value:function attached(){var a=this,b=this.container=this.tags.list,c=this.scroller=this.tags.scroller||b,d=new _Tag.Tag("<div data-tag = \"shim\">");c.style({overflowY:"scroll",position:"relative",display:"block",width:"100%"}),d.style({pointerEvents:"none",position:"absolute",opacity:0,height:"var(--shimHeight)",width:"1px"}),this.listen(c.node,"scroll",function(b){return a.updateViewport(b)}),this.args.bindTo("snapOffset",function(a){return b.style({"--snapperOffset":"".concat(-1*a,"px")})}),this.args.bindTo("snapOffset",function(a){return b.style({"--snapperOffset":"".concat(-1*a,"px")})}),c.append(d.element);var e=function(a,b){return c.style(_defineProperty({},"--".concat(b),"".concat(a,"px")))};this.args.bindTo("height",function(a){return b.style({height:a})}),this.args.bindTo("width",function(a){return b.style({width:a})}),this.args.bindTo("rowHeight",e),this.args.bindTo("shimHeight",e),this.args.bindTo("rowHeight",function(b,c,d){var e=a.header&&a.header();d[c]=parseInt(b);var f=e?1:0,g=f+a.args.content?a.args.content.length:0;a.args.shimHeight=g*a.args.rowHeight,a.scroller.scrollTop=a.first*a.args.rowHeight,a.updateViewport()}),this.contentDebind=this.args.bindTo("content",function(b){var c=a.header&&a.header(),d=c?1:0,e=d+b?b.length:0;a.args.shimHeight=e*a.args.rowHeight,a.lengthDebind&&a.lengthDebind(),b&&(a.lengthDebind=b.bindTo("length",function(b){b=+b,a.args.shimHeight=b*a.args.rowHeight,a.onNextFrame(function(){return a.updateViewport()})})),a.onNextFrame(function(){return a.updateViewport()})},{wait:0}),this.updateViewport()}},{key:"updateViewport",value:function updateViewport(a){var b=this;if(this.snapper&&this.snapper.cancel(),!this.changing){var c=this.container,d=this.scroller||c,e=this.header&&this.header(),f=this.args.scrollTop=d.scrollTop,g=this.args.scrollHeight=d.scrollHeight,h=c.offsetHeight,i=f+h;d.style({"--scrollTop":f}),this.args.scrollMax=g-h;var j=Math.floor(f/this.args.rowHeight),k=Math.ceil(i/this.args.rowHeight),l={time:Date.now(),pos:f};if(this.speedTimer||(this.speedTimer=this.onTimeout(100,function(){var a=Date.now()-l.time,c=d.scrollTop-f;b.speed=1e3*(c/a);var e=Math.abs(b.speed);e>Math.abs(b.topSpeed)&&(b.topSpeed=b.speed),b.speed||(b.topSpeed=b.speed),b.args.speed=b.speed.toFixed(2)}),this.speedTimer=!1),this.args.content||Array.isArray(this.args.content)){if(c.style({"--hasHeaders":+!!e}),j>this.args.content.length&&(j=this.args.content.length-1),k>this.args.content.length&&(k=this.args.content.length-1),this.setVisible(j,k),0===f||i===g)return c.style({"--inertiaOffset":"0px"}),void c.style({"--snapperOffset":"0px"});if(a){var m=Math.round(f/this.args.rowHeight),n=m*this.args.rowHeight,o=n-f,p=Math.abs(o*this.args.rowHeight/2);192<p&&(p=192);var q=3<Math.abs(o)?new _ElasticOut.ElasticOut(13*p,{friction:.15}):new _GeoIn.GeoIn(p,{power:5});this.snapperDone&&this.snapperDone(),this.snapperDone=this.onFrame(function(){var a=q.current()*o;b.args.snapOffset=a}),q.then(function(){b.onNextFrame(function(){0==b.args.snapOffset||d.scrollTop!==n&&(d.scrollTop=n,b.args.snapOffset=0)}),b.snapperDone&&b.snapperDone(),a.preventDefault()})["catch"](function(){var a=b.snapper.current()*o;b.args.snapOffset=a}),this.scrollFrame&&cancelAnimationFrame(this.scrollFrame),this.scrollFrame=requestAnimationFrame(function(){return q.start()}),this.snapper=q}}}}},{key:"setVisible",value:function setVisible(a,b){if(!this.changing&&this.tags.list)// if(this.first === first && this.last === last)
// {
// 	return;
// }
{var c=this.tags.list,e=this.viewLists.get(c.element);this.changing=!0;var f=e.views,g=[];if(a<=b)for(var n in f){var h=parseInt(n),j=f[h];if(a===b&&0===b){g.unshift(h);continue}if(h<a||h>b){g.unshift(h);continue}if(j&&(!j.visible||j.removed)){g.unshift(h);continue}}else f.map(function(a,b){return g.push(b)});for(var k,l=0,m=g;l<m.length;l++)(k=m[l],!(0===k&&this.header()))&&(f[k]&&f[k].remove(),delete f[k],delete this.args.visible[k]);for(var i=a;i<=b;i++)this.args.content.length<=i||(this.args.visible[i]=this.args.content[i]);this.first=a,this.last=b,this.changing=!1}}},{key:"header",value:function header(){return!!this.args.content&&!Array.isArray(this.args.content)&&"function"==typeof this.args.content.header&&this.args.content.header()}},{key:"leftPad",value:function leftPad(a){return(a+"").padStart(4,0)}}]),b}(_Mixin.Mixin.from(_View.View));exports.InfiniteScroller=InfiniteScroller;
});

;require.register("Experiments/InfiniteScroll/lib/RecordSet.js", function(exports, require, module) {
"use strict";var _Bindable=require("curvature/base/Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.RecordSet=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var _Fetch=Symbol("_Fetch"),RecordSet=/*#__PURE__*/function(){function a(){var b=this;_classCallCheck(this,a),_defineProperty(this,"length",0),this.length=1e6;var c=function(a,c){return"length"===c?b.count():"symbol"===_typeof(c)||parseInt(c)!==+c?a[c]:b[_Fetch](+c)},d=function(a,b){return"symbol"===_typeof(b)||parseInt(b)!==+b||!0};return new Proxy(_Bindable.Bindable.make(this),{get:c,set:d,delete:function del(){return!0}})}return _createClass(a,[{key:"count",value:function count(){return this.length}},{key:"header",value:function header(){return!1}},{key:_Fetch,value:function value(a){var b=this.header();return 0===a&&b?(b.___header="is-header",b):(this.content||(this.content=[]),this.content[a]?this.content[a]:this.content[a]=this.fetch(a))}},{key:"fetch",value:function fetch(){}}]),a}();exports.RecordSet=RecordSet;
});

;require.register("Experiments/InfiniteScroll/lib/Row.js", function(exports, require, module) {
"use strict";var _View=require("curvature/base/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Row=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _createForOfIteratorHelper(a){if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(a=_unsupportedIterableToArray(a))){var b=0,c=function(){};return{s:c,n:function n(){return b>=a.length?{done:!0}:{done:!1,value:a[b++]}},e:function e(a){throw a},f:c}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var d,e,f=!0,g=!1;return{s:function s(){d=a[Symbol.iterator]()},n:function n(){var a=d.next();return f=a.done,a},e:function e(a){g=!0,e=a},f:function f(){try{f||null==d["return"]||d["return"]()}finally{if(g)throw e}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Row=/*#__PURE__*/function(a){function b(a,d){var e;return _classCallCheck(this,b),e=c.call(this,a,d),e.visible=!0,e.preserve=!0,e}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"attached",value:function attached(){var a=this,b=this.tags.row;b.style.setProperty("--index",this.args.r),b.style.position="absolute",b.style.height="var(--rowHeight)",b.style.transform="translateY(calc( var(--snapperOffset) + var(--inertiaOffset) )) translateZ(100px)",b.style.top="calc( var(--rowHeight) * calc(var(--index)) )";var c=new IntersectionObserver(function(b,c){return a.scrollObserved(b,c)},{root:this.parent.container.node});c.observe(b)}},{key:"scrollObserved",value:function scrollObserved(a){var b,c=!1,d=_createForOfIteratorHelper(a);try{for(d.s();!(b=d.n()).done;){var e=b.value;if(e.intersectionRatio){c=!0;break}}}catch(a){d.e(a)}finally{d.f()}this.visible=c}}]),b}(_View.View);exports.Row=Row;
});

;require.register("Experiments/InfiniteScroll/lib/infinite-scroller.html", function(exports, require, module) {
module.exports = "<div class = \"cv-hyperscroller\" cv-ref  = \"list\">\n\t<div class = \"cv-hyperscroller-row\" cv-ref = \"row\">[[row]]</div>\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/sliders/Scroller.js", function(exports, require, module) {
"use strict";var _InfiniteScroller2=require("../lib/InfiniteScroller");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Scroller=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Scroller=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./scroller"),a}_inherits(b,a);var c=_createSuper(b);return b}(_InfiniteScroller2.InfiniteScroller);exports.Scroller=Scroller;
});

;require.register("Experiments/InfiniteScroll/sliders/SliderRecords.js", function(exports, require, module) {
"use strict";var _RecordSet2=require("../lib/RecordSet");Object.defineProperty(exports,"__esModule",{value:!0}),exports.SliderRecords=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var SliderRecords=/*#__PURE__*/function(a){function b(){return _classCallCheck(this,b),c.apply(this,arguments)}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"changed",value:function changed(a){this.length=a}},{key:"header",value:function header(){return{id:"id",title:"title",value:"value"}}},{key:"fetch",value:function fetch(a){var b=((a+65025+30)/77).toString(36);return{index:a,id:a,title:b,value:1024-a%1024}}}]),b}(_RecordSet2.RecordSet);exports.SliderRecords=SliderRecords;
});

;require.register("Experiments/InfiniteScroll/sliders/scroller.html", function(exports, require, module) {
module.exports = "<div cv-ref = \"list\" class = \"table\">\n\n\t<div\n\t\tcv-ref  = \"row\"\n\t\tcv-with = \"row\"\n\t\tclass   = \"table-row [[row.___header]]\">\n\n\t\t<div>[[id]]</div>\n\n\t\t<div>\n\t\t\t<span cv-if = \"___header\">\n\t\t\t\ttitle\n\t\t\t</span>\n\t\t\t<span cv-if = \"!___header\">\n\t\t\t\t<input type = \"text\" cv-bind = \"title\" placeholder = \"input a title\">\n\t\t\t</span>\n\t\t</div>\n\n\t\t<div>[[value]]</div>\n\n\t\t<div cv-if = \"!___header\">\n\n\t\t\t<input\n\t\t\t\ttype    = \"range\"\n\t\t\t\tmin     = \"0\"\n\t\t\t\tmax     = \"1024\"\n\t\t\t\tcv-bind = \"value\">\n\n\t\t</div>\n\n\t</div>\n\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/strings/Records.js", function(exports, require, module) {
"use strict";var _RecordSet2=require("../lib/RecordSet");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Records=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Records=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return a=c.call.apply(c,[this].concat(e)),_defineProperty(_assertThisInitialized(a),"length",1000001),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"fetch",value:function fetch(a){return"String #".concat(a,"!")}}]),b}(_RecordSet2.RecordSet);exports.Records=Records;
});

;require.register("Experiments/InfiniteScroll/template.html", function(exports, require, module) {
module.exports = "<h2>Experimental Scrollers</h2>\n\n<p>These scroll boxes automatically remove any DOM elements that are no longer visible to the user. This allows us to make large scrollable boxes without wasting large amounts of computing power on DOM calculations for records that may never become visible.</p>\n\n<div class = \"row wide line-up\">\n\n\t<div class = \"wide\">\n\t\t<h3>Simple Scroller</h3>\n\n\t\t<p>This scroller uses an array of <b>[[simpleRows|thousands]]</b> integers.</p>\n\t\t<p>Building large arrays can have significant overhead.</p>\n\n\t\t<button cv-on = \"click:increase(event)\">increase to 1,000,000</button>\n\n\t\t<div class = \"simple scroller\">\n\t\t\t[[arrayScroller]]\n\t\t</div>\n\n\t</div>\n\n\t<div class = \"wide\">\n\n\t\t<h3>String Scroller</h3>\n\n\t\t<p>This scroller uses a RecordSet  that returns <b>1,000,000</b> strings.</p>\n\t\t<p>This list was able to populate quickly because RecordSets defer loading.</p>\n\n\t\t<div class = \"string scroller\">\n\t\t\t[[stringScroller]]\n\t\t</div>\n\n\t</div>\n\n\t<div class = \"wide\">\n\n\t\t<h3>View Scroller</h3>\n\n\t\t<p>This scroller uses a RecordSet that returns <b>1,000,000</b> curvature View objects.</p>\n\t\t<p>There is a 250ms <b>simulated</b> load time on each row.</p>\n\n\t\t<div class = \"views scroller\">\n\t\t\t[[viewScroller]]\n\t\t</div>\n\n\t</div>\n\n</div>\n\n<h3>Table Scroller</h3>\n\n<p>This scroller uses flexbox, and a custom template to simulate a table. Its RecordSet returns <b>[[rows|thousands]]</b> plain objects.</p>\n\n<p>The number of records and row height can be altered on the fly as well, this is common to all Scrollers.</p>\n\n<p>Counting both the texboxes & sliders, there are 2,000,002 input fields avaiable below, each mapped to an object in memory.</p>\n\n<p><b>NOTE:</b> This is currently limited by the scroll-height limit of <u>33,554,400 pixels</u> imposed by webkit.</p>\n\n<div class = \"row wide\">\n\t<div class = \"row wide\">\n\t\t<label>\n\t\t\t<p>Rows:&nbsp;<input cv-bind = \"rows\" type = \"number\" min = \"0\" /></p>\n\t\t</label>\n\t</div>\n\t<div class = \"row wide\">\n\t\t<label>\n\t\t\t<p>\n\t\t\t\tRow Height [[rowHeight|leftPad]]px\n\t\t\t\t<input cv-bind = \"rowHeight\" type = \"range\" max = \"100\" />\n\t\t\t</p>\n\t\t</label>\n\t</div>\n</div>\n\n<div class = \"grid scroller\">\n\t[[gridScroller]]\n</div>\n\n<div class = \"row wide\">\n\t<div class = \"row wide\">\n\t\tPosition: [[gridScroller.args.scrollTop]] / [[gridScroller.args.scrollMax]]\n\t</div>\n\t<div class = \"row wide\">\n\t\tSpeed: [[gridScroller.args.speed]] px/s\n\t</div>\n</div>\n\n"
});

;require.register("Experiments/InfiniteScroll/views/Records.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Records=void 0;var _RecordSet2=require("../lib/RecordSet"),_View=require("curvature/base/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Records=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return a=c.call.apply(c,[this].concat(e)),_defineProperty(_assertThisInitialized(a),"length",1000001),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"fetch",value:function fetch(a){var b=_View.View.from("<div class = \"contents\">\n\t\t\t\t<span cv-if = \"ready\" class = \"contents\">\n\t\t\t\t\t<i>#[[k]]</i>\n\t\t\t\t\t<div class = \"input\">\n\t\t\t\t\t\t<input placeholder = \"type here\" cv-bind = \"val\">\n\t\t\t\t\t\t<div>[[val]]</div>\n\t\t\t\t\t</div>\n\t\t\t\t</span>\n\t\t\t\t<span cv-if = \"!ready\">\n\t\t\t\t\tloading...\n\t\t\t\t</span>\n\t\t\t</div>",{k:a});return setTimeout(function(){return b.args.ready=!0},250),b}}]),b}(_RecordSet2.RecordSet);exports.Records=Records;
});

;require.register("Experiments/Php/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_PhpEditor=require("../../Editor/PhpEditor");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b),a=c.call(this),a.template=require("./template");var d=a.args.editor=new _PhpEditor.PhpEditor;return d.args.tabs.php={title:"php",file:"HelloWorld.php",body:require("./phpinfo.php"),mode:"ace/mode/php"},a.onNextFrame(function(){return d.refreshCode()}),a}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.View=View;
});

;require.register("Experiments/Php/phpinfo.php", function(exports, require, module) {
module.exports = "<?php\n\nphpinfo();\n"
});

;require.register("Experiments/Php/template.html", function(exports, require, module) {
module.exports = "<h2>Basic PHP Integration</h2>\n\nPHP is running in-browser here. Open your dev tools and watch your network tab to verify that no server communication is happening here.\n\n[[editor]]\n"
});

;require.register("FormsDemo/FormEditor.js", function(exports, require, module) {
"use strict";var _View=require("../Editor/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.FormEditor=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var FormEditor=/*#__PURE__*/function(a){function b(a){var d;_classCallCheck(this,b),d=c.call(this,a),d.args.subframe=!1,d.messageQueue=[],d.args.resultTabs.output={title:"json",file:"Result JSON",body:"{}",mode:"ace/mode/javascript",readonly:!0};var e=function(a){return d.onMessage(a)};return window.addEventListener("message",e),d.onRemove(function(){return window.removeEventListener("message",e)}),d}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"frameLoaded",value:function frameLoaded(a){for(this.args.subframe=a.target.contentWindow.frames[0];a=this.messageQueue.shift();)this.onMessage(a)}},{key:"onMessage",value:function onMessage(a){return this.args.subframe?void(a.source===this.args.subframe&&(this.args.resultTabs.output.body=a.data+"\n"||"")):void this.messageQueue.push(a)}}]),b}(_View.View);exports.FormEditor=FormEditor;
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
"use strict";var _Form=require("curvature/form/Form");Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_FormEditor=require("./FormEditor"),ace=_interopRequireWildcard(require("brace"));require("brace/mode/html"),require("brace/mode/javascript"),require("brace/theme/monokai");function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var a=new WeakMap;return _getRequireWildcardCache=function(){return a},a}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;if(null===a||"object"!==_typeof(a)&&"function"!=typeof a)return{default:a};var b=_getRequireWildcardCache();if(b&&b.has(a))return b.get(a);var c={},d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var e in a)if(Object.prototype.hasOwnProperty.call(a,e)){var f=d?Object.getOwnPropertyDescriptor(a,e):null;f&&(f.get||f.set)?Object.defineProperty(c,e,f):c[e]=a[e]}return c["default"]=a,b&&b.set(a,c),c}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b),a=c.call(this),a.template=require("./template");var d=a.args.basic=new _FormEditor.FormEditor;d.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Basic.jss"),mode:"ace/mode/javascript"},d.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},d.refreshCode();var e=a.args.group=new _FormEditor.FormEditor;e.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Groups.jss"),mode:"ace/mode/javascript"},e.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},e.refreshCode();var f=a.args.textField=new _FormEditor.FormEditor;f.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/TextField.jss"),mode:"ace/mode/javascript"},f.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},f.refreshCode();var g=a.args.textareaField=new _FormEditor.FormEditor;g.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/TextAreaField.jss"),mode:"ace/mode/javascript"},g.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},g.refreshCode();var h=a.args.fileField=new _FormEditor.FormEditor;h.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/FileField.jss"),mode:"ace/mode/javascript"},h.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},h.refreshCode();var i=a.args.submitField=new _FormEditor.FormEditor;i.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/SubmitField.jss"),mode:"ace/mode/javascript"},i.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},i.refreshCode();var j=a.args.buttonField=new _FormEditor.FormEditor;j.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/ButtonField.jss"),mode:"ace/mode/javascript"},j.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},j.refreshCode();var k=a.args.checkboxField=new _FormEditor.FormEditor;k.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Checkbox.jss"),mode:"ace/mode/javascript"},k.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},k.refreshCode();var l=a.args.selectField=new _FormEditor.FormEditor;l.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/SelectField.jss"),mode:"ace/mode/javascript"},l.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},l.refreshCode();var m=a.args.radioField=new _FormEditor.FormEditor;m.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/RadioField.jss"),mode:"ace/mode/javascript"},m.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Form.html"),mode:"ace/mode/html"},m.refreshCode();var n=a.args.hiddenField=new _FormEditor.FormEditor;n.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/HiddenField.jss"),mode:"ace/mode/javascript"},n.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/HiddenField.html"),mode:"ace/mode/html"},n.refreshCode();var o=a.args.htmlField=new _FormEditor.FormEditor;o.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/HtmlField.jss"),mode:"ace/mode/javascript"},o.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/HtmlForm.html"),mode:"ace/mode/html"},o.refreshCode();var p=a.args.html5Fields=new _FormEditor.FormEditor;return p.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Html5.jss"),mode:"ace/mode/javascript"},p.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Html5Form.html"),mode:"ace/mode/html"},p.refreshCode(),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"postRender",value:function postRender(){}},{key:"toJson",value:function toJson(a){return JSON.stringify(a,null,2)}}]),b}(_View.View);exports.View=View;
});

;require.register("FormsDemo/template.html", function(exports, require, module) {
module.exports = "<h2>forms</h2>\n\n<p>Forms can be generated by passing an object describing the desired fields & properties. Keys prefixed with \"_\" will affect the form itself rather than generating fields. Other keys will map to fields.</p>\n\n<ul>\n\t<li><b>_method</b> - The \"method\" attribute of the form element.</li>\n\t<li><b>_action</b> - The \"action\" attribute of the form element.</li>\n</ul>\n\n<p>Fields are object with 0 or more of the following keys</p>\n\n<ul>\n\t<li><b>name</b> - Field name attribute (key will be used if not provided.)</li>\n\t<li><b>title</b> - Field title (key will be used if not provided.)</li>\n\t<li><b>type</b> - Field Type</li>\n\t<li><b>attrs</b> - Additional attributes for field tag (k/v object)</li>\n</ul>\n\n<p><i>Note: form submisions are disabled in the editor</i></p>\n\n[[basic]]\n\n<h3>Field Groupings</h3>\n\n<p>Fields may be grouped with the <b>fieldset</b> field type.</p>\n\n<p>Fieldset definitions may have the following keys in additions to the standard keys:</p>\n\n<ul>\n\t<li><b>children</b> - Array or object listing child field.</li>\n\t<li><b>array</b> - Boolean determining if field names should cascade.</li>\n</ul>\n\n<p>Array field names will appear normal in output JSON but will have their name attributs in the form fieldset[fieldname]. Nested fieldsets can cascade this property to produce names like fieldset[subset][fieldname].</p>\n\n[[group]]\n\n<h3>Traditional Field Types</h3>\n\n<h4>Text Field</h4>\n\n[[textField]]\n\n<h4>Textarea</h4>\n\n[[textareaField]]\n\n<h4>File Field</h4>\n\n[[fileField]]\n\n\n<h4>Submit</h4>\n\n[[submitField]]\n\n<h4>Button</h4>\n\n[[buttonField]]\n\n<h4>Checkbox Field</h4>\n\n[[checkboxField]]\n\n<h4>Select Field</h4>\n\n[[selectField]]\n\n<h4>Radio Button Field</h4>\n\n[[radioField]]\n\n<h4>Hidden Field</h4>\n\nHidden fields have no user-visible representation. Not even the title will render, but the field will be present.\n\n[[hiddenField]]\n\n<h4>HTML Field</h4>\n\n[[htmlField]]\n\n<h3>HTML5 Input Types</h3>\n\nIf the input type is not recognized, it will be passed through and treated like any other input. It is up to the browser at that point to do any specialized rendering and/or validation.\n\n[[html5Fields]]\n\n<h3>Custom Fields</h3>\n\n<p>@TODO: Document the custom fields API.</p>\n"
});

;require.register("Home/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _Database=require("curvature/model/Database"),_View=require("curvature/base/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.View=View;
});

;require.register("Home/template.html", function(exports, require, module) {
module.exports = "<h2>curvature</h2>\n\n<p>curvature is a lightweight javascript framework with an emphasis on straightforwardness.</p>\n\n<h4>npm</h4>\n\n<p>the recommended way to get curvature is via <a cv-link = \"https://github.com/seanmorris/curvature-2\">npm</a>:</p>\n\n<pre>$ npm i curvature</pre>\n\n<br />\n\n<h4>cdn</h4>\n\n<p>curvature is also available from unpkg:</p>\n\n<p><a cv-link = \"https://unpkg.com/curvature@0.0.66/dist/curvature.min.js\">minified:</a></p>\n<pre>&lt;script src = \"https://unpkg.com/curvature@0.0.66/dist/curvature.min.js\"&gt;&lt;/script&gt;</pre>\n\n<p><a cv-link = \"https://unpkg.com/curvature@0.0.66/dist/curvature.js\">uncompressed:</a></p>\n<pre>&lt;script src = \"https://unpkg.com/curvature@0.0.66/dist/curvature.js\"&gt;&lt;/script&gt;</pre>\n\n<br />\n\n<h4>source</h4>\n\n<p>the curvature source code is available on github:</p>\n\n<pre>$ git clone https://github.com/seanmorris/curvature-2</pre>\n\n<a cv-link = \"https://github.com/seanmorris/curvature-2\">curvature source</a>\n\n<br />\n\n<h4>demo source</h4>\n\n<p>the demo source code is also on github:</p>\n\n<pre>$ git clone https://github.com/seanmorris/cv2-demo</pre>\n\n<a cv-link = \"https://github.com/seanmorris/cv2-demo\">demo source</a>\n\n<br />\n"
});

;require.register("Layout/View.js", function(exports, require, module) {
"use strict";var _View=require("curvature/base/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.View=View;
});

;require.register("Layout/template.html", function(exports, require, module) {
module.exports = "<div class = \"header\">\n\t<div class = \"title\">\n\t\t<h1><a cv-link = \"/\">curvature</a></h1>\n\t</div>\n\t<div class = \"menu\">\n\t\t<ul>\n\t\t\t<li><a href = \"/about-sean\">sean morris</a></li>\n\t\t\t<li><a href = \"/github\">source</a></li>\n\t\t\t<li><a href = \"/npm\">npm</a></li>\n\t\t\t<li><a href = \"/github\">license</a></li>\n\t\t</ul>\n\t</div>\n</div>\n<div class = \"layout\">\n\t<div class = \"navigation\">\n\t\t<ul>\n\t\t\t<li>navigation\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/\">home</a></li>\n\t\t\t\t\t<li><a cv-link = \"/about-sean\">about the dev</a></li>\n\t\t\t\t\t<li><a cv-link = \"/license\">license</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>base system\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/views\">views</a></li>\n\t\t\t\t\t<li><a cv-link = \"/config\">config</a></li>\n\t\t\t\t\t<li><a cv-link = \"/routes\">routes</a></li>\n\t\t\t\t\t<li><a cv-link = \"/mixins\">mixins</a></li>\n\t\t\t\t\t<li><a cv-link = \"/rules\">rules</a></li>\n\t\t\t\t\t<li><a cv-link = \"/cookies\">cookies</a></li>\n\t\t\t\t\t<li><a cv-link = \"/themes\">themes</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>forms\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/forms\">forms</a></li>\n\t\t\t\t\t<li><a cv-link = \"/forms\">fields</a></li>\n\t\t\t\t\t<li><a cv-link = \"/forms\">extending</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>input\n\t\t\t\t<ul>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/keyboard\">keyboard</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/mouse\">mouse</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/gamepad\">gamepad</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>data\n\t\t\t\t<ul>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/models\">models</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/database\">database</a></li>\n\t\t\t\t\t<li cv-link = \"/models\"><a cv-link = \"/record-set\">record source</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>extras\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/cv-markdown\">cv2-markdown</a></li>\n\t\t\t\t\t<li><a cv-link = \"/cv-markdown\">cv2-documentor</a></li>\n\t\t\t\t\t<!-- <li><a cv-link = \"/cv-markdown\">cv3-inject</a></li> -->\n\t\t\t\t\t<!-- <li><a cv-link = \"/cv-markdown\">cv-stringtools</a></li> -->\n\t\t\t\t</ul>\n\t\t\t</li>\n\n<!-- \t\t\t<li>binding:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/scalars\">Scalars</a></li>\n\t\t\t\t\t<li><a cv-link = \"/arrays\">Arrays</a></li>\n\t\t\t\t\t<li><a cv-link = \"/objects\">Objects</a></li>\n\t\t\t\t\t<li><a cv-link = \"/chains\">Chain Binding</a></li>\n\t\t\t\t</ul>\n\t\t\t</li> -->\n\n\t\t\t<li>experiments:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/infinite-scroll\">scrollers</a></li>\n\t\t\t\t\t<li><a cv-link = \"/html-editor\">html editor</a></li>\n\t\t\t\t\t<li><a cv-link = \"/grid-resizer\">grid resizer</a></li>\n\t\t\t\t\t<li><a cv-link = \"/php\">php (really)</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>projects:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/nynex95\">nynex 95</a></li>\n\t\t\t\t\t<li><a cv-link = \"/eventi\">eventi</a></li>\n\t\t\t\t\t<li><a cv-link = \"/subspace\">tigl-2d</a></li>\n\t\t\t\t\t<li><a cv-link = \"/subspace\">subspace</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t</ul>\n\t</div>\n\n\t<div class = \"col full\">\n\n\t\t<div class = \"row full\">\n\t\t\t<div class = \"content\">[[content]]</div>\n\t\t\t<!-- <div class = \"right-bar\"></div> -->\n\t\t</div>\n\n\t\t<div class = \"footer\">\n\t\t\t<span>&copy 2019 - 2020 Sean Morris.</span>\n\t\t</div>\n\n\t</div>\n\n</div>\n"
});

;require.register("ModelsDemo/ModelScroller.js", function(exports, require, module) {
"use strict";var _InfiniteScroller2=require("../Experiments/InfiniteScroll/lib/InfiniteScroller");Object.defineProperty(exports,"__esModule",{value:!0}),exports.ModelScroller=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ModelScroller=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./scroller"),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"toJson",value:function toJson(a){return console.log(a),JSON.stringify(a)}}]),b}(_InfiniteScroller2.InfiniteScroller);exports.ModelScroller=ModelScroller;
});

;require.register("ModelsDemo/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _Model=require("curvature/model/Model"),_Database2=require("curvature/model/Database"),_Tag=require("curvature/base/Tag"),_View=require("curvature/base/View"),_InfiniteScroller=require("../Experiments/InfiniteScroll/lib/InfiniteScroller"),_ModelScroller=require("./ModelScroller"),_codemirror=_interopRequireDefault(require("codemirror"));require("codemirror/mode/javascript/javascript");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ExampleDatabase=/*#__PURE__*/function(a){function b(){return _classCallCheck(this,b),c.apply(this,arguments)}_inherits(b,a);var c=_createSuper(b);return _createClass(b,null,[{key:"_version_1",value:function _version_1(a){var b=a.createObjectStore("models-store",{keyPath:"id"});b.createIndex("id","id",{unique:!1}),b.createIndex("class","class",{unique:!1})}}]),b}(_Database2.Database),View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a.args.newClass="Mock",a.args.newId=1,a.args.models=[],a.modelCount=0,a.args.content=_toConsumableArray(Array(100)).map(function(a,b){return b+1}),a.args.resultScroller=new _ModelScroller.ModelScroller({rowHeight:33}),a.db=new Promise(function(a){ExampleDatabase.open("models-db",1).then(function(b){a(b)})}),ExampleDatabase.open("models-db",1).then(function(b){var c,d="models-store",e={store:d,index:"id",type:_Model.Model};a.args.stores=b.listStores(),a.args.queryStore=null!==(c=a.args.stores[0])&&void 0!==c?c:null,Promise.all(Array(500).fill().map(function(a,c){var f=1+c,g=Object.assign({},e,{range:f});return b.select(g).one().then(function(a){var c=a.record,e=a.index;if(!c)return b.insert(d,_Model.Model.from({id:f,class:"Mock"}))})}))}),a.args.bindTo("queryStore",function(b){b&&ExampleDatabase.open("models-db",1).then(function(c){a.args.queryIndexes=c.listIndexes(b)})}),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"postRender",value:function postRender(){var a=new _Tag.Tag("<textarea>"),b=(0,_codemirror["default"])(a,{theme:"elegant",autoRefresh:!0,mode:"javascript"});b.setValue("// sample code to test out CodeMirror\n// as a replacement for ACE-editor\nfunction findSequence(goal) {\n  function find(start, history) {\n    if (start == goal)\n      return history;\n    else if (start > goal)\n      return null;\n    else\n      return find(start + 5, \"(\" + history + \" + 5)\") ||\n             find(start * 3, \"(\" + history + \" * 3)\");\n  }\n  return find(1, \"1\");\n}"),a.value=123,this.onNextFrame(function(){return b.refresh()}),this.args.editor=b.display.wrapper,this.listen(this,"focusin",function(a){return a.srcElement.select&&a.srcElement.select()})}},{key:"removeKey",value:function removeKey(a,b){["id","class"].includes(a)||delete this.args.models[b][a]}},{key:"addKey",value:function addKey(a,b,c){a.preventDefault(),this.args.models[c][b]=this.args.models[c][b]||""}},{key:"closeModel",value:function closeModel(a,b){this.args.models.splice(b,1)}},{key:"loadModel",value:function loadModel(){var a=this,b={store:"models-store",index:"id",range:+this.args.newId};this.db.then(function(c){c.select(b).one(function(b){a.args.models.push(_Model.Model.from(b))}).then(function(b){var c=b.index;0===c&&a.args.models.push(_Model.Model.from({id:+a.args.newId,class:a.args.newClass}))})})}},{key:"fieldAttached",value:function fieldAttached(a){a.target.matches("[data-property=id],[data-property=class]")&&a.target.setAttribute("disabled","disabled")}},{key:"queryDatabase",value:function queryDatabase(a){var b=this;a.preventDefault();var c={store:this.args.queryStore,index:this.args.queryIndex,limit:+this.args.queryLimit};""===this.args.queryLimit&&delete c.limit,c.range=this.args.queryValue,""===this.args.queryValue?delete c.range:!isNaN(c.range)&&c.range.length&&c.range==+c.range&&c.range.length===(+c.range+"").length&&(c.range=+c.range),ExampleDatabase.open("models-db",1).then(function(a){b.args.total=null;var d=b.args.resultScroller,e=[];a.select(c).each(function(a){return e.push(a)}).then(function(a){var c=a.index;b.args.total=c,d.args.content=e})})}},{key:"useDb",value:function useDb(a,b){this.args.queryStore=b}},{key:"showModelStores",value:function showModelStores(a,b){b.args.saving="saving"}},{key:"storeModel",value:function storeModel(a,b,c,d){var e={store:c,index:"id",range:b.id};ExampleDatabase.open("models-db",1).then(function(a){a.select(e).one(function(d){var e=Object.keys(b);Object.keys(d).map(function(a){e.includes(a)||delete d[a]}),a.update(c,Object.assign({},d,b))}).then(function(d){var e=d.index;0===e&&a.insert(c,b)})}),d.args.saving=""}}]),b}(_View.View);exports.View=View;
});

;require.register("ModelsDemo/scroller.html", function(exports, require, module) {
module.exports = "<div class = \"table\" cv-ref = \"list\">\n\n\t<div class = \"table-row\" cv-ref = \"row\">\n\n\t\t<div cv-each = \"row:val:key\">\n\t\t\t<div data-property = \"[[key]]\">[[key]]: <input cv-bind = \"val\"></div>\n\t\t</div>\n\n\t</div>\n\n</div>\n"
});

;require.register("ModelsDemo/template.html", function(exports, require, module) {
module.exports = "<div class=\"models-demo\">\n\n\t<h2>models</h2>\n\n\t<p>Models are simple objects, with some light tooling to make them simple to populate. They will also use the <b>class</b> and <b>id</b> properties to ensure that each model only gets a single reference. If you load the same model multiple times, the input fields should remain synced.</p>\n\n\t<div class = \"row wrap\">\n\n\t\t<div class = \"model-editor model-loader\">\n\n\t\t\t<div class = \"model-editor-title\">\n\t\t\t\t<span class = \"title\">Model Loader</span>\n\t\t\t\t<span class = \"buttons\">✕</span>\n\t\t\t</div>\n\n\t\t\t<div class = \"model-editor-eyebrow\">Load an instance of a record with the given ID and type. If no record is found, one will be created.</div>\n\n<pre>model = Model.from({\n<div class = \"property-edit\"><span>  id: </span><input type = \"number\" cv-bind = \"newId\" />,</div>\n<div class = \"property-edit\"><span>  class: </span><input cv-bind = \"newClass\" />,</div>});</pre>\n\t\t\t<div class = \"buttons\">\n\t\t\t\t<button cv-on = \"click:loadModel\">load</button>\n\t\t\t</div>\n\n\t\t</div>\n\t\t<div cv-each = \"models:model:m\" cv-ref = \"models\" class = \"contents\">\n\t\t\t<div class = \"model-editor [[saving]]\">\n\n\t\t\t\t<div class = \"model-editor-title\">\n\t\t\t\t\t<span class = \"title\">Model Editor</span>\n\t\t\t\t\t<span class = \"buttons\">\n\t\t\t\t\t\t<span tabindex=\"-1\" cv-on = \"click:closeModel(event, m)\">✕</span>\n\t\t\t\t\t</span>\n\t\t\t\t</div>\n\n\t\t\t\t<div class = \"model-editor-eyebrow\">When you modify the properties below, the in-memory values will be updated as you type.</div>\n\n\t\t\t\t<div class = \"model-editor-body\">\n\n\t\t\t\t\t<div cv-each = \"stores:store:s\" class = \"database-store-selector\">\n\t\t\t\t\t\t<div cv-on = \"click:storeModel(event, model, store, $parent)\">[[store]]</div>\n\t\t\t\t\t</div>\n\n<pre><span class = \"firstline row\">model = { <img src = \"/save.svg\" cv-on = \"click:showModelStores(event, $subview)\" data-icon tabindex=\"-1\"></span>\n<div cv-each = \"model:value:property\"><div class = \"property-edit\"><span class = \"prop-remove remove-[[property]]\" cv-on = \"click:removeKey(property, m);\">  ✕ </span> [[property]]: <input data-property = \"[[property]]\" cv-bind = \"value\" cv-on = \"cvDomAttached:fieldAttached(event)\" />,\n</div></div>};</pre>\n\n\t\t\t\t\t<div class = \"model-editor-text\">Add a new key:</div>\n\n\t\t\t\t\t<div class = \"new-property\">\n\t\t\t\t\t\t<form class = \"contents\" cv-on = \"submit:addKey(event, newField, m)\">\n\t\t\t\t\t\t\t<input cv-bind = \"newField\" placeholder=\"new property\">\n\t\t\t\t\t\t\t<button cv-on = \"click:addKey(event, newField, m)\" class = \"tight\">+</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n\n\t<h3>querying databases</h3>\n\n\t<p>Under the hood, the system uses the browser's IndexedDb system for local persistence.</p>\n\n\t<div class = \"databases\">\n\n\t\t<div class = \"database-editor\">\n\t\t\t<div class = \"model-editor-title\">\n\t\t\t\tDatabase Explorer\n\t\t\t</div>\n\t\t\t<div class = \"database-editor-body\">\n\t\t\t\t<div class = \"database-store-list\">\n\t\t\t\t\t<div class = \"model-editor-eyebrow\">\n\t\t\t\t\t\t<ul cv-each = \"stores:store:s\">\n\t\t\t\t\t\t\t<li cv-on = \"click:useDb(event, store);\">[[store]]</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class = \"database-editor-right\">\n\t\t\t\t\t<form cv-on = \"submit:queryDatabase(event)\">\n\t\t\t\t\t\t<label>index: <select cv-bind = \"queryIndex\" cv-each = \"queryIndexes:index:i\">\n\t\t\t\t\t\t\t<option value=\"[[index]]\">[[index]]</option>\n\t\t\t\t\t\t</select></label>\n\t\t\t\t\t\t<label>value: <input cv-bind = \"queryValue\" /></label>\n\t\t\t\t\t\t<label>limit: <input type = \"number\" cv-bind = \"queryLimit\" /></label>\n\t\t\t\t\t\t<input type = \"hidden\" readonly=\"readonly\" cv-bind = \"queryStore\" />\n\t\t\t\t\t\t<label class = \"buttons\">\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span cv-if = \"?total\"> [[total]] record returned. </span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<button>query</button>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</form>\n\t\t\t\t\t<div class = \"tight model-scroller scroller\">\n\t\t\t\t\t\t[[resultScroller]]\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t</div>\n\n\t<h3>events, workers & sync</h3>\n\n\t<!-- [[editor]] -->\n\n</div>\n"
});

;require.register("ObjectDemo/View.js", function(exports, require, module) {
"use strict";var _View=require("curvature/base/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a.z=0,a.args.obj={a:1,b:2,c:3},a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"setKey",value:function setKey(a,b){this.args.obj[a]=b}},{key:"delKey",value:function delKey(a){delete this.args.obj[a]}}]),b}(_View.View);exports.View=View;
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
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Routes=void 0;var _View=require("curvature/base/View"),_View2=require("Home/View"),_View3=require("ViewDemo/View"),_View4=require("FormsDemo/View"),_View5=require("ThemeDemo/View"),_View6=require("ConfigDemo/View"),_View7=require("CookieDemo/View"),_View8=require("RulesDemo/View"),_View9=require("ScalarDemo/View"),_View10=require("ChainDemo/View"),_View11=require("ArrayDemo/View"),_View12=require("ObjectDemo/View"),_View13=require("ModelsDemo/View"),_View14=require("Experiments/InfiniteScroll/View"),_View15=require("Experiments/HtmlEditor/View"),_View16=require("Experiments/GridResizer/View"),_View17=require("Experiments/Php/View");function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Routes=_defineProperty({"":function _(){return new _View2.View},"about-sean":function aboutSean(){return _View.View.from(require("pages/about.html"))},github:function github(){return _View.View.from(require("pages/github.html"))},views:function views(){return new _View3.View},forms:function forms(){return new _View4.View},config:function config(){return new _View6.View},cookies:function cookies(){return new _View7.View},rules:function rules(){return new _View8.View},themes:function themes(){return new _View5.View},scalars:function scalars(){return new _View9.View},chains:function chains(){return new _View10.View},arrays:function arrays(){return new _View11.View},objects:function objects(){return new _View12.View},models:function models(){return new _View13.View},php:function php(){return new _View17.View},"infinite-scroll":function infiniteScroll(){return new _View14.View},"html-editor":function htmlEditor(){return new _View15.View},"grid-resizer":function gridResizer(){return new _View16.View}},!1,function _false(){return _View.View.from(require("pages/404.html"))});exports.Routes=Routes;
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
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_View2=require("../Editor/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b),a=c.call(this),a.template=require("./template");var d=new _View2.View;d.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Static.jss"),mode:"ace/mode/javascript"},d.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Static.html"),mode:"ace/mode/html"},d.refreshCode(),a.args.globalRules=d;var e=new _View2.View;e.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/BasicRule.jss"),mode:"ace/mode/javascript"},e.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/BasicRule.html"),mode:"ace/mode/html"},e.refreshCode(),a.args.basic=e;var f=new _View2.View;f.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Preproc.jss"),mode:"ace/mode/javascript"},f.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Preproc.html"),mode:"ace/mode/html"},f.refreshCode(),a.args.preproc=f;var g=new _View2.View;g.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Mapper.jss"),mode:"ace/mode/javascript"},g.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Mapper.html"),mode:"ace/mode/html"},g.refreshCode(),a.args.mapper=g;var h=new _View2.View;return h.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/ViewMapper.jss"),mode:"ace/mode/javascript"},h.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/ViewMapper.html"),mode:"ace/mode/html"},h.refreshCode(),a.args.viewMapper=h,a}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.View=View;
});

;require.register("RulesDemo/template.html", function(exports, require, module) {
module.exports = "<h2>rules</h2>\n\n<p>The most basic rules simply map CSS selectors to callbacks. Whenever a tag matching a rule is encountered, the callback is applied.</p>\n\n<p>Every View comes with a RuleSet, so you can add Rules by calling <code>this.ruleSet.add</code>.</p>\n\n[[basic]]\n\n<h3>Global Rules</h3>\n\n<p>The <code>RuleSet.add</code> method may be called statically to add global rules.</p>\n\n[[globalRules]]\n\n<h3>Preprocessing</h3>\n\n<p>If <code>this.preRuleSet.add</code> is used rather than <code>this.ruleSet.add</code>, the rules will be appled BEFORE the template is processed, rather than after.</p>\n\n<p>This allows the use of cv-* attributes.</p>\n\n[[preproc]]\n\n<h3>Mapping tags to tags</h3>\n\n<p>If the callback returns an HTMLElement, the original tag will be replaced.</p>\n\n[[mapper]]\n\n<h3>Mapping tags to views</h3>\n\n<p>View classes, or instances of them may both be passed instead of a callback. In this case, the view will be rendered <b>inside</b> the existing tag.</p>\n\n[[viewMapper]]\n\n<!-- <h3>The RuleSet class <i>per se</i></h3> -->\n"
});

;require.register("ScalarDemo/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_View2=require("../ArrayDemo/View"),_View3=require("../ObjectDemo/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template=require("./template"),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"clear",value:function clear(a){this.args[a]=""}}]),b}(_View.View);exports.View=View;
});

;require.register("ScalarDemo/template.html", function(exports, require, module) {
module.exports = "<h2>Scalar Binding Demo</h2>\n\n<p>\n\ta:\n\t<input cv-bind = \"a\">\n\t<button cv-on = \"click:clear('a')\">x</button> : \"[[a]]\"\n</p>\n\n<p>\n\tb:\n\t<input cv-bind = \"b\">\n\t<button cv-on = \"click:clear('b')\">x</button> : \"[[b]]\"\n</p>\n\n<p>\n\tc:\n\t<input cv-bind = \"c\">\n\t<button cv-on = \"click:clear('c')\">x</button> : \"[[c]]\"\n</p>\n"
});

;require.register("ThemeDemo/Theme.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Theme=void 0;function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _createForOfIteratorHelper(a){if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(a=_unsupportedIterableToArray(a))){var b=0,c=function(){};return{s:c,n:function n(){return b>=a.length?{done:!0}:{done:!1,value:a[b++]}},e:function e(a){throw a},f:c}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var d,e,f=!0,g=!1;return{s:function s(){d=a[Symbol.iterator]()},n:function n(){var a=d.next();return f=a.done,a},e:function e(a){g=!0,e=a},f:function f(){try{f||null==d["return"]||d["return"]()}finally{if(g)throw e}}}}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var ThemeList=/*#__PURE__*/function(){function a(b){var c;_classCallCheck(this,a),_defineProperty(this,"themes",[]),(c=this.themes).push.apply(c,_toConsumableArray(b))}return _createClass(a,[{key:"getTemplate",value:function getTemplate(a){for(var b in this.themes){var c=this.themes[b].getTemplate(a);if(c)return c}}},{key:"getView",value:function getView(a){for(var b in this.themes){var c=this.themes[b].getView(a);if(c)return c}}}]),a}(),Theme=/*#__PURE__*/function(){function a(b){_classCallCheck(this,a),this.key=b,this.viewMap=new Map,this.templateMap=new Map,this.fallbacks=[]}return _createClass(a,null,[{key:"get",value:function get(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];if(1>=b.length){var e=(b[0]||"")+"";return this.instances[e]||(this.instances[e]=new this(e)),this.instances[e]}var d=[];for(var f in b)d.push(this.get(b[f]));return new ThemeList(d)}}]),_createClass(a,[{key:"setFallback",value:function setFallback(){var a;return(a=this.fallbacks).push.apply(a,arguments),this}},{key:"setView",value:function setView(a,b){return this.viewMap.set(a,b),this}},{key:"getView",value:function getView(a){var b=this.resolve(a,"viewMap");if(!b)return null;var c=new b(a);return c}},{key:"setTemplate",value:function setTemplate(a,b){return this.templateMap.set(a,b),this}},{key:"getTemplate",value:function getTemplate(a){return this.resolve(a,"templateMap")}},{key:"resolve",value:function resolve(a,b){a.___object___&&a.isBound&&(a=a.___object___);var c=a.__proto__.constructor,d=this[b];if(d.has(c,a))return d.get(c);var e,f=null,g=_createForOfIteratorHelper(d);try{for(g.s();!(e=g.n()).done;){var h=_slicedToArray(e.value,2),i=h[0],j=h[1];a instanceof i&&(f=j)}}catch(a){g.e(a)}finally{g.f()}if(!f){var k,l=_createForOfIteratorHelper(this.fallbacks);try{for(l.s();!(k=l.n()).done;){var m=k.value;if(f=m.resolve(a,b))return f}}catch(a){l.e(a)}finally{l.f()}}return f&&d.set(c,f),f}}]),a}();exports.Theme=Theme,_defineProperty(Theme,"instances",{});
});

;require.register("ThemeDemo/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _Theme=require("./Theme"),_View=require("curvature/base/View"),_XyzTheme=require("./themes/XyzTheme"),_TypeX=require("./types/TypeX"),_TypeY=require("./types/TypeY"),_TypeZ=require("./types/TypeZ"),_TypeZAlpha=require("./types/TypeZAlpha"),_ViewZAlpha=require("./views/ViewZAlpha"),_Config=require("curvature/base/Config");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var View=/*#__PURE__*/function(a){function b(a){var d;_classCallCheck(this,b),d=c.call(this,a),d.template=require("./template");var e=_XyzTheme.XyzTheme;console.log(e);var f=_Theme.Theme.get("alpha");f.setTemplate(_ViewZAlpha.ViewZAlpha,require("./views/templateZAlpha")).setFallback(_Theme.Theme.get()).setView(_TypeZAlpha.TypeZAlpha,_ViewZAlpha.ViewZAlpha);var g=new _TypeX.TypeX(_assertThisInitialized(d)),h=new _TypeY.TypeY(_assertThisInitialized(d)),i=new _TypeZ.TypeZ(_assertThisInitialized(d)),j=new _TypeZAlpha.TypeZAlpha(_assertThisInitialized(d));return d.args.views=[g,h,i,j].map(function(a){var b=f.getView(a);return b}),d}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.View=View;
});

;require.register("ThemeDemo/template.html", function(exports, require, module) {
module.exports = "<h2>theme</h2>\n\n<div cv-each = \"views:view:v\">[[view]]</div>\n"
});

;require.register("ThemeDemo/themes/XyzTheme.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.XyzTheme=void 0;var _Theme=require("../Theme"),_View=require("curvature/base/View"),_TypeX=require("../types/TypeX"),_TypeY=require("../types/TypeY"),_TypeZ=require("../types/TypeZ"),_ViewX=require("../views/ViewX"),_ViewY=require("../views/ViewY"),_ViewZ=require("../views/ViewZ"),_TypeZAlpha=require("../types/TypeZAlpha"),_ViewZAlpha=require("../views/ViewZAlpha");_Theme.Theme.get().setTemplate(_ViewX.ViewX,require("../views/templateX")).setTemplate(_ViewY.ViewY,require("../views/templateY")).setTemplate(_ViewZ.ViewZ,require("../views/templateZ")).setView(_TypeX.TypeX,_ViewX.ViewX).setView(_TypeY.TypeY,_ViewY.ViewY).setView(_TypeZ.TypeZ,_ViewZ.ViewZ);var XyzTheme=_Theme.Theme.get();exports.XyzTheme=XyzTheme;
});

require.register("ThemeDemo/types/TypeX.js", function(exports, require, module) {
"use strict";var _Bindable=require("curvature/base/Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.TypeX=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var TypeX=function a(b){_classCallCheck(this,a);var c=_Bindable.Bindable.makeBindable(this);this.type="X",this.value=1/Math.random(),this.interval=b.onInterval(100,function(){c.value="0x"+Math.floor(1e4*Math.random()).toString(16).padStart(4,0)})};exports.TypeX=TypeX;
});

;require.register("ThemeDemo/types/TypeY.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TypeY=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var TypeY=function a(){_classCallCheck(this,a),this.type="Y",this.value=1/Math.random()};exports.TypeY=TypeY;
});

;require.register("ThemeDemo/types/TypeZ.js", function(exports, require, module) {
"use strict";var _Bindable=require("curvature/base/Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.TypeZ=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var TypeZ=function a(b){_classCallCheck(this,a);var c=_Bindable.Bindable.makeBindable(this);return this.type="Z",this.value=0,this.interval=b.onInterval(250,function(){c.value++}),c};exports.TypeZ=TypeZ;
});

;require.register("ThemeDemo/types/TypeZAlpha.js", function(exports, require, module) {
"use strict";var _TypeZ2=require("./TypeZ");Object.defineProperty(exports,"__esModule",{value:!0}),exports.TypeZAlpha=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var TypeZAlpha=/*#__PURE__*/function(a){function b(a){var d;return _classCallCheck(this,b),d=c.call(this,a),d.type="Z\uD835\uDEFC",clearInterval(d.interval),d.interval=a.onInterval(20,function(){d.value++}),d}_inherits(b,a);var c=_createSuper(b);return b}(_TypeZ2.TypeZ);exports.TypeZAlpha=TypeZAlpha;
});

;require.register("ThemeDemo/views/ViewX.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ViewX=void 0;var _Config=require("curvature/base/Config"),_View=require("curvature/base/View"),_Theme=require("../Theme");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ViewX=/*#__PURE__*/function(a){function b(a){var d;_classCallCheck(this,b),d=c.call(this,a);var e=_Config.Config.get("theme")||"",f=_Theme.Theme.get(e// App config theme
,""// App default theme
,"app/cv2playground"// App specific theme
,"lib/curvature"// Library-specific theme
,"base"// Base theme
);return d.template=f.getTemplate(_assertThisInitialized(d)),d}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.ViewX=ViewX;
});

;require.register("ThemeDemo/views/ViewY.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ViewY=void 0;var _Theme=require("../Theme"),_Config=require("curvature/base/Config"),_View=require("curvature/base/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ViewY=/*#__PURE__*/function(a){function b(a){var d;_classCallCheck(this,b),d=c.call(this,a);var e=_Config.Config.get("theme")||"",f=_Theme.Theme.get(f);return d.template=f.getTemplate(_assertThisInitialized(d)),d}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.ViewY=ViewY;
});

;require.register("ThemeDemo/views/ViewZ.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ViewZ=void 0;var _Theme=require("../Theme"),_Config=require("curvature/base/Config"),_View=require("curvature/base/View");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ViewZ=/*#__PURE__*/function(a){function b(a){var d;_classCallCheck(this,b),d=c.call(this,a);var e=_Config.Config.get("theme")||"",f=_Theme.Theme.get(f);return d.args.vName="Z",d.template=f.getTemplate(_assertThisInitialized(d)),d}_inherits(b,a);var c=_createSuper(b);return b}(_View.View);exports.ViewZ=ViewZ;
});

;require.register("ThemeDemo/views/ViewZAlpha.js", function(exports, require, module) {
"use strict";var _ViewZ2=require("./ViewZ");Object.defineProperty(exports,"__esModule",{value:!0}),exports.ViewZAlpha=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ViewZAlpha=/*#__PURE__*/function(a){function b(a){var d;return _classCallCheck(this,b),d=c.call(this,a),d.args.vName="Z\uD835\uDEFC",d}_inherits(b,a);var c=_createSuper(b);return b}(_ViewZ2.ViewZ);exports.ViewZAlpha=ViewZAlpha;
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
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _View=require("curvature/base/View"),_View2=require("../ArrayDemo/View"),_View3=require("../ObjectDemo/View"),_View4=require("../Editor/View"),ace=_interopRequireWildcard(require("brace"));require("brace/mode/html"),require("brace/mode/php"),require("brace/mode/javascript"),require("brace/theme/monokai");function _getRequireWildcardCache(){if("function"!=typeof WeakMap)return null;var a=new WeakMap;return _getRequireWildcardCache=function(){return a},a}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;if(null===a||"object"!==_typeof(a)&&"function"!=typeof a)return{default:a};var b=_getRequireWildcardCache();if(b&&b.has(a))return b.get(a);var c={},d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var e in a)if(Object.prototype.hasOwnProperty.call(a,e)){var f=d?Object.getOwnPropertyDescriptor(a,e):null;f&&(f.get||f.set)?Object.defineProperty(c,e,f):c[e]=a[e]}return c["default"]=a,b&&b.set(a,c),c}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Module={onRuntimeInitialized:function onRuntimeInitialized(){console.log("WASM Loaded")}},View=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b),a=c.call(this),a.template=require("./template"),window.addEventListener("message",void 0),a.onRemove(function(){window.removeEventListener("message",f)});var d=a.args.editor=new _View4.View;d.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Scalar.jss"),mode:"ace/mode/javascript"},d.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Scalar.html"),mode:"ace/mode/html"},d.refreshCode();var e=a.args.editorTwoWay=new _View4.View;e.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/TwoWay.jss"),mode:"ace/mode/javascript"},e.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/TwoWay.html"),mode:"ace/mode/html"},e.refreshCode();var f=function(a){console.log(a)},g=a.args.editorReverse=new _View4.View;g.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Scalar.jss"),mode:"ace/mode/javascript"},g.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Reverse.html"),mode:"ace/mode/html"},g.refreshCode();var h=a.args.editorEscape=new _View4.View;h.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Scalar.jss"),mode:"ace/mode/javascript"},h.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Escape.html"),mode:"ace/mode/html"},h.refreshCode();var i=a.args.editorArray=new _View4.View;i.args.orientation="vertical",i.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Array.jss"),mode:"ace/mode/javascript"},i.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Array.html"),mode:"ace/mode/html"},i.refreshCode();var j=a.args.editorJson=new _View4.View;j.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Array.jss"),mode:"ace/mode/javascript"},j.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/ArrayJson.html"),mode:"ace/mode/html"},j.refreshCode();var k=a.args.editorReuse=new _View4.View;return k.args.tabs.js={title:"js",file:"DemoView.js",body:require("./Samples/Array.jss"),mode:"ace/mode/javascript"},k.args.tabs.html={title:"html",file:"template.html",body:require("./Samples/Reuse.html"),mode:"ace/mode/html"},k.refreshCode(),a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"addItalicTags",value:function addItalicTags(a){return"<i>".concat(a,"</i>")}},{key:"reverseString",value:function reverseString(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";return a.split("").reverse().join("")}},{key:"clear",value:function clear(a){this.args[a]=""}}]),b}(_View.View);exports.View=View;
});

;require.register("ViewDemo/template.html", function(exports, require, module) {
module.exports = "<h2>views</h2>\n<!--\n<h3>PHP</h3>\n\n[[editorPhp]]\n -->\n<h3>Scalar Binding</h3>\n\n<p>Scalars can be bound with double square brackets:</p>\n\n[[editor]]\n\n<h3>Two way binding, Events & Methods</h3>\n\n<p>Two way binding is also supported.</p>\n\n<p>Methods can be bound to events with cv-on.</p>\n\n[[editorTwoWay]]\n\n<h3>Transformations</h3>\n\n<p>Values can also be transformed with methods:</p>\n\n[[editorReverse]]\n\n<h3>Escaping</h3>\n\n<p>HTML is automatically escaped unless \"$\" is used:</p>\n\n[[editorEscape]]\n\n<h3>Arrays & Objects</h3>\n\n<p>Arrays and objects may be looped over with the cv-each attribute:</p>\n\n[[editorArray]]\n\n<h3>Methods</h3>\n\n<p>Values of any type may be transformed by methods:</p>\n\n[[editorJson]]\n\n<h3>Templates</h3>\n\n<p>Reusable templates can be created with the cv-template attribute.</p>\n\n<p>Templates may be reused within the same view with the cv-slot attribute.</p>\n\n[[editorReuse]]\n\n<h2>Lifecycle</h2>\n\n<h4>Construct</h3>\n<h4>On Render</h3>\n<h4>On Attachment</h3>\n<h4>On Detachment</h3>\n<h4>On Final Removal</h3>\n"
});

;require.register("initialize.js", function(exports, require, module) {
"use strict";var _Router=require("curvature/base/Router"),_RuleSet=require("curvature/base/RuleSet"),_View=require("./Layout/View");document.addEventListener("DOMContentLoaded",function(){var a=new _View.View;_RuleSet.RuleSet.add("body",a),_RuleSet.RuleSet.apply(),_Router.Router.listen(a)});
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