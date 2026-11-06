// Text helpers shared by the flow and sequence layouts.
// The site monospace font (Roboto Mono) has an advance of 0.6 em, so text width is a plain multiplication.
export const FS = { node: 13, small: 11, label: 11.5 };
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const cw = (px) => px * 0.6;
export const tw = (s, px) => Math.ceil(String(s).length * cw(px));

// Greedy word wrap at `max` characters. A word longer than `max` is split after "(" or "-", so identifiers
// such as transfer(account, ...) can wrap. Explicit "\n" in the text always starts a new line.
export function wrap(text, max) {
  const out = [];
  for (const para of String(text).split('\n')) {
    const toks = [];
    for (const w of para.split(/\s+/).filter(Boolean)) {
      const parts = w.length > max ? w.split(/(?<=.[(-])/) : [w];
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
