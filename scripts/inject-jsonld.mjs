// Inject schema.org JSON-LD (author identity + site) into every built
// page's <head>. This is the machine-attribution layer: crawlers and
// models get the author (with ORCID) on every page, not just /citing.
// Runs after `quartz build` (see netlify.toml).
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs"
import { join } from "node:path"

const PUB = "public"
const AUTHOR = {
  "@type": "Person",
  "@id": "https://orcid.org/0009-0005-0260-4136",
  name: "Zayin Cabot",
  url: "https://zayincabot.com",
  sameAs: [
    "https://orcid.org/0009-0005-0260-4136",
    "https://thisspirituallife.com/about",
  ],
}
const SITE = {
  "@type": "WebSite",
  name: "This Spiritual Life",
  url: "https://thisspirituallife.com",
}

const files = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith(".html")) files.push(p)
  }
}
walk(PUB)

let count = 0
for (const f of files) {
  let html = readFileSync(f, "utf8")
  if (html.includes('"@context":"https://schema.org"')) continue
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? ""
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    author: AUTHOR,
    isPartOf: SITE,
  })
  const tag = `<script type="application/ld+json">${ld}</script></head>`
  let next = html.replace("</head>", tag)
  // Properties panel starts collapsed for humans; the contents stay in
  // the DOM, so machine readers lose nothing.
  next = next.replace(
    '<details class="note-properties metadata-container" open data-collapsed="false">',
    '<details class="note-properties metadata-container" data-collapsed="true">',
  )
  if (next !== html) {
    writeFileSync(f, next)
    count++
  }
}
console.log(`json-ld: injected into ${count} pages`)
