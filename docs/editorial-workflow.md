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

## Publication registers: fixed and tended

Adopted 2026-08-20 (owner-ratified). The site has two temporal
registers, and every published page belongs to exactly one.

**Essays are fixed at publication.** An essay is a dated act. Once
published it is out in the world and stays what it was: corrections
only, never revision of the argument. Its frontmatter carries
`status: fixed at publication; corrections only`, and `/citing`
already supports pinning the exact version by commit. This is the
provenance register: a dated, locked essay is the kind of artifact a
generated web cannot counterfeit, and the lock also performs the
philosophy. The essay completes; it does not get tended back into
indefiniteness.

Corrections on a fixed essay are: typos, broken links, formatting,
and factual or canon-drift fixes that change a sentence without
changing the argument. A correction that changes meaning gets a dated
line in a small `Corrections` section at the essay's foot, so the
record is visible rather than silent. If the argument itself must
change, that is not a correction. It is a new essay, or a dated
postscript clearly marked as later; the original stands.

**Terms and wikis are tended.** Terms carry
`status: canonical; revised in place`; wikis evolve in place; git is
the revision record. They are the living tissue around the fixed
essays.

**The fixed register applies from owner-authorized publication
forward.** A page already live before these rules existed enters the
fixed register only after the owner's voice pass, not by retroactive
stamp. As of 2026-08-20 that means the time essay is live but not yet
fixed: the owner has flagged its voice, and it awaits re-voicing
before any lock applies.

**Nothing leaves `_drafts/` without the owner's explicit go.** For an
essay, the go follows the owner's voice pass. An AI session never
publishes an essay, term, or wiki on its own initiative, however
finished a draft looks; drafting and publication are different acts,
and the second belongs to the owner.

## What goes public, and when: the pull-rule

A term or wiki page goes public when a published or publishing essay
needs it, and never before. The essay pulls the page through the
membrane; a page never walks out on its own.

This is the store-discipline. Essays spend the philosophy on
questions readers already care about, which is the work's public use.
A program of planting vocabulary ahead of use would inventory the
store without its demonstrations, and would publish pages nothing yet
drives readers to. The practical form: each essay's draft map lists
the terms and wikis it depends on, and that list is the publication
queue for those pages.

## The lock-gate for research-program material

The framework's research program (the field studies, instruments,
formal apparatus, and the vault pipeline that governs them) reaches
this site only when a field locks under the vault's own pipeline
ruling, and TSL is then the announcement surface. Until a field
locks, essays may trail the program without exposing its instruments:
use the thinking, withhold the apparatus and the coined internal
vocabulary. The published essay on time is the worked example,
carrying the temporal argument without the internal term it rests on.

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

A TSL wiki is a public, source-grounded encounter, not a neutral
encyclopedia entry. Its purpose is to orient a reader and then bring a
person, tradition, movement, institution, text, or concept into explicit
dialogue with the work articulated here. The encounter should build,
test, correct, or clarify that work. It must not recruit every
interlocutor as a precursor or treat another body of thought as raw
material for a framework that cannot itself be changed.

A public wiki draft earns publication when it has:

1. a distinctive reason to exist beyond generic biography or summary;
2. reliable engagement with primary material and the strongest fair
   account of the position needed for this page;
3. a clear account of what the subject contributes and why it matters
   here;
4. a precise account of convergence, divergence, or a harder problem,
   where any is present;
5. an explicit framework response and a reciprocal statement of what the
   encounter changes, tests, narrows, or leaves unresolved in this work;
6. finished Chicago citations and, for a substantive page, a bibliography
   or sources section;
7. meaningful links to an essay, term, or neighboring wiki;
8. one to four reviewed Topics.

Public pages may be shorter and more orienting than primary-vault wikis,
but they must not be thin search-engine pages. Traffic is an outcome of
good writing, strong internal structure, and accumulated depth.

## Public wiki editorial form

The following is a structural spine, not a set of mandatory heading
names. Short pages may combine adjacent movements. Longer pages may
expand them. Every published wiki should nevertheless make the movements
legible in this order unless the subject gives a compelling editorial
reason to vary it.

