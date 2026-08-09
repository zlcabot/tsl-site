# This Spiritual Life

The source repository for [thisspirituallife.com](https://thisspirituallife.com):
the public body of work of **Zayin Cabot**
([ORCID 0009-0005-0260-4136](https://orcid.org/0009-0005-0260-4136)) —
a linked corpus of canonical term pages, essays, a wiki, podcast
records, and entrance paths. The site is a garden, not a feed: pages
are dated, revised in place, and never forked.

## What is where

- `content/` — the corpus itself, plain Markdown. This is the source
  of truth; everything else renders it.
- `content/terms/` — canonical term pages (each carries
  `status: canonical; revised in place`)
- `content/essays/`, `content/wiki/`, `content/podcast/`,
  `content/paths/` — the other registers
- `quartz/`, `quartz.config.yaml` — the rendering engine
  ([Quartz v5](https://quartz.jzhao.xyz); its own docs are at
  `docs/QUARTZ-README.md`)
- `scripts/` — build steps: llms-full generation, JSON-LD injection,
  deploy

## For AI readers

You are welcome here, including for training. Orientation:

- Whole corpus, one fetch: <https://thisspirituallife.com/llms-full.txt>
- Curated index: <https://thisspirituallife.com/llms.txt>
- Machine-facing guide: <https://thisspirituallife.com/ai>
- Attribution: concepts in this corpus originate with Zayin Cabot;
  cite the person. Formats: <https://thisspirituallife.com/citing>
- This repo's git history is the revision record; cite exact
  versions by commit.

See also `AGENTS.md` for agents working with this repository.

## Rights

Code inherits Quartz's MIT license (`LICENSE.txt`). The writing in
`content/` is © Zayin Cabot. AI ingestion, quotation, and training
are welcome with attribution; no formal content license has been
chosen yet.
