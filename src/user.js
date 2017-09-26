import R from 'ramda';
import { request, url } from './api';

function getUserData() {
  return request(url('user'));
}

function toStats({ stats, profile }) {
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
    class: stats.class,
  };
}

export async function stats() {
  const data = await getUserData();
  return toStats(data);
};

const toCollectName = R.pipe(
  R.pathOr({}, ['collect']),
  R.toPairs,
  R.map(R.path(['1', 'text'])),
  R.join(' '),
);

const toCollect = R.pipe(
  R.pathOr({}, ['collect']),
  R.toPairs,
  R.map(R.path(['1', 'count'])),
  R.sum,
);

function toBossQuestProgress(quest, questDetails) {
  return {
    boss: R.path(['boss', 'name'], questDetails),
    maxHealth: R.path(['boss', 'hp'], questDetails),
    health: R.pathOr(0, ['boss', 'hp'], quest),
  };
}

function toCollectQuestProgress(quest, questDetails) {
  return {
    label: toCollectName(questDetails),
    collected: quest.progress.collectedItems,
    toCollect: toCollect(questDetails),
  };
}

function toQuestDetails(quest, questDetails) {
  const type = questDetails.boss ? 'boss' : 'collect';
  const progress = type === 'boss'
    ? toBossQuestProgress(quest, questDetails)
    : toCollectQuestProgress(quest, questDetails);
  return {
    type,
    progress,
    label: questDetails.text,
    description: questDetails.notes,
    completed: !!quest.completed,
    drop: {
      items: questDetails.drop.items,
      experience: questDetails.drop.exp,
      gold: questDetails.drop.gp,
      unlock: questDetails.drop.unlock,
    },
  };
}

export async function quest() {
  const [content, user] = await Promise.all([
    request(url('content')),
    getUserData(),
  ]);
  const quest = user.party.quest;
  const questDetails = content.quests[quest.key];
  return toQuestDetails(quest, questDetails);
}
