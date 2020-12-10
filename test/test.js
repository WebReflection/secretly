
module.exports = async Secretly => {

console.assert(Secretly.PATH.length, 'unexpected Secretly.PATH');

const safe = new Secretly('no-shenaigans');

const IN = `this
is
a test!`;

const OUT = await safe.encrypt(IN);

console.log(await new Secretly('pass', 'salt', false).encrypt(IN));

console.assert(
  await safe.decrypt(OUT) === IN,
  'decrypted output is same as input'
);

console.assert(
  await new Secretly('no-shenaigans').encrypt(IN) !== OUT,
  'encrypted output is never the same'
);

console.assert(
  OUT !== IN,
  'encrypted output is different from the input'
);

console.assert(
  await safe.decrypt(await safe.encrypt(IN)) === IN,
  'decrypted text is identical from the input'
);

try {
  const unsafe = new Secretly;
  process.exit(1);
} catch(e) {
  console.assert(true, e.message);
}

const predictable = () => new Secretly('no-shenaigans', 'salt', false);

console.assert(
  await predictable().encrypt(IN) === await predictable().encrypt(IN),
  'encrypted output is always the same'
);

console.assert(
  await predictable().decrypt(await predictable().encrypt(IN)) === IN,
  'decrypted output still works'
);

};
