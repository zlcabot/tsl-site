# TSL Editorial Workflow

This document governs how research becomes public work on This Spiritual
Life. It is the human-readable counterpart to the enforcement rules in
`AGENTS.md` and `scripts/validate-content.mjs`.

## Two sources of truth, two registers

The Fourth Way primary vault and the TSL vault are not mirrors.

| Home                     | Canonical for                                                                                            | Not for                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Fourth Way primary vault | source close reads, framework development, and durable Register 2 readings of external material          | staging prose whose destination is the TSL website                         |
| TSL vault                | public essays, public wiki entries, canonical term pages, and all drafts intended to become those things | source-level scholarly archives or a duplicate of every primary-vault wiki |

A primary source note may feed a TSL essay directly. A public wiki may
exist for reader orientation without a primary-vault twin. A primary
wiki may remain private when its durable research function does not
warrant a public page.

## Draft folders

Website-bound drafts live here:

```text
content/_drafts/
  essays/
  wiki/
  collections/
  paths/
```

Every draft must carry `draft: true` and must not carry aliases. Quartz
ignores the entire `_drafts` tree, so a draft cannot become public merely
because one frontmatter field is mistyped. The `draft: true` field remains
as a second safeguard and makes draft status visible in Obsidian.

Research close reads continue to live in the primary vault's
`05_sources/`. If an essay needs a working map, create one project hub or
collection draft rather than a scatter of thin primary-vault wiki pages.

## Promotion gates

### Primary-vault wiki

Create or retain a primary-vault wiki only when there is a substantial,
durable Fourth Way reading of the external object. The reading must be
source-grounded, reusable beyond one essay, and worth retrieving years
later. Fame, adjacency, frequency of mention, or potential search traffic
do not earn a primary entry.

### Public TSL wiki

A public wiki draft earns publication when it has:

1. a distinctive reason to exist beyond generic biography or summary;
2. reliable engagement with primary material;
3. a clear account of why the figure, movement, text, or concept matters
   here;
4. meaningful links to an essay, term, or neighboring wiki;
5. one to four reviewed Topics.

Public pages may be shorter and more orienting than primary-vault wikis,
but they must not be thin search-engine pages. Traffic is an outcome of
good writing, strong internal structure, and accumulated depth.

### Publication

To publish a draft:

1. finish the source and editorial review;
2. move the file from `_drafts/` into its live register;
3. remove `draft: true`;
4. add aliases only now;
5. review Topics against the controlled vocabulary;
6. add deliberate links from the relevant index and neighboring pages;
7. run content validation, tests, and a production build;
8. verify that no `_drafts` path or draft alias was emitted;
9. deploy only on the owner's explicit word or at an agreed session
   close.

## Topics

The frontmatter field is `tags` because Quartz uses it to create tag
pages. On the site these are understood as **Topics**.

The initial controlled vocabulary is:

| Topic           | Use for                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `agency`        | action, responsibility, freedom, and response                          |
| `consciousness` | awareness, reflexivity, witness, and selfhood                          |
| `ecology`       | living systems, multispecies relations, land, and interdependence      |
| `modernity`     | colonial modernity, acceleration, mechanism, progress, and its endings |
| `mortality`     | finitude, death, grief, hospice, perishing, and completion             |
| `politics`      | institutions, power, labor, activism, and collective decision          |
| `practice`      | exercises, disciplines, pedagogy, and lived ways of working            |
| `tending`       | the framework's central verb and its direct public elaborations        |
| `time`          | temporality, timing, duration, acceleration, and temporal plurality    |

Rules:

- Use one to four Topics on substantive `term`, `essay`, and `wiki`
  pages.
- Use lowercase singular nouns.
- Do not tag with author names, content types, draft states, series names,
  or workflow labels.
- Do not create synonyms such as `temporality` beside `time` or `death`
  beside `mortality`.
- A Topic is an aggregation route. A wiki is an explanatory page. Both
  may exist: `/tags/modernity` gathers the corpus, while
  `/wiki/modernity` would explain the subject.
- Expand the vocabulary only by editing this table and the validator in
  the same reviewed change.

Topic navigation should be featured only when it helps a reader. Defining
the vocabulary early does not require promoting a sparse topic index in
the site's main navigation.
