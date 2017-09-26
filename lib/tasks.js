'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scoreTasks = exports.scoreTask = exports.getTasks = exports.TYPES = undefined;

var getTasks = exports.getTasks = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var type = _ref.type;
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _api.request)((0, _api.url)('tasks/user', {
              type: type
            }));

          case 2:
            data = _context.sent;
            return _context.abrupt('return', mapIndexed(toTask, data));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getTasks(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var scoreTask = exports.scoreTask = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
    var id = _ref3.id,
        _ref3$direction = _ref3.direction,
        direction = _ref3$direction === undefined ? 'up' : _ref3$direction;
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _api.request)((0, _api.url)('tasks/' + id + '/score/' + direction), {
              method: 'POST',
              body: {
                taskId: id,
                direction: direction
              }
            });

          case 2:
            data = _context2.sent;
            return _context2.abrupt('return', scoreResult(data));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function scoreTask(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var scoreTasks = exports.scoreTasks = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref5) {
    var type = _ref5.type,
        ids = _ref5.ids,
        _ref5$direction = _ref5.direction,
        direction = _ref5$direction === undefined ? 'up' : _ref5$direction;
    var tasks, taskIds;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getTasks({ type: type });

          case 2:
            tasks = _context3.sent;
            taskIds = ids.map(function (id) {
              return tasks[id];
            }).filter(_ramda2.default.identity).filter(function (x) {
              return direction === 'up' ? !x.isCompleted : x.isCompleted;
            }).map(function (x) {
              return x.id;
            });
            _context3.next = 6;
            return Promise.all(taskIds.map(function (id) {
              return scoreTask({ id: id, direction: direction });
            }));

          case 6:
            return _context3.abrupt('return', _context3.sent);

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function scoreTasks(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mapIndexed = _ramda2.default.addIndex(_ramda2.default.map);

var TYPES = exports.TYPES = {
  DAILIES: 'dailys',
  HABITS: 'habits',
  TODOS: 'todos',
  REWARDS: 'rewards',
  COMPLETED: 'completedTodos'
};

function toTask(task, i) {
  return {
    id: task.id,
    shortId: i,
    type: task.type,
    notes: task.notes,
    label: task.text,
    isCompleted: task.completed,
    isDue: task.isDue
  };
}

function scoreResult(data) {
  return {
    health: data.hp,
    mana: data.mp,
    experience: data.exp,
    gold: data.gp
  };
}