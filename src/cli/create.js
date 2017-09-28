import * as tasks from '../tasks';
import * as questions from './questions';
import { log } from '../utils';

const DAYS = tasks.DAYS;
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
      questions.difficulty,
    ]);

    await tasks.create({
      type: TYPES.TODO,
      title: answers.title,
      notes: answers.notes,
      difficulty: DIFFICULTIES[answers.difficulty],
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

  await tasks.create({
    type: TYPES.HABIT,
    title: answers.title,
    notes: answers.notes,
    up: answers.up,
    down: answers.down,
    difficulty: DIFFICULTIES[answers.difficulty],
  });

  log('Success!');

  callback();
}

const convertRepeat = repeat => repeat && ({
  [DAYS.SUNDAY]: repeat.SUNDAY,
  [DAYS.MONDAY]: repeat.MONDAY,
  [DAYS.TUESDAY]: repeat.TUESDAY,
  [DAYS.WEDNESDAY]: repeat.WEDNESDAY,
  [DAYS.THURSDAY]: repeat.THURSDAY,
  [DAYS.FRIDAY]: repeat.FRIDAY,
  [DAYS.SATURDAY]: repeat.SATURDAY,
});

export async function daily(args, callback) {
  const answers = await this.prompt([
    questions.title,
    questions.notes,
    questions.difficulty,
    questions.frequency,
    questions.repeat,
    questions.everyX,
  ]);

  await tasks.create({
    type: TYPES.DAILY,
    title: answers.title,
    notes: answers.notes,
    difficulty: DIFFICULTIES[answers.difficulty],
    frequency: answers.frequency,
    everyX: answers.everyX,
    repeat: convertRepeat(answers.repeat),
  });

  log('Success!');

  callback();
}
