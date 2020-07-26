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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function Config() {
  _classCallCheck(this, Config);
};

exports.Config = Config;
Config.theme = 'alpha';
Config.title = 'cv-playground';
});

require.register("ConfigDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Config = require("curvature/base/Config");

var _Import = require("curvature/base/Import");

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
    var vendorJs = new _Import.Import('/vendor.js');
    vendorJs.attach();
    _this.args.theme = _Config.Config.get('theme');
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ConfigDemo/template.html", function(exports, require, module) {
module.exports = "Current theme: [[theme]]\n"
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
module.exports = "<!DOCTYPE HTML>\n<head>\n<style>[STYLE]</style>\n<script src = \"[ORIGIN]/vendor.js\"></script>\n<script>require.register('Config', (exports, require, module)=>{ return module.exports = {}});</script>\n\n<script>require.register('template', (exports, require, module)=>{ return module.exports = `[TEMPLATE]`});</script>\n\n<script src = \"[ORIGIN]/curvature.js\"></script>\n\n<script>\n\nwindow.addEventListener('submit', (event) => {\n\n\tconsole.log(event);\n\n\tconst error = event.message;\n\n\twindow.parent.parent.postMessage(\n\t\tJSON.stringify({'@error': error}, null, 2)\n\t, '*');\n\n}, false);\n\ndocument.addEventListener('DOMContentLoaded', () => {\n\n\t[SCRIPT]\n\n\tif(typeof DemoView !== 'undefined')\n\t{\n\t\tconst view = new DemoView;\n\n\t\tview.render(document.body);\n\t}\n\n\tconsole.debug()\n\n});\n\n</script>\n</head>\n<body>\n</body>\n"
});

