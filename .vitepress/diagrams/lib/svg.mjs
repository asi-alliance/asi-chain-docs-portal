// SVG fragments shared by both diagram kinds. No colour appears here: every shape gets a class and
// diagrams.css maps the classes to --d-* custom properties, so the SVG follows the site theme.
import { esc } from './text.mjs';

export const svgOpen = (w, h, id, title, desc, cls) =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="dgm ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-labelledby="${id}-t ${id}-d"><title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc>`;

export const defs = (id) => `<defs>
<marker id="${id}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1.5 9 5 1 8.5" class="d-arrow"/></marker>
<marker id="${id}-ap" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1.5 9 5 1 8.5" class="d-arrow d-arrow-strong"/></marker></defs>`;

const n2 = (v) => Math.round(v * 100) / 100;

// Polyline with corners rounded by `r` px.
export function rounded(pts, r = 8) {
  let d = `M${n2(pts[0].x)} ${n2(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
    const l1 = Math.hypot(p1.x - p0.x, p1.y - p0.y), l2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    if (!l1 || !l2) continue;
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const a = { x: p1.x - ((p1.x - p0.x) / l1) * rr, y: p1.y - ((p1.y - p0.y) / l1) * rr };
    const b = { x: p1.x + ((p2.x - p1.x) / l2) * rr, y: p1.y + ((p2.y - p1.y) / l2) * rr };
    d += ` L${n2(a.x)} ${n2(a.y)} Q${n2(p1.x)} ${n2(p1.y)} ${n2(b.x)} ${n2(b.y)}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${n2(l.x)} ${n2(l.y)}`;
}
export { n2 };
