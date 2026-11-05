// npm run diagrams: renders every spec in src/ into out/*.svg.
import fs from 'node:fs';
import path from 'node:path';
import { outDir, renderAll } from './lib/render.mjs';

const files = await renderAll();
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir).filter((f) => f.endsWith('.svg') && !(f in files))) fs.unlinkSync(path.join(outDir, f));
for (const [f, text] of Object.entries(files)) fs.writeFileSync(path.join(outDir, f), text);
console.log(`diagrams: wrote ${Object.keys(files).length} files to ${path.relative(process.cwd(), outDir) || '.'}`);
