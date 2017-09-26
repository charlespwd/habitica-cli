'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tasks = tasks;
exports.statsDiff = statsDiff;
exports.stats = stats;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _nodeEmoji = require('node-emoji');

var _nodeEmoji2 = _interopRequireDefault(_nodeEmoji);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pp(n) {
  return n.toFixed(2);
}

function withEmojis(s) {
  return _nodeEmoji2.default.emojify(s.replace(/:heart:|:recycle:|☢️ ️/, '$& '));
}

var makeTableOpts = function makeTableOpts(opts) {
  return _ramda2.default.merge(opts, {
    chars: {
      'top': '─',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      'bottom': '─',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      'left': '',
      'left-mid': '─',
      'mid': '─',
      'mid-mid': '',
      'right': '',
      'right-mid': '─',
      'middle': ''
    }
  });
};

var makeTable = function makeTable(opts) {
  return new _cliTable2.default(makeTableOpts(opts));
};
var isDaily = function isDaily(task) {
  return task.type === 'daily';
};

function getFilter() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'due';

  switch (type) {
    case 'due':
      return function (x) {
        return !x.isCompleted && x.isDue;
      };
    case 'all':
      return function (x) {
        return x;
      };
    case 'grey':
      return function (x) {
        return x.isCompleted || !x.isDue;
      };
    default:
      throw new Error('filter \'' + type + '\' not supported');
  }
}

function tasks(taskList, filterType) {
  var table = makeTable({});
  var taskFilter = getFilter(filterType);

  taskList.filter(taskFilter).forEach(function (task) {
    var row = [];
    row.push(task.shortId);
    if (filterType === 'all' && isDaily(task)) row.push(task.isCompleted ? 'X' : ' ');
    row.push(withEmojis(task.label));
    table.push(row);
  });

  if (table.length === 0) {
    return 'There\'s nothing left!';
  }

  return table.toString();
}

function statsDiff(before, after) {
  var deltas = {
    HP: after.health - before.health,
    MP: after.mana - before.mana,
    GP: after.gold - before.gold,
    XP: after.experience - before.experience
  };

  var str = [];
  _ramda2.default.forEachObjIndexed(function (delta, key) {
    if (delta !== 0) {
      str.push('' + (delta > 0 ? '+' : '') + pp(delta) + ' ' + key);
    }
  }, deltas);

  return str.join(', ');
}

function stats(statsData) {
  return '\n' + (0, _utils.capitalize)(statsData.class) + ' - Level ' + statsData.level + '\nHP: ' + pp(statsData.health) + ' / ' + statsData.maxHealth + '\nMP: ' + pp(statsData.mana) + ' / ' + statsData.maxMana + '\nXP: ' + pp(statsData.experience) + ' / ' + statsData.toNextLevel + '\nGOLD: ' + pp(statsData.gold) + '\n';
}