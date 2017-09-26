import * as tasks from './tasks';
import * as user from './user';
import * as gear from './gear';
import * as format from './format';
import {
  log,
  setLogger,
} from './utils';

const TYPES = tasks.TYPES;
const vorpal = require('vorpal');
const cli = vorpal();

cli.command('status', 'List your stats.')
  .alias('stats')
  .action(async (args, callback) => {
    const stats = await user.stats();
    log(format.stats(stats));
    callback();
  });

cli.command('habits', 'List your habits.')
  .alias('h')
  .action(async (args, callback) => {
    const habits = await tasks.getTasks({
      type: TYPES.HABITS,
    });

    log(format.tasks(habits, 'all'));

    callback();
  });

cli.command('habits score [ids...]', 'Score one or multiple habits.')
  .alias('hs')
  .option('-d, --down', 'Score a habit down.')
  .action(async (args, callback) => {
    const stats = await user.stats();
    const scores = await tasks.scoreTasks({
      type: TYPES.HABITS,
      ids: args.ids || [],
      direction: args.options.down ? 'down' : 'up',
    });
    const afterStats = await user.stats();

    log(format.statsDiff(stats, afterStats));

    callback();
  });

cli.command('dailies', 'List your dailies.')
  .alias('d')
  .option('-f, --filter [filter]', 'List filter type (all | due | grey).', ['due', 'all', 'grey'])
  .action(async (args, callback) => {
    const dailies = await tasks.getTasks({
      type: TYPES.DAILIES,
    });

    log(format.tasks(dailies, args.options.filter));

    callback();
  });

cli.command('dailies complete [ids...]', 'Complete one or multiple dailies.')
  .alias('dailies score')
  .alias('dc')
  .alias('ds')
  .option('-d, --down', 'Undo a complete action on a task.')
  .action(async (args, callback) => {
    const stats = await user.stats();
    const scores = await tasks.scoreTasks({
      type: TYPES.DAILIES,
      ids: args.ids || [],
      direction: args.options.down ? 'down' : 'up',
    });
    const afterStats = await user.stats();

    log(format.statsDiff(stats, afterStats));

    callback();
  });

cli.command('todos', 'List your todos.')
  .alias('t')
  .option('-f, --filter [filter]', 'List filter type (all | dated | completed).', ['all', 'dated', 'completed'])
  .action(async (args, callback) => {
    const filter = args.options.filter || 'dated';
    const todos = await tasks.getTodos({ filter });
    log(format.tasks(todos, filter));
    callback();
  });

cli.command('todos complete [ids...]', 'Score one or multiple habits.')
  .alias('todos score')
  .alias('tc')
  .alias('ts')
  .option('-u, --undo', 'Uncomplete a todo.')
  .option('-d, --down', 'Uncomplete a todo. (alias)')
  .action(async (args, callback) => {
    const stats = await user.stats();
    const isDown = args.options.undo || args.options.down;
    const scores = await tasks.scoreTasks({
      type: TYPES.TODOS,
      ids: args.ids || [],
      direction: isDown ? 'down' : 'up',
    });
    const afterStats = await user.stats();

    log(format.statsDiff(stats, afterStats));

    callback();
  });

cli.command('gear', 'List available gear for purchase.')
  .action(async (args, callback) => {
    const items = await gear.getBuyItems();

    log(format.gear(items));

    callback();
  })

export async function run() {
  setLogger(cli.log.bind(cli));
  const stats = await user.stats();
  log(`Welcome back ${stats.userName}!`)
  cli.delimiter('habitica $ ')
    .history('habitica-cli')
    .show();
}
