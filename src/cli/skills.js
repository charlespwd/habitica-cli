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

  const answers = await this.prompt([
    questions.skill(spells),
    questions.skillTargetType,
    questions.skillTarget(allTasks),
  ]);

  const skillId = answers.skill.id;
  const targetId = R.path(['skillTarget', 'id'], answers);

  try {
    await skills.cast({
      spellId: skillId,
      targetId,
    });
    if (answers.skillTarget) {
      log(`You cast ${answers.skill.label} on ${answers.skillTarget.label}!`);
    } else {
      log(`You cast ${answers.skill.label}!`);
    }
  } catch (e) {
    log(e.message);
  }

  callback();
}
