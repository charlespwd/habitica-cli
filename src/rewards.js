import { request, url } from './api';

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
  return data.map(toGearItem);
}
