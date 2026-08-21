// Sidenotes: after `quartz build`, copy each footnote's content to sit
// beside its reference as a marginal note. The footnote list at the foot
// is kept (narrow screens, print, machines); CSS in quartz/styles/custom.scss
// decides which one shows. Runs after inject-jsonld (see deploy.sh).
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs"
import { join } from "node:path"

const PUB = "public"
const files = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith(".html")) files.push(p)
  }
}
walk(PUB)

let pages = 0
let notes = 0
for (const f of files) {
  const html = readFileSync(f, "utf8")
  if (!html.includes("data-footnotes")) continue
  const section = html.match(/<section data-footnotes[\s\S]*?<\/section>/)
  if (!section) continue
  const defs = new Map()
  for (const m of section[0].matchAll(/<li id="user-content-fn-([^"]+)">([\s\S]*?)<\/li>/g)) {
    let inner = m[2]
      .replace(/<a href="#user-content-fnref-[^"]*" data-footnote-backref[\s\S]*?<\/a>/g, "")
      .replace(/^\s*<p>/, "")
      .replace(/<\/p>\s*$/, "")
      .trim()
    defs.set(m[1], inner)
  }
  if (defs.size === 0) continue
  const out = html.replace(
    /<sup><a href="#user-content-fn-([^"]+)" id="user-content-fnref-[^"]*" data-footnote-ref[^>]*>([^<]*)<\/a><\/sup>/g,
    (whole, id, label) => {
      const body = defs.get(id)
      if (!body) return whole
      notes++
      return `${whole}<span class="sidenote" role="note"><span class="sidenote-num" aria-hidden="true">${label}</span> ${body}</span>`
    },
  )
  if (out !== html) {
    writeFileSync(f, out)
    pages++
  }
}
console.log(`sidenotes: ${notes} note(s) placed on ${pages} page(s)`)
