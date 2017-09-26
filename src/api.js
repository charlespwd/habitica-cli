import request from 'request-promise-native';
import { mergeDeepLeft } from 'ramda';
import * as ini from 'ini';
import * as fs from 'fs';
import * as qs from 'qs';

const BASE_URL = 'https://habitica.com/api/v3';
const CONFIG_PATH = `${process.env.XDG_CONFIG_HOME}/habitica/auth.cfg`;
const config = ini.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

export const getUserID = () => config.Habitica.login;
export const getApiKey = () => config.Habitica.password;
export const url = (uri, options) => `${BASE_URL}/${uri}?${qs.stringify(options)}`;

async function makeRequest(url, params = {}) {
  const options = mergeDeepLeft(params, {
    json: true,
    headers: {
      'x-api-user': getUserID(),
      'x-api-key': getApiKey(),
    },
  });

  const response = await request(url, options);
  if (!response.success) {
    throw new Error(response.data);
  }

  return response.data;
}

export { makeRequest as request };
