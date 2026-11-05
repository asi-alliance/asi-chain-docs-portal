// Flow diagrams on a manual grid with orthogonal edges. No layout engine: the author puts every node on a
// (col, row) cell, the generator sizes the cells from the text and routes the edges.
//
// Grid coordinates (nodes and `via` points):
//   integer   centre of that column or row
//   c + f     inside the gap after column c, f of the way across it (0.5 is the middle of the gap)
//   below 0   outside the grid on the left or top, beyond the last column or row on the right or bottom
// An edge goes from the centre of one node to the centre of the other, through the `via` points, with an
// elbow added wherever two neighbouring points differ in both x and y. The ends are cut at the node border.
import { FS, esc, tw, wrap } from './text.mjs';
import { svgOpen, defs, rounded, n2 } from './svg.mjs';

const KINDS = ['chain', 'store', 'service', 'external', 'decision', 'terminal'];
const LEGEND = { chain: 'Chain node', store: 'Data store', service: 'Service', external: 'External', decision: 'Decision', terminal: 'Start or end' };
const eq = (a, b) => Math.abs(a - b) < 0.01;
const fail = (spec, msg) => { throw new Error(`${spec.id}: ${msg}`); };

// Merge the narrow overrides into the wide spec.
function resolve(spec, variant) {
  const nar = variant === 'n' ? spec.narrow || {} : null;
  const o = { colGap: 56, rowGap: 36, wrap: 24, labelWrap: 0, ...(spec.opts || {}), ...(nar ? nar.opts || {} : {}) };
  const nodes = spec.nodes.map((n) => ({ kind: 'service', ...n, ...(nar && nar.nodes && nar.nodes[n.id] || {}) }));
  const groups = (spec.groups || []).map((g) => ({ ...g, ...(nar && nar.groups && nar.groups[g.id] || {}) }));
  const seen = {};
  const edges = spec.edges.map((e, i) => {
    const key = `${e.from}>${e.to}`;
    seen[key] = (seen[key] || 0) + 1;
    const ov = nar && nar.edges ? nar.edges[seen[key] > 1 ? `${key}#${seen[key]}` : key] : null;
    const base = { ...e };
    if (nar) for (const k of ['via', 'route', 'fromOff', 'toOff', 'labelAt', 'labelPos']) delete base[k];
    return { ...base, ...(ov || {}), index: i, key };
  });
  if (nar && nar.edges) for (const k of Object.keys(nar.edges)) if (!edges.some((e) => e.key === k.split('#')[0])) fail(spec, `narrow.edges has no edge "${k}"`);
  return { o, nodes, groups, edges };
}

function check(spec, r) {
  const ids = new Set();
  for (const n of r.nodes) {
    if (ids.has(n.id)) fail(spec, `duplicate node id "${n.id}"`);
    ids.add(n.id);
    if (!KINDS.includes(n.kind)) fail(spec, `node "${n.id}": unknown kind "${n.kind}"`);
    if (typeof n.col !== 'number' || typeof n.row !== 'number') fail(spec, `node "${n.id}" needs col and row`);
    if (n.col < 0 || n.row < 0) fail(spec, `node "${n.id}": col and row must not be negative`);
  }
  const grouped = new Set();
  for (const g of r.groups) for (const id of g.nodes) {
    if (!ids.has(id)) fail(spec, `group "${g.id}" lists unknown node "${id}"`);
    if (grouped.has(id)) fail(spec, `node "${id}" is in two groups`);
    grouped.add(id);
  }
  for (const e of r.edges) for (const k of ['from', 'to']) if (!ids.has(e[k])) fail(spec, `edge ${e.index + 1} has unknown ${k} "${e[k]}"`);
}

