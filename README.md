# Secretly

[![Build Status](https://travis-ci.com/WebReflection/secretly.svg?branch=master)](https://travis-ci.com/WebReflection/secretly) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/secretly/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/secretly?branch=master)

<sup>**Social Media Photo by [Felix Hanspach](https://unsplash.com/@fhanspach) on [Unsplash](https://unsplash.com/)**</sup>


A basic class to encrypt and decrypt.

## Usage

```js
// NodeJS
import Secretly from 'secretly';
// or const Secretly = require('secretly');

// Web
// import Secretly from 'secretly/web';
// or import Secretly from 'https://unpkg.com/secretly/esm/web.js';

const pvt = new Secretly(secret, Secretly.PATH);

const encrypted = await pvt.encrypt('any text');
const decrypted = await pvt.decrypt(encrypted);
```

## API

  * `constructor(password, salt = Secretly.PATH, random = true)` where both `password` and `salt` cannot be empty strings. The `Secretly.PATH` is the `process.cwd()` in *NodeJS*, and the current location up to the last `/` in the browser. The third `random` is used to have *different* results across sessions, while if forced to `false` there won't be randomness in the derived *iv key*, so while encrypted content will be reusable across different sessions, assuming also the `salt` is the same, it might be less secure.
  * `async encrypt(plain_text) => encrypted_hex`
  * `async decrypt(encrypted_hex) => plain_text`

## Compatibility

This module requires *ES2015* compatible browsers on the client side, and *NodeJS* 15+ on the backend for the native `crypto.webcrypto` API, which is polyfilled via [node-webcrypto-ossl](https://www.npmjs.com/package/node-webcrypto-ossl).

If interested in using the synchronous, *NodeJS* only version of this module, which produces different results but in terms of API it works identically, you can use `secretly@1` instead, which has been successfully tested, and used, from *NodeJS* version *8* up to version *15*.

### Breaking V2

After bringing this module to the *Web*, and discovering that *NodeJS* has a `crypto.webcrypto` that works the same, I've decided to make this module identical for both *Web* and *NodeJS*, making it portable client/server.