;require.register("Editor/template.html", function(exports, require, module) {
module.exports = "<div class = \"editor-window [[expanded]]\" cv-on = \"mouseup:resizeEditor(event)\" data-orientation = \"[[orientation]]\" data-multiselect=\"[[multiselect]]\">\n\n\t<div class = \"row full tabs [[showClasses|joinClass]]\">\n\n\t\t<span cv-each = \"tabs:tab:t\" class = \"row dcontent\">\n\t\t\t<div class = \"tab [[tab.active]]\" cv-on = \"click:showTab(tab)\">[[tab.title]]</div>\n\t\t</span>\n\n\t\t<div class = \"tab [[showResult]]\" cv-on = \"click:showResult()\">result</div>\n\n\t\t<span cv-each = \"resultTabs:tab:t\" class = \"row dcontent\">\n\t\t\t<div class = \"tab [[tab.active]]\" cv-on = \"click:showTab(tab)\">[[tab.title]]</div>\n\t\t</span>\n\n\t\t<div class = \"tab [[showSplit]]\" cv-on = \"click:showTab()\">all</div>\n\n\t\t<span class = \"hint\">\n\t\t\t<div data-icon = \"check\"></div>\n\t\t\thold ctrl / ⌘ to select multiple tabs.\n\t\t</span>\n\n\t</div>\n\n\t<div class = \"row full editors [[showClasses|joinClass]]\">\n\n\t\t<p>Select a tab.</p>\n\n\t\t<span cv-each = \"tabs:tab:t\" class = \"dcontent\">\n\t\t\t<div cv-carry = \"t\" class = \"half\">\n\t\t\t\t<p>[[tab.file]]</p>\n\t\t\t\t<div class = \"box\"><div class = \"editor\" cv-ref = \"edit::t\"><textarea cv-bind = \"tab.body\"></textarea></div></div>\n\t\t\t</div>\n\t\t</span>\n\n\t\t<div class = \"half [[showResult]]\">\n\t\t\t<p>Result</p>\n\t\t\t<div class = \"result\">\n\t\t\t\t<iframe\n\t\t\t\t\tcv-ref = \"result\"\n\t\t\t\t\tcv-on  = \"load:frameLoaded(event)\"\n\t\t\t\t\tsrcdoc = '\n\t\t\t\t<meta http-equiv=\"Content-Security-Policy\" content=\"default-src [[location.origin]]/curvature.js ws://[[location.hostname]]:9485\n\t\t\t\t[[location.origin]]/vendor.js &apos;unsafe-inline&apos;;\">\n\t\t\t\t<style>\n\t\t\t\t\tiframe {\n\t\t\t\t\t\tposition: absolute;\n\t\t\t\t\t\ttop: 0px;\n\t\t\t\t\t\tleft: 0px;\n\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\theight: 100%;\n\t\t\t\t\t\tborder: none;\n\t\t\t\t\t}\n\t\t\t\t</style>\n\t\t\t\t<iframe\n\t\t\t\t\tsandbox = \"allow-scripts\"\n\t\t\t\t\tsrc     = \"about:blank\"\n\t\t\t\t\tsrcdoc  = \"[[frameSource|escapeQuotes]]\"\n\t\t\t\t></iframe>\n\t\t\t\t'></iframe>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<span cv-each = \"resultTabs:tab:t\" class = \"dcontent\">\n\t\t\t<div cv-carry = \"t\" class = \"half\">\n\t\t\t\t<p>[[tab.file]]</p>\n\t\t\t\t<div class = \"box\"><div class = \"editor\" cv-ref = \"edit::t\"><textarea cv-bind = \"tab.body\"></textarea></div></div>\n\t\t\t</div>\n\t\t</span>\n\n\t\t<div class = \"buttons\">\n\n\t\t\t<div cv-on = \"click:changeOrientation(event)\" class = \"button orientation\">\n\t\t\t\t<span class = \"label\">vert/horiz</span>\n\t\t\t\t<div data-icon = \"orientation\"></div>\n\t\t\t</div>\n\n\t\t\t<div cv-on = \"click:expand(event)\" class = \"button expand\">\n\t\t\t\t<span class = \"label\">expand/contract</span>\n\t\t\t\t<div data-icon = \"expand\"></div>\n\t\t\t</div>\n\n\t\t</div>\n\n\t</div>\n\n\t<div class = \"row full status\">\n\t\t<div class = \"[[editorRefresh]]\">\n\t\t\t<span>[[editorStatus]]</span>\n\t\t\t<button cv-on = \"click:refreshCode(event)\">⟳</button>\n\t\t</div>\n\t</div>\n\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/List.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = void 0;

var _View = require("curvature/base/View");

var _Row = require("./Row");

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

var List = /*#__PURE__*/function (_BaseView) {
  _inherits(List, _BaseView);

  var _super = _createSuper(List);

  function List() {
    var _this;

    _classCallCheck(this, List);

    _this = _super.call(this);
    _this.template = require('./list');
    _this.args.visible = [];
    _this.args.content = undefined;
    _this.first = null;
    _this.last = null;
    _this.args.max = 666;
    _this.changing = false;
    return _this;
  }

  _createClass(List, [{
    key: "attached",
    value: function attached() {
      var _this2 = this;

      this.container = this.findTag('div[data-tag="container"]');
      var container = this.container;
      var shim = document.createElement('div');
      shim.setAttribute('data-tag', 'shim');
      shim.setAttribute('style', "position: absolute;width: 1px;height: var(--shimHeight);pointer-events: none;opacity: 0;");
      container.append(shim);
      this.args.bindTo('rowHeight', function (v, k, t) {
        t[k] = parseInt(v);
        var rows = _this2.args.content.length;

        if (rows && _this2.args.rowHeight) {
          _this2.args.shimHeight = rows * _this2.args.rowHeight;
        }

        if (_this2.container) {
          _this2.updateViewport();
        }
      });
      this.contentDebind = this.args.bindTo('content', function (v, k, t) {
        var _v$length;

        var rows = (_v$length = v.length) !== null && _v$length !== void 0 ? _v$length : 0;

        if (_this2.args.rowHeight) {
          _this2.args.shimHeight = rows * _this2.args.rowHeight;
        }

        t[k] = v;

        _this2.updateViewport();
      });
      this.args.rowHeight = this.args.rowHeight || 32;
      this.onNextFrame(function () {
        return _this2.updateViewport();
      });
    }
  }, {
    key: "updateViewport",
    value: function updateViewport(event) {
      if (this.changing) {
        return;
      }

      var container = this.container;
      var open = container.scrollTop;
      var space = container.offsetHeight;
      var first = Math.floor(open / this.args.rowHeight);
      var last = Math.ceil((open + space) / this.args.rowHeight);

      if (first > this.args.content.length) {
        first = this.args.content.length - 1;
      }

      if (last > this.args.content.length) {
        last = this.args.content.length - 1;
      }

      this.setVisible(first, last);
    }
  }, {
    key: "setVisible",
    value: function setVisible(first, last) {
      var _this3 = this;

      if (this.changing) {
        return;
      }

      if (this.first === first && this.last === last) {
        return;
      }

      this.changing = true;
      var del = [];

      for (var i in this.args.visible) {
        var index = parseInt(i);
        var entry = this.args.visible[index];

        if (first === last && last === 0) {
          del.unshift(index);
          continue;
        }

        if (index < first || index > last) {
          del.unshift(index);
          continue;
        }

        if (entry && !entry.visible) {
          del.unshift(index);
          continue;
        }
      }

      for (var _i = 0, _del = del; _i < _del.length; _i++) {
        var d = _del[_i];
        this.args.visible[d].remove();
        delete this.args.visible[d];
      }

      var _loop = function _loop(_i2) {
        if (_this3.args.visible[_i2] && !_this3.args.visible[_i2].removed && _this3.args.visible[_i2].firstNode && _this3.args.visible[_i2].firstNode.getRootNode() === document) {
          return "continue";
        }

        if (_this3.args.content.length <= _i2) {
          return "continue";
        }

        var row = new _Row.Row(_this3.args.content[_i2], _i2, _this3);
        _this3.args.visible[_i2] = row;

        _this3.args.visible[_i2].args.bindTo('content', function (v) {
          _this3.args.content[_i2] = v;
        });
      };

      for (var _i2 = first; _i2 <= last; _i2++) {
        var _ret = _loop(_i2);

        if (_ret === "continue") continue;
      }

      ;
      this.first = first;
      this.last = last;
      this.changing = false;
    }
  }, {
    key: "leftPad",
    value: function leftPad(x) {
      return String(x).padStart(4, 0);
    }
  }]);

  return List;
}(_View.View);

exports.List = List;
});

