'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.constructor');
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.map');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
require('core-js/modules/es6.regexp.search');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.promise');
var fetch = _interopDefault(require('cross-fetch'));
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.object.assign');
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
require('core-js/modules/es6.number.constructor');
require('core-js/modules/es6.number.is-integer');
require('core-js/modules/es7.array.includes');
require('core-js/modules/es6.string.includes');
require('core-js/modules/es7.object.values');
require('core-js/modules/es6.function.name');

var MiddlewareType = {
  REQ: Symbol('REQ'),
  RES: Symbol('RES')
};
var BaseProvider =
/*#__PURE__*/
function () {
  function BaseProvider() {
    var _this = this;

    var reqMiddleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();
    var resMiddleware = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Map();

    _classCallCheck(this, BaseProvider);

    _defineProperty(this, "middleware", {
      request: {
        use: function use(fn) {
          var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
          return _this.pushMiddleware(fn, MiddlewareType.REQ, match);
        }
      },
      response: {
        use: function use(fn) {
          var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
          return _this.pushMiddleware(fn, MiddlewareType.RES, match);
        }
      }
    });

    this.reqMiddleware = reqMiddleware;
    this.resMiddleware = resMiddleware;
  }

  _createClass(BaseProvider, [{
    key: "pushMiddleware",
    value: function pushMiddleware(fn, type, match) {
      if (type !== MiddlewareType.REQ && type !== MiddlewareType.RES) {
        throw new Error('Please specify the type of middleware being added');
      }

      if (type === MiddlewareType.REQ) {
        var current = this.reqMiddleware.get(match) || [];
        this.reqMiddleware.set(match, _toConsumableArray(current).concat([fn]));
      } else {
        var _current = this.resMiddleware.get(match) || [];

        this.resMiddleware.set(match, _toConsumableArray(_current).concat([fn]));
      }
    }
  }, {
    key: "getMiddleware",
    value: function getMiddleware(method) {
      var reqFns = [];
      var resFns = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.reqMiddleware.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              transformers = _step$value[1];

          if (typeof key === 'string' && key !== '*' && key === method) {
            reqFns.push.apply(reqFns, _toConsumableArray(transformers));
          }

          if (key instanceof RegExp && key.test(method)) {
            reqFns.push.apply(reqFns, _toConsumableArray(transformers));
          }

          if (key === '*') {
            reqFns.push.apply(reqFns, _toConsumableArray(transformers));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.resMiddleware.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              key = _step2$value[0],
              transformers = _step2$value[1];

          if (typeof key === 'string' && key !== '*' && key === method) {
            resFns.push.apply(resFns, _toConsumableArray(transformers));
          }

          if (key instanceof RegExp && key.test(method)) {
            resFns.push.apply(resFns, _toConsumableArray(transformers));
          }

          if (key === '*') {
            resFns.push.apply(resFns, _toConsumableArray(transformers));
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return [reqFns, resFns];
    }
  }]);

  return BaseProvider;
}();

var composeMiddleware = function composeMiddleware() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce(function (a, b) {
    return function (arg) {
      return a(b(arg));
    };
  });
};

var DEFAULT_TIMEOUT = 120000;
var DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

function _fetch(fetchPromise, timeout) {
  var abortFn = null;
  var abortPromise = new Promise(function (resolve, reject) {
    abortFn = function abortFn() {
      return reject(new Error("request Timeout in ".concat(timeout, " ms")));
    };
  });
  var abortablePromise = Promise.race([fetchPromise, abortPromise]);
  setTimeout(function () {
    abortFn();
  }, timeout);
  return abortablePromise;
}

var execParams = function execParams(url, params) {
  var paramsArray = [];
  var newUrl = url; // 拼接参数

  Object.keys(params).forEach(function (key) {
    return paramsArray.push("".concat(key, "=").concat(params[key]));
  });

  if (url.search(/\?/) === -1) {
    newUrl += "?".concat(paramsArray.join('&'));
  } else {
    newUrl += "&".concat(paramsArray.join('&'));
  }

  console.log(params);
  return newUrl;
};

var performRPC =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(request, handler) {
    var response;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _fetch(fetch(request.options.method === 'POST' ? request.url : execParams(request.url, request.payload.params), {
              method: request.options && request.options.method ? request.options.method : 'POST',
              cache: 'no-cache',
              mode: 'cors',
              redirect: 'follow',
              referrer: 'no-referrer',
              body: request.options.method === 'POST' ? JSON.stringify(request.payload) : null,
              headers: _objectSpread({}, DEFAULT_HEADERS, request.options && request.options.headers ? request.options.headers : {})
            }), request.options && request.options.timeout ? request.options.timeout : DEFAULT_TIMEOUT);

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response.json().then(function (body) {
              return {
                result: body.result || body,
                req: request
              };
            }).then(handler));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function performRPC(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var defaultOptions = {
  method: 'POST',
  timeout: 120000,
  user: null,
  password: null,
  headers: {
    'Content-Type': 'application/json'
  }
};

var FetchProvider =
/*#__PURE__*/
function (_BaseProvider) {
  _inherits(FetchProvider, _BaseProvider);

  function FetchProvider(url, options) {
    var _this;

    _classCallCheck(this, FetchProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FetchProvider).call(this));
    _this.url = url || 'http://localhost:4200';

    if (options) {
      _this.options = {
        method: options.method || defaultOptions.method,
        timeout: options.timeout || defaultOptions.timeout,
        user: options.user || defaultOptions.user,
        password: options.password || defaultOptions.password,
        headers: options.headers || defaultOptions.headers
      };
    } else {
      _this.options = defaultOptions;
    }

    return _this;
  }

  _createClass(FetchProvider, [{
    key: "send",
    value: function send(payload, callback) {
      return this.requestFunc({
        payload: payload,
        callback: callback
      });
    }
  }, {
    key: "sendServer",
    value: function sendServer(endpoint, payload, callback) {
      return this.requestFunc({
        endpoint: endpoint,
        payload: payload,
        callback: callback
      });
    }
  }, {
    key: "requestFunc",
    value: function requestFunc(_ref) {
      var _this2 = this;

      var endpoint = _ref.endpoint,
          payload = _ref.payload,
          callback = _ref.callback;

      var _this$getMiddleware = this.getMiddleware(payload.method),
          _this$getMiddleware2 = _slicedToArray(_this$getMiddleware, 2),
          tReq = _this$getMiddleware2[0],
          tRes = _this$getMiddleware2[1];

      var reqMiddleware = composeMiddleware.apply(void 0, _toConsumableArray(tReq).concat([function (obj) {
        return _this2.optionsHandler(obj);
      }, function (obj) {
        return _this2.endpointHandler(obj, endpoint);
      }, this.payloadHandler]));
      var resMiddleware = composeMiddleware.apply(void 0, [function (data) {
        return _this2.callbackHandler(data, callback);
      }].concat(_toConsumableArray(tRes)));
      var req = reqMiddleware(payload);
      return performRPC(req, resMiddleware);
    }
  }, {
    key: "payloadHandler",
    value: function payloadHandler(payload) {
      return {
        payload: payload
      };
    }
  }, {
    key: "endpointHandler",
    value: function endpointHandler(obj, endpoint) {
      return Object.assign({}, obj, {
        url: endpoint !== null && endpoint !== undefined ? "".concat(this.url).concat(endpoint) : this.url
      });
    }
  }, {
    key: "optionsHandler",
    value: function optionsHandler(obj) {
      if (this.options.user && this.options.password) {
        var AUTH_TOKEN = "Basic ".concat(Buffer.from("".concat(this.options.user, ":").concat(this.options.password)).toString('base64'));
        this.options.headers.Authorization = AUTH_TOKEN;
      }

      return Object.assign({}, obj, {
        options: this.options
      });
    }
  }, {
    key: "callbackHandler",
    value: function callbackHandler(data, cb) {
      if (cb) {
        cb(null, data);
      }

      return data;
    }
  }]);

  return FetchProvider;
}(BaseProvider);

/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */
var isNumber = function isNumber(obj) {
  return obj === +obj;
};
/**
 * [isNumber verify param is a Number]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isInt = function isInt(obj) {
  return isNumber(obj) && Number.isInteger(obj);
};
/**
 * [isString verify param is a String]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isString = function isString(obj) {
  return obj === "".concat(obj);
};
/**
 * [isBoolean verify param is a Boolean]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isBoolean = function isBoolean(obj) {
  return obj === !!obj;
};
/**
 * [isArray verify param input is an Array]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isArray = function isArray(obj) {
  return Array.isArray(obj);
};
/**
 * [isObject verify param is an Object]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [boolean]
 */

var isObject = function isObject(obj) {
  return obj !== null && !Array.isArray(obj) && _typeof(obj) === 'object';
};
/**
 * [isFunction verify param is a Function]
 * @param  {[type]}  obj [value]
 * @return {Boolean}     [description]
 */

var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};
/**
 * check Object isNull
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */

