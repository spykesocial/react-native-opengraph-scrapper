'use strict';

const mod = require('./index.runtime.cjs');
const run = mod.default || mod.run;

module.exports = run;
Object.assign(module.exports, mod, {
  default: run,
  run: mod.run || run,
});
