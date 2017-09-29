import * as tasks from '../tasks';
import { log } from '../utils';

const TYPES = tasks.TYPES;

async function destroyTasks(type, ids = []) {
  await tasks.destroyTasks({ type, ids });
  log('Success!');
}

export async function habits(args, callback) {
  await destroyTasks(TYPES.HABITS, args.ids);
  callback();
}

export async function dailies(args, callback) {
  await destroyTasks(TYPES.DAILIES, args.ids);
  callback();
}

export async function todos(args, callback) {
  await destroyTasks(TYPES.TODOS, args.ids);
  callback();
}

