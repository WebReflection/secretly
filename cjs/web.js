'use strict';
// https://github.com/WebReflection/caller-of#readme
const callerOf = method => method.call.bind(method);
const proto = ({prototype}) => prototype;

// secured globals
const {
  crypto, location, parseInt,
  Array,
  Number,
  Object,
  String,
  TextDecoder, TextEncoder,
  Uint8Array,
  WeakMap
} = self;

// secured WeakMap methods
const wm = new WeakMap;
const get = callerOf(wm.get);
const set = callerOf(wm.set);

// secured Array methods
let tmp = proto(Array);
const join = callerOf(tmp.join);
const map = callerOf(tmp.map);
const push = callerOf(tmp.push);

// secured TextDecoder / TextEncoder methods
const decode = callerOf(proto(TextDecoder).decode);
const encode = callerOf(proto(TextEncoder).encode);

// secured crypto methods
const getRandomValues = callerOf(crypto.getRandomValues);

// secured crypto.subtle methods
const {subtle} = crypto;
const decrypt = callerOf(subtle.decrypt);
const encrypt = callerOf(subtle.encrypt);
const deriveKey = callerOf(subtle.deriveKey);
const importKey = callerOf(subtle.importKey);

// secured String methods
tmp = proto(String);
const slice = callerOf(tmp.slice);
const substr = callerOf(tmp.substr);

// secured Number methods
const toString = callerOf(proto(Number).toString);

// secured freeze
const {freeze} = Object;

const asHEX = i => slice('0' + toString(i, 16), -2);

// big thanks to Webbjocke article for this bit of the Web Crypto API
// https://webbjocke.com/javascript-web-encryption-and-hashing-with-the-crypto-api/
const genEncryptionKey = async (password, salt) => {
  const name = 'PBKDF2';
  const derived = {name: 'AES-GCM', length: 256};
  const encoded = encode(new TextEncoder, password);
  const key = await importKey(subtle, 'raw', encoded, {name}, false, ['deriveKey']);
  return deriveKey(
    subtle,
    {
      name,
      hash: 'SHA-256',
      salt: encode(new TextEncoder, salt),
      iterations: 1000
    },
    key,
    derived,
    false,
    ['encrypt', 'decrypt']
  );
};

const hex = buff => join(map(new Uint8Array(buff), asHEX), '');

const xeh = str => {
  const bytes = [];
  for (let i = 0, {length} = str; i < length; i += 2)
    push(bytes, parseInt(substr(str, i, 2), 16));
  return new Uint8Array(bytes);
};

class Secretly {

  static get PATH() {
    const {protocol, host, pathname} = location;
    return protocol + '//' + host + pathname;
  }

  constructor(
    password,
    salt = location.href,
    random = true
  ) {
    const pwd = String(password || '');
    if (!pwd || !salt)
      throw new TypeError(`invalid password`);
    const buffer = new Uint8Array(16);
    set(wm, this, {
      key: genEncryptionKey(pwd, salt),
      info: {
        name: 'AES-GCM',
        length: 256,
        iv: random ?
              getRandomValues(crypto, buffer) :
              buffer
      }
    });
  }

  async decrypt(encrypted) {
    const {key, info} = get(wm, this);
    const descrypted = await decrypt(subtle, info, await key, xeh(encrypted));
    return decode(new TextDecoder, descrypted);
  }

  async encrypt(decrypted) {
    const {key, info} = get(wm, this);
    const encrypted = encode(new TextEncoder, decrypted);
    return hex(await encrypt(subtle, info, await key, encrypted));
  }
}

freeze(proto(Secretly));

module.exports = freeze(Secretly);
