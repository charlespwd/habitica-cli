import R from 'ramda';
import * as user from '../user';
import * as rewards from '../rewards';
import * as format from '../format';
import * as questions from './questions';
import {
  log,
  logMsg,
} from '../utils';

export async function shop(args, callback) {
  const [items, stats] = await Promise.all([
    rewards.getRewards(),
    user.stats(),
  ]);
  log(format.rewards(items));
  logMsg(format.goldBalance(stats));
  callback();
}


export async function buy(args, callback) {
  this.isCancelled = false;
  const [items, stats] = await Promise.all([
    rewards.getRewards(),
    user.stats(),
  ]);

  logMsg('');
  logMsg('You enter the shop.');
  logMsg(format.goldBalance(stats));
  logMsg('');

  const answers = await this.prompt([
    questions.reward(items),
  ]);

  // You can cancel mid-prompt with ctrl+c
  if (this.isCancelled) {
    return;
  }

  const shortId = R.find(
    item => format.withEmojis(item.label) === answers.reward,
    items,
  ).shortId;

  logMsg('');

  try {
    const message = await rewards.buyReward({ shortId });
    log(message);
  } catch (e) {
    logMsg(`${e.message}.`);
    logMsg('You leave the shop.');
  }

  logMsg('');

  callback();
}
