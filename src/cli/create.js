import * as tasks from '../tasks';
import * as questions from './questions';
import { log } from '../utils';

const TYPES = tasks.TYPES;
const DIFFICULTIES = tasks.DIFFICULTIES;

export async function todo(args, callback) {
  const message = args.options.message;
  if (message) {
    const answer = await this.prompt([
      questions.confirmTodoMessage(message),
    ]);

    if (answer.confirmTodoMessage) {
      await tasks.create({
        type: TYPES.TODO,
        title: message,
      });
      log('Success!');
    }
  } else {
    const answers = await this.prompt([
      questions.title,
      questions.notes,
    ]);

    await tasks.create({
      type: TYPES.TODO,
      title: answers.title,
      notes: answers.notes,
    });

    log('Success!');
  }

  callback();
}

export async function habit(args, callback) {
  const answers = await this.prompt([
    questions.title,
    questions.notes,
    questions.up,
    questions.down,
    questions.difficulty,
  ]);

  const result = await tasks.create({
    type: TYPES.HABIT,
    title: answers.title,
    notes: answers.notes,
    up: answers.up,
    down: answers.down,
    difficulty: DIFFICULTIES[answers.difficulty],
  });

  log(result);

  log('Success!');

  callback();
}
