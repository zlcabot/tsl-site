// Answer log: generate content/answers/index.md from the site repo's issues
// labelled `answer`. Runs BEFORE `quartz build`, so the log is part of the
// corpus: searchable, in contentIndex.json, in llms-full.txt.
//
// Visibility rule. Every submission is public on GitHub the moment it is
// filed. The site shows an answer once it has been triaged in (label
// `reviewed`) and never shows one set aside (label `archived`). So the
// inbox is open and the canvas is curated, and no untriaged spam can
// appear on thisspirituallife.com.
//
// The generated page IS committed: Quartz respects .gitignore, so an
// ignored file is never emitted. It rewrites on every build; its diff is
// meaningful (it changes when the answer log changes).
//
// Unauthenticated GitHub API (public repo, 60 req/hr) unless GITHUB_TOKEN
// is set. Network failure is not fatal: the page is written with whatever
// is known, so a build never breaks because GitHub is slow.
import { writeFileSync, mkdirSync } from "node:fs"

const REPO = process.env.ANSWERS_REPO ?? "zlcabot/tsl-site"
const SITE = "https://thisspirituallife.com"
const headers = { Accept: "application/vnd.github+json", "User-Agent": "tsl-build" }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

let issues = []
try {
  const res = await fetch(`https://api.github.com/repos/${REPO}/issues?labels=answer&state=all&per_page=100`, { headers })
  if (res.ok) issues = await res.json()
  else console.warn(`answers: GitHub ${res.status}; writing an empty log`)
} catch (e) {
  console.warn(`answers: ${e}; writing an empty log`)
}

const shown = issues
  .filter((i) => !i.pull_request)
  .filter((i) => i.labels.some((l) => l.name === "reviewed"))
  .filter((i) => !i.labels.some((l) => l.name === "archived"))
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

const essayOf = (i) => {
  const m = (i.body ?? "").match(/\*\*Essay:\*\*\s*(\S+)/) ?? (i.title ?? "").match(/Answer:\s*(\S+)/)
  return m ? m[1].replace(SITE + "/", "") : null
}
const firstLines = (body) => {
  const after = (body ?? "").split(/^---$/m).slice(1).join("---").trim() || (body ?? "")
  return after.replace(/\s+/g, " ").trim().slice(0, 320)
}

const lines = shown.map((i) => {
  const essay = essayOf(i)
  const date = i.created_at.slice(0, 10)
  const who = i.user?.login ?? "someone"
  const to = essay ? ` on [${essay}](${SITE}/${essay})` : ""
  return `### [${i.title}](${i.html_url})\n\n${date}${to}. Filed by ${who}.\n\n${firstLines(i.body)}${(i.body ?? "").length > 320 ? "…" : ""} [Read and reply in the log.](${i.html_url})`
})

const body = shown.length
  ? lines.join("\n\n")
  : `Nothing has been answered yet, or nothing has come through the first pass. The log itself is open at [github.com/${REPO}/issues](https://github.com/${REPO}/issues?q=label%3Aanswer) and everything filed is visible there from the moment it arrives.`

mkdirSync("content/answers", { recursive: true })
writeFileSync("content/answers/index.md", `---
title: Answers
description: What has been sent back. Answers are public when filed; these are the ones the first pass brought forward.
date: ${new Date().toISOString().slice(0, 10)}
type: page
author: Zayin Cabot (https://orcid.org/0009-0005-0260-4136)
cite: ${SITE}/citing
---

Answers to the essays: checks, extensions, refusals with reasons, and
results from running a claim on ground this work does not have. Every
answer is public from the moment it is filed, in the
[log](https://github.com/${REPO}/issues?q=label%3Aanswer). This page
shows the ones a first pass has brought forward. Nothing is deleted;
what is set aside stays readable in the log.

How to answer, and what happens to an answer: [/answer](/answer).

${body}
`)
console.log(`answers: ${shown.length} shown of ${issues.length} filed -> content/answers/index.md`)
