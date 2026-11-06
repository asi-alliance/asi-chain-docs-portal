// Loads every spec in src/ and renders it. Shared by build.mjs and check.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { flow } from './flow.mjs';
import { sequence } from './sequence.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const srcDir = path.join(root, 'src');
export const outDir = path.join(root, 'out');

// name -> { 'name.svg': text, 'name.narrow.svg': text }
export function render(name, spec) {
  const s = { ...spec, id: name };
  for (const k of ['title', 'desc']) if (!s[k]) throw new Error(`${name}: spec needs ${k}`);
  const draw = { flow, sequence }[s.kind];
  if (!draw) throw new Error(`${name}: unknown kind "${s.kind}"`);
  const files = { [`${name}.svg`]: draw(s, 'w') };
  if (s.kind === 'sequence' ? s.narrow !== false : s.narrow) files[`${name}.narrow.svg`] = draw(s, 'n');
  return files;
}

export async function renderAll() {
  const out = {};
  for (const f of fs.readdirSync(srcDir).filter((f) => f.endsWith('.mjs')).sort()) {
    const name = f.replace(/\.mjs$/, '');
    const mod = await import(pathToFileURL(path.join(srcDir, f)).href);
    Object.assign(out, render(name, mod.default));
  }
  return out;
}
