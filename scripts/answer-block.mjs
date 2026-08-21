// Answer block: after `quartz build`, append to every published essay a
// uniform block built from its frontmatter (claim, kind, fails_if) with
// the route for answering. Essays are fixed at publication; this block is
// site chrome, so the route and wording can be tended here without
// touching an essay. Runs after sidenotes (see deploy.sh).
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { parse } from "yaml"

const SRC = join("content", "essays")
const OUT = join("public", "essays")
const KIND = {
  rereading: "a rereading of evidence everyone already accepts, which you can check",
  bet: "a bet, registered in advance, which you can watch pay or break",
  pointing: "a pointing at what no measurement will corner, offered as pointing and nothing more",
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

let n = 0
for (const name of readdirSync(SRC)) {
  if (!name.endsWith(".md") || name === "index.md") continue
  const src = readFileSync(join(SRC, name), "utf8")
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) continue
  const data = parse(fm[1]) ?? {}
  if (data.type !== "essay" || data.draft === true) continue
  const html = join(OUT, name.replace(/\.md$/, ".html"))
  let page
  try { page = readFileSync(html, "utf8") } catch { continue }
  if (page.includes('id="answer-this"')) continue
  const block = `
<section class="answer" aria-labelledby="answer-this">
<h2 id="answer-this">Answer this<a role="anchor" aria-hidden="true" tabindex="-1" data-no-popover="true" href="#answer-this" class="internal internal-link"></a></h2>
<p><span class="answer-label">Claim.</span> ${esc(data.claim ?? "")}</p>
<p><span class="answer-label">Kind.</span> ${esc(KIND[data.kind] ?? data.kind ?? "")}.</p>
<p><span class="answer-label">It fails if.</span> ${esc(data.fails_if ?? "")}</p>
<p>Nothing here asks to be believed. It asks to be answered: checked, extended, refused with reasons, or run on your own ground. Answers are read, and the ones that change something are published with a reply. How to answer, for people and for machines: <a href="/answer" class="internal">/answer</a>.</p>
</section>
`
  page = page.replace("</article>", block + "</article>")
  writeFileSync(html, page)
  n++
}
console.log(`answer-block: ${n} essay(s)`)
