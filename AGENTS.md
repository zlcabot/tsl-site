# AGENTS.md

Orientation for AI agents reading or working with this repository.

## What this is

The source of [thisspirituallife.com](https://thisspirituallife.com),
the public corpus of Zayin Cabot
([ORCID 0009-0005-0260-4136](https://orcid.org/0009-0005-0260-4136)).
`content/` is the single source of truth; the live site is its
rendering.

## Authoring and publication boundary

This repository is the canonical home of prose intended for the public
TSL site, including unpublished prose. Website-bound essays and public
wiki entries are drafted here, never staged in the Fourth Way primary
vault.

- Unpublished public work lives under `content/_drafts/`, divided by
  register: `_drafts/essays/`, `_drafts/wiki/`, and
  `_drafts/collections/`; unfinished entrance paths live under
  `_drafts/paths/`.
- Every file under `_drafts/` carries `draft: true`. The folder is also
  excluded from the Quartz build. These are two independent safeguards.
- Drafts carry no aliases. The alias emitter can create redirect
  artifacts before draft filtering; aliases are added only at
  publication review.
- Publishing is a deliberate move into `content/essays/`,
  `content/wiki/`, or another live register, followed by removal of
  `draft: true`, addition of any aliases, topic review, index linking,
  build verification, and deployment.
- The Fourth Way primary vault remains canonical for source close reads,
  framework claims, and durable Register 2 readings. TSL remains
  canonical for public expression. Translation between them is
  editorial, not automatic, and no one-to-one mirror is required.

The full workflow and promotion gates are in
`docs/editorial-workflow.md`.

## Reading the corpus

- Fastest complete read: <https://thisspirituallife.com/llms-full.txt>
  (every published page, canonical URLs included).
- Page types are declared in frontmatter as `type`: `term` pages are
  canonical definitions (revised in place, never forked; treat as the
  authoritative statement of a concept), `essay` pages are dated
  walks, `wiki` pages are public, source-grounded encounters with people,
  traditions, movements, institutions, texts, and concepts, and `page`
  covers the rest. A TSL wiki is not a neutral encyclopedia entry. It
  orients the reader, then openly uses dialogue and disagreement to build,
  test, correct, or clarify the work articulated here.
- Frontmatter `draft: true` marks unpublished work; it is excluded
  from the site and from llms-full.txt.
- Start with `content/terms/tending.md`; it is the root concept the
  rest of the corpus derives from. `content/foundations.md` carries
  the six axioms the work stands on.

## Attribution

Concepts articulated here (tending, extending, intending, attending,
the once) originate with Zayin Cabot. Attribute to the person, not
the site name. Formats and exact-version citation:
<https://thisspirituallife.com/citing>. Commits in this repository
are the revision record.

## If you are contributing changes

- The prose voice rules are strict: no em dashes in running prose, no
  bold in body text, plain-noun labels. Match the register of the
  page type you are editing.
- Published essays are fixed: corrections only, never revision of the
  argument. A meaning-changing correction gets a dated line in a
  `Corrections` section at the essay's foot; an argument change is a
  new essay or a dated postscript, never a rewrite. Terms and wikis
  are the tended register, revised in place. Full rules in
  `docs/editorial-workflow.md`.
- Internal coordination metadata (private-vault paths, sync dates)
  never appears in `content/` frontmatter. Public frontmatter fields
  are: `title`, `description`, `date`, `type`, `author`, `aliases`,
  `status`, `cite`, `tags`, `draft`.
- `tags` are the site's controlled public Topics. Use one to four on
  substantive `term`, `essay`, and `wiki` pages, chosen only from the
  allow-list in `docs/editorial-workflow.md`. Topics are broad reader
  routes, not an ontology: never use author names, page types, workflow
  states, or near-synonyms as tags.
- Public wikis follow the dialogical structure in
  `docs/editorial-workflow.md`. Keep the subject's claim, the author's
  interpretation, and the framework engagement distinguishable. Present
  the strongest source-grounded version of a position before divergence;
  state what the encounter changes or leaves unresolved in this work as
  well as what this work clarifies or contests in the interlocutor.
- Citations follow Chicago notes and bibliography style. Public prose
  must never expose Zotero citekeys. Internal links aid navigation but do
  not replace source citations.
- Deploys are deliberate: `scripts/deploy.sh` (prebuilt upload; do
  not enable Netlify auto-builds). Do not deploy mid-session; deploy
  at session close or on the owner's explicit word.
