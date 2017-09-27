import * as tasks from '../tasks';
import * as user from '../user';
import * as format from '../format';
import {
  log,
} from '../utils';

const TYPES = tasks.TYPES;

export async function habits(args, callback) {
  const stats = await user.stats();
  const scores = await tasks.scoreTasks({
    type: TYPES.HABITS,
    ids: args.ids || [],
    direction: args.options.down ? 'down' : 'up',
  });
  const afterStats = await user.stats();

  log(format.statsDiff(stats, afterStats));
  log(format.scores(scores));

  callback();
}

export async function dailies(args, callback) {
  const stats = await user.stats();
  const scores = await tasks.scoreTasks({
    type: TYPES.DAILIES,
    ids: args.ids || [],
    direction: args.options.down ? 'down' : 'up',
  });
  const afterStats = await user.stats();

  log(format.statsDiff(stats, afterStats));
  log(format.scores(scores));

  callback();
}

export async function todos(args, callback) {
  const stats = await user.stats();
  const isDown = args.options.undo || args.options.down;
  const scores = await tasks.scoreTasks({
    type: TYPES.TODOS,
    ids: args.ids || [],
    direction: isDown ? 'down' : 'up',
  });
  const afterStats = await user.stats();

  log(format.statsDiff(stats, afterStats));
  log(format.scores(scores));

  callback();
}