var isNull = function isNull(obj) {
  return obj === null;
};
/**
 * check object is undefined
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */

var isUndefined = function isUndefined(obj) {
  return obj === undefined;
};

var validators = /*#__PURE__*/Object.freeze({
  isNumber: isNumber,
  isInt: isInt,
  isString: isString,
  isBoolean: isBoolean,
  isArray: isArray,
  isObject: isObject,
  isFunction: isFunction,
  isNull: isNull,
  isUndefined: isUndefined
});

function objToArray(obj) {
  var keys = Object.keys(obj);
  var values = Object.values(obj);
  var newArray = keys.map(function (k, index) {
    var Obj = {};
    Obj[k] = values[index];
    return Obj;
  });
  return newArray;
}

function injectValidator(func) {
  if (_typeof(func) === 'object' && func !== undefined) {
    var valName = Object.keys(func)[0];
    var valFunc = Object.values(func)[0];
    return Object.assign(valFunc, {
      validator: valName,
      test: function test(obj) {
        return valFunc(obj);
      }
    });
  } else return false;
}

function extractValidator(vals) {
  var newValidator = [];
  var newArr = objToArray(vals);
  newArr.forEach(function (v, index) {
    var newV = injectValidator(v);
    var validatorString = newV.validator;
    newValidator[validatorString] = newV;
    newValidator[index] = newV;
  });
  return newValidator;
}

