import R from 'ramda';
import { request, url } from './api';

const cache = {
  gear: null,
};

function toShortId(text) {
  return text.replace(/ /g, '_').toLowerCase();
}

function toGearItem(item) {
  return {
    id: item.key,
    shortId: toShortId(item.text),
    label: item.text,
    description: item.notes,
    price: item.value,
    stats: {
      con: item.con,
      str: item.str,
      int: item.int,
      per: item.per,
    },
  };
}

export async function getBuyItems() {
  const data = await request(url('user/inventory/buy'));
  cache.gear = data.map(toGearItem);
  return cache.gear;
}

const findGearByShortId = (shortId, gear = cache.gear) => R.find(
  item => item.shortId === shortId,
  gear,
);

export async function buyGear({ shortId }) {
  if (!cache.gear) await getBuyItems();
  const item = findGearByShortId(toShortId(shortId));
  if (!item) throw new Error(`${shortId} does not exist.`);

  const result = await request(url(`user/buy-gear/${item.id}`), {
    method: 'POST',
  });

  return result._meta; // eslint-disable-line no-underscore-dangle
}
