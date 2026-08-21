// Open-claims feed: after `quartz build`, write public/static/claims.json
// from every published essay's frontmatter (claim, kind, fails_if). Read by
// the TSL MCP server's open_claims tool and by anyone who wants the list.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { parse } from "yaml"

const SITE = "https://thisspirituallife.com"
const SRC = join("content", "essays")
const claims = []
for (const name of readdirSync(SRC)) {
  if (!name.endsWith(".md") || name === "index.md") continue
  const fm = readFileSync(join(SRC, name), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) continue
  const d = parse(fm[1]) ?? {}
  if (d.type !== "essay" || d.draft === true || !d.claim) continue
  const slug = `essays/${name.replace(/\.md$/, "")}`
  claims.push({ slug, url: `${SITE}/${slug}`, title: d.title, kind: d.kind, claim: d.claim, fails_if: d.fails_if, date: String(d.date), tags: d.tags ?? [] })
}
mkdirSync(join("public", "static"), { recursive: true })
writeFileSync(join("public", "static", "claims.json"), JSON.stringify({ generated: new Date().toISOString().slice(0, 10), site: SITE, answer_route: `${SITE}/answer`, claims }, null, 2))
console.log(`claims: ${claims.length} open claim(s) -> public/static/claims.json`)
