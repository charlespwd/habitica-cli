'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stats = undefined;

var stats = exports.stats = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _api.request)((0, _api.url)('user'));

          case 2:
            data = _context.sent;
            return _context.abrupt('return', toStats(data));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function stats() {
    return _ref2.apply(this, arguments);
  };
}();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function toStats(_ref) {
  var stats = _ref.stats,
      profile = _ref.profile;

  return {
    userName: profile.name,
    mana: stats.mp,
    maxMana: stats.maxMP,
    health: stats.hp,
    maxHealth: stats.maxHealth,
    gold: stats.gp,
    experience: stats.exp,
    toNextLevel: stats.toNextLevel,
    level: stats.lvl,
    class: stats.class
  };
}

;