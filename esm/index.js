import {webcrypto} from 'crypto';
import {cwd} from 'process';

import {callerOf, proto, securedClass} from './helpers.js';

const {from} = Buffer;
const toString = callerOf(proto(Buffer).toString);

export default securedClass(
  webcrypto,
  cwd(),
  buffer => toString(from(buffer), 'hex'),
  str => from(str, 'hex')
);
