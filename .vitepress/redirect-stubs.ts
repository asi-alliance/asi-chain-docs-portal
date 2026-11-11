import fs from 'node:fs'
import path from 'node:path'
import type { SiteConfig } from 'vitepress'
import redirects from './redirects'

const SITE = 'https://docs.asichain.io'

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Page shown at an old address. The script keeps ?query and #anchor, which meta refresh would drop. */
function stub(target: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Page moved</title>
<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
<link rel="canonical" href="${SITE}${escapeHtml(target)}">
<meta name="robots" content="noindex">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script>
</head>
<body>
<p>This page moved to <a href="${escapeHtml(target)}">${SITE}${escapeHtml(target)}</a>.</p>
</body>
</html>
`
}

const pageOf = (url: string) => url.replace(/^\//, '') + 'index.md'

/** Writes the stubs after the build. Fails when an old address is a real page or a target does not exist. */
export function writeRedirectStubs(config: SiteConfig): void {
  const pages = new Set(config.pages)
  for (const [from, to] of Object.entries(redirects)) {
    if (pages.has(pageOf(from))) throw new Error(`redirects.ts: ${from} is also a real page`)
    if (!pages.has(pageOf(to))) throw new Error(`redirects.ts: target ${to} of ${from} does not exist`)
    const file = path.join(config.outDir, from, 'index.html')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, stub(to))
  }
}
