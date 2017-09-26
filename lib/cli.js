'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _tasks = require('./tasks');

var _user = require('./user');

var user = _interopRequireWildcard(_user);

var _format = require('./format');

var format = _interopRequireWildcard(_format);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var vorpal = require('vorpal');
var cli = vorpal();

cli.command('status', 'list your stats').action(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args, callback) {
    var stats;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return user.stats();

          case 2:
            stats = _context.sent;

            (0, _utils.log)(format.stats(stats));
            callback();

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

cli.command('habits', 'list your habits').alias('h').action(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args, callback) {
    var habits;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _tasks.getTasks)({
              type: _tasks.TYPES.HABITS
            });

          case 2:
            habits = _context2.sent;


            (0, _utils.log)(format.tasks(habits, 'all'));

            callback();

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

cli.command('habits score [ids...]', 'score one or multiple habits').alias('hs').option('-d, --down', 'score a habit down').action(function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(args, callback) {
    var stats, scores, afterStats;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return user.stats();

          case 2:
            stats = _context3.sent;
            _context3.next = 5;
            return (0, _tasks.scoreTasks)({
              type: _tasks.TYPES.HABITS,
              ids: args.ids || [],
              direction: args.options.down ? 'down' : 'up'
            });

          case 5:
            scores = _context3.sent;
            _context3.next = 8;
            return user.stats();

          case 8:
            afterStats = _context3.sent;


            (0, _utils.log)(format.statsDiff(stats, afterStats));

            callback();

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

cli.command('dailies', 'list your dailies').alias('d').option('-f, --filter [filter]', 'list filter type (all | due | grey)', ['due', 'all', 'grey']).action(function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(args, callback) {
    var dailies;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _tasks.getTasks)({
              type: _tasks.TYPES.DAILIES
            });

          case 2:
            dailies = _context4.sent;


            (0, _utils.log)(format.tasks(dailies, args.options.filter));

            callback();

          case 5:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

cli.command('dailies complete [ids...]', 'complete one or multiple dailies').alias('dailies score').alias('dc').alias('ds').option('-d, --down', 'Undo a complete action on a task').action(function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(args, callback) {
    var stats, scores, afterStats;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return user.stats();

          case 2:
            stats = _context5.sent;
            _context5.next = 5;
            return (0, _tasks.scoreTasks)({
              type: _tasks.TYPES.DAILIES,
              ids: args.ids || [],
              direction: args.options.down ? 'down' : 'up'
            });

          case 5:
            scores = _context5.sent;
            _context5.next = 8;
            return user.stats();

          case 8:
            afterStats = _context5.sent;


            (0, _utils.log)(format.statsDiff(stats, afterStats));

            callback();

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());

cli.command('todos', 'list your todos').alias('t').action(function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(args, callback) {
    var habits;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _tasks.getTasks)({
              type: _tasks.TYPES.TODOS
            });

          case 2:
            habits = _context6.sent;


            (0, _utils.log)(format.tasks(habits, 'all'));

            callback();

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());

cli.command('todos complete [ids...]', 'score one or multiple habits').alias('todos score').alias('tc').alias('ts').option('-u, --undo', 'uncomplete a todo').action(function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(args, callback) {
    var stats, scores, afterStats;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return user.stats();

          case 2:
            stats = _context7.sent;
            _context7.next = 5;
            return (0, _tasks.scoreTasks)({
              type: _tasks.TYPES.TODOS,
              ids: args.ids || [],
              direction: args.options.undo ? 'down' : 'up'
            });

          case 5:
            scores = _context7.sent;
            _context7.next = 8;
            return user.stats();

          case 8:
            afterStats = _context7.sent;


            (0, _utils.log)(format.statsDiff(stats, afterStats));

            callback();

          case 11:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());

function run() {
  (0, _utils.setLogger)(cli.log.bind(cli));
  cli.delimiter('habitica $ ').history('habitica-cli').show();
}