var valArray = extractValidator(validators);
var isNumber$1 = valArray.isNumber,
    isInt$1 = valArray.isInt,
    isString$1 = valArray.isString,
    isBoolean$1 = valArray.isBoolean,
    isArray$1 = valArray.isArray,
    isObject$1 = valArray.isObject,
    isFunction$1 = valArray.isFunction,
    isNull$1 = valArray.isNull,
    isUndefined$1 = valArray.isUndefined;
/**
 * [Validator description]
 * @param       {[type]} stringToTest    [description]
 * @param       {[type]} validatorString [description]
 * @constructor
 */

function Validator(stringToTest, validatorString) {
  if (typeof validatorString === 'string' && valArray["is".concat(validatorString)] !== undefined) {
    return valArray["is".concat(validatorString)].test(stringToTest);
  } else if (typeof validatorString === 'function') {
    return validatorString(stringToTest);
  } else {
    throw new Error("validator not found :".concat(validatorString));
  }
}

function tester(value, callback) {
  try {
    var validateResult = valArray.map(function (func) {
      return func.test(value) ? func.validator.substring(2) : false;
    }).filter(function (d) {
      return d !== false;
    });
    return callback === undefined ? validateResult : callback(validateResult);
  } catch (e) {
    return callback === undefined ? e : callback(e);
  }
}

Object.assign(Validator, {
  test: tester
});
var validator = Validator;
/**
 * make sure each of the keys in requiredArgs is present in args
 * @param  {[type]} args         [description]
 * @param  {[type]} requiredArgs [description]
 * @param  {[type]} optionalArgs [description]
 * @return {[type]}              [description]
 */

function validateArgs(args, requiredArgs, optionalArgs) {
  for (var key in requiredArgs) {
    if (args[key] !== undefined) {
      for (var i = 0; i < requiredArgs[key].length; i += 1) {
        if (typeof requiredArgs[key][i] !== 'function') throw new Error('Validator is not a function');

        if (!requiredArgs[key][i](args[key])) {
          throw new Error("Validation failed for ".concat(key, ",should be ").concat(requiredArgs[key][i].validator));
        }
      }
    } else throw new Error("Key not found: ".concat(key));
  }

  for (var _key in optionalArgs) {
    if (args[_key]) {
      for (var _i = 0; _i < optionalArgs[_key].length; _i += 1) {
        if (typeof optionalArgs[_key][_i] !== 'function') throw new Error('Validator is not a function');

        if (!optionalArgs[_key][_i](args[_key])) {
          throw new Error("Validation failed for ".concat(_key, ",should be ").concat(optionalArgs[_key][_i].validator));
        }
      }
    }
  }

  return true;
}

