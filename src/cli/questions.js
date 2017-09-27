import { DIFFICULTIES } from '../tasks';

export const title = {
  type: 'input',
  name: 'title',
  message: 'What should we call it? ',
  validate(input) {
    return input !== '';
  },
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
