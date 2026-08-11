# Plantly UI Design

## Purpose

This document defines the shared UI/UX language for Plantly.

It establishes design principles, responsive priorities, navigation, visual tokens, component conventions, and interaction patterns that should remain consistent as individual use cases are implemented.

This document does not define every screen in advance. Use cases define observable behaviour. This guide defines how that behaviour should be presented consistently.

The visual direction is based on the previous Plantly application: a calm neutral interface, restrained green accents, white surfaces, subtle borders and shadows, and sidebar navigation. Previous product behaviour is not inherited unless it is defined by the current domain, business rules, or use cases.

---

## Design Principles

### One Product, Two Usage Contexts

Plantly must be fully usable on mobile and desktop. Both layouts expose the same underlying information and workflows, but they may prioritise and arrange them differently.

Mobile is primarily used while physically caring for plants. It prioritises:

* recording care events with minimal interaction;
* adding quick observations and notes;
* identifying a plant and its current care context;
* large touch targets and short, focused flows; and
* avoiding dense controls or unnecessary detail before a common action.

Desktop is primarily used to review and maintain the collection. It prioritises:

* collection overview and comparison;
* organising plants and locations;
* reading and writing detailed notes;
* reviewing history and guidance;
* planning and administrative actions; and
* using additional width to keep useful context visible.

Responsive design does not require identical layouts. A desktop overview may show more fields, denser controls, or multiple sections side by side when the additional information is useful. Mobile may reduce a card to essential identifying and actionable information, with remaining detail available on the relevant detail screen.

No essential action may be available only on desktop. Do not create separate domain behaviour for one viewport.

### Care First, Logging Second

Using Plantly must not meaningfully slow down plant care.

Common care actions should require as few interactions as practical. Frequently repeated actions should favour direct controls over multi-step forms. Optional detail must not obstruct recording the basic fact.

### Scannable Information

Plant information should be easy to understand at a glance.

Prefer:

* short labels;
* structured values;
* clear grouping;
* concise notes;
* visible current state; and
* predictable placement of repeated actions and metadata.

Avoid large blocks of explanatory care text when structured information communicates the same information more effectively.

### Relevant Information First

Current and actionable information has priority over historical or rarely needed information. Historical data should remain accessible without dominating everyday workflows.

Additional desktop detail must help comparison, organisation, planning, or understanding. Available space alone is not a reason to display more information.

### Simple Over Decorative

Prefer a calm, clean, information-focused interface.

Avoid unnecessary dashboard widgets, excessive card nesting, decorative charts, strong gradients, or visual elements that do not improve understanding or interaction.

### Progressive Detail

Common information should be immediately visible. Less frequently needed detail may be revealed through secondary screens, expandable sections, dialogs, or similar patterns.

The user should not need to navigate through detailed information to perform routine care actions.

---

## Visual Language

### Overall Character

The interface should feel calm, practical, and lightly organic without becoming decorative. Neutral colours carry most of the interface. Green identifies Plantly, primary actions, links, focus, and selected navigation. Semantic colours are reserved for states that benefit from them.

Use borders and spacing before shadows to establish hierarchy. Surfaces should feel light rather than elevated or glossy.

### Typography

Use `Inter` when it can be provided reliably, followed by the system sans-serif stack. The interface must remain legible when the web font is unavailable.

Use a restrained type scale:

| Role | Typical size | Weight | Guidance |
| --- | --- | --- | --- |
| Page title | 1.875rem on mobile, up to 2.25rem on desktop | 700 | One clear title per page |
| Section heading | 1.125rem to 1.25rem | 600 or 700 | Separate meaningful page regions |
| Card title / primary value | 1rem to 1.125rem | 600 or 700 | Make identifying information easy to scan |
| Body | 0.875rem to 1rem | 400 | Default reading text |
| Label | 0.75rem to 0.875rem | 500 or 600 | Use concise wording; uppercase only for short labels |
| Metadata | 0.75rem to 0.875rem | 400 or 500 | Use neutral secondary colour |