function validateTypes(arg, validatorArray) {
  var valLength = validatorArray.length;

  if (valLength === 0 || !isArray$1(validatorArray)) {
    throw new Error('Must include some validators');
  }

  var valsKey = validator.test(arg);
  var getValidators = [];
  var finalReduceArray = validatorArray.map(function (v) {
    getValidators.push(v.validator);
    return valsKey.includes(v.validator.substring(2)) ? 1 : 0;
  });
  var finalReduce = finalReduceArray.reduce(function (acc, cur) {
    return acc + cur;
  });

  if (finalReduce === 0) {
    throw new TypeError("One of [".concat(getValidators.concat(), "] has to pass, but we have your arg to be [").concat(_toConsumableArray(valsKey), "]"));
  }

  return true;
}

var toString = function toString(string) {
  validateTypes(string, [isNumber$1, isInt$1, isString$1, isBoolean$1, isArray$1, isObject$1, isFunction$1, isNull$1, isUndefined$1]);

  try {
    if (isArray$1(string) || isObject$1(string)) {
      return JSON.stringify(string);
    }

    return String(string);
  } catch (e) {
    throw new Error(e);
  }
};
var toNumber = function toNumber(string) {
  validateTypes(string, [isNumber$1, isInt$1, isString$1, isBoolean$1, isNull$1, isUndefined$1]);

  try {
    return Number(string);
  } catch (e) {
    throw new Error(e);
  }
};

var validatorArray = {
  isNumber: [isNumber$1],
  isInt: [isInt$1],
  isString: [isString$1],
  isBoolean: [isBoolean$1],
  isArray: [isArray$1],
  isObject: [isObject$1],
  isFunction: [isFunction$1],
  isNull: [isNull$1],
  isUndefined: [isUndefined$1]
};
var transformerArray = {
  toNumber: toNumber,
  toString: toString
};

var Method = function Method(options, provider) {
  var _this = this;

  _classCallCheck(this, Method);

  _defineProperty(this, "generateValidateObjects", function () {
    var validatorObject = _this.params;
    var requiredArgs = {};
    var optionalArgs = {};

    for (var index in validatorObject) {
      if (index !== undefined) {
        var newObjectKey = index;
        var newObjectValid = validatorObject[index][0];
        var isRequired = validatorObject[index][1];

        if (isRequired === 'required') {
          requiredArgs[newObjectKey] = validatorArray[newObjectValid];
        } else {
          optionalArgs[newObjectKey] = validatorArray[newObjectValid];
        }
      }
    }

    return {
      requiredArgs: requiredArgs,
      optionalArgs: optionalArgs
    };
  });

  _defineProperty(this, "validateArgs", function (args, requiredArgs, optionalArgs) {
    var reArgs = requiredArgs === undefined ? {} : requiredArgs;
    var opArgs = optionalArgs === undefined ? {} : optionalArgs;

    if (args && _this.params !== {}) {
      return validateArgs(args, reArgs, opArgs);
    }

    return true;
  });

  _defineProperty(this, "extractParams", function (args) {
    var paramsObject = isObject$1(args) ? args : {};
    var result;
    var keyArrayLength = Object.keys(paramsObject).length;
    if (keyArrayLength === 0) result = [];

    if (keyArrayLength === 1 && !_this.isSendJson) {
      var resultKey = Object.keys(paramsObject)[0];
      result = [_this.transformedBeforeSend(paramsObject[resultKey], resultKey)];
    } else if (keyArrayLength > 0 && _this.isSendJson) {
      var newObject = {};
      Object.keys(paramsObject).map(function (k) {
        newObject[k] = _this.transformedBeforeSend(paramsObject[k], k);
        return false;
      });
      result = newObject;
    }

    return result;
  });

  _defineProperty(this, "transformedBeforeSend", function (value, key) {
    var transformMethod = _this.transformer[key];

    if (transformMethod !== undefined) {
      return transformerArray[transformMethod](value);
    } else return value;
  });

  _defineProperty(this, "assignToObject", function (object) {
    var newObject = {};
    newObject[_this.name] = _this.methodBuilder();
    return Object.assign(object, newObject);
  });

  _defineProperty(this, "methodBuilder", function () {
    if (_this.provider !== null && _this.endpoint === 'client') {
      return function (args, callback) {
        var _this$generateValidat = _this.generateValidateObjects(),
            requiredArgs = _this$generateValidat.requiredArgs,
            optionalArgs = _this$generateValidat.optionalArgs;

        _this.validateArgs(args, requiredArgs, optionalArgs);

        var params = _this.extractParams(args);

        var newCallback = isFunction$1(args) ? args : callback;

        if (newCallback) {
          return _this.provider.send({
            method: _this.call,
            params: params
          }, newCallback);
        }

        return _this.provider.send({
          method: _this.call,
          params: params
        });
      };
    }

    if (_this.provider !== null && _this.endpoint !== 'client') {
      return function (args, callback) {
        var _this$generateValidat2 = _this.generateValidateObjects(),
            requiredArgs = _this$generateValidat2.requiredArgs,
            optionalArgs = _this$generateValidat2.optionalArgs;

        _this.validateArgs(args, requiredArgs, optionalArgs);

        var params = _this.extractParams(args);

        var newCallback = isFunction$1(args) ? args : callback;

        if (newCallback) {
          return _this.provider.sendServer(_this.endpoint, {
            method: _this.call,
            params: params
          }, newCallback);
        }

        return _this.provider.sendServer(_this.endpoint, {
          method: _this.call,
          params: params
        });
      };
    }
  });

  var name = options.name,
      call = options.call,
      _params = options.params,
      transformer = options.transformer,
      isSendJson = options.isSendJson,
      endpoint = options.endpoint;
  this.provider = provider;
  this.name = name;
  this.call = call;
  this.params = _params;
  this.endpoint = endpoint || 'client';
  this.transformer = transformer || {};
  this.isSendJson = isSendJson || false;
};

