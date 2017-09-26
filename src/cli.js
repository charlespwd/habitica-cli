import {
  TYPES,
  getTasks,
  scoreTasks,
} from './tasks';
import * as user from './user';
import * as format from './format';
import {
  log,
  setLogger,
} from './utils';

const vorpal = require('vorpal');
const cli = vorpal();

cli.command('status', 'list your stats')
  .action(async (args, callback) => {
    const stats = await user.stats();
    log(format.stats(stats));
    callback();
  });

cli.command('habits', 'list your habits')
  .alias('h')
  .action(async (args, callback) => {
    const habits = await getTasks({
      type: TYPES.HABITS,
    });

    log(format.tasks(habits, 'all'));

    callback();
  });

cli.command('habits score [ids...]', 'score one or multiple habits')
  .alias('hs')
  .option('-d, --down', 'score a habit down')
  .action(async (args, callback) => {
    const stats = await user.stats();
    const scores = await scoreTasks({
      type: TYPES.HABITS,
      ids: args.ids || [],
      direction: args.options.down ? 'down' : 'up',
    });
    const afterStats = await user.stats();

    log(format.statsDiff(stats, afterStats));

    callback();
  });

cli.command('dailies', 'list your dailies')
  .alias('d')
  .option('-f, --filter [filter]', 'list filter type (all | due | grey)', ['due', 'all', 'grey'])
  .action(async (args, callback) => {
    const dailies = await getTasks({
      type: TYPES.DAILIES,
    });

    log(format.tasks(dailies, args.options.filter));

    callback();
  });

cli.command('dailies complete [ids...]', 'complete one or multiple dailies')
  .alias('dailies score')
  .alias('dc')
  .alias('ds')
  .option('-d, --down', 'Undo a complete action on a task')
  .action(async (args, callback) => {
    const stats = await user.stats();
    const scores = await scoreTasks({
      type: TYPES.DAILIES,
      ids: args.ids || [],
      direction: args.options.down ? 'down' : 'up',
    });
    const afterStats = await user.stats();

    log(format.statsDiff(stats, afterStats));

    callback();
  });

cli.command('todos', 'list your todos')
  .alias('t')
  .action(async (args, callback) => {
    const habits = await getTasks({
      type: TYPES.TODOS,
    });

    log(format.tasks(habits, 'all'));

    callback();
  });

cli.command('todos complete [ids...]', 'score one or multiple habits')
  .alias('todos score')
  .alias('tc')
  .alias('ts')
  .option('-u, --undo', 'uncomplete a todo')
  .action(async (args, callback) => {
    const stats = await user.stats();
    const scores = await scoreTasks({
      type: TYPES.TODOS,
      ids: args.ids || [],
      direction: args.options.undo ? 'down' : 'up',
    });
    const afterStats = await user.stats();

    log(format.statsDiff(stats, afterStats));

    callback();
  });


export function run() {
  setLogger(cli.log.bind(cli));
  cli.delimiter('habitica $ ')
    .history('habitica-cli')
    .show();
}