;require.register("Experiments/InfiniteScroll/Row.js", function(exports, require, module) {
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

  function Row(content, index, container) {
    var _this;

    _classCallCheck(this, Row);

    _this = _super.call(this, {
      content: content,
      index: index
    });
    _this.container = container;
    _this.template = require('./row');
    _this.visible = true;
    _this.args.x = Math.random();
    _this.preserve = true;
    return _this;
  }

  _createClass(Row, [{
    key: "attached",
    value: function attached() {
      var _this2 = this;

      var containerTag = this.container.containerTag;
      var rowTag = this.findTag('div[data-tag="row"]');
      var observer = new IntersectionObserver(function (e, o) {
        return _this2.scrollObserved(e, o);
      }, {
        root: containerTag
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

;require.register("Experiments/InfiniteScroll/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _Row = require("./Row");

var _List = require("./List");

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
    _this.args.rows = 100000;
    _this.args.rowHeight = 32;
    var list = new _List.List();
    _this.args.list = list;

    _this.args.bindTo('rowHeight', function (v) {
      return list.args.rowHeight = v;
    });

    _this.args.bindTo('rows', function (v) {
      list.args.content = Array(parseInt(v) || 0).fill(0).map(function (v, k) {
        return (1 + k) * 10;
      });
    });

    return _this;
  }

  _createClass(View, [{
    key: "leftPad",
    value: function leftPad(x) {
      return String(x).padStart(4, 0);
    }
  }]);

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Experiments/InfiniteScroll/list.html", function(exports, require, module) {
module.exports = "<div data-tag = \"container\" class = \"infinite-scroll demo\" cv-on = \"scroll:updateViewport(event):p\" style = \"--rowHeight:[[rowHeight]]px;--shimHeight: [[shimHeight]]px; overflow-y: scroll; position: relative;\">\n\t<div cv-each  = \"visible:row:r\">\n\t\t[[row]]\n\t</div>\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/row.html", function(exports, require, module) {
module.exports = "<div\n\tdata-tag = \"row\"\n\tstyle = \"--index:[[index]]; top: calc(var(--rowHeight) * var(--index)); \theight: var(--rowHeight); position: absolute;\">\n\t<input cv-bind = \"content\" type = \"range\" min = \"0\" max = \"[[max]]\" />\n\t[[content]]\n</div>\n"
});

;require.register("Experiments/InfiniteScroll/template.html", function(exports, require, module) {
module.exports = "<label>\n\tRows: <input cv-bind = \"rows\" type = \"number\" min = \"0\"/>\n</label>\n<label>\n\tRow Height ([[rowHeight|leftPad]]):\n\t<input cv-bind = \"rowHeight\" type = \"range\" max = \"100\" />\n</label>\n\n[[list]]\n\n<!-- <div data-tag = \"container\" class = \"infinite-scroll demo\" cv-on = \"scroll:containerScrolled(event):p\" style = \"--rowHeight:[[rowHeight]]px;--shimHeight: [[shimHeight]]px; overflow-y: scroll; position: relative;\">\n\t<div cv-each  = \"visible:row:r\">\n\t\t[[row]]\n\t</div>\n</div>\n -->\n"
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
module.exports = "<style>label,input:not([type=\"radio\"]),select,textarea{display: block; margin: 0.5em;}</style>\n\n[[form]]\n"
});

;require.register("FormsDemo/Samples/Form.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst commentField = {\n\t\t\ttype: 'fieldset'\n\t\t\t, array: true\n\t\t\t, children: {\n\t\t\t\tid:        {type: 'number'}\n\t\t\t\t, content: {type: 'textarea'}\n\t\t\t}\n\t\t};\n\n\t\tconst formSkeleton = {\n\n\t\t\t_method: 'POST'\n\n\t\t\t, hidden: {type:'hidden', value: 'hidden value'}\n\n\t\t\t, id: {type:'number', value: 1000}\n\t\t\t, name: {}\n\n\t\t\t, access: {\n\t\t\t\ttype:    'radios'\n\t\t\t\t, options: {\n\n\t\t\t\t\t'private':  0\n\t\t\t\t\t, 'public': 1\n\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t, image: {type: 'file'}\n\n\t\t\t, type: {\n\t\t\t\ttype:    'select'\n\t\t\t\t, value: 300\n\t\t\t\t, options: {\n\n\t\t\t\t\t'-select-': null\n\t\t\t\t\t, 'image':  100\n\t\t\t\t\t, 'text':   200\n\t\t\t\t\t, 'video':  300\n\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t, comments: {\n\t\t\t\tname:   'comments'\n\t\t\t\t, type: 'fieldset'\n\t\t\t\t, array: true\n\t\t\t\t, children: [\n\n\t\t\t\t\tcommentField\n\t\t\t\t\t, commentField\n\n\t\t\t\t]\n\t\t\t}\n\n\t\t\t, submit: {\n\t\t\t\ttype: 'submit'\n\t\t\t}\n\t\t};\n\n\t\tconst form = new Form(formSkeleton);\n\n\t\tform.bindTo('json', v => {\n\t\t\tconst output = v;\n\n\t\t\tthis.args.output = output;\n\n\t\t\twindow.parent.parent.postMessage(output, 'http://localhost:3333');\n\t\t});\n\n\t\tthis.args.form = form;\n\t\tthis.args.formSkeleton = formSkeleton;\n\t}\n\n\ttoJson(input)\n\t{\n\t\treturn JSON.stringify(input, null, 2);\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/Groups.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst personField = {\n\t\t\ttype:    'fieldset'\n\t\t\t, title: 'Person'\n\t\t\t, array: true\n\t\t\t, children: {\n\t\t\t\tid: {type:'number'}\n\t\t\t\t, name:  {}\n\t\t\t}\n\t\t};\n\n\t\tconst peopleField = {\n\t\t\ttype:    'fieldset'\n\t\t\t, title: 'People'\n\t\t\t, array: true\n\t\t\t, children: [\n\t\t\t\tpersonField\n\t\t\t\t, personField\n\t\t\t\t, personField\n\t\t\t]\n\t\t};\n\n\t\tthis.args.form = new Form({\n\t\t\t_method:  'POST'\n\t\t\t, field:  peopleField\n\t\t\t, submit: {type: 'submit', value: 'submit'}\n\t\t});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/HiddenField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'Hidden field'\n\t\t\t, type:  'hidden'\n\t\t\t, value: 'You cant see me.'\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/HtmlField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst staticHtml = {\n\t\t\ttitle:   'Radio Field'\n\t\t\t, type:  'html'\n\t\t\t, value: '<li><b><u>This is static HTML</u></b></li>'\n\t\t};\n\n\t\tconst editableHtml = {\n\t\t\ttitle:   'Radio Field'\n\t\t\t, type:  'html'\n\t\t\t, value: '<li><b>These</b></li><li><b>Items</b></li><li><b>Are</b></li><li><b>Editable</b></li>'\n\t\t\t, attrs: { contenteditable: true }\n\t\t};\n\n\t\tthis.args.form = new Form({staticHtml, editableHtml});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/HtmlForm.html", function(exports, require, module) {
module.exports = "<style>label,input:not([type=\"radio\"]),select,textarea{display: block; margin: 0.5em;}</style>\n\n<ul>[[form]]</ul>\n"
});

;require.register("FormsDemo/Samples/RadioField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'Radio Field'\n\t\t\t, type:  'radios'\n\t\t\t, options: {\n\t\t\t\t'Red':     1\n\t\t\t\t, 'Blue':  2\n\t\t\t\t, 'Green': 3\n\t\t\t}\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
});

;require.register("FormsDemo/Samples/SelectField.jss", function(exports, require, module) {
module.exports = "const View = require('curvature/base/View').View;\nconst Form = require('curvature/form/Form').Form;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\n\t\tthis.template = require('template');\n\n\t\tconst field = {\n\t\t\ttitle:   'Select Field'\n\t\t\t, type:  'select'\n\t\t\t, options: {\n\t\t\t\t'Select One': null\n\t\t\t\t, 'Red':   1\n\t\t\t\t, 'Blue':  2\n\t\t\t\t, 'Green': 3\n\t\t\t}\n\t\t};\n\n\t\tthis.args.form = new Form({field});\n\n\t\tthis.args.form.bindTo('json', v => {\n\n\t\t\twindow.parent.parent.postMessage(v, '*');\n\n\t\t});\n\t}\n}\n"
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
      body: require('./Samples/Form.html'),
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
module.exports = "<h2>Forms Demo</h2>\n\n<p>Forms can be generated by passing an object describing the desired fields & properties. Keys prefixed with \"_\" will affect the form itself rather than generating fields. Other keys will map to fields.</p>\n\n<ul>\n\t<li><b>_method</b> - The \"method\" attribute of the form element.</li>\n\t<li><b>_action</b> - The \"action\" attribute of the form element.</li>\n</ul>\n\n<p>Fields are object with 0 or more of the following keys</p>\n\n<ul>\n\t<li><b>name</b> - Field name attribute (key will be used if not provided.)</li>\n\t<li><b>title</b> - Field title (key will be used if not provided.)</li>\n\t<li><b>type</b> - Field Type</li>\n\t<li><b>attrs</b> - Additional attributes for field tag (k/v object)</li>\n</ul>\n\n<p><i>Note form submisions are disabled in the editor</i></p>\n\n[[basic]]\n\n<h3>Field Groupings</h3>\n\n<p>Fields may be grouped with the <b>fieldset</b> field type.</p>\n\n<p>Fieldset definitions may have the following keys in additions to the standard keys:</p>\n\n<ul>\n\t<li><b>children</b> - Array or object listing child field.</li>\n\t<li><b>array</b> - Boolean determining if field names should cascade.</li>\n</ul>\n\n<p>Array field names will appear normal in output JSON but will have their name attributs in the form fieldset[fieldname]. Nested fieldsets can cascade this property to produce names like fieldset[subset][fieldname].</p>\n\n[[group]]\n\n<h3>Traditional Field Types</h3>\n\n<h4>Text Field</h4>\n\n[[textField]]\n\n<h4>Textarea</h4>\n\n[[textareaField]]\n\n<h4>File Field</h4>\n\n[[fileField]]\n\n\n<h4>Submit</h4>\n\n[[submitField]]\n\n<h4>Button</h4>\n\n[[buttonField]]\n\n<h4>Checkbox Field</h4>\n\n[[checkboxField]]\n\n<h4>Select Field</h4>\n\n[[selectField]]\n\n<h4>Radio Button Field</h4>\n\n[[radioField]]\n\n<h4>Hidden Field</h4>\n\nHidden fields have no user-visible representation. Not even the title will render, but the field will be present.\n\n[[hiddenField]]\n\n<h4>HTML Field</h4>\n\n[[htmlField]]\n\n<h3>HTML5 Fields</h3>\n<h3>Custom Fields</h3>\n"
});

;require.register("Layout/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _View = require("curvature/base/View");

var _View2 = require("../ViewDemo/View");

var _View3 = require("../FormsDemo/View");

var _View4 = require("../ThemeDemo/View");

var _View5 = require("../ConfigDemo/View");

var _View6 = require("../ScalarDemo/View");

var _View7 = require("../ChainDemo/View");

var _View8 = require("../ArrayDemo/View");

var _View9 = require("../ObjectDemo/View");

var _View10 = require("../Experiments/Php/View");

var _View11 = require("../Experiments/InfiniteScroll/View");

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
    _this.routes = {
      '': function _() {
        return 'home';
      },
      views: function views() {
        return new _View2.View();
      },
      forms: function forms() {
        return new _View3.View();
      },
      config: function config() {
        return new _View5.View();
      },
      themes: function themes() {
        return new _View4.View();
      },
      scalars: function scalars() {
        return new _View6.View();
      },
      chains: function chains() {
        return new _View7.View();
      },
      arrays: function arrays() {
        return new _View8.View();
      },
      objects: function objects() {
        return new _View9.View();
      },
      'php': function php() {
        return new _View10.View();
      },
      'infinite-scroll': function infiniteScroll() {
        return new _View11.View();
      }
    };
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("Layout/template.html", function(exports, require, module) {
module.exports = "<h1>curvature-2</h1>\n<div class = \"layout\">\n\t<div class = \"navigation\">\n\t\t<ul>\n\t\t\t<li>Components\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/views\">Views</a></li>\n\t\t\t\t\t<li><a cv-link = \"/forms\">Forms</a></li>\n\t\t\t\t\t<li><a cv-link = \"/config\">Config</a></li>\n\t\t\t\t\t<li cv-link = \"/rules\">Rules</li>\n\t\t\t\t\t<li cv-link = \"/models\">Models</li>\n\t\t\t\t\t<li cv-link = \"/routes\">Routes</li>\n\t\t\t\t\t<li><a cv-link = \"/themes\">Themes</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t\t<li>Binding:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/scalars\">Scalars</a></li>\n\t\t\t\t\t<li><a cv-link = \"/arrays\">Arrays</a></li>\n\t\t\t\t\t<li><a cv-link = \"/objects\">Objects</a></li>\n\t\t\t\t\t<li><a cv-link = \"/chains\">Chain Binding</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n<!-- \t\t\t<li>Integrations:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/presskit\">PressKit</a></li>\n\t\t\t\t\t<li><a cv-link = \"/eventi\">Eventi</a></li>\n\t\t\t\t\t<li><a cv-link = \"/subspace\">Tigl-2d</a></li>\n\t\t\t\t\t<li><a cv-link = \"/subspace\">Subspace</a></li>\n\t\t\t\t\t<li><a cv-link = \"/cv-markdown\">cv-Markdown</a></li>\n\t\t\t\t</ul>\n\t\t\t</li> -->\n\n\t\t\t<li>Experiments:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><a cv-link = \"/php\">PHP Integration</a></li>\n\t\t\t\t\t<li><a cv-link = \"/infinite-scroll\">Infinite Scroll</a></li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\n\t\t</ul>\n\t</div>\n\n\t<div class = \"content\">[[content]]</div>\n\n\t<div></div>\n\n</div>\n"
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

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Theme = /*#__PURE__*/function () {
  _createClass(Theme, null, [{
    key: "get",
    value: function get() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (!this.instances) {
        this.instances = {};
      }

      if (!this.instances[key]) {
        this.instances[key] = new this(key);
      }

      return this.instances[key];
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

      var type = object.constructor;
      var map = this[whichMap];

      if (map.has(type)) {
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

          if (type.prototype instanceof key) {
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
});

;require.register("ThemeDemo/View.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Theme = require("./Theme");

var _View = require("curvature/base/View");

var _TypeX = require("./types/TypeX");

var _TypeY = require("./types/TypeY");

var _TypeZ = require("./types/TypeZ");

var _ViewX = require("./views/ViewX");

var _ViewY = require("./views/ViewY");

var _ViewZ = require("./views/ViewZ");

var _TypeZAlpha = require("./types/TypeZAlpha");

var _ViewZAlpha = require("./views/ViewZAlpha");

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

    var theme = _Theme.Theme.get();

    var alpha = _Theme.Theme.get('alpha');

    theme.setTemplate(_ViewX.ViewX, require('./views/templateX')).setTemplate(_ViewY.ViewY, require('./views/templateY')).setTemplate(_ViewZ.ViewZ, require('./views/templateZ')).setView(_TypeX.TypeX, _ViewX.ViewX).setView(_TypeY.TypeY, _ViewY.ViewY).setView(_TypeZ.TypeZ, _ViewZ.ViewZ);
    alpha.setTemplate(_ViewZAlpha.ViewZAlpha, require('./views/templateZAlpha')).setFallback(_Theme.Theme.get()).setView(_TypeZAlpha.TypeZAlpha, _ViewZAlpha.ViewZAlpha);
    var x = new _TypeX.TypeX(_assertThisInitialized(_this));
    var y = new _TypeY.TypeY(_assertThisInitialized(_this));
    var z = new _TypeZ.TypeZ(_assertThisInitialized(_this));
    var z𝛼 = new _TypeZAlpha.TypeZAlpha(_assertThisInitialized(_this));
    _this.args.views = [x, x, y, z, z𝛼].map(function (v) {
      return alpha.getView(v);
    });
    return _this;
  }

  return View;
}(_View.View);

exports.View = View;
});

;require.register("ThemeDemo/template.html", function(exports, require, module) {
module.exports = "<div cv-each = \"views:view:v\">[[view]]</div>\n"
});

;require.register("ThemeDemo/types/TypeX.js", function(exports, require, module) {
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

var _Theme = require("../Theme");

var _Config = require("../../Config");

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

var ViewX = /*#__PURE__*/function (_BaseView) {
  _inherits(ViewX, _BaseView);

  var _super = _createSuper(ViewX);

  function ViewX(args) {
    var _this;

    _classCallCheck(this, ViewX);

    _this = _super.call(this, args);
    _this.template = _Theme.Theme.get(_Config.Config.theme || '').getTemplate(_assertThisInitialized(_this));
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

var _Config = require("../../Config");

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
    _this.template = _Theme.Theme.get(_Config.Config.theme || '').getTemplate(_assertThisInitialized(_this));
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

var _Config = require("../../Config");

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
    _this.template = _Theme.Theme.get(_Config.Config.theme || '').getTemplate(_assertThisInitialized(_this));
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

  function ViewZAlpha() {
    _classCallCheck(this, ViewZAlpha);

    return _super.apply(this, arguments);
  }

  return ViewZAlpha;
}(_ViewZ2.ViewZ);

exports.ViewZAlpha = ViewZAlpha;
});

;require.register("ThemeDemo/views/templateX.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">X;[[type]]: [[value]]</div>\n"
});

;require.register("ThemeDemo/views/templateY.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">Y;[[type]]: [[value]]</div>\n"
});

;require.register("ThemeDemo/views/templateZ.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">Z;[[type]]: [[value]]</div>\n"
});

;require.register("ThemeDemo/views/templateZAlpha.html", function(exports, require, module) {
module.exports = "<div class = \"[[type]]\">Z𝛼;[[type]]: [[value]]</div>\n"
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
module.exports = "const View = require('curvature/base/View').View;\n\nclass DemoView extends View\n{\n\tconstructor()\n\t{\n\t\tsuper();\n\t\tthis.template = require('template');\n\t\tthis.args.val = '';\n\t}\n\n\trandom()\n\t{\n\t\tthis.args.val = 1 / Math.random();\n\t}\n\n\tclear()\n\t{\n\t\tthis.args.val = '';\n\t}\n}\n"
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
module.exports = "<h2>Views Demo</h2>\n<!--\n<h3>PHP</h3>\n\n[[editorPhp]]\n -->\n<h3>Scalar Binding</h3>\n\n<p>Scalars can be bound with double square brackets:</p>\n\n[[editor]]\n\n<h3>Two way binding, Events & Methods</h3>\n\n<p>Two way binding is also supported.</p>\n\n<p>Methods can be bound to events with cv-on.</p>\n\n[[editorTwoWay]]\n\n<h3>Transformations</h3>\n\n<p>Values can also be transformed with methods:</p>\n\n[[editorReverse]]\n\n<h3>Escaping</h3>\n\n<p>HTML is automatically escaped unless \"$\" is used:</p>\n\n[[editorEscape]]\n\n<h3>Arrays & Objects</h3>\n\n<p>Arrays and objects may be looped over with the cv-each attribute:</p>\n\n[[editorArray]]\n\n<h3>Methods</h3>\n\n<p>Values of any type may be transformed by methods:</p>\n\n[[editorJson]]\n\n<h3>Templates</h3>\n\n<p>Reusable templates can be created with the cv-template attribute.</p>\n\n<p>Templates may be reused within the same view with the cv-slot attribute.</p>\n\n[[editorReuse]]\n\n<h3>Lifecycle</h3>\n\n<h3>Construct</h3>\n<h3>On Render</h3>\n<h3>On Attachment</h3>\n<h3>On Detachment</h3>\n<h3>On Final Removal</h3>\n"
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

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map