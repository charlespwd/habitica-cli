import 'babel-polyfill';
import talkback from 'talkback';
import path from 'path';
import { expect } from 'chai';

import { getContent } from '../src/content';


const PROXY_URL = 'http://localhost:3000/api/v3';
const opts = {
  host: "https://habitica.com",
  record: talkback.Options.RecordMode.NEW,
  port: 3000,
  path: path.join(__dirname, "tapes"),
  ignoreHeaders: ['x-api-user', 'x-api-key'],
};
const proxy = talkback(opts);
proxy.start(() => console.log('Talk back started...'))

describe('getContent', () => {

  beforeEach(function () {
    this.timeout(100000);
  });

  after(() => proxy.close());

  it('get all contents', async () => {
    const res = await getContent(PROXY_URL);

    expect(Object.keys(res)).to.have.lengthOf(48);
  });

  it('contains achivements', async () => {
    const res = await getContent(PROXY_URL);
    expect(res).to.have.property('achievements');
  });
});
