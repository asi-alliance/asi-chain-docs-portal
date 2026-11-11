// Old address to new address. buildEnd in config.ts writes a stub page at every old address,
// so bookmarks and links from other repositories keep working. One line per moved page,
// keep the quoted 'old': 'new' form because tools/facts_guard.py reads this file.
export default {
  '/general/overview/': '/overview/',
  '/general/endpoints/': '/reference/endpoints/',
  '/general/container-images/': '/reference/container-images/',
  '/general/useful-links/': '/reference/links/',
  '/general/documentation-status/': '/help/',
  '/quick-start/join-observer/': '/nodes/observer/',
  '/quick-start/join-validator/': '/nodes/validator/',
  '/quick-start/validator-enrollment/': '/nodes/validator-enrollment/',
  '/quick-start/troubleshooting/': '/help/troubleshooting/',
  '/shard-nodes/devnet-structure/': '/nodes/roles/',
  '/shard-nodes/validator-image/': '/nodes/image/',
  '/shard-nodes/own-shard/': '/nodes/private-shard/',
  '/faq/': '/help/faq/',
} as Record<string, string>
