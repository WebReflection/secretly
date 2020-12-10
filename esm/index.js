import {webcrypto} from 'crypto';
import {cwd} from 'process';
import {Crypto} from 'node-webcrypto-ossl';

import {callerOf, proto, securedClass} from './helpers.js';

const {from} = Buffer;
const toString = callerOf(proto(Buffer).toString);

export default securedClass(
  webcrypto || new Crypto,
  cwd(),
  buffer => toString(from(buffer), 'hex'),
  str => from(str, 'hex')
);
