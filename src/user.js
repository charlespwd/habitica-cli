import R from 'ramda';
import { request, url } from './api';

function toStats({ stats, profile }) {
  return {
    userName: profile.name,
    mana: stats.mp,
    maxMana: stats.maxMP,
    health: stats.hp,
    maxHealth: stats.maxHealth,
    gold: stats.gp,
    experience: stats.exp,
    toNextLevel: stats.toNextLevel,
    level: stats.lvl,
    class: stats.class,
  };
}

export async function stats() {
  const data = await request(url('user'));
  return toStats(data);
};
