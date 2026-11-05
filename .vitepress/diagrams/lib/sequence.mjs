// Sequence diagrams on a fixed grid: participants in a row, messages top to bottom, numbered in order.
// Column gaps grow until every message label fits between its two lifelines.
import { FS, esc, cw, tw, wrap } from './text.mjs';
import { svgOpen, defs, n2 } from './svg.mjs';

const FRAMES = ['opt', 'loop', 'alt'];
const KINDS = ['chain', 'store', 'service', 'external'];
const fail = (spec, msg) => { throw new Error(`${spec.id}: ${msg}`); };

const WIDE = { gap: 150, wrapMsg: 34, wrapSelf: 36, headWrap: 20, pad: 44 };

export function sequence(spec, variant = 'w') {
  const o = { ...WIDE, ...(variant === 'n' ? spec.narrow || {} : {}) };
  const P = spec.participants;
  const idx = Object.fromEntries(P.map((p, i) => [p.id, i]));
  if (Object.keys(idx).length !== P.length) fail(spec, 'duplicate participant id');
  for (const p of P) if (p.kind && !KINDS.includes(p.kind)) fail(spec, `participant "${p.id}": unknown kind "${p.kind}"`);
  const need = (id, where) => { if (!(id in idx)) fail(spec, `${where} names unknown participant "${id}"`); };
  const id = `${spec.id}-${variant}`;
  const numbered = true;

  const hl = P.map((p) => wrap(p.label, o.headWrap));
  const hw = hl.map((ls) => Math.max(...ls.map((l) => tw(l, FS.node))) + 28);
  const hh = Math.max(...hl.map((l) => l.length)) * 16 + 20;
  const gaps = P.slice(1).map((_, i) => Math.max(o.gap * 0.6, (hw[i] + hw[i + 1]) / 2 + 16));

  // flatten steps: frames become start and end markers, messages and notes get a depth
  const flat = [];
  let n = 0;
  const add = (st, depth) => {
    if (st.frame) {
      if (!FRAMES.includes(st.frame)) fail(spec, `unknown frame "${st.frame}"`);
      flat.push({ t: 'start', st, depth });
      st.steps.forEach((x) => add(x, depth + 1));
      flat.push({ t: 'end', st, depth });
    } else if (st.note !== undefined) {
      st.over.forEach((i) => need(i, 'note'));
      flat.push({ t: 'note', st, depth });
    } else {
      need(st.from, `message "${st.label}"`); need(st.to, `message "${st.label}"`);
      flat.push({ t: 'msg', st, depth, n: ++n });
    }
  };
  spec.steps.forEach((st) => add(st, 0));
  const msgs = flat.filter((f) => f.t === 'msg');
  for (const m of msgs) {
    const a = idx[m.st.from], b = idx[m.st.to];
    m.lines = wrap(m.st.label, a === b ? o.wrapSelf : o.wrapMsg);
    m.w = Math.max(...m.lines.map((l) => tw(l, FS.label)));
  }
  const span = (m) => Math.abs(idx[m.st.from] - idx[m.st.to]);
  for (const m of msgs.filter((m) => span(m) > 0).sort((p, q) => span(p) - span(q))) {
    const a = Math.min(idx[m.st.from], idx[m.st.to]), b = Math.max(idx[m.st.from], idx[m.st.to]);
    const want = m.w + o.pad + 22;
    let have = 0;
    for (let i = a; i < b; i++) have += gaps[i];
    if (have < want) for (let i = a; i < b; i++) gaps[i] += (want - have) / (b - a);
  }
  const X = [hw[0] / 2 + 8];
  gaps.forEach((g) => X.push(X[X.length - 1] + g));

  let y = hh + 26;
  const rows = [];
  const stack = [];
  const lineH = 14;
  const colsOf = (st) => st.steps.flatMap((x) => (x.frame ? colsOf(x) : x.note !== undefined ? x.over.map((i) => idx[i]) : [idx[x.from], idx[x.to]]));
  for (const f of flat) {
    if (f.t === 'start') {
      const cs = colsOf(f.st);
      const avail = X[Math.max(...cs)] + 28 - (X[Math.min(...cs)] - 28) - tw(f.st.frame, FS.small) - 44;
      f.cl = wrap(f.st.label, Math.max(10, Math.floor(avail / cw(FS.small))));
      y += 8; stack.push({ f, y0: y, minc: 99, maxc: -1 }); y += 28 + (f.cl.length - 1) * 13;
    } else if (f.t === 'end') {
      const g = stack.pop(); g.y1 = y + 2; rows.push({ g }); y += 12;
    } else if (f.t === 'note') {
      const cs = f.st.over.map((i) => idx[i]);
      const a = Math.min(...cs), b = Math.max(...cs);
      const width = Math.max(X[b] - X[a] + 56, 90);
      f.lines = wrap(f.st.note, Math.max(8, Math.floor((width - 20) / cw(FS.small))));
      const h = f.lines.length * 13 + 14;
      rows.push({ note: f, a, b, y, h, width });
      stack.forEach((g) => { g.minc = Math.min(g.minc, a); g.maxc = Math.max(g.maxc, b); });
      y += h + 8;
    } else {
      const a = idx[f.st.from], b = idx[f.st.to];
      const h = a === b ? Math.max(f.lines.length * lineH, 24) + 12 : f.lines.length * lineH + 20;
      const ay = a === b ? y + 6 : y + f.lines.length * lineH + 8;
      rows.push({ m: f, a, b, y, ay, h });
      stack.forEach((g) => { g.minc = Math.min(g.minc, a, b); g.maxc = Math.max(g.maxc, a, b); });
      y += h + 8;
    }
  }
  let W = X[X.length - 1] + hw[hw.length - 1] / 2 + 8;
  for (const r of rows) {
    if (r.m && r.a === r.b) W = Math.max(W, X[r.a] + 46 + r.m.w + 8 + 18);
    if (r.note) W = Math.max(W, (X[r.a] + X[r.b]) / 2 + r.width / 2 + 8);
  }
  const H = y + 6;
  let s = defs(id);
  P.forEach((_, i) => { s += `<line x1="${n2(X[i])}" y1="${hh}" x2="${n2(X[i])}" y2="${H - 4}" class="d-life"/>`; });
  for (const r of rows) {
    if (!r.g) continue;
    const g = r.g, x0 = X[g.minc] - 28, x1 = X[g.maxc] + 28;
    W = Math.max(W, x1 + 8);
    s += `<g class="d-fragment"><rect x="${n2(x0)}" y="${g.y0}" width="${n2(x1 - x0)}" height="${g.y1 - g.y0}" rx="8"/><path d="M${n2(x0)} ${g.y0 + 22}h${tw(g.f.st.frame, FS.small) + 22}v-22" class="d-fragline"/><text x="${n2(x0 + 11)}" y="${g.y0 + 15}" class="d-meta d-strong">${esc(g.f.st.frame)}</text>`;
    g.f.cl.forEach((t, j) => { s += `<text x="${n2(x0 + tw(g.f.st.frame, FS.small) + 34)}" y="${g.y0 + 15 + j * 13}" class="d-meta">${esc(t)}</text>`; });
    s += '</g>';
  }
  P.forEach((p, i) => {
    const x = X[i] - hw[i] / 2;
    s += `<g class="d-node d-${p.kind || 'service'}"><rect x="${n2(x)}" y="0" width="${n2(hw[i])}" height="${hh}" rx="10"/></g>`;
    hl[i].forEach((l, j) => { s += `<text x="${n2(X[i])}" y="${n2(hh / 2 + 4.5 - (hl[i].length - 1) * 8 + j * 16)}" class="d-label" text-anchor="middle">${esc(l)}</text>`; });
  });
  for (const r of rows) {
    if (r.note) {
      const cx = (X[r.a] + X[r.b]) / 2, f = r.note;
      s += `<g class="d-note"><rect x="${n2(cx - r.width / 2)}" y="${r.y}" width="${n2(r.width)}" height="${r.h}" rx="6"/>`;
      f.lines.forEach((t, j) => { s += `<text x="${n2(cx)}" y="${r.y + 16 + j * 13}" class="d-meta d-notetext" text-anchor="middle">${esc(t)}</text>`; });
      s += '</g>';
      continue;
    }
    if (!r.m) continue;
    const m = r.m, xa = X[r.a], xb = X[r.b];
    const cls = 'd-edge' + (m.st.reply ? ' d-dashed' : '');
    if (r.a === r.b) {
      s += `<path d="M${n2(xa)} ${r.ay - 6} h26 q8 0 8 8 v4 q0 8 -8 8 h-24" class="${cls}" marker-end="url(#${id}-a)"/>`;
      m.lines.forEach((t, j) => { s += `<text x="${n2(xa + 46 + 18)}" y="${n2(r.ay + 8 - (m.lines.length - 1) * 7 + j * lineH)}" class="d-seqlabel">${esc(t)}</text>`; });
      if (numbered) s += `<g class="d-badge"><circle cx="${n2(xa + 52)}" cy="${r.ay + 4}" r="8"/><text x="${n2(xa + 52)}" y="${r.ay + 7.5}" text-anchor="middle">${m.n}</text></g>`;
    } else {
      const dir = xb > xa ? 1 : -1;
      s += `<path d="M${n2(xa + dir * 2)} ${r.ay} H${n2(xb - dir * 2)}" class="${cls}" marker-end="url(#${id}-a)"/>`;
      const mid = (xa + xb) / 2;
      m.lines.forEach((t, j) => { s += `<text x="${n2(mid + 10)}" y="${r.y + 11 + j * lineH}" class="d-seqlabel" text-anchor="middle">${esc(t)}</text>`; });
      if (numbered) s += `<g class="d-badge"><circle cx="${n2(mid - m.w / 2 - 2)}" cy="${r.y + 7}" r="8"/><text x="${n2(mid - m.w / 2 - 2)}" y="${r.y + 10.5}" text-anchor="middle">${m.n}</text></g>`;
    }
  }
  return svgOpen(Math.ceil(W), Math.ceil(H), id, spec.title, spec.desc, 'seq') + s + '</svg>\n';
}
