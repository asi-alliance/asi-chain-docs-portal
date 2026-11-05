# Diagrams

Each diagram is a spec in `src/<name>.mjs`. `npm run diagrams` renders every spec into `out/<name>.svg` (wide layout) and `out/<name>.narrow.svg` (phone layout), and both files are committed. A page shows a diagram with `<Diagram name="<name>" caption="One sentence." />`, and `components/Diagram.vue` inlines the SVG, so the figure is in the server HTML and follows the site theme.

## Edit a diagram

1. Change `src/<name>.mjs`.
2. Run `npm run diagrams`. It stops with a message when a node is unknown, two nodes overlap, an edge runs through a node or two labels overlap.
3. Look at the page with `npm run docs:dev`, in both themes and at 390 px.
4. Commit the spec and both SVG files. `npm run diagrams:check` exits 1 when `out/` differs from what the specs render, so run it before the commit.

Colours are never set in a spec. `.vitepress/theme/diagrams.css` maps the node kinds to `--vp-c-*` tokens.

## Flow spec

```js
export default {
  kind: 'flow',
  title: 'Short title',            // read by screen readers
  desc: 'One or two sentences that describe the diagram in words.',
  legend: true,                    // one swatch per node kind in use
  legendLabels: { chain: 'Chain node', decision: 'Check' },   // optional text per kind, the defaults are below
  opts: { colGaps: [96, 70], rowGaps: [40], wrap: 24, labelWrap: 0 },
  groups: [{ id: 'p2p', label: 'Group title', sub: 'optional second line', nodes: ['a', 'b'], pad: { b: 30 } }],
  nodes: [{ id: 'a', label: 'Text', sub: ['optional', 'second line'], kind: 'chain', col: 0, row: 0, w: 136, wrap: 12 }],
  edges: [{ from: 'a', to: 'b', label: 'HTTP', dir: 'both', style: 'strong', via: [[1, 0.5]], route: 'hv', fromOff: -10, toOff: 0 }],
  narrow: { opts: {}, nodes: { a: { col: 0, row: 1 } }, groups: {}, edges: { 'a>b': { via: [] } } },
};
```

- Node kinds are `chain` (brand colour), `store` (tip colour, drawn as a cylinder), `service` (default), `external` (dashed), `decision` (hexagon) and `terminal` (pill).
- `col` and `row` put a node on a grid. Column widths and row heights follow the widest and tallest node, and `colGaps` and `rowGaps` (or `colGap`, `rowGap`) set the space after each column and row.
- A coordinate between two integers lies inside the gap after the lower one, so `0.5` is the middle of the gap. A negative coordinate lies outside the grid on the left or top.
- An edge runs from node centre to node centre through the `via` points, and the generator adds an elbow wherever two points differ in both x and y. `route: 'vh'` makes the first elbow go vertical first. The ends are cut at the node border.
- `fromOff` and `toOff` move the first and the last segment sideways by pixels, so edges that share a node side do not overlap. A straight edge needs both equal, or only one of them.
- `style: 'strong'` draws the edge in the chain colour and `'dashed'` dashes it. An edge ends in one arrowhead by default, `dir: 'both'` puts arrowheads on both ends and `dir: 'none'` draws a plain line for a relation that has no direction.
- `sub` is the grey text under the node label. It is a string, where `
` starts a new line, or an array with one line per item, and the node grows to fit it. This is how a table node lists its columns.
- `legend: true` adds one sample per node kind in use, drawn in the shape of that kind (cylinder, hexagon, pill, box, dashed box). `legendLabels` renames a sample, with the defaults `chain: 'Chain node'`, `store: 'Data store'`, `service: 'Service'`, `external: 'External'`, `decision: 'Decision'` and `terminal: 'Start or end'`.
- The label sits on the longest segment of the edge. `labelPos` (0 to 1) moves it along that segment, `labelAt: [col, row]` puts it on a grid point, and `labelWrap` wraps it at that many characters.
- `narrow` overrides the wide spec for the phone layout. Nodes get their own `col` and `row`, edges are matched by `'from>to'` (`'from>to#2'` for a second edge between the same nodes), and an edge listed there drops the wide `via` and offsets. Without `narrow` the wide SVG is used on every screen.
- On a phone the figure leaves 374 px for the SVG at a 390 px screen, and a wider SVG is scaled down. Labels are 11 px, so keep the natural width of a narrow layout at 410 px or less. The width is the `viewBox` width in the file, and anything wider drops the labels under 10 px on screen.

## Sequence spec

```js
export default {
  kind: 'sequence',
  title: '...', desc: '...',
  participants: [{ id: 'u', label: 'User', kind: 'external' }],
  steps: [
    { from: 'u', to: 'w', label: 'Message', reply: true },
    { frame: 'opt', label: 'Condition', steps: [ /* messages */ ] },   // opt, loop or alt
    { note: 'Text', over: ['u', 'w'] },
  ],
  wide: { gap: 110, pad: 36, wrapMsg: 26, wrapSelf: 24 },
  narrow: { gap: 50, pad: 16, wrapMsg: 9, wrapSelf: 12, headWrap: 8 },
};
```

Messages are numbered in order, and a table under the diagram uses the same numbers. A message from a participant to itself is drawn as a loop. The narrow layout is always rendered, and `narrow: false` turns it off.
