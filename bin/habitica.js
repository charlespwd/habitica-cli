#!/usr/bin/env node
require('babel-polyfill');
const run = require('../lib/cli').default;

run();
