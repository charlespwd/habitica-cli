import * as tasks from '../tasks';
import * as format from '../format';
import {
  log,
} from '../utils';

const TYPES = tasks.TYPES;

export async function habits(args, callback) {
  const habits = await tasks.getTasks({
    type: TYPES.HABITS,
  });

  log(format.tasks(habits, 'all', args.options.notes));

  callback();
}

export async function dailies(args, callback) {
  const dailies = await tasks.getTasks({
    type: TYPES.DAILIES,
  });

  log(format.tasks(dailies, args.options.filter, args.options.notes));

  callback();
}

export async function todos(args, callback) {
  const filter = args.options.filter || 'dated';
  const todos = await tasks.getTodos({ filter });
  log(format.tasks(todos, filter, args.options.notes));
  callback();
}
