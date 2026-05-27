import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
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