### 1. Orientation: who or what is this?

Give only the biography, history, corpus, practice, or institutional
context needed to enter the conversation. Identify the central claim or
move. Do not substitute an exhaustive life summary for an intellectual
encounter.

For a tradition, specify the relevant texts, period, school, lineage, or
practice. Never make an undifferentiated tradition speak as one person.
For an institution or commercial ecology, identify the relevant legal,
organizational, evidentiary, financial, and governance layers rather than
hiding them beneath its philosophical language.

### 2. Contribution: why does this matter here?

Name the subject's genuine gift before disagreement. Ask what it sees
unusually clearly, what problem it makes harder to ignore, and what
vocabulary, practice, distinction, or evidence it contributes. This is
not ceremonial praise. It identifies what remains valuable even if the
eventual disagreement is substantial.

### 3. Encounter: where do we meet?

Calibrate the relationship. It may be a shared problem, a structural
cognate, a useful analogy, an established lineage, or a productive
neighboring position. Resemblance alone does not establish agreement or
ancestry.

### 4. Divergence: where do we take different paths?

Locate the fork precisely. State what the subject claims, what follows
from it, and which commitment of this work leads elsewhere. Name whether
the disagreement is ontological, temporal, ethical, political,
practical, or evidentiary. Do not describe another thinker as having
nearly discovered this framework or as failing to become it. Both paths
must remain intelligible on their own terms.

### 5. The harder problem, when needed

Ordinary disagreement does not require a prosecutorial section. Include a
harder problem only when the evidence warrants a specific concern such as
contradiction, empirical overreach, political or ethical harm,
appropriation, totalization, institutional opacity, commercial conflict,
or a practice whose effects contradict its stated commitments. Make the
claim specific, cited, proportionate, and open to correction.

### 6. Framework response: what does tending make visible?

State openly how the framework engages the problem. It may preserve an
insight while rejecting its metaphysics, distinguish phenomena the
subject conflates, supply missing temporal or agential structure, show
how a proposed solution reproduces its problem, or offer a different
practice or construction. A page need not manufacture victory. Sometimes
the responsible response is a sharpened question or an unresolved test.

### 7. Reciprocal test: what changes here?

Dialogue must be able to alter both sides. State what the encounter
corrects, tests, or makes more precise in this work; which claim must be
narrowed; what remains unresolved; or what evidence could change the
present judgment. If the framework survives the encounter unchanged,
the page should make clear why that is a result of the test rather than
an assumption built into it.

### 8. Sources and ways in

End with the primary texts actually used, a Chicago bibliography or
sources section where the page is substantive, one or two responsible
starting points, and deliberate links to related essays, terms, and
neighboring wikis.

### Three voices

Every wiki must keep three voices distinguishable even when the prose
flows without labels:

1. **The subject's claim:** what the person, tradition, movement,
   institution, text, or concept actually says or does.
2. **The author's reading:** what Zayin Cabot understands to be at stake
   in that material.
3. **The framework engagement:** what tending accepts, contests,
   reframes, learns, or cannot yet decide.

Attribution phrases and section architecture should prevent a reader
from mistaking the framework's reconstruction for the subject's own
self-description.

## Citations

The vault, papers, and website use Chicago style. Public essays and wikis
use Chicago notes and bibliography form:

- Give a full note on first citation and a shortened note thereafter.
- Give page or section locators for direct quotations and load-bearing
  interpretations.
- Include a bibliography or clearly labeled sources section on
  substantive essays and wikis.
- Keep Zotero citekeys in the research and authoring layer. Never expose
  them in public prose.
- Use internal links for navigation and conceptual relation. They do not
  replace citations to external sources.
- Cite the exact text, edition, translator, recording, institutional
  document, or dataset actually used.
- Separate philosophical, historical, empirical, clinical,
  organizational, and commercial claims. Evidence in one track does not
  automatically establish another.

## Publication

To publish a draft:

1. finish the source and editorial review;
2. move the file from `_drafts/` into its live register;
3. remove `draft: true`;
4. add aliases only now, and on an essay set
   `status: fixed at publication; corrections only`;
