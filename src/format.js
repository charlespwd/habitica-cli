import R from 'ramda';
import emoji from 'node-emoji';
import Table from 'cli-table';
import colors from 'colors/safe';
import { capitalize } from './utils';
import { QUEST_TYPES } from './user';

function pp(n) {
  return n.toFixed(2);
}

const twoCharacterEmojis = [
  ':heart:',
  ':recycle:',
  '☢️ ️',
  ':arrow_up_right:',
  ':scissors:',
].join('|');
const twoCharacterEmojisRegex = new RegExp(twoCharacterEmojis, 'g');
const twoCharacterEmojisRegexPlusSpace = new RegExp(`(${twoCharacterEmojis}) `, 'g');

export function withEmojis(s) {
  return emoji.emojify(s.replace(twoCharacterEmojisRegex, '$& '));
}

export function withoutEmojis(s) {
  return emoji.unemojify(s).replace(twoCharacterEmojisRegexPlusSpace, '$1');
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
XP: ${statsData.experience.toFixed(0)} / ${statsData.toNextLevel}
GOLD: ${pp(statsData.gold)}
`;
}

export function rewards(items) {
  const table = makeTable({
    head: ['Price', 'Name', 'STR', 'CON', 'INT', 'PER'],
    colAligns: ['right', 'left', 'right', 'right', 'right', 'right'],
  });

  for (const item of items) {
    table.push([
      colors.yellow(`${item.price} GP`),
      withEmojis(item.label),
      item.stats.str || '-',
      item.stats.con || '-',
      item.stats.int || '-',
      item.stats.per || '-',
    ]);
  }

  return table.toString();
}

function questProgress(progress) {
  if (progress.boss) {
    return (
      `${progress.boss}
${progress.health.toFixed(0) || progress.maxHealth} / ${progress.maxHealth}`
    );
  }

  return progress.map(x => (
    `${x.collected} / ${x.toCollect} ${x.label}`
  )).join('\n');
}

export function quest(questDetails) {
  return quest && `
${questDetails.label}
${R.repeat('=', questDetails.label.length).join('')}
${questDetails.description}
${R.repeat('=', questDetails.label.length).join('')}
${questProgress(questDetails.progress)}
`;
}

export function scores(scoresData, questDetails) {
  const type = questDetails && questDetails.type;
  const isQuestActive = questDetails && questDetails.isActive;
  const isBossQuest = isQuestActive && type === QUEST_TYPES.BOSS;
  const isCollectQuest = isQuestActive && type === QUEST_TYPES.COLLECT;

  const drops = R.pipe(
    R.filter(R.prop('drop')),
    R.map(R.prop('drop')),
  )(scoresData);

  const collected = R.pipe(
    R.filter(R.prop('collected')),
    R.map(R.prop('collected')),
    R.sum,
  )(scoresData);
  const collectedText = isCollectQuest && `+${collected} quest item(s) found!`;

  const damage = R.pipe(
    R.filter(R.prop('damage')),
    R.map(R.prop('damage')),
    R.sum,
  )(scoresData);
  const damageText = isBossQuest && `+${damage.toFixed(1)} damage to boss!`;

  return [].concat(drops, collectedText, damageText)
    .filter(R.identity)
    .join('\n');
}

export function goldBalance(stats) {
  const gold = Math.floor(stats.gold);
  const silver = (stats.gold - gold) * 100;
  return `You have ${colors.yellow(gold.toFixed(0))}${colors.yellow(' GP')} and ${colors.grey(silver.toFixed(0))}${colors.grey(' silver')}.`;
}

export function skills(skills) {
  const table = new Table({
    head: ['MP', 'Name', 'Description'],
  });

  for (const skill of skills) {
    table.push([
      skill.mana,
      skill.label,
      skill.description,
    ]);
  }

  return table.toString();
}
