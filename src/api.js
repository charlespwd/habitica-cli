import request from 'request-promise-native';
import { mergeDeepLeft } from 'ramda';
import * as ini from 'ini';
import * as fs from 'fs';
import * as qs from 'qs';
import * as path from 'path';
import { debug } from './utils';

const BASE_URL = 'https://habitica.com/api/v3';
const CONFIG_HOME = process.env.XDG_CONFIG_HOME || path.join(process.env.HOME, '.config');
const CONFIG_PATH = path.join(CONFIG_HOME, 'habitica', 'auth.cfg');

let config;
try {
  config = ini.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
} catch (e) {
  console.log(`There seems to be a problem with your configuration file.
Does your ${CONFIG_PATH} file exist?

For more information on how to get started, see
https://github.com/charlespwd/habitica-cli#quick-start`);
  process.exit(1);
}

export const getUserID = () => config.Habitica.login;
export const getApiKey = () => config.Habitica.password;
export const url = (uri, options) => `${BASE_URL}/${uri}?${qs.stringify(options)}`;

async function makeRequest(url, params = {}) {
  const start = Date.now();
  const options = mergeDeepLeft(params, {
    json: true,
    headers: {
      'x-api-user': getUserID(),
      'x-api-key': getApiKey(),
    },
  });

  try {
    const response = await request(url, options);

    if (!response.success) {
      throw new Error(response.message);
    }

    const data = response.data;
    Object.defineProperty(data, '__message', {
      enumerable: false,
      value: response.message,
    });

    const dtms = Date.now() - start;
    debug(url, dtms);

    return data;
  } catch (e) {
    if (e.statusCode >= 400 && e.statusCode < 500) {
      throw new Error(e.error.message);
    }
    throw e;
  }
}

export { makeRequest as request };
