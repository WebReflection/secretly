# Secretly

[![Build Status](https://travis-ci.com/WebReflection/secretly.svg?branch=master)](https://travis-ci.com/WebReflection/secretly) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/secretly/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/secretly?branch=master)

A basic class to encrypt and decrypt

```js
const Secretly = require('secretly');

// optionally with a salt value as second argument
const pvt = new Secretly('my-password');

const encrypted = pvt.encrypt('any text');
const decrypted = pvt.decrypt(encrypted);
```
