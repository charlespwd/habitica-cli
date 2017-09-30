import R from 'ramda';
import { request, url } from './api';
import * as tasks from './tasks';

const { TYPES } = tasks;

const REWARD_TYPES = {
  GEAR: 'gear',
  REWARD: 'reward',
  POTION: 'potion',
  ARMOIRE: 'armoire',
};

const cache = {
  gear: null,
};

function toShortId(text) {
  return text.replace(/ /g, '_').toLowerCase();
}

function toGearItem(item) {
  return {
    id: item.key,
    shortId: toShortId(item.text),
    type: REWARD_TYPES.GEAR,
    label: item.text,
    description: item.notes,
    price: item.value,
    stats: {
      con: item.con,
      str: item.str,
      int: item.int,
      per: item.per,
    },
  };
}

export async function getBuyItems() {
  const data = await request(url('user/inventory/buy'));
  return data.map(toGearItem);
}

function rewardToGearItem(reward) {
  return {
    id: reward.id,
    shortId: toShortId(reward.label),
    type: REWARD_TYPES.REWARD,
    label: reward.label,
    description: reward.notes,
    price: reward.value,
    stats: {
      con: 0,
      str: 0,
      int: 0,
      per: 0,
    },
  };
}

export async function getRewards() {
  const [rewards, gear] = await Promise.all([
    tasks.getTasks({
      type: TYPES.REWARDS,
    }),
    getBuyItems(),
  ]);

  cache.rewards = rewards.map(rewardToGearItem).concat(gear);
  return cache.rewards;
}

const findRewardByShortId = (shortId, rewards = cache.rewards) => R.find(
  item => item.shortId === shortId,
  rewards,
);

export async function buyReward({ shortId }) {
  if (!cache.rewards) await getRewards();
  const item = findRewardByShortId(toShortId(shortId));
  if (!item) throw new Error(`${shortId} does not exist.`);

  if (item.type === REWARD_TYPES.REWARD) {
    await tasks.scoreTask({ id: item.id });
    return `Success! Bought ${shortId} for ${item.price} GP.`;
  }

  const result = await request(url(`user/buy/${item.id}`), {
    method: 'POST',
  });

  return result._meta; // eslint-disable-line no-underscore-dangle
}
