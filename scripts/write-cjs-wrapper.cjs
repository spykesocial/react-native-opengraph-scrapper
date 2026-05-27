const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const cjsEntry = path.join(distDir, 'index.cjs');
const runtimeEntry = path.join(distDir, 'index.runtime.cjs');

if (fs.existsSync(runtimeEntry)) {
  fs.rmSync(runtimeEntry);
}

fs.renameSync(cjsEntry, runtimeEntry);

fs.writeFileSync(cjsEntry, `'use strict';

const mod = require('./index.runtime.cjs');
const run = mod.default || mod.run;

module.exports = run;
Object.assign(module.exports, mod, {
  default: run,
  run: mod.run || run,
});
`);
