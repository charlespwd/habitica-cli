import R from 'ramda';
import { withEmojis, withoutEmojis } from '../format';
import {
  DAYS,
  DIFFICULTIES,
  FREQUENCIES,
} from '../tasks';

export const title = {
  type: 'input',
  name: 'title',
  message: 'What should we call it? ',
  validate: input => input !== '',
};

export const notes = {
  type: 'input',
  name: 'notes',
  message: 'Any notes? ',
};

export const confirmTodoMessage = message => ({
  type: 'confirm',
  name: 'confirmTodoMessage',
  message: `Are you sure you want to create a new todo with title = '${message}'`,
});

export const up = {
  type: 'confirm',
  name: 'up',
  message: 'Positive? ',
};

export const down = {
  type: 'confirm',
  name: 'up',
  message: 'Negative? ',
  prefix: '',
  suffix: '',
};

export const difficulty = {
  type: 'list',
  name: 'difficulty',
  message: 'How difficult? ',
  choices: Object.keys(DIFFICULTIES),
  default: 'EASY',
};

export const frequency = {
  type: 'list',
  name: 'frequency',
  message: 'Daily or weekly? ',
  choices: Object.keys(FREQUENCIES),
  default: 'DAILY',
};

export const repeat = {
  type: 'checkbox',
  name: 'repeat',
  message: 'Days of the week? ',
  choices: Object.keys(DAYS),
  when: answers => answers.frequency === 'WEEKLY',
};

export const everyX = {
  type: 'input',
  name: 'everyX',
  message: 'Every [x] days? x = ',
  default: 1,
  filter: input => parseInt(input, 10),
  validate: (input) => {
    const int = parseInt(input, 10);
    return !Number.isNaN(int) && int > 0;
  },
  when: answers => answers.frequency === 'DAILY',
};

export const reward = rewards => ({
  type: 'list',
  name: 'reward',
  message: 'What are you looking for? ',
  choices: rewards.map(R.pipe(R.prop('label'), withEmojis)),
});

export const skill = skills => ({
  type: 'list',
  name: 'skill',
  message: 'What are you going to cast? ',
  choices: skills.map(x => ({
    name: x.label,
    value: x,
  })),
});

export const skillTargetType = {
  type: 'list',
  name: 'skillTargetType',
  message: 'What type of task?',
  choices: ['HABIT', 'DAILY', 'TODO'],
  when: answers => answers.skill.target === 'task',
};

const toLabel = R.pipe(R.prop('label'), withEmojis);
const toChoice = x => ({
  name: toLabel(x),
  value: x,
});

export const skillTarget = tasks => ({
  type: 'list',
  name: 'skillTarget',
  message: 'What is your target?',
  choices: ({ skillTargetType }) => {
    const [habits, dailies, todos] = tasks;

    if (skillTargetType === 'HABIT') {
      return habits.map(toChoice);
    }

    if (skillTargetType === 'DAILY') {
      return dailies.map(toChoice);
    }

    if (skillTargetType === 'TODO') {
      return todos.map(toChoice);
    }

    return [];
  },
  when: answers => !!answers.skillTargetType,
});
