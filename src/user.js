import R from 'ramda';
import { request, url } from './api';
import { getContent } from './content';

const state = {
  questDetails: null,
};

export const QUEST_TYPES = {
  COLLECT: 'collect',
  BOSS: 'boss',
};

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
}

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

const getQuestType = (questDetails) => {
  if (!questDetails) {
    return undefined;
  } else if (questDetails.boss) {
    return QUEST_TYPES.BOSS;
  } else if (questDetails.collect) {
    return QUEST_TYPES.COLLECT;
  }
  throw new Error(`Can't figure out quest type for ${JSON.stringify(questDetails)}`);
};

function toQuestDetails(quest, questDetails) {
  const type = getQuestType(questDetails);
  const progress = type === QUEST_TYPES.BOSS
    ? toBossQuestProgress(quest, questDetails)
    : toCollectQuestProgress(quest, questDetails);
  return {
    type,
    progress,
    isActive: quest.active,
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

const getPartyId = R.memoize(async () => {
  const group = await request(url('groups', {
    type: 'party',
  }));

  return R.path(['id'], R.head(group));
});

export async function quest() {
  if (!state.questDetails) {
    const partyId = await getPartyId();
    if (!partyId) return undefined;
    const [content, group] = await Promise.all([
      getContent(),
      request(url(`groups/${partyId}`)),
    ]);
    const quest = group.quest;
    const questDetails = content.quests[quest.key];
    state.questDetails = toQuestDetails(quest, questDetails);
  }

  return state.questDetails;
}

export async function cron() {
  const result = await request(url('cron'), {
    method: 'POST',
  });

  state.questDetails = null;

  return result;
}
