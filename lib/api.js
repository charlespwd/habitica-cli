'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = exports.url = exports.getApiKey = exports.getUserID = undefined;

var makeRequest = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = (0, _ramda.mergeDeepLeft)(params, {
              json: true,
              headers: {
                'x-api-user': getUserID(),
                'x-api-key': getApiKey()
              }
            });
            _context.next = 3;
            return (0, _requestPromiseNative2.default)(url, options);

          case 3:
            response = _context.sent;

            if (response.success) {
              _context.next = 6;
              break;
            }

            throw new Error(response.data);

          case 6:
            return _context.abrupt('return', response.data);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function makeRequest(_x2) {
    return _ref.apply(this, arguments);
  };
}();

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _ramda = require('ramda');

var _ini = require('ini');

var ini = _interopRequireWildcard(_ini);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _qs = require('qs');

var qs = _interopRequireWildcard(_qs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var BASE_URL = 'https://habitica.com/api/v3';
var CONFIG_PATH = process.env.XDG_CONFIG_HOME + '/habitica/auth.cfg';
var config = ini.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

var getUserID = exports.getUserID = function getUserID() {
  return config.Habitica.login;
};
var getApiKey = exports.getApiKey = function getApiKey() {
  return config.Habitica.password;
};
var url = exports.url = function url(uri, options) {
  return BASE_URL + '/' + uri + '?' + qs.stringify(options);
};

exports.request = makeRequest;