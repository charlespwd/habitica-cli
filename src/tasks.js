import R from 'ramda';
import { request, url } from './api';

const mapIndexed = R.addIndex(R.map);

export const DAYS = {
  SUNDAY: 'su',
  MONDAY: 'm',
  TUESDAY: 't',
  WEDNESDAY: 'w',
  THURSDAY: 'th',
  FRIDAY: 'f',
  SATURDAY: 's',
};

export const FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
};

export const DIFFICULTIES = {
  TRIVIAL: '0.1',
  EASY: '1',
  MEDIUM: '1.5',
  HARD: '2',
};

export const TYPES = {
  DAILY: 'daily',
  HABIT: 'habit',
  REWARD: 'reward',
  TODO: 'todo',

  COMPLETED: 'completedTodos',
  DAILIES: 'dailys',
  HABITS: 'habits',
  REWARDS: 'rewards',
  TODOS: 'todos',
};

// We hold a cache so that the shortIds remain consistent with what was
// displayed on the screen. Otherwise someone might score task with index 1
// and then score the one with index 3 instead of the one with index 2
// because everything got shifted.
const cache = new Map(); // <TYPE, TASKS>

function getFromCache(type) {
  switch (type) {
    case TYPES.COMPLETED:
    case TYPES.TODOS: {
      return [].concat(
        cache.get(TYPES.TODOS),
        cache.get(TYPES.COMPLETED),
      ).filter(R.identity);
    }
    default: {
      return cache.get(type) || [];
    }
  }
}

const toTask = ({ idPrefix }) => (task, i) => ({
  id: task.id,
  shortId: idPrefix + i,
  type: task.type,
  notes: task.notes,
  label: task.text,
  isCompleted: task.completed,
  isDue: (task.type === 'todo' && !task.completed) || task.isDue,
});

export async function getTasks({ type, idPrefix = '' }) {
  const data = await request(url('tasks/user', {
    type,
  }));

  const tasks = mapIndexed(toTask({ idPrefix }), data);
  cache.set(type, tasks);

  return tasks;
}

export function getTodos({ filter }) {
  switch (filter) {
    case 'all': {
      return getAllTodos();
    }

    case 'grey':
    case 'completed': {
      return getCompletedTodos();
    }

    case 'due':
    case 'dated':
    default: {
      return getTasks({
        type: TYPES.TODOS,
      });
    }
  }
}

export async function getCompletedTodos() {
  return getTasks({
    type: TYPES.COMPLETED,
    idPrefix: 'C',
  });
}

export async function getAllTodos() {
  const [todos, completed] = await Promise.all([
    getTasks({ type: TYPES.TODOS }),
    getCompletedTodos(),
  ]);

  return todos.concat(completed);
}

export function create({
  type,
  title,
  notes,
  frequency,
  repeat,
  everyX,
  difficulty = DIFFICULTIES.EASY,
  down = true,
  up = true,
}) {
  return request(url('tasks/user'), {
    method: 'POST',
    body: {
      type,
      notes,
      text: title,
      priority: difficulty,

      // dailies
      frequency,
      everyX,
      repeat,

      // only valid for habits, ignored otherwise
      up,
      down,
    },
  });
}

function scoreResult(data) {
  return {
    health: data.hp,
    mana: data.mp,
    experience: data.exp,
    gold: data.gp,
    drop: R.path(['_tmp', 'drop', 'dialog'], data),
    collected: R.path(['_tmp', 'quest', 'collection'], data),
    damage: R.path(['_tmp', 'quest', 'progressDelta'], data),
  };
}

export async function scoreTask({ id, direction = 'up' }) {
  const data = await request(url(`tasks/${id}/score/${direction}`), {
    method: 'POST',
    body: {
      taskId: id,
      direction,
    },
  });

  return scoreResult(data);
}

export async function scoreTasks({ type, ids, direction = 'up' }) {
  const tasks = getFromCache(type);
  const scoredTasks = ids.map(id => R.find(task => task.shortId === id.toString(), tasks))
    .filter(R.identity)
    .filter(x => (direction === 'up' ? !x.isCompleted : x.isCompleted));
  const taskIds = scoredTasks.map(x => x.id);

  // Doing sequentially because the API can't handle the load.
  const scores = [];
  for (const id of taskIds) {
    const score = await scoreTask({ id, direction }); // eslint-disable-line no-await-in-loop
    scores.push(score);
  }

  // we need to mutate the cache to prevent double spends because somehow
  // the backend doesn't prevent it!
  scoredTasks.forEach((task) => {
    task.isCompleted = !task.isCompleted; // eslint-disable-line no-param-reassign
    task.isDue = !task.isDue; // eslint-disable-line no-param-reassign
  });

  return scores;
}
