import R from 'ramda';
import { request, url } from './api';
import * as content from './content';
import * as user from './user';

export async function getAllUserSkills() {
  const [
    allSkills,
    stats,
  ] = await Promise.all([
    content.getAllSkillsByClass(),
    user.stats(),
  ]);

  return allSkills[stats.class];
}
