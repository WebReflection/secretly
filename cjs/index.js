'use strict';
const {webcrypto} = require('crypto');
const {cwd} = require('process');

const {callerOf, proto, securedClass} = require('./helpers.js');

const {from} = Buffer;
const toString = callerOf(proto(Buffer).toString);

module.exports = securedClass(
  webcrypto,
  cwd(),
  buffer => toString(from(buffer), 'hex'),
  str => from(str, 'hex')
);
