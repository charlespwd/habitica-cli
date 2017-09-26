import R from 'ramda';
import emoji from 'node-emoji';
import Table from 'cli-table';
import { log, capitalize } from './utils';

function pp(n) {
  return n.toFixed(2);
}

function withEmojis(s) {
  return emoji.emojify(s.replace(/:heart:|:recycle:|☢️ ️/, '$& '));
}

const makeTableOpts = (opts) => R.merge(opts, {
  chars: {
    'top': '─' ,
    'top-mid': '' ,
    'top-left': '' ,
    'top-right': '',
    'bottom': '─' ,
    'bottom-mid': '' ,
    'bottom-left': '' ,
    'bottom-right': '',
    'left': '' ,
    'left-mid': '─' ,
    'mid': '─' ,
    'mid-mid': '',
    'right': '' ,
    'right-mid': '─' ,
    'middle': '',
  },
});

const makeTable = (opts) => new Table(makeTableOpts(opts));
const isDaily = task => task.type === 'daily';

function getFilter(type = 'due') {
  switch (type) {
    case 'due': return x => !x.isCompleted && x.isDue;
    case 'all': return x => x;
    case 'grey': return x => x.isCompleted || !x.isDue;
    default: throw new Error(`filter '${type}' not supported`)
  }
}

export function tasks(taskList, filterType) {
  const table = makeTable({});
  const taskFilter = getFilter(filterType);

  taskList.filter(taskFilter).forEach(task => {
    const row = [];
    row.push(task.shortId);
    if (filterType === 'all' && isDaily(task)) row.push(task.isCompleted ? 'X' : ' ');
    row.push(withEmojis(task.label));
    table.push(row)
  });

  if (table.length === 0) {
    return `There's nothing left!`;
  }

  return table.toString();
}

export function statsDiff(before, after) {
  const deltas = {
    HP: after.health - before.health,
    MP: after.mana - before.mana,
    GP: after.gold - before.gold,
    XP: after.experience - before.experience,
  };

  const str = [];
  R.forEachObjIndexed((delta, key) => {
    if (delta !== 0) {
      str.push(`${delta > 0 ? '+' : ''}${pp(delta)} ${key}`)
    }
  }, deltas);

  return str.join(', ');
}

export function stats(statsData) {
  return `
${capitalize(statsData.class)} - Level ${statsData.level}
HP: ${pp(statsData.health)} / ${statsData.maxHealth}
MP: ${pp(statsData.mana)} / ${statsData.maxMana}
XP: ${pp(statsData.experience)} / ${statsData.toNextLevel}
GOLD: ${pp(statsData.gold)}
`;
}