5. verify Chicago notes, locators, and the bibliography or sources
   section;
6. review Topics against the controlled vocabulary;
7. add deliberate links from the relevant index and neighboring pages;
8. run content validation, tests, and a production build;
9. verify that no `_drafts` path or draft alias was emitted;
10. deploy only on the owner's explicit word or at an agreed session
    close.

## Linking

Links are the site's navigation and its graph. Backlinks, the local
graph, and the topic pages are all built from them, so a link is a
structural act and not a decoration. Six rules.

**No red links.** The primary vault seeds with links to pages that do
not exist yet; a published site does not. A wikilink is written only
when its target is published. `npm run validate:content` fails the
build on a wikilink whose target does not exist, and the build command
runs it, so a red link cannot reach production. Seeds live in the
to-do, not in public 404s.

**The pull-rule does the linking work.** When an essay needs a term the
site does not have, either the term is written and published with the
essay, or the essay says the thing in plain English and links nothing.
An essay never ships pointing at a page that does not exist. This is
the same pull-rule that governs promotion: the essay pulls the term
through the membrane.

**First substantive use, once per page.** Link a term the first time
the page leans on it and not again. Repeated links to one target read
as noise and flatten the graph. The validator warns above two.

**Link what the argument stands on, not what it mentions.** If a reader
who does not follow the link would misread the sentence, link it. If
the link is a courtesy, leave it out. A page dense with links is a page
that has not decided what it depends on.

**The face links sparingly; the record links freely.** In the two-strata
form the face is read straight through: at most two or three links, and
none in the opening paragraph, where an interruption costs the most.
The record is for the checker and may link each term it uses on first
mention.

**Essays link to terms; terms link to terms; essays rarely link to
essays.** An essay-to-essay link is written when the argument actually
depends on the other essay, never as a "see also." Browsing is the job
of the topic pages and the essays map, not of inline links. Aliases
carry natural phrasing: `[[the-once|once]]` reads as prose and resolves
to the canonical page.

## Topics and fields

The frontmatter field is `tags` because Quartz uses it to create tag
pages. Inside that one field the site keeps **two vocabularies**, and
the validator enforces both.

**Topics** are flat words: what a page is *about*. One to four on every
substantive page. Small, stable, thematic.

**Fields** are written `group/child`: what a page *engages*, which
science, which philosophy, which tradition, which kind of practice.
Zero to three on a page. Quartz renders a page for the child
(`/tags/science/physics`) and for the group (`/tags/science`, which also
lists its children), so fields browse at two levels without any extra
machinery. A page about grief in a Buddhist register would carry
`tags: [mortality, practice, tradition/buddhism]`.

The field library was seeded 2026-08-21 from the primary vault's
`domain` and `category` usage (Comparative Philosophy, Trika Śaivism,
Buddhism, Neoplatonism, Physics, Chemistry, Neuroscience, Psychology,
and so on). It is **proposed**, and trimmed or extended only by editing
the table below and `scripts/validate-content.mjs` together.

| Field | Use for |
| --- | --- |
| `science/physics` · `science/chemistry` · `science/biology` · `science/psychology` · `science/consciousness` · `science/mathematics` · `science/ecology` | a page that reads that science at its own criterion |
| `philosophy/process` · `philosophy/pragmatism` · `philosophy/phenomenology` · `philosophy/metaphysics` · `philosophy/comparative` · `philosophy/anthropology` | a page that engages that lineage or discipline |
| `tradition/buddhism` · `tradition/shaivism` · `tradition/christianity` · `tradition/judaism` · `tradition/islam` · `tradition/daoism` · `tradition/yoruba` · `tradition/amazonian` · `tradition/indigenous-americas` · `tradition/esoteric` | a page that engages that tradition on its own terms |
| `practice/contemplative` · `practice/clinical` · `practice/ritual` | a page about an actual practice, something learned and done |

Note the distinction the topics keep: the topic `practice` is for pages
*about* practices as lived ways of working; the field `practice/...`
names which kind. A page about the death exemption is not `practice`.

### Topics

The topic vocabulary is:

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
