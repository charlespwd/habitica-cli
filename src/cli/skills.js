import R from 'ramda';
import * as tasks from '../tasks';
import * as skills from '../skills';
import * as format from '../format';
import * as questions from './questions';
import {
  log,
} from '../utils';

export async function list(args, callback) {
  const spells = await skills.getAllUserSkills();
  log(format.skills(spells));
  callback();
}

export async function cast(args, callback) {
  const [spells, allTasks] = await Promise.all([
    skills.getAllUserSkills(),
    Promise.all([
      tasks.getTasks({ type: tasks.TYPES.HABITS }),
      tasks.getTasks({ type: tasks.TYPES.DAILIES }),
      tasks.getTodos({ filter: 'due' }),
    ]),
  ]);

  let skill;
  let skillId;
  let targetId;
  let skillTarget;

  if (!args.spell) {
    const answers = await this.prompt([
      questions.skill(spells),
      questions.skillTargetType,
      questions.skillTarget(allTasks),
    ]);

    skill = answers.skill;
    skillTarget = answers.skillTarget;
    skillId = answers.skill.id;
    targetId = R.path(['skillTarget', 'id'], answers);
  } else {
    const spellName = args.spell.toLowerCase();
    skill = R.find(spell => spell.label.toLowerCase() === spellName, spells);

    if (!skill) {
      throw new Error(`Spell named '${spellName}' does not exist. It's either a typo or you forgot to wrap the spell name in quotes (e.g. cast 'brutal smash' todo 10).`);
    }

    skillId = skill.id;

    const { taskType, taskId } = args;
    if (taskType && taskId) {
      const taskTypeUpper = taskType.toUpperCase();
      const [habits, dailies, todos] = allTasks;
      const findTaskByShortId = R.find(task => task.shortId === taskId.toString());

      if (taskTypeUpper === 'HABIT' || taskTypeUpper === 'HABITS') {
        skillTarget = findTaskByShortId(habits);
      } else if (taskTypeUpper === 'DAILY' || taskTypeUpper === 'DAILIES') {
        skillTarget = findTaskByShortId(dailies);
      } else if (taskTypeUpper === 'TODO' || taskTypeUpper === 'TODOS') {
        skillTarget = findTaskByShortId(todos);
      } else {
        throw new Error('task type not supported try with `habit`, `daily` or `todo`');
      }

      if (!skillTarget) {
        throw new Error(`Could not find ${taskType} with id = ${taskId}`);
      }

      targetId = skillTarget.id;
    }
  }

  try {
    await skills.cast({
      spellId: skillId,
      targetId,
    });
    if (skillTarget) {
      log(`You cast ${skill.label} on ${skillTarget.label}!`);
    } else {
      log(`You cast ${skill.label}!`);
    }
  } catch (e) {
    log(e.message);
  }

  callback();
}