Do not communicate hierarchy using size alone. Combine size with weight, spacing, and semantic structure. Avoid more than three visibly competing font weights in one region.

### Colour Palette

The following values establish the intended palette. Equivalent Tailwind tokens should be preferred in implementation.

| Role | Value | Typical use |
| --- | --- | --- |
| Canvas | `#fafafa` | Application background |
| Surface | `#ffffff` | Sidebar, cards, forms, dialogs |
| Strong text | `#171717` | Headings and primary values |
| Body text | `#404040` | Normal content |
| Secondary text | `#737373` | Metadata, hints, secondary labels |
| Border | `#e5e5e5` | Cards, dividers, controls |
| Subtle fill | `#f5f5f5` | Hover states and grouped backgrounds |
| Brand green | `#15803d` | Brand, links, selected navigation |
| Action green | `#16a34a` | Primary actions |
| Green hover | `#166534` | Primary-action hover or pressed state |
| Green tint | `#f0fdf4` | Selected navigation and restrained positive emphasis |

Semantic colours may use restrained red, amber, and blue families for destructive/error, caution, and informational states. Semantic meaning must also be expressed through text, labels, or icons. Do not use semantic colour to predict that care is due unless a future use case explicitly defines that behaviour.

Dark mode is not currently a requirement. Do not introduce an incomplete automatic dark theme that reduces consistency or contrast.

### Spacing and Density

Use a 4px base spacing scale. Prefer repeated increments corresponding to 4, 8, 12, 16, 24, 32, and 48px.

* Mobile page gutters should normally be 16px.
* Desktop page gutters should normally be 24 to 32px.
* Related controls generally use 8 to 12px gaps.
* Card content generally uses 16px on mobile and may use 20 to 24px on desktop.
* Major page sections generally use 24 to 32px vertical separation.

Compact desktop presentation may reduce vertical repetition, but must remain readable and operable.

### Shape, Borders, and Elevation

Use a small radius vocabulary:

* 6 to 8px for inputs, buttons, badges, and compact controls;
* 12px for cards, grouped filters, and menus; and
* 16px for prominent panels or dialogs when the larger radius improves separation.

Default surfaces use a 1px neutral border. Use subtle shadows only for floating or interactive layers such as the sidebar drawer, menus, dialogs, or a hovered card. Avoid stacking multiple shadows or combining strong borders with strong shadows.

### Icons

Use simple outline icons with consistent stroke weight. Icons may support repeated actions and improve scanability.

Important or unfamiliar actions require visible text or an accessible label. Do not rely on an icon alone for destructive actions, ambiguous care actions, or important status.

### Motion

Use short, restrained transitions for navigation drawers, hover states, disclosure, and feedback. Motion should explain a state change, not decorate the page. Respect reduced-motion preferences.

---

## Application Layout and Navigation

### Shared Application Shell

Normal application screens live within one shared shell. The shell provides the Plantly identity, primary navigation, consistent canvas, and a content region. Error or exceptional full-screen states may use a reduced shell when the normal navigation cannot be loaded safely.

The main content region should:

* use the neutral canvas;
* retain consistent page gutters;
* allow focused reading pages to use a narrower measure; and
* allow collection, planning, and organisation screens to use a wider desktop measure.

Avoid forcing every page into the same narrow maximum width. A detailed note may benefit from a readable line length, while a desktop plant overview may use a wide multi-column grid.

### Desktop Navigation

At desktop widths, display a persistent left sidebar approximately 16rem wide. It remains visible while the main content scrolls.

The sidebar contains:

* the Plantly name and a short product descriptor;
* a small set of destination links defined by implemented use cases; and
* a clear selected state for the current destination.

Selected destinations use the green tint, brand-green text, and an additional non-colour cue such as weight or a marker. Unselected destinations use neutral text and a subtle neutral hover state.

Primary navigation represents destinations, not one-off actions. Actions such as adding a plant belong in the relevant page header or workflow unless a use case establishes them as globally frequent.

### Mobile Navigation

