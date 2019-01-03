const Secretly = require('./index.js');

const safe = new Secretly('no-shenaigans');

const IN = `this
is
a test!`;

const OUT = safe.encrypt(IN);

console.assert(
  safe.decrypt(OUT) === IN,
  'decrypted output is same as input'
);

console.assert(
  safe.encrypt(IN) !== OUT,
  'encrypted output is never the same'
);

console.assert(
  OUT !== IN,
  'encrypted output is different from the input'
);

console.assert(
  safe.decrypt(safe.encrypt(IN)) === IN,
  'decrypted text is identical from the input'
);

try {
  const unsafe = new Secretly;
} catch(e) {
  console.assert(true, e.message);
}

const predictable = new Secretly('no-shenaigans', 'salt', false);

console.assert(
  predictable.encrypt(IN) === predictable.encrypt(IN),
  'encrypted output is always the same'
);

console.assert(
  predictable.decrypt(predictable.encrypt(IN)) === IN,
  'decrypted output still works'
);

