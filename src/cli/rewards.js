import R from 'ramda';
import colors from 'colors/safe';
import * as user from '../user';
import * as rewards from '../rewards';
import * as format from '../format';
import * as questions from './questions';
import {
  log,
} from '../utils';

export async function shop(args, callback) {
  const [items, stats] = await Promise.all([
    rewards.getRewards(),
    user.stats(),
  ]);
  log(format.rewards(items));
  const gold = Math.floor(stats.gold);
  const silver = (stats.gold - gold) * 100;
  log(`  You have ${colors.yellow(gold.toFixed(0))}${colors.yellow(' GP')} and ${colors.grey(silver.toFixed(0))}${colors.grey(' silver')}.\n`);
  callback();
}

export async function buy(args, callback) {
  const items = await rewards.getRewards();
  const answers = await this.prompt([
    questions.reward(items),
  ]);
  const shortId = R.find(
    item => format.withEmojis(item.label) === answers.reward,
    items,
  ).shortId;

  try {
    const message = await rewards.buyReward({ shortId });
    log(message);
  } catch (e) {
    log(e.message);
  }

  callback();
}
