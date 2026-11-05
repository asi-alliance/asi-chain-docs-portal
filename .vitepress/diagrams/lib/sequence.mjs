// Sequence diagrams on a fixed grid: participants in a row, messages top to bottom, numbered in order.
// Column gaps grow until every message label fits between its two lifelines.
// Frames (opt, loop, alt) nest. An alt may carry `else: [{ label, steps }]` branches, drawn under a divider
// inside the same frame. A frame is as wide as everything in it, including self-message labels and notes,
// and a nested frame sits INSET px inside its parent.
import { FS, esc, cw, tw } from './text.mjs';
import { svgOpen, defs, n2 } from './svg.mjs';

const FRAMES = ['opt', 'loop', 'alt'];
const KINDS = ['chain', 'store', 'service', 'external'];
const INSET = 10;
// Same greedy wrap as wrap() in text.mjs, but a word longer than the limit may also break after "/", so paths
// such as /api/explore-deploy wrap on a phone. text.mjs is shared with flow diagrams and stays as it is.
function wrap(text, max) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const toks = [];
    for (const w of para.split(/\s+/).filter(Boolean)) {
      const parts = w.length > max ? w.split(/(?<=.[(\-/])/) : [w];
      parts.forEach((t, k) => toks.push({ t, sp: k === 0 }));
    }
    let line = '';
    for (const { t, sp } of toks) {
      const cand = line ? line + (sp ? ' ' : '') + t : t;
      if (line && cand.length > max) { out.push(line); line = t; } else line = cand;
    }
    out.push(line);
  }
  return out;
}
const fail = (spec, msg) => { throw new Error(`${spec.id}: ${msg}`); };

const WIDE = { gap: 150, wrapMsg: 34, wrapSelf: 36, headWrap: 20, pad: 44, headGap: 16, headPad: 28, msgPad: 22, selfLabel: 'right' };