export function flow(spec, variant = 'w') {
  const r = resolve(spec, variant);
  check(spec, r);
  const { o } = r;
  const id = `${spec.id}-${variant}`;

  // node sizes
  for (const n of r.nodes) {
    n.lines = wrap(n.label, n.wrap || o.wrap);
    const tx = Math.max(...n.lines.map((l) => tw(l, FS.node)), n.sub ? tw(n.sub, FS.small) : 0);
    n.blockH = n.lines.length * 16 + (n.sub ? 14 : 0);
    const pad = { decision: 64, terminal: 44, store: 36 }[n.kind] ?? 36;
    n.w = n.w || Math.max(tx + pad, 96);
    n.h = n.h || n.blockH + 24 + (n.kind === 'store' ? 14 : 0) + (n.kind === 'decision' ? 6 : 0);
  }

  // grid
  const maxC = Math.max(...r.nodes.map((n) => Math.ceil(n.col)), 0);
  const maxR = Math.max(...r.nodes.map((n) => Math.ceil(n.row)), 0);
  const axis = (count, size, gapOf, dflt) => {
    const lo = [], hi = [];
    let at = 0;
    for (let i = 0; i <= count; i++) {
      lo[i] = at; hi[i] = at + size[i]; at = hi[i] + (gapOf[i] ?? dflt);
    }
    return (g) => {
      if (g < 0) return lo[0] + g * dflt;
      if (g > count) return hi[count] + (g - count) * dflt;
      const c = Math.floor(g), f = g - c;
      if (f === 0) return (lo[c] + hi[c]) / 2;
      return hi[c] + f * (lo[c + 1] - hi[c]);
    };
  };
  const ints = (key, size) => (k) => Math.max(0, ...r.nodes.filter((n) => n[key] === k).map((n) => n[size]));
  const colW = Array.from({ length: maxC + 1 }, (_, c) => ints('col', 'w')(c));
  const rowH = Array.from({ length: maxR + 1 }, (_, k) => ints('row', 'h')(k));
  const gx = axis(maxC, colW, o.colGaps || [], o.colGap);
  const gy = axis(maxR, rowH, o.rowGaps || [], o.rowGap);
  const byId = new Map(r.nodes.map((n) => [n.id, n]));
  for (const n of r.nodes) { n.cx = gx(n.col); n.cy = gy(n.row); n.x = n.cx - n.w / 2; n.y = n.cy - n.h / 2; }

  // groups
  for (const g of r.groups) {
    const m = g.nodes.map((i) => byId.get(i));
    const p = { t: 40 + (g.sub ? 14 : 0), r: 18, b: 18, l: 18, ...(g.pad || {}) };
    const x0 = Math.min(...m.map((n) => n.x)) - p.l;
    const x1 = Math.max(Math.max(...m.map((n) => n.x + n.w)) + p.r, x0 + tw(g.label, FS.small) * 1.16 + 32);
    g.x = x0; g.y = Math.min(...m.map((n) => n.y)) - p.t; g.w = x1 - x0; g.h = Math.max(...m.map((n) => n.y + n.h)) + p.b - g.y;
  }

  // edges
  const rects = r.nodes.map((n) => ({ x: n.x, y: n.y, w: n.w, h: n.h, id: n.id }));
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const segHitsRect = (p, q, rc, shrink = 2) => {
    const x0 = Math.min(p.x, q.x), x1 = Math.max(p.x, q.x), y0 = Math.min(p.y, q.y), y1 = Math.max(p.y, q.y);
    return x1 > rc.x + shrink && x0 < rc.x + rc.w - shrink && y1 > rc.y + shrink && y0 < rc.y + rc.h - shrink;
  };
  const chips = [];
  for (const e of r.edges) {
    const a = byId.get(e.from), b = byId.get(e.to);
    const ctrl = [{ x: a.cx, y: a.cy }, ...(e.via || []).map(([c, k]) => ({ x: gx(c), y: gy(k) })), { x: b.cx, y: b.cy }];
    let pts = [ctrl[0]];
    for (let i = 1; i < ctrl.length; i++) {
      const p = pts[pts.length - 1], q = ctrl[i];
      if (!eq(p.x, q.x) && !eq(p.y, q.y)) {
        const horizFirst = pts.length >= 2 ? eq(pts[pts.length - 2].x, p.x) : (e.route || 'hv') === 'hv';
        pts.push(horizFirst ? { x: q.x, y: p.y } : { x: p.x, y: q.y });
      }
      pts.push(q);
    }
    // drop repeated and collinear points
    pts = pts.filter((p, i) => i === 0 || !(eq(p.x, pts[i - 1].x) && eq(p.y, pts[i - 1].y)));
    pts = pts.filter((p, i) => i === 0 || i === pts.length - 1 || !((eq(p.x, pts[i - 1].x) && eq(p.x, pts[i + 1].x)) || (eq(p.y, pts[i - 1].y) && eq(p.y, pts[i + 1].y))));
    if (pts.length < 2) fail(spec, `edge ${e.key}: both ends are at the same point`);
    // offsets move the first and last segment sideways so that edges sharing a node side do not overlap
    const horiz = (i) => eq(pts[i].y, pts[i + 1].y);
    const mv = (i, d) => {
      if (!d) return;
      const h = horiz(i);
      for (const k of [i, i + 1]) pts[k] = h ? { ...pts[k], y: pts[k].y + d } : { ...pts[k], x: pts[k].x + d };
    };
    if (pts.length === 2) {
      if (e.fromOff !== undefined && e.toOff !== undefined && e.fromOff !== e.toOff) fail(spec, `edge ${e.key}: a straight edge needs equal fromOff and toOff`);
      mv(0, e.fromOff ?? e.toOff ?? 0);
    } else {
      const last = pts.length - 2;
      const fh = horiz(0), lh = horiz(last);
      mv(0, e.fromOff); mv(last, e.toOff);
      if (fh !== horiz(0) || lh !== horiz(last)) fail(spec, `edge ${e.key}: offsets broke the orthogonal route`);
    }
    // cut both ends at the node border
    const cut = (idx, nxt, n) => {
      const p = pts[idx], q = pts[nxt];
      if (eq(p.y, q.y)) pts[idx] = { x: p.x + Math.sign(q.x - p.x) * n.w / 2, y: p.y };
      else pts[idx] = { x: p.x, y: p.y + Math.sign(q.y - p.y) * n.h / 2 };
    };
    cut(0, 1, a); cut(pts.length - 1, pts.length - 2, b);
    for (let i = 0; i + 1 < pts.length; i++) {
      const p = pts[i], q = pts[i + 1];
      if (!eq(p.x, q.x) && !eq(p.y, q.y)) fail(spec, `edge ${e.key}: segment ${i + 1} is not orthogonal (offsets and via points disagree)`);
      for (const rc of rects) if (rc.id !== e.from && rc.id !== e.to && segHitsRect(p, q, rc)) fail(spec, `edge ${e.key} runs through node "${rc.id}"`);
    }
    e.pts = pts;
    if (e.label) {
      const lw = e.labelWrap ?? o.labelWrap;
      const lines = lw ? wrap(e.label, lw) : String(e.label).split('\n');
      let at;
      if (e.labelAt) at = { x: gx(e.labelAt[0]), y: gy(e.labelAt[1]) };
      else {
        let best = -1, bi = 0;
        for (let i = 0; i + 1 < pts.length; i++) {
          const l = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
          if (l > best + 0.01) { best = l; bi = i; }
        }
        const f = e.labelPos ?? 0.5;
        at = { x: pts[bi].x + (pts[bi + 1].x - pts[bi].x) * f, y: pts[bi].y + (pts[bi + 1].y - pts[bi].y) * f };
      }
      const w = Math.max(...lines.map((t) => tw(t, FS.label))) + 10, h = lines.length * 14 + 2;
      e.chip = { x: at.x - w / 2, y: at.y - h / 2 + 1, w, h, lines, cx: at.x, cy: at.y, key: e.key };
      chips.push(e.chip);
    }
  }

  // overlap checks: the generator refuses a layout the reader could not read
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) if (hit(rects[i], rects[j])) fail(spec, `nodes "${rects[i].id}" and "${rects[j].id}" overlap`);
  for (const g of r.groups) {
    for (const n of r.nodes) if (!g.nodes.includes(n.id) && hit(g, n)) fail(spec, `group "${g.id}" covers node "${n.id}" (move the node or change the grid gaps)`);
    for (const g2 of r.groups) if (g2 !== g && hit(g, g2)) fail(spec, `groups "${g.id}" and "${g2.id}" overlap`);
  }
  for (const c of chips) {
    for (const n of r.nodes) if (hit(c, n)) fail(spec, `label of edge ${c.key} overlaps node "${n.id}" (widen the gap, set labelPos or labelAt)`);
    for (const d of chips) if (d !== c && hit(c, d)) fail(spec, `labels of edges ${c.key} and ${d.key} overlap`);
  }

  // frame
  const boxes = [...r.nodes, ...r.groups, ...chips];
  let minX = Math.min(...boxes.map((b) => b.x)), minY = Math.min(...boxes.map((b) => b.y));
  let maxX = Math.max(...boxes.map((b) => b.x + b.w)), maxY = Math.max(...boxes.map((b) => b.y + b.h));
  for (const e of r.edges) for (const p of e.pts) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); }
  const M = 4, dx = M - minX, dy = M - minY;
  const W = Math.ceil(maxX - minX + 2 * M);
  let H = Math.ceil(maxY - minY + 2 * M);

  let s = defs(id) + `<g transform="translate(${n2(dx)} ${n2(dy)})">`;
  for (const g of r.groups) {
    s += `<g class="d-group"><rect x="${n2(g.x)}" y="${n2(g.y)}" width="${n2(g.w)}" height="${n2(g.h)}" rx="14"/><text x="${n2(g.x + 16)}" y="${n2(g.y + 23)}" class="d-gtitle">${esc(g.label)}</text>${g.sub ? `<text x="${n2(g.x + 16)}" y="${n2(g.y + 38)}" class="d-meta">${esc(g.sub)}</text>` : ''}</g>`;
  }
  for (const e of r.edges) {
    const strong = e.style === 'strong';
    const m = `${id}-${strong ? 'ap' : 'a'}`;
    s += `<path d="${rounded(e.pts)}" class="d-edge${strong ? ' d-edge-strong' : ''}${e.style === 'dashed' ? ' d-dashed' : ''}" marker-end="url(#${m})"${e.dir === 'both' ? ` marker-start="url(#${m})"` : ''}/>`;
  }
  for (const n of r.nodes) {
    const { x, y, w, h, cx, cy } = n;
    s += `<g class="d-node d-${n.kind}">`;
    if (n.kind === 'store') {
      s += `<path d="M${n2(x)} ${n2(y + 7)}v${n2(h - 14)}a${n2(w / 2)} 7 0 0 0 ${n2(w)} 0v${n2(-(h - 14))}a${n2(w / 2)} 7 0 0 0 ${n2(-w)} 0a${n2(w / 2)} 7 0 0 0 ${n2(w)} 0"/>`;
    } else if (n.kind === 'decision') {
      const k = 18;
      s += `<polygon points="${n2(x)},${n2(cy)} ${n2(x + k)},${n2(y)} ${n2(x + w - k)},${n2(y)} ${n2(x + w)},${n2(cy)} ${n2(x + w - k)},${n2(y + h)} ${n2(x + k)},${n2(y + h)}"/>`;
    } else {
      s += `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" rx="${n.kind === 'terminal' ? n2(h / 2) : 10}"/>`;
    }
    s += '</g>';
    const top = cy - n.blockH / 2 + (n.kind === 'store' ? 3 : 0);
    n.lines.forEach((l, j) => { s += `<text x="${n2(cx)}" y="${n2(top + 12 + j * 16)}" class="d-label" text-anchor="middle">${esc(l)}</text>`; });
    if (n.sub) s += `<text x="${n2(cx)}" y="${n2(top + n.lines.length * 16 + 11)}" class="d-meta" text-anchor="middle">${esc(n.sub)}</text>`;
  }
  for (const c of chips) s += `<rect x="${n2(c.x)}" y="${n2(c.y)}" width="${n2(c.w)}" height="${n2(c.h)}" rx="4" class="d-chip"/>`;
  for (const c of chips) c.lines.forEach((t, j) => { s += `<text x="${n2(c.cx)}" y="${n2(c.cy + 4 + (j - (c.lines.length - 1) / 2) * 14)}" class="d-elabel" text-anchor="middle">${esc(t)}</text>`; });
  s += '</g>';

  // legend: one swatch per node kind in use, wrapped to the diagram width
  if (spec.legend) {
    const used = KINDS.filter((k) => r.nodes.some((n) => n.kind === k));
    if (used.length > 1) {
      let lx = 4, ly = H + 8;
      for (const k of used) {
        const text = (spec.legendLabels || {})[k] || LEGEND[k];
        const need = 30 + tw(text, FS.small) + 18;
        if (lx + need > W && lx > 4) { lx = 4; ly += 22; }
        s += `<g class="d-node d-${k}"><rect x="${lx}" y="${ly}" width="22" height="14" rx="${k === 'terminal' ? 7 : 4}"/></g><text x="${lx + 30}" y="${ly + 11}" class="d-meta">${esc(text)}</text>`;
        lx += need;
      }
      H = ly + 14 + 6;
    }
  }
  return svgOpen(W, H, id, spec.title, spec.desc, 'flow') + s + '</svg>\n';
}
