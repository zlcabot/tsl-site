import { readdirSync, readFileSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { parse } from "yaml"

const CONTENT = "content"
const TOPICS = new Set([
  "agency",
  "consciousness",
  "ecology",
  "modernity",
  "mortality",
  "politics",
  "practice",
  "tending",
  "time",
])
// Fields: a second vocabulary inside the same tags: field, written as
// group/child. A page carries zero to three. Browse at /tags/<group> and
// /tags/<group>/<child>. PROPOSED 2026-08-21 — trim or extend in
// docs/editorial-workflow.md §Topics and fields and here, together.
const FIELDS = new Set([
  "science/physics",
  "science/chemistry",
  "science/biology",
  "science/psychology",
  "science/consciousness",
  "science/mathematics",
  "science/ecology",
  "philosophy/process",
  "philosophy/pragmatism",
  "philosophy/phenomenology",
  "philosophy/metaphysics",
  "philosophy/comparative",
  "philosophy/anthropology",
  "tradition/buddhism",
  "tradition/shaivism",
  "tradition/christianity",
  "tradition/judaism",
  "tradition/islam",
  "tradition/daoism",
  "tradition/yoruba",
  "tradition/amazonian",
  "tradition/indigenous-americas",
  "tradition/esoteric",
  "practice/contemplative",
  "practice/clinical",
  "practice/ritual",
])
const SUBSTANTIVE_TYPES = new Set(["term", "essay", "wiki"])
const ASSET_EXT = /\.(jpg|jpeg|png|gif|svg|webp|pdf|mp3|mp4|webm)$/i
// Repeated links to one target flatten the graph and read as noise.
// Two allows a body mention plus a deliberate "Further" pointer at the foot.
const LINK_REPEAT_LIMIT = 2

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : path.endsWith(".md") ? [path] : []
  })
}

function walkAll(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walkAll(path) : [path]
  })
}

const files = walk(CONTENT)
const warnings = []
const errors = []

for (const path of files) {
  const rel = relative(CONTENT, path).split(sep).join("/")
  const source = readFileSync(path, "utf8")
  const match = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  if (!match) {
    errors.push(`${rel}: missing YAML frontmatter`)
    continue
  }

  let data
  try {
    data = parse(match[1]) ?? {}
  } catch (error) {
    errors.push(`${rel}: invalid YAML (${error.message})`)
    continue
  }

  const inDrafts = rel.startsWith("_drafts/")
  if (inDrafts && data.draft !== true) {
    errors.push(`${rel}: every file under _drafts must carry draft: true`)
  }
  if (!inDrafts && data.draft === true) {
    errors.push(`${rel}: drafts must live under content/_drafts`)
  }
  if (data.draft === true && data.aliases !== undefined) {
    errors.push(`${rel}: draft pages must not carry aliases`)
  }

  const tags = data.tags
  const topicTags = Array.isArray(tags) ? tags.filter((t) => !String(t).includes("/")) : []
  const fieldTags = Array.isArray(tags) ? tags.filter((t) => String(t).includes("/")) : []
  if (SUBSTANTIVE_TYPES.has(data.type)) {
    if (!Array.isArray(tags) || topicTags.length < 1 || topicTags.length > 4) {
      errors.push(`${rel}: ${data.type} pages require one to four topic tags`)
      continue
    }
    if (fieldTags.length > 3) {
      errors.push(`${rel}: at most three field tags (group/child)`)
    }
  } else if (tags === undefined) {
    continue
  }

  if (!Array.isArray(tags)) {
    errors.push(`${rel}: tags must be a YAML list`)
    continue
  }
  if (new Set(tags).size !== tags.length) {
    errors.push(`${rel}: topic tags must be unique`)
  }
  for (const tag of tags) {
    if (String(tag).includes("/")) {
      if (!FIELDS.has(tag)) errors.push(`${rel}: unknown field tag ${JSON.stringify(tag)}`)
    } else if (!TOPICS.has(tag)) {
      errors.push(`${rel}: unknown topic tag ${JSON.stringify(tag)}`)
    }
  }
}

// --- link integrity: no red links on a public site ---------------------
// The vault seeds with red links; a published site does not. A wikilink is
// written only when its target exists. See docs/editorial-workflow.md
// "Linking".
const targets = new Set()
for (const path of files) {
  const rel = relative(CONTENT, path).split(sep).join("/").replace(/\.md$/, "")
  const source = readFileSync(path, "utf8")
  const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  let data = {}
  try {
    data = fm ? (parse(fm[1]) ?? {}) : {}
  } catch {
    data = {}
  }
  if (data.draft === true) continue
  targets.add(rel)
  targets.add(rel.split("/").pop())
  if (rel.endsWith("/index")) {
    targets.add(rel.slice(0, -"/index".length))
    targets.add(rel.slice(0, -"/index".length).split("/").pop())
  }
  for (const alias of Array.isArray(data.aliases) ? data.aliases : []) {
    targets.add(String(alias))
  }
}
for (const path of walkAll(CONTENT)) {
  if (ASSET_EXT.test(path)) {
    const rel = relative(CONTENT, path).split(sep).join("/")
    targets.add(rel)
    targets.add(rel.split("/").pop())
  }
}
for (const path of files) {
  const rel = relative(CONTENT, path).split(sep).join("/")
  const source = readFileSync(path, "utf8")
  const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  let data = {}
  try {
    data = fm ? (parse(fm[1]) ?? {}) : {}
  } catch {
    data = {}
  }
  if (data.draft === true) continue
  const body = source.slice(fm ? fm[0].length : 0)
  const seen = new Map()
  for (const match of body.matchAll(/\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]/g)) {
    const target = match[1].trim()
    if (/^https?:/.test(target)) continue
    if (!targets.has(target)) {
      errors.push(`${rel}: wikilink to a page that does not exist: ${JSON.stringify(target)}`)
    }
    seen.set(target, (seen.get(target) ?? 0) + 1)
  }
  for (const [target, count] of seen) {
    if (count > LINK_REPEAT_LIMIT) {
      warnings.push(
        `${rel}: ${JSON.stringify(target)} linked ${count} times; prefer first substantive use only`,
      )
    }
  }
}

if (warnings.length > 0) {
  console.warn(`content validation warnings (${warnings.length})`)
  for (const warning of warnings) console.warn(`- ${warning}`)
}

if (errors.length > 0) {
  console.error(`content validation failed (${errors.length})`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`content validation passed (${files.length} Markdown files)`)
