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

cli.command('dailies list', 'List your dailies.')
  .alias('dailies')
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
    log(format.scores(scores));

    callback();
  });

cli.command('todos list', 'List your todos.')
  .alias('todos')
  .alias('t')
  .option('-f, --filter [filter]', 'List filter type (all | dated | completed).', ['all', 'dated', 'completed'])
  .action(async (args, callback) => {
    const filter = args.options.filter || 'dated';
    const todos = await tasks.getTodos({ filter });
    log(format.tasks(todos, filter));
    callback();
  });

cli.command('todos add', 'Create a new task.')
  .alias('new todo')
  .alias('ta')
  .option('-m, --message [message]', 'Use the given [message] as todo title and skip the prompt.')
  .action(async function addTodo(args, callback) {
    const message = args.options.message;
    if (message) {
      const answer = await this.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to create a new todo with title = '${message}'`
      }]);

      if (answer.confirm) {
        await tasks.newTask({
          type: TYPES.TODO,
          title: message,
        });
        log('Success!');
      }

    } else {
      const answers = await this.prompt([{
        type: 'input',
        name: 'title',
        message: 'What should we call it? ',
        validate(input) {
          return input !== '';
        },
      }, {
        type: 'input',
        name: 'notes',
        message: `Any notes? `,
      }]);
      const result = await tasks.newTask({
        type: TYPES.TODO,
        title: answers.title,
        notes: answers.notes,
      });
      log('Success!');
    }

    callback();
  })

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

cli.command('rewards', 'List available gear for purchase.')
  .action(async (args, callback) => {
    const items = await gear.getBuyItems();

    log(format.gear(items));

    callback();
  })

cli.command('quest', 'List current quest details.')
  .action(async (args, callback) => {
    const questDetails = await user.quest();
    log(format.quest(questDetails))
    callback();
  });

export async function run() {
  setLogger(cli.log.bind(cli));
  const stats = await user.stats();
  log(`Welcome back ${stats.userName}!`)
  cli.delimiter('habitica $ ')
    .history('habitica-cli')
    .show();
}
