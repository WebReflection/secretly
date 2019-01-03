# Secretly

[![Build Status](https://travis-ci.com/WebReflection/secretly.svg?branch=master)](https://travis-ci.com/WebReflection/secretly) 

A basic class to encrypt and decrypt

```js
const Secretly = require('secretly');

// optionally with a salt value as second argument
const pvt = new Secretly('my-password');

const encrypted = pvt.encrypt('any text');
const decrypted = pvt.decrypt(encrypted);
```
