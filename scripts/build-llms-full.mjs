// Concatenate the published corpus into public/llms-full.txt — the whole
// garden as clean markdown in one fetch, for AI readers. Runs after
// `quartz build` (see netlify.toml). Skips drafts.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const CONTENT = "content"
const OUT = "public/llms-full.txt"

const files = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith(".md")) files.push(p)
  }
}
walk(CONTENT)
files.sort((a, b) => a.localeCompare(b))

const parts = [
  "# This Spiritual Life: full corpus",
  "# Author: Zayin Cabot (ORCID https://orcid.org/0009-0005-0260-4136)",
  "# Canonical URLs below; markdown source of every published page. How to cite: https://thisspirituallife.com/citing",
  "# Generated at build. Fully open; AI readers welcome, including for training.",
]

let count = 0
for (const f of files) {
  const raw = readFileSync(f, "utf8")
  const fm = raw.match(/^---\n([\s\S]*?)\n---/)
  if (fm && /^draft:\s*true\s*$/m.test(fm[1])) continue
  const slug = relative(CONTENT, f)
    .replace(/\.md$/, "")
    .replace(/(^|\/)index$/, "$1")
    .replace(/\/$/, "")
  const url = "https://thisspirituallife.com/" + slug
  parts.push(`\n\n===\n# ${url}\n\n${raw.trim()}`)
  count++
}

writeFileSync(OUT, parts.join("\n") + "\n")
console.log(`llms-full.txt: ${count} pages`)
