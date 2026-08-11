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
const SUBSTANTIVE_TYPES = new Set(["term", "essay", "wiki"])

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : path.endsWith(".md") ? [path] : []
  })
}

const files = walk(CONTENT)
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
  if (SUBSTANTIVE_TYPES.has(data.type)) {
    if (!Array.isArray(tags) || tags.length < 1 || tags.length > 4) {
      errors.push(`${rel}: ${data.type} pages require one to four topic tags`)
      continue
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
    if (!TOPICS.has(tag)) {
      errors.push(`${rel}: unknown topic tag ${JSON.stringify(tag)}`)
    }
  }
}

if (errors.length > 0) {
  console.error(`content validation failed (${errors.length})`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`content validation passed (${files.length} Markdown files)`)
