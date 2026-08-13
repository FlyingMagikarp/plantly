---
name: generate-species
description: Research a named plant species and create a parser-compatible Plantly Markdown definition with evidence, controlled-vocabulary mappings, confidence ratings, conflicts, and source citations. Use when asked to add, generate, draft, or research a species definition under docs/species.
---

# Generate Species

Create one authoritative Plantly species definition from trusted horticultural evidence. Treat the generated Markdown as a short care reference, not an encyclopedia. Return the research trail separately because the species parser accepts only the template's sections and fields.

## Input

Require a species name. Accept a scientific name, common name, cultivar, or hybrid, but resolve the intended taxon before writing.

If the supplied name is ambiguous and different interpretations would materially change care guidance, ask the user to identify the intended plant. Do not silently substitute a related species. Preserve cultivar or hybrid specificity when reliable evidence supports it; otherwise disclose that evidence applies to the parent species or broader taxon.

## Read Project Context

Before researching or editing, read completely:

* `AGENTS.md`
* `docs/species/TEMPLATE.md`
* `docs/species/README.md`
* `docs/product.md`
* `docs/domain.md`
* `docs/business-rules.md`
* the species definition parser and its accepted values
* existing files under `docs/species/`

Use the current repository as authoritative for syntax and controlled vocabulary. If these files disagree, stop and report the conflict.

## Research Sources

Search the web and open the supporting pages. Prefer sources in this order:

1. Royal Horticultural Society (RHS)
2. University extension services
3. Botanical gardens and recognized horticultural institutions
4. Specialist plant societies
5. Reputable specialist growers or nurseries

Unless specified otherwise, assume Northern Hemisphere and zone 7b.

Use at least two independent sources where practical. Prefer primary care pages for the exact taxon and evidence that directly supports the mapped field. A search-result snippet is not evidence; open the page. Record the page title, publishing organization, direct URL, and access date.

Do not use generic SEO care sites, social media, forums, AI-generated summaries, or retailer descriptions as the sole authority. Do not let many low-quality sources outweigh one strong horticultural authority.

If two suitable independent sources cannot be found, continue only when the available evidence is credible, lower the relevant confidence, and state the limitation. Do not fill gaps from memory.

## Compare Evidence

Build an evidence matrix for every required field:

* moisture
* light
* preferred temperature range
* minimum temperature
* growth period
* bloom period
* dormancy period
* growth, bloom, and dormancy fertilizer

Separate explicit source statements from inference. Account for whether advice describes indoor container culture, greenhouse culture, or outdoor cultivation and whether dates assume a particular hemisphere. Prefer care guidance relevant to a single-user indoor plant collection. Treat hardiness-zone survival data as different from a safe indoor-care minimum.

When sources conflict, do not average them mechanically. Explain the likely reason, choose the best-supported interpretation for Plantly's context, and lower confidence. Use `unknown` where the schema permits it and evidence cannot justify a value. If a required care value cannot be responsibly normalized, pause and ask rather than inventing it.

## Normalize to Plantly Vocabulary

Map evidence to the definitions in `docs/species/README.md`:

* Moisture: `dry`, `slightly-dry`, `moist`, or `wet`.
* Light: `low`, `medium`, `bright-indirect`, or `direct`.
* Seasonal periods: full English `Month-Month`, `year-round` where allowed, `none`, or `unknown`.
* Fertilizer: `none`, `balanced`, `foliage`, `bloom`, or `species-specific`.

Apply these guardrails:

* Map wording by meaning, not keyword alone. For example, “well-drained” describes drainage and does not by itself prove `dry` or `slightly-dry`.
* Distinguish tolerates from prefers. Choose the preferred category; mention meaningful tolerance only when useful in Notes.
* Do not translate outdoor “full sun” directly to indoor `direct` without considering the source's growing context.
* Use a conservative preferred temperature range supported by normal growth guidance. Use the minimum as an approximate care threshold, not a claimed lethal limit.
* Do not invent calendar months from generic phrases such as “growing season.” Use `unknown` when timing is unresolved.
* Use `none` only when a phase does not meaningfully occur, not merely when a source omits it.
* When a seasonal phase is `none`, set its fertilizer to `none`.
* Use `species-specific` only when the general fertilizer categories do not fit, and explain the requirement in Notes.
* Keep Notes concise, actionable, species-specific, and supported. Do not put citations or research commentary in Notes.

Rate each mapping `high`, `medium`, or `low` confidence:

* `high`: multiple credible sources align, or one top-tier source states the value directly and another supports it.
* `medium`: credible indirect evidence requires a reasonable normalization, or sources vary in a reconcilable way.
* `low`: only one suitable source exists, evidence is extrapolated from a broader taxon, or a material conflict remains.

## Assign Identity and Filename

Use the accepted scientific name as the title when the evidence establishes it; otherwise use the least ambiguous supported name and disclose the naming choice.

Create a concise kebab-case slug. Before assigning an ID:

1. Inspect current `docs/species/SP-*.md` filenames.
2. Inspect Git history for species filenames, including deleted files, because IDs are permanent and cannot be reused.
3. Choose the next unused three-digit ID greater than every ID found in current files or history.
4. Confirm that neither the ID nor intended species/slug already exists.

If repository history is unavailable or does not establish whether an apparent gap was previously used, do not fill the gap. Prefer the next ID above the observed maximum. Stop if the next ID exceeds three digits because the documented filename format does not define that case.

Write `docs/species/SP-xxx-species-name.md` from `TEMPLATE.md`. Do not overwrite an existing definition unless the user explicitly asked to update it.

## Validate

After writing:

1. Re-read the generated file against `docs/species/TEMPLATE.md` and `docs/species/README.md`.
2. Confirm every required field is present, exact, and parser-compatible; Notes is the only optional section.
3. Confirm title, slug, ID, temperature ordering, seasonal values, and phase/fertilizer consistency.
4. Run the repository's species validation command if one exists.
5. Run the narrowest parser-focused automated test available when no dedicated CLI validator exists.

Fix validation failures caused by the new definition. Do not synchronize species into a database as part of this skill unless the user separately requests it.

## Report

Return the created file path and validation result, followed by a short, editable research report. For every field, use this compact shape:

```text
Moisture: slightly-dry
  RHS: well-drained; water moderately during active growth.
  NC State Extension: allow part of the substrate to dry between waterings.
  Mapping: source wording normalized to Plantly's substrate-moisture vocabulary.
  Confidence: high
```

Include:

* one block for each required field; group the three fertilizer fields only when the same evidence and reasoning applies
* short source paraphrases, not long quotations
* explicit conflicts, assumptions, broader-taxon extrapolations, and hemisphere or cultivation-context limitations
* a final source list with organization, page title, direct URL, and access date
* unresolved low-confidence items that deserve manual review

Keep citations in the report, not in the strict species Markdown file. Ensure each factual claim can be traced to a listed source.

## Completion Criteria

Complete only when the taxon is resolved, trusted evidence has been compared, all mappings are justified and confidence-rated, a unique parser-compatible file exists, relevant validation passes, and the source report is delivered. If evidence is inadequate for a required value, report the blocker instead of fabricating a complete definition.
