"use strict";

const crypto = require('crypto');

const aes = 'aes-256-cbc';
const digest = 'sha256';

const $ = String;
const {concat, from} = Buffer;

const wm = new WeakMap;

module.exports = class Secretly {

  constructor(password, salt = process.env.ENCRYPTION_SALT || aes) {
    const pwd = $(password || '');
    if (!pwd.length)
      throw `[${this.constructor.name}] invalid password`;
    wm.set(this, crypto.pbkdf2Sync(pwd, salt, 8192, 32, digest));
  }

  decrypt(buffer) {
    const parts = $(buffer).split(':');
    const iv = from(parts.shift(), 'hex');
    const encrypted = from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(aes, wm.get(this), iv);
    return $(concat([decipher.update(encrypted), decipher.final()]));
  }

  encrypt(text) {
    const buffer = from(text);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(aes, wm.get(this), iv);
    const encrypted = concat([cipher.update(buffer), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

};
