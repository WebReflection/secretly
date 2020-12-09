# Secretly

[![Build Status](https://travis-ci.com/WebReflection/secretly.svg?branch=master)](https://travis-ci.com/WebReflection/secretly) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/secretly/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/secretly?branch=master)

<sup>**Social Media Photo by [Felix Hanspach](https://unsplash.com/@fhanspach) on [Unsplash](https://unsplash.com/)**</sup>


A basic class to encrypt and decrypt.

```js
// NodeJS
import Secretly from 'secretly';
// or const Secretly = require('secretly');

const pvt = new Secretly(
  'my-password',
  // optional second argument as salt
  process.env.ENCRYPTION_SALT,
  // optional third argument to avoid
  // using a random iv (when same output per input is needed)
  false
);

const encrypted = pvt.encrypt('any text');
const decrypted = pvt.decrypt(encrypted);
```

### Secretly Web

It's the same class with the following differences:

  * both `encrypt` and `decrypt` are *asynchronous*
  * the `salt` parameter is by default the `location.href`
  * there is a static helper to make salts less greedy, which is `Secretly.PATH`, returning the current domain + path without search and hashes, like `location.href` would do
  * the module is *not compatible* with browsers that don't support *ES2015* and it won't be published as such

```js
// Web
import Secretly from '//unpkg.com/secretly/web?module';

const pvt = new Secretly(
  'my-password',
  // optional second argument as salt
  Secretly.PATH,
  // optional third argument to avoid
  // using a random iv (when same output per input is needed)
  false
);

const encrypted = await pvt.encrypt('any text');
const decrypted = await pvt.decrypt(encrypted);
```
