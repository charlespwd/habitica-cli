import R from 'ramda';
import emoji from 'node-emoji';
import Table from 'cli-table';
import { capitalize } from './utils';

function pp(n) {
  return n.toFixed(2);
}

const twoCharacterEmojis = new RegExp([
  ':heart:',
  ':recycle:',
  '☢️ ️',
  ':arrow_up_right:',
  ':scissors:',
].join('|'), 'g');

function withEmojis(s) {
  return emoji.emojify(s.replace(twoCharacterEmojis, '$& '));
}

const makeTableOpts = opts => R.merge(opts, {
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
    'middle': '',
  },
});

const makeTable = (opts = {}) => new Table(makeTableOpts(opts));
const isDaily = task => task.type === 'daily';
const isTodo = task => task.type === 'todo';

function getFilter(type = 'due') {
  switch (type) {
    case 'all': {
      return x => x;
    }

    case 'dated':
    case 'due': {
      return x => !x.isCompleted && x.isDue;
    }

    case 'completed':
    case 'grey': {
      return x => x.isCompleted || !x.isDue;
    }

    default: throw new Error(`filter '${type}' not supported`);
  }
}

const shouldShowCompletedColumn = (task, filterType) => (
  (isTodo(task) && filterType === 'all') ||
  (isDaily(task) && filterType === 'all')
);

export function tasks(taskList, filterType) {
  const table = makeTable({});
  const taskFilter = getFilter(filterType);

  taskList.filter(taskFilter).forEach((task) => {
    const row = [];
    row.push(task.shortId);

    if (shouldShowCompletedColumn(task, filterType)) {
      row.push(task.isCompleted ? 'X' : ' ');
    }
    row.push(withEmojis(task.label));
    table.push(row);
  });

  if (table.length === 0) {
    return `There's nothing left!`;
  }

  return table.toString();
}

export function statsDiff(before, after) {
  const isLevelUp = after.level > before.level;
  const deltas = {
    HP: after.health - before.health,
    MP: after.mana - before.mana,
    GP: after.gold - before.gold,
    XP: isLevelUp
      ? (after.experience + before.toNextLevel - before.experience)
      : (after.experience - before.experience),
  };

  const str = [];

  R.forEachObjIndexed((delta, key) => {
    if (delta !== 0) {
      str.push(`${delta > 0 ? '+' : ''}${pp(delta)} ${key}`);
    }
  }, deltas);

  if (isLevelUp) {
    str[str.length - 1] += '\nLEVEL UP!';
  }

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

export function gear(items) {
  const table = makeTable({
    head: ['Price', 'Name', 'STR', 'CON', 'INT', 'PER'],
    colAligns: ['right', 'left', 'right', 'right', 'right', 'right'],
  });

  for (const item of R.sortBy(R.prop('label'), items)) {
    table.push([
      `${item.price} GP`,
      item.label,
      item.stats.str,
      item.stats.con,
      item.stats.int,
      item.stats.per,
    ]);
  }

  return table.toString();
}

function questProgress(progress) {
  if (progress.boss) {
    return (
      `${progress.boss}
${progress.health} / ${progress.maxHealth}`
    );
  }

  return progress.map(x => (
    `${x.collected} / ${x.toCollect} ${x.label}`
  )).join('\n');
}

export function quest(questDetails) {
  return `
${questDetails.label}
${R.repeat('=', questDetails.label.length).join('')}
${questDetails.description}
${R.repeat('=', questDetails.label.length).join('')}
${questProgress(questDetails.progress)}
`;
}

export function scores(scoresData) {
  return R.pipe(
    R.filter(R.prop('drop')),
    R.map(score => score.drop),
    R.join('\n'),
  )(scoresData);
}
