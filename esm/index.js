import crypto from 'crypto';

const aes = 'aes-256-cbc';
const digest = 'sha256';

const $ = String;
const {concat, from} = Buffer;

const wm = new WeakMap;

export default class {

  constructor(
    password,
    salt = process.env.ENCRYPTION_SALT || aes,
    random = true
  ) {
    const pwd = $(password || '');
    if (!pwd.length)
      throw `[${this.constructor.name}] invalid password`;
    wm.set(this, {
      key: crypto.pbkdf2Sync(pwd, salt, 8192, 32, digest),
      iv: random ? null : crypto.randomBytes(16)
    });
  }

  decrypt(buffer) {
    const parts = $(buffer).split(':');
    const iv = from(parts.shift(), 'hex');
    const encrypted = from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(aes, wm.get(this).key, iv);
    return $(concat([decipher.update(encrypted), decipher.final()]));
  }

  encrypt(text) {
    const {iv, key} = wm.get(this);
    const buffer = from(text);
    const civ = iv || crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(aes, key, civ);
    const encrypted = concat([cipher.update(buffer), cipher.final()]);
    return civ.toString('hex') + ':' + encrypted.toString('hex');
  }

};