var getObjects = [{
  name: 'testGET',
  call: 'TESTGET',
  params: {
    param1: ['isString', 'required'],
    param2: ['isString', 'required'],
    param3: ['isString', 'optional'],
    param4: ['isNumber', 'optional']
  },
  transformer: {
    param4: 'toNumber'
  },
  isSendJson: true,
  endpoint: '/testGet'
}];

var postObjects = [{
  name: 'testPost',
  call: 'TESTPOST',
  params: {
    param1: ['isString', 'required'],
    param2: ['isString', 'required'],
    param3: ['isString', 'optional'],
    param4: ['isNumber', 'optional']
  },
  transformer: {
    param4: 'toNumber'
  },
  isSendJson: true,
  endpoint: 'testPost'
}];

var mapGetToMethods = function mapGetToMethods(main, provider) {
  getObjects.map(function (data) {
    var method = new Method(data, provider);
    method.assignToObject(main);
    return false;
  });
};

var mapPostToMethods = function mapPostToMethods(main, provider) {
  postObjects.map(function (data) {
    var reg = new Method(data, provider);
    reg.assignToObject(main);
    return false;
  });
};

var Fetch =
/*#__PURE__*/
function () {
  function Fetch(url) {
    _classCallCheck(this, Fetch);

    _defineProperty(this, "modules", {
      FetchProvider: FetchProvider
    });

    this.getProvider = new FetchProvider(url, {
      method: 'GET'
    });
    this.postProvider = new FetchProvider(url, {
      method: 'POST'
    });
    this.get = {};
    this.post = {};
    mapGetToMethods(this.get, this.getProvider);
    mapPostToMethods(this.post, this.postProvider);
  }

  _createClass(Fetch, [{
    key: "extends",
    value: function _extends(data, type) {
      if (!isObject$1(data)) {
        throw new TypeError('Extend Method has to be Object');
      }

      if (type === 'GET') {
        return new Method(data, this.getProvider).assignToObject(this.get);
      }

      return new Method(data, this.postProvider).assignToObject(this.post);
    }
  }]);

  return Fetch;
}();

if (typeof window !== 'undefined' && typeof window.Fetch === 'undefined') {
  window.Fetch = Fetch;
}

module.exports = Fetch;
