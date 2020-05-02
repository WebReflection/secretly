# Secretly

[![Build Status](https://travis-ci.com/WebReflection/secretly.svg?branch=master)](https://travis-ci.com/WebReflection/secretly) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/secretly/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/secretly?branch=master)

A basic class to encrypt and decrypt

```js
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