At mobile widths, replace the persistent sidebar with a compact sticky header containing the Plantly identity and a labelled navigation control.

Activating the control opens the same navigation destinations in an off-canvas drawer. The drawer:

* appears above the page with a subdued backdrop;
* identifies the selected destination;
* can be closed with its close control, the backdrop, or the Escape key;
* closes after a destination is selected; and
* returns focus predictably when dismissed without navigation.

The closed drawer must not remain reachable by keyboard or assistive technology. Opening it must not cause the underlying page to perform an action.

### Navigation Model

The current primary destinations are:

* Home — the location-oriented active-plant overview;
* My Plants — the searchable and filterable collection;
* Species — concise species knowledge; and
* Locations — location management.

Add future destinations only when their use cases are implemented. In particular, do not show Care as a working destination before its workflow exists.

The Plantly identity links to Home. Detail and form screens additionally provide contextual return navigation, such as returning from a plant detail to My Plants or from a species detail to Species. Breadcrumbs may supplement this navigation on deeper desktop screens but must not be the only way to leave a module.

---

## Responsive Content Strategy

Responsive layouts should be chosen from the purpose of the screen rather than by shrinking the desktop arrangement.

### Mobile

* Prefer one primary column.
* Keep the main care action and quick-note entry easy to reach.
* Reduce overview cards to essential identification, current context, and actions.
* Stack form controls and make primary actions full-width when that improves reach and clarity.
* Move secondary management actions into clearly labelled disclosure or menus.
* Avoid horizontal scrolling for normal content.

### Desktop

* Use multiple columns where comparison or simultaneous context is valuable.
* Keep filters, organisation controls, detailed notes, history, or guidance visible alongside primary content when useful.
* Allow overview cards or rows to show additional useful fields that are available through detail views on mobile.
* Keep primary and secondary actions visually distinct even when more actions fit on screen.
* Do not fill space with decorative widgets or duplicate information.

### Information Parity

The two layouts may differ in density, ordering, and initial visibility. They must preserve access to the same records and actions. Information omitted from a compact mobile card must remain available through a clear detail route or disclosure.

---

## Core Components

Prefer a small reusable component vocabulary. New reusable components should emerge from repeated interface needs rather than being created speculatively.

### Buttons and Links

* Primary buttons use action green, white text, and a darker hover or pressed state.
* Secondary buttons use a white or subtle neutral surface with a neutral border.
* Destructive buttons use explicit destructive wording and restrained red emphasis.
* Text links use brand green and a visible hover/focus treatment.
* Disabled controls remain legible and visibly unavailable.
* Mobile touch targets should normally be at least 44 by 44px.

Use one visually dominant primary action per local region. Do not style ordinary navigation links as primary actions unless they initiate the region's main workflow.

### Forms

Forms use persistent visible labels. Placeholder text may provide an example but never replaces a label.

Inputs use a white surface, neutral border, readable text, and a clear green focus ring. Validation messages appear near the affected field and do not rely on colour alone.

On mobile, stack fields unless a pair is short and naturally related. On desktop, related fields may share rows and detailed-note fields may use additional width or height.

Forms should request only information required by the relevant use case. Optional fields must be distinguishable from required fields. Avoid large forms where information can be collected progressively.

### Cards and List Items

Cards use a white surface, neutral border, 12px radius, and little or no resting shadow. Hoverable cards may strengthen the border with green and add a subtle shadow.

The whole card may be interactive when it has one clear destination. If a card contains multiple actions, preserve valid semantics and avoid nested interactive controls.

Plant cards prioritise:

1. nickname;
2. species name;
3. information required by the view's use case; and
4. optional additional desktop context.

Avoid nested cards when headings, dividers, or list rows provide enough structure.

### Badges and Status

Badges are compact and use short labels. Use tint, text, and when helpful a border. Status must remain understandable without colour.

### Dialogs and Menus

Dialogs use a white surface, clear title, concise consequence text, and explicit actions. Destructive confirmation identifies the affected record and result.

Menus and dialogs must manage focus, support Escape where appropriate, and remain usable without pointer input.

