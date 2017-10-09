import * as skills from '../skills';
import * as format from '../format';
import {
  log,
} from '../utils';

export async function list(args, callback) {
  const spells = await skills.getAllUserSkills();
  log(format.skills(spells));
  callback();
}
