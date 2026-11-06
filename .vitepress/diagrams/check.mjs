// npm run diagrams:check: exits 1 when out/ differs from what the specs render now.
import fs from 'node:fs';
import path from 'node:path';
import { outDir, renderAll } from './lib/render.mjs';

const files = await renderAll();
const bad = [];
for (const [f, text] of Object.entries(files)) {
  const p = path.join(outDir, f);
  if (!fs.existsSync(p)) bad.push(`${f}: missing, run npm run diagrams`);
  else if (fs.readFileSync(p, 'utf8') !== text) bad.push(`${f}: differs from its spec, run npm run diagrams`);
}
if (fs.existsSync(outDir)) for (const f of fs.readdirSync(outDir).filter((f) => f.endsWith('.svg') && !(f in files))) bad.push(`${f}: no spec renders it, run npm run diagrams`);
if (bad.length) { console.error('diagrams:check failed\n  ' + bad.join('\n  ')); process.exit(1); }
console.log(`diagrams:check ok, ${Object.keys(files).length} files`);
