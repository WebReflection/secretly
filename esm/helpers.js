const $String = String;
const $TextDecoder = TextDecoder;
const $TextEncoder = TextEncoder;
const $Uint8Array = Uint8Array;
const $parseInt = parseInt;

// https://github.com/WebReflection/caller-of#readme
const callerOf = method => method.call.bind(method);
const proto = ({prototype}) => prototype;

const wm = new WeakMap;
const get = wm.get.bind(wm);
const set = wm.set.bind(wm);

const arrayProto = proto(Array);
const join = callerOf(arrayProto.join);
const map = callerOf(arrayProto.map);
const push = callerOf(arrayProto.push);

const stringProto = proto($String);
const slice = callerOf(stringProto.slice);
const substr = callerOf(stringProto.substr);

const toString = callerOf(proto(Number).toString);

const decode = callerOf(proto($TextDecoder).decode);
const encode = callerOf(proto($TextEncoder).encode);

const {freeze} = Object;

const securedClass = (crypto, PATH, asHex, fromHex) => {
  const getRandomValues = crypto.getRandomValues.bind(crypto);

  const {subtle} = crypto;
  const decrypt = callerOf(subtle.decrypt);
  const encrypt = callerOf(subtle.encrypt);
  const deriveKey = callerOf(subtle.deriveKey);
  const importKey = callerOf(subtle.importKey);

  // big thanks to Webbjocke article for this bit of the Web Crypto API
  // https://webbjocke.com/javascript-web-encryption-and-hashing-with-the-crypto-api/
  const createKey = async (password, salt) => {
    const name = 'PBKDF2';
    const derived = {name: 'AES-GCM', length: 256};
    const encoded = encode(new $TextEncoder, password);
    const key = await importKey(subtle, 'raw', encoded, {name}, false, ['deriveKey']);
    return deriveKey(
      subtle,
      {
        name,
        hash: 'SHA-256',
        salt: encode(new $TextEncoder, salt),
        iterations: 1000
      },
      key,
      derived,
      false,
      ['encrypt', 'decrypt']
    );
  };

  class Secretly {

    /**
     * Used as default salt, it returns `process.cwd()` in NodeJS,
     * and location up to the last path's `/` on the Web.
     * @returns {string}
     */
    static get PATH() { return PATH; }

    /**
     * Initialize a Secretly instance.
     * @param {string} password a generic password.
     * @param {string?} salt a non-empty string to use as salt, it's Secretly.PATH by default.
     * @param {boolean?} random avoid iv's randomness to enable enc/decryption across sessions.
     */
    constructor(
      password,
      salt = PATH,
      random = true
    ) {
      if (!password || !salt) {
        password = salt = '';
        throw new TypeError(`invalid password or salt`);
      }
      const buffer = new Uint8Array(16);
      set(this, {
        key: createKey(String(password), String(salt)),
        info: {
          name: 'AES-GCM',
          length: 256,
          iv: random ?
                getRandomValues(buffer) :
                buffer
        }
      });
    }

    /**
     * Decrypt a previously encrypted string.
     * @param {string} encrypted an encrypted string as hex.
     * @returns {Promise<string>}
     */
    async decrypt(encrypted) {
      const {key, info} = get(this);
      return decode(
        new $TextDecoder,
        await decrypt(subtle, info, await key, fromHex(encrypted))
      );
    }

    /**
     * Encrypt a generic string.
     * @param {string} decrypted a generic string to encrypt.
     * @returns {Promise<string>}
     */
    async encrypt(decrypted) {
      const {key, info} = get(this);
      const encrypted = encode(new $TextEncoder, decrypted);
      return asHex(await encrypt(subtle, info, await key, encrypted));
    }
  }

  freeze(proto(Secretly));

  return freeze(Secretly);
};

export {
  $Uint8Array as Uint8Array,
  $parseInt as parseInt,
  callerOf, proto, securedClass,
  join, map, push, slice, substr, toString
};
