import R from 'ramda';
import { request, url } from './api';
const mapIndexed = R.addIndex(R.map);

export const TYPES = {
  DAILIES: 'dailys',
  HABITS: 'habits',
  TODOS: 'todos',
  REWARDS: 'rewards',
  COMPLETED: 'completedTodos',
};

function toTask(task, i) {
  return {
    id: task.id,
    shortId: i,
    type: task.type,
    notes: task.notes,
    label: task.text,
    isCompleted: task.completed,
    isDue: task.isDue,
  }
}

export async function getTasks({ type }) {
  const data = await request(url('tasks/user', {
    type,
  }));

  return mapIndexed(toTask, data);
}

function scoreResult(data) {
  return {
    health: data.hp,
    mana: data.mp,
    experience: data.exp,
    gold: data.gp,
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
  const tasks = await getTasks({ type });
  const taskIds = ids.map(id => tasks[id])
    .filter(R.identity)
    .filter(x => direction === 'up' ? !x.isCompleted : x.isCompleted)
    .map(x => x.id);

  return await Promise.all(taskIds.map(id => scoreTask({ id, direction })));
}
