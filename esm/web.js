import {
  Uint8Array,
  parseInt,
  securedClass,
  join, map, push,
  slice, substr, toString
} from './helpers.js';

const {protocol, host, pathname} = location;

const asHEX = i => slice('0' + toString(i, 16), -2);

export default securedClass(
  self.crypto,
  protocol + '//' + host + pathname.replace(/\/[^/]*$/i, ''),
  buffer => join(map(new Uint8Array(buffer), asHEX), ''),
  str => {
    const bytes = [];
    for (let i = 0, {length} = str; i < length; i += 2)
      push(bytes, parseInt(substr(str, i, 2), 16));
    return new Uint8Array(bytes);
  }
);