export function sequence(spec, variant = 'w') {
  // maxWidth keeps the labels of self-messages inside that many px (374 is what diagrams.css leaves under the SVG on a 390 px screen: 390 minus 2 x 8 px of figure padding, with the figure running to the screen edges).
  // selfLabel: 'right' puts the text of a self-message beside its loop, 'above' puts it over the loop, centred
  // on the lifeline and kept inside the diagram, which a phone layout needs because the right side is short.
  const o = { ...WIDE, ...(variant === 'n' ? { selfLabel: 'above', maxWidth: 374, headGap: 6, headPad: 18, msgPad: 10, ...(spec.narrow || {}) } : spec.wide || {}) };
  const above = o.selfLabel === 'above';
  const P = spec.participants;
  const idx = Object.fromEntries(P.map((p, i) => [p.id, i]));
  if (Object.keys(idx).length !== P.length) fail(spec, 'duplicate participant id');
  for (const p of P) if (p.kind && !KINDS.includes(p.kind)) fail(spec, `participant "${p.id}": unknown kind "${p.kind}"`);
  const need = (id, where) => { if (!(id in idx)) fail(spec, `${where} names unknown participant "${id}"`); };
  const id = `${spec.id}-${variant}`;

  const hl = P.map((p) => wrap(p.label, o.headWrap));
  const hw = hl.map((ls) => Math.max(...ls.map((l) => tw(l, FS.node))) + o.headPad);
  const hh = Math.max(...hl.map((l) => l.length)) * 16 + 20;
  const gaps = P.slice(1).map((_, i) => Math.max(o.gap * 0.6, (hw[i] + hw[i + 1]) / 2 + o.headGap));

  // flatten steps: frames become start, else and end markers, messages and notes become rows
  const flat = [];
  const item = new Map();
  let n = 0;
  const branchesOf = (st) => {
    if (st.else === undefined) return [];
    if (st.frame !== 'alt') fail(spec, `frame "${st.label}": only alt has else branches`);
    const list = Array.isArray(st.else) ? st.else : [st.else];
    for (const b of list) if (!Array.isArray(b.steps) || !b.steps.length) fail(spec, `frame "${st.label}": an else branch needs steps`);
    return list;
  };
  const add = (st) => {
    let f;
    if (st.frame) {
      if (!FRAMES.includes(st.frame)) fail(spec, `unknown frame "${st.frame}"`);
      if (!Array.isArray(st.steps) || !st.steps.length) fail(spec, `frame "${st.label}" needs steps`);
      f = { t: 'start', st };
      flat.push(f);
      st.steps.forEach(add);
      for (const b of branchesOf(st)) {
        flat.push({ t: 'else', st: b });
        b.steps.forEach(add);
      }
      flat.push({ t: 'end', st });
    } else if (st.note !== undefined) {
      st.over.forEach((i) => need(i, 'note'));
      f = { t: 'note', st };
      flat.push(f);
    } else {
      need(st.from, `message "${st.label}"`); need(st.to, `message "${st.label}"`);
      f = { t: 'msg', st, n: ++n };
      flat.push(f);
    }
    item.set(st, f);
  };
  spec.steps.forEach(add);
  const msgs = flat.filter((f) => f.t === 'msg');
  for (const m of msgs) {
    const a = idx[m.st.from], b = idx[m.st.to];
    m.lines = wrap(m.st.label, a === b ? o.wrapSelf : o.wrapMsg);
    m.w = Math.max(...m.lines.map((l) => tw(l, FS.label)));
  }
  const span = (m) => Math.abs(idx[m.st.from] - idx[m.st.to]);
  for (const m of msgs.filter((m) => span(m) > 0).sort((p, q) => span(p) - span(q))) {
    const a = Math.min(idx[m.st.from], idx[m.st.to]), b = Math.max(idx[m.st.from], idx[m.st.to]);
    const want = m.w + o.pad + o.msgPad;
    let have = 0;
    for (let i = a; i < b; i++) have += gaps[i];
    if (have < want) for (let i = a; i < b; i++) gaps[i] += (want - have) / (b - a);
  }
  const X = [hw[0] / 2 + 8];
  gaps.forEach((g) => X.push(X[X.length - 1] + g));

  // self-message labels placed above the loop: centred on the lifeline, but not further left than the badge needs
  for (const m of msgs.filter((m) => idx[m.st.from] === idx[m.st.to])) {
    const lo = m.w / 2 + 22, hi = (o.maxWidth ?? Infinity) - 28 - m.w / 2;
    m.cx = Math.max(lo, Math.min(X[idx[m.st.from]], hi));
  }

  // notes: the width follows the participants they span
  for (const f of flat.filter((f) => f.t === 'note')) {
    const cs = f.st.over.map((i) => idx[i]);
    f.a = Math.min(...cs); f.b = Math.max(...cs);
    f.width = Math.max(X[f.b] - X[f.a] + 56, 90);
    f.lines = wrap(f.st.note, Math.max(8, Math.floor((f.width - 20) / cw(FS.small))));
    f.h = f.lines.length * 13 + 14;
  }

  // horizontal extent of every step, so that a frame encloses self-message labels and notes in any column
  // and a nested frame sits INSET px inside its parent
  const ext = (st) => {
    const f = item.get(st);
    if (f.t === 'note') { const c = (X[f.a] + X[f.b]) / 2; return [c - f.width / 2 - 8, c + f.width / 2 + 8]; }
    if (f.t === 'msg') {
      const a = idx[st.from], b = idx[st.to];
      if (a === b) return above ? [Math.min(X[a] - 28, f.cx - f.w / 2 - 24), Math.max(X[a] + 40, f.cx + f.w / 2 + 8)] : [X[a] - 28, Math.max(X[a] + 28, X[a] + 64 + f.w + 10)];
      return [Math.min(X[a], X[b]) - 28, Math.max(X[a], X[b]) + 28];
    }
    const kids = [...st.steps, ...branchesOf(st).flatMap((b) => b.steps)];
    const es = kids.map((k) => { const e = ext(k); return k.frame ? [e[0] - INSET, e[1] + INSET] : e; });
    const x0 = Math.min(...es.map((e) => e[0]));
    f.x0 = x0;
    f.x1 = Math.max(Math.max(...es.map((e) => e[1])), x0 + tw(st.frame, FS.small) + 34 + 90);
    return [f.x0, f.x1];
  };
  spec.steps.forEach(ext);

  let y = hh + 26;
  const rows = [];
  const frames = [];
  const stack = [];
  const lineH = 14;
  const labelLines = (g, text) => wrap(text, Math.max(10, Math.floor((g.x1 - g.x0 - tw(g.st.frame, FS.small) - 44) / cw(FS.small))));
  for (const f of flat) {
    if (f.t === 'start') {
      f.cl = labelLines(f, f.st.label);
      y += 8; f.y0 = y; f.parts = [];
      frames.push(f); stack.push(f);
      y += 28 + (f.cl.length - 1) * 13;
    } else if (f.t === 'else') {
      const g = stack[stack.length - 1];
      const cl = f.st.label ? labelLines(g, f.st.label) : [];
      y += 2;
      g.parts.push({ y, cl });
      y += 10 + (cl.length ? 10 + (cl.length - 1) * 13 : 0);
    } else if (f.t === 'end') {
      const g = stack.pop(); g.y1 = y + 2; y += 12;
    } else if (f.t === 'note') {
      rows.push({ note: f, a: f.a, b: f.b, y, h: f.h, width: f.width });
      y += f.h + 8;
    } else {
      const a = idx[f.st.from], b = idx[f.st.to];
      const self = a === b;
      const h = self ? (above ? f.lines.length * lineH + 30 : Math.max(f.lines.length * lineH, 20) + 12) : f.lines.length * lineH + 20;
      const ay = self ? (above ? y + f.lines.length * lineH + 12 : y + h / 2 - 4) : y + f.lines.length * lineH + 8;
      rows.push({ m: f, a, b, y, ay, h });
      y += h + 8;
    }
  }
  const H = y + 6;

  // overall width, and a shift when something sticks out on the left
  let minX = 0, maxX = X[X.length - 1] + hw[hw.length - 1] / 2 + 8;
  P.forEach((_, i) => { minX = Math.min(minX, X[i] - hw[i] / 2); });
  for (const g of frames) { minX = Math.min(minX, g.x0 - 2); maxX = Math.max(maxX, g.x1 + 8); }
  for (const r of rows) {
    if (r.note) { const c = (X[r.a] + X[r.b]) / 2; minX = Math.min(minX, c - r.width / 2); maxX = Math.max(maxX, c + r.width / 2 + 8); }
    if (r.m && r.a === r.b) maxX = Math.max(maxX, above ? r.m.cx + r.m.w / 2 + 8 : X[r.a] + 64 + r.m.w + 8);
  }
  const ox = minX < 0 ? -minX : 0;
  const W = maxX + ox;

  let s = defs(id) + (ox ? `<g transform="translate(${n2(ox)} 0)">` : '');
  P.forEach((_, i) => { s += `<line x1="${n2(X[i])}" y1="${hh}" x2="${n2(X[i])}" y2="${H - 4}" class="d-life"/>`; });
  // frames in order of their start, so that an inner frame is drawn over its parent
  for (const g of frames) {
    const { x0, x1 } = g, kw = tw(g.st.frame, FS.small), lx = x0 + kw + 34;
    s += `<g class="d-fragment"><rect x="${n2(x0)}" y="${g.y0}" width="${n2(x1 - x0)}" height="${g.y1 - g.y0}" rx="8"/><path d="M${n2(x0)} ${g.y0 + 22}h${kw + 22}v-22" class="d-fragline"/><text x="${n2(x0 + 11)}" y="${g.y0 + 15}" class="d-meta d-strong">${esc(g.st.frame)}</text>`;
    g.cl.forEach((t, j) => { s += `<text x="${n2(lx)}" y="${g.y0 + 15 + j * 13}" class="d-meta">${esc(t)}</text>`; });
    for (const p of g.parts) {
      s += `<path d="M${n2(x0)} ${p.y}H${n2(x1)}" class="d-fragline" stroke-dasharray="6 4"/>`;
      p.cl.forEach((t, j) => { s += `<text x="${n2(x0 + 11)}" y="${p.y + 15 + j * 13}" class="d-meta">${esc(t)}</text>`; });
    }
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
    const m = r.m, xa = X[r.a], xb = X[r.b];
    const cls = 'd-edge' + (m.st.reply ? ' d-dashed' : '');
    if (r.a === r.b) {
      s += `<path d="M${n2(xa)} ${r.ay - 6} h26 q8 0 8 8 v4 q0 8 -8 8 h-24" class="${cls}" marker-end="url(#${id}-a)"/>`;
      if (above) {
        m.lines.forEach((t, j) => { s += `<text x="${n2(m.cx)}" y="${r.y + 11 + j * lineH}" class="d-seqlabel" text-anchor="middle">${esc(t)}</text>`; });
        s += `<g class="d-badge"><circle cx="${n2(m.cx - m.w / 2 - 14)}" cy="${r.y + 7}" r="8"/><text x="${n2(m.cx - m.w / 2 - 14)}" y="${r.y + 10.5}" text-anchor="middle">${m.n}</text></g>`;
      } else {
        m.lines.forEach((t, j) => { s += `<text x="${n2(xa + 64)}" y="${n2(r.ay + 8 - (m.lines.length - 1) * 7 + j * lineH)}" class="d-seqlabel">${esc(t)}</text>`; });
        s += `<g class="d-badge"><circle cx="${n2(xa + 52)}" cy="${r.ay + 4}" r="8"/><text x="${n2(xa + 52)}" y="${r.ay + 7.5}" text-anchor="middle">${m.n}</text></g>`;
      }
    } else {
      const dir = xb > xa ? 1 : -1;
      s += `<path d="M${n2(xa + dir * 2)} ${r.ay} H${n2(xb - dir * 2)}" class="${cls}" marker-end="url(#${id}-a)"/>`;
      const mid = (xa + xb) / 2;
      m.lines.forEach((t, j) => { s += `<text x="${n2(mid + 10)}" y="${r.y + 11 + j * lineH}" class="d-seqlabel" text-anchor="middle">${esc(t)}</text>`; });
      s += `<g class="d-badge"><circle cx="${n2(mid - m.w / 2 - 2)}" cy="${r.y + 7}" r="8"/><text x="${n2(mid - m.w / 2 - 2)}" y="${r.y + 10.5}" text-anchor="middle">${m.n}</text></g>`;
    }
  }
  return svgOpen(Math.ceil(W), Math.ceil(H), id, spec.title, spec.desc, 'seq') + s + (ox ? '</g>' : '') + '</svg>\n';
}
