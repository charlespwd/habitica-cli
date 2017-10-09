import R from 'ramda';
import { request, url } from './api';

export const getContent = R.memoize(() => request(url('content')));

const toSkills = R.pipe(
  R.prop('spells'),
  R.map(R.pipe(
    R.values,
    R.map(spell => ({
      id: spell.key,
      label: spell.text,
      mana: spell.mana,
      level: spell.lvl,
      description: spell.notes,
      target: spell.target,
    })),
  )),
);

export const getAllSkillsByClass = R.memoize(async () => {
  const content = await getContent();
  return toSkills(content);
});
