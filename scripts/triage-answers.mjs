// Triage helper: list answer-log entries that have not had a first pass,
// with enough of each to judge. Judgment is the session's, not this
// script's; it only fetches and formats. Apply labels with:
//   gh issue edit <n> -R zlcabot/tsl-site --add-label reviewed
//   gh issue close <n> -R zlcabot/tsl-site --reason "not planned" \
//     --comment "Set aside as off-topic; kept in the log."  # + label archived
import { execSync } from "node:child_process"
const REPO = process.env.ANSWERS_REPO ?? "zlcabot/tsl-site"
const out = execSync(
  `gh issue list -R ${REPO} --label answer --state all --limit 100 --json number,title,body,labels,author,createdAt,state,url`,
  { encoding: "utf8" },
)
const items = JSON.parse(out).filter((i) => {
  const names = i.labels.map((l) => l.name)
  return !names.includes("reviewed") && !names.includes("archived")
})
if (!items.length) {
  console.log("No untriaged answers.")
} else {
  console.log(`${items.length} untriaged:\n`)
  for (const i of items) {
    console.log(`#${i.number} [${i.state}] ${i.createdAt.slice(0, 10)} by ${i.author?.login}\n  ${i.title}\n  ${i.url}`)
    console.log("  " + (i.body ?? "").replace(/\s+/g, " ").slice(0, 500) + "\n")
  }
  console.log(`Label each: reviewed (bring forward to /answers) | archived (set aside, stays readable) | duplicate.`)
}
