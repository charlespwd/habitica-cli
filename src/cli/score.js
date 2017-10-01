import * as tasks from '../tasks';
import * as user from '../user';
import * as format from '../format';
import {
  log,
} from '../utils';

const TYPES = tasks.TYPES;

async function scoreAndLogTask({ type, ids = [], isDown = false }) {
  const [stats, questDetails] = await Promise.all([
    user.stats(),
    user.quest(),
  ]);
  const scores = await tasks.scoreTasks({
    type,
    ids,
    direction: isDown ? 'down' : 'up',
  });
  const afterStats = await user.stats();

  log(format.statsDiff(stats, afterStats));
  log(format.scores(scores, questDetails));
}

export async function habits(args, callback) {
  await scoreAndLogTask({
    type: TYPES.HABITS,
    ids: args.ids,
    isDown: args.options.down,
  });

  callback();
}

export async function dailies(args, callback) {
  await scoreAndLogTask({
    type: TYPES.DAILIES,
    ids: args.ids,
    isDown: args.options.down,
  });

  callback();
}

export async function todos(args, callback) {
  await scoreAndLogTask({
    type: TYPES.TODOS,
    ids: args.ids,
    isDown: args.options.undo || args.options.down,
  });

  callback();
}