### Loading, Empty, Error, and Feedback States

Loading states communicate that work is occurring without blocking unrelated content. Avoid full-page loading when only one region is changing.

Empty states explain the state and provide the most useful next action when one exists. Filtered empty states must be distinguishable from a genuinely empty collection.

Errors explain what failed, preserve input where practical, allow recovery where possible, and avoid exposing unnecessary technical details.

Successful quick actions provide immediate but unobtrusive feedback. Routine care logging must not require dismissing a success dialog.

---

## Core Screen Concepts

### Home Plant Overview

Home is initially a location-oriented overview of active plants. It follows the behavioural specification created for that view.

Each location forms a clear section. Plant cards remain compact and show the nickname, species name, and last recorded care-event date. The current version must not infer urgency or use colour to claim that a plant needs care.

Mobile uses a compact single-column presentation suited to selecting a plant while moving between locations. Desktop may use a multi-column grid within each location and wider spacing for overview and comparison.

### Plant Collection

My Plants is the complete searchable, sortable, and filterable collection. It prioritises identification and collection management rather than duplicating the location-oriented Home view.

Mobile keeps filters compact and collapsible. Desktop may keep more filters visible and show additional useful collection metadata when supported by a use case.

### Plant Detail

Plant detail represents one individual plant. Current useful information and frequent care actions appear before historical or administrative detail.

On mobile, care actions and quick notes have priority. On desktop, notes, current guidance, history, images, and management controls may be arranged side by side when their use cases exist.

The exact actions and information displayed depend on implemented use cases.

### Care Round

The care round is optimised for rapid interaction while physically checking plants. Plants should preferably be grouped by location so the screen follows the physical care workflow.

Care-round interactions should require minimal navigation. Recording fertilizer represents watering in which fertilizer was included, not a separate fertilisation event. Additional care actions must not make the common watering workflow cumbersome.

The exact meaning and persistence of a care round will be defined by its use cases.

### Species Detail

Species detail provides concise, structured reference information rather than an encyclopedic guide.

Species knowledge cannot be maintained through the application UI. The UI may display species data, but authoritative species maintenance occurs only through the species Markdown definitions.

---

## Accessibility

* Interactive controls must be keyboard accessible where applicable.
* Controls require meaningful accessible names.
* Text and important interface elements must maintain sufficient contrast.
* Touch targets must be appropriately sized for mobile interaction.
* Focus must remain visible and follow a predictable order.
* Navigation drawers, dialogs, disclosures, and menus must expose their open or selected state programmatically.
* Important state must not rely solely on colour, icon shape, or position.
* Responsive reordering must preserve a logical reading and focus order.

---

## Design Evolution

This document defines the shared design language, not a complete specification of every Plantly screen.

When implementing a use case with meaningful UI:

1. Read this document.
2. Reuse existing interaction and visual patterns.
3. Determine the minimum UI required by the use case.
4. Apply the mobile and desktop priorities relevant to the workflow.
5. Extend existing screens where appropriate.
6. Introduce new patterns only when existing patterns are insufficient.

If a use case introduces a reusable UI/UX principle, update this document. Implementation-specific React patterns belong in agent engineering guidance rather than here.

Do not redesign unrelated screens while implementing a focused use case unless the existing design prevents the required behaviour.



### UI PROMPT

Rework the Plantly frontend styling according to docs/ui-design.md.
Introduce the shared application shell defined by UC-033 and apply the documented visual language consistently across every currently implemented frontend screen.
Reuse Tailwind and shared components for page headers, buttons, forms, cards, badges, dialogs, navigation, empty states, loading states, and errors.
Preserve all behavior defined by existing use cases. Do not add speculative features or change backend/domain behavior.
Optimize mobile layouts for quick care and note entry, and desktop layouts for overview, organisation, and detailed information. Where the existing UCs do not yet provide care actions or additional data, style only what currently exists.
Visually inspect representative mobile and desktop viewports, then run frontend tests, linting, type checking, and build validation.