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

function toBossQuestProgress(quest, questDetails) {
  return {
    boss: R.path(['boss', 'name'], questDetails),
    maxHealth: R.path(['boss', 'hp'], questDetails),
    health: R.pathOr(0, ['progress', 'hp'], quest),
  };
}

function toCollectQuestProgress(quest, questDetails) {
  return R.pipe(
    R.pathOr({}, ['collect']),
    R.toPairs,
    R.map(([collectKey, collectInfo]) => ({
      label: collectInfo.text,
      key: collectKey,
      collected: quest.progress.collect[collectKey],
      toCollect: collectInfo.count,
    })),
  )(questDetails);
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

const getContent = R.memoize(() => request(url('content')));
const getPartyId = R.memoize(async () => {
  const group = await request(url('groups', {
    type: 'party',
  }))

  return R.path(['id'], R.head(group));
});

export async function quest() {
  const partyId = await getPartyId();
  const [content, group] = await Promise.all([
    getContent(),
    request(url(`groups/${partyId}`)),
  ]);
  const quest = group.quest;
  const questDetails = content.quests[quest.key];
  return toQuestDetails(quest, questDetails);
}
