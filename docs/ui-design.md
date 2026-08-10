# Plantly UI Design

## Purpose

This document defines the shared UI/UX language for Plantly.

It establishes design principles, information hierarchy, navigation, interaction patterns, and baseline visual conventions that should remain consistent as individual use cases are implemented.

This document does not define every screen in advance. New screens and interaction patterns should evolve from concrete use cases while following the principles defined here.

---

## Design Principles

### Mobile First

Plantly is primarily used while physically caring for plants.

The mobile experience is therefore the primary design target.

Desktop layouts may make better use of additional space, but core workflows must not depend on desktop-specific interactions.

### Care First, Logging Second

Using Plantly must not meaningfully slow down plant care.

Common care actions should require as few interactions as practical.

Frequently repeated actions should favor direct controls over multi-step forms.

### Scannable Information

Plant information should be easy to understand at a glance.

Prefer:

* short labels
* structured values
* clear grouping
* concise notes
* visible current state

Avoid large blocks of explanatory care text when structured information communicates the same information more effectively.

### Relevant Information First

Current and actionable information has priority over historical or rarely needed information.

Historical data should remain accessible without dominating everyday workflows.

### Simple Over Decorative

Prefer a calm, clean, information-focused interface.

Avoid unnecessary dashboard widgets, excessive card nesting, decorative charts, or visual elements that do not improve understanding or interaction.

### Progressive Detail

Common information should be immediately visible.

Less frequently needed details may be revealed through secondary screens, expandable sections, dialogs, or similar patterns.

The user should not need to navigate through detailed information to perform routine care actions.

---

## Visual Language

### Typography

Use clear sans-serif typography.

Maintain a strong visual distinction between:

* page titles
* section headings
* primary values
* labels
* secondary metadata
* notes

Avoid excessive font sizes, weights, or typography variants.

### Spacing

Use a consistent spacing scale throughout the application.

Layouts should have enough whitespace to remain readable without wasting limited mobile screen space.

Interactive controls must provide comfortable touch targets.

### Color

Use a neutral base interface.

Plant, growth, seasonal, or care states may use restrained semantic color where it improves recognition.

Color must not be the only means of communicating information.

Avoid using many competing accent colors.

### Icons

Icons may support frequently repeated actions and improve scanability.

Icons should have consistent meaning throughout the application.

Important actions should not depend on ambiguous icons without labels unless their meaning is well established in context.

### Cards

Cards may be used to group meaningful information.

Avoid excessive or nested cards when simple sections or list items provide sufficient structure.

---

## Core Components

Prefer a small reusable component vocabulary.

Expected common components include:

* buttons
* icon buttons
* text inputs
* selection controls
* badges
* dialogs
* confirmation dialogs
* navigation controls
* plant list items
* species list items
* care-action controls
* section headers
* empty states
* loading states
* error states

New reusable components should emerge from repeated interface needs rather than being created speculatively.

---

## Navigation

The primary navigation should remain small and focused on frequent workflows.

A mobile bottom navigation is preferred for primary destinations.

Conceptually:

```text id="jq84yh"
┌─────────────────────────┐
│ Plantly                 │
├─────────────────────────┤
│                         │
│                         │
│      Page content       │
│                         │
│                         │
│                         │
├─────────────────────────┤
│ Plants    Care     More │
└─────────────────────────┘
```

The exact destinations may evolve as use cases are implemented.

Avoid adding primary navigation items for functionality that is rarely used.

---

## Core Screen Concepts

These wireframes describe the intended information hierarchy rather than final visual layouts.

They may evolve as relevant use cases are specified.

### Plant Collection

The plant collection is the primary overview of owned plants.

Plants should be easy to identify and may be grouped by location.

```text id="kl69gh"
┌─────────────────────────┐
│ My Plants           +   │
├─────────────────────────┤
│ Living Room             │
│                         │
│ 🌿 Hoya linearis        │
│    Window shelf         │
│                         │
│ 🌿 Thai Constellation   │
│    South window         │
│                         │
│ Balcony                 │
│                         │
│ 🌿 Olive #1             │
│                         │
│ 🌿 Olive #2             │
│                         │
├─────────────────────────┤
│ Plants    Care     More │
└─────────────────────────┘
```

Selecting a plant opens its plant detail screen.

The collection should prioritize identification and navigation rather than displaying all available plant data.

---

### Plant Detail

The plant detail screen represents one individual plant.

Current useful information appears before historical detail.

```text id="lflf31"
┌─────────────────────────┐
│ ‹ My Plants             │
├─────────────────────────┤
│                         │
│      [ Plant image ]    │
│                         │
│ Hoya linearis           │
│ Living Room             │
│                         │
│ Moisture    Slightly dry│
│ Light       Bright      │
│ Phase       Growth      │
│                         │
│ Care                    │
│ [ Water ]  [ + Action ] │
│                         │
│ Current guidance        │
│ Regular weak feeding    │
│                         │
│ Notes                   │
│ Long trailing growth... │
│                         │
│ Recent history          │
│ Watered          3d ago │
│ Repotted         2mo ago│
│                         │
│ View full history →     │
├─────────────────────────┤
│ Plants    Care     More │
└─────────────────────────┘
```

The exact care actions displayed depend on implemented use cases.

Historical information should be summarized rather than overwhelming the primary view.

---

### Care Round

The care round is optimized for rapid interaction while physically checking plants.

Plants should preferably be grouped by location so the screen follows the physical care workflow.

```text id="zg61ne"
┌─────────────────────────┐
│ Care Round              │
├─────────────────────────┤
│ Living Room             │
│                         │
│ Hoya linearis           │
│ [ Water ] [ Fertilized ]│
│                         │
│ Thai Constellation      │
│ [ Water ] [ Fertilized ]│
│                         │
│ Balcony                 │
│                         │
│ Olive #1                │
│ [ Water ] [ Fertilized ]│
│                         │
│ Olive #2                │
│ [ Water ] [ Fertilized ]│
│                         │
│       Finish Round      │
├─────────────────────────┤
│ Plants    Care     More │
└─────────────────────────┘
```

Care-round interactions should require minimal navigation.

Recording fertilizer represents a watering in which fertilizer was included, not a separate fertilization event.

Additional care actions should not make the common watering workflow cumbersome.

The exact meaning and persistence of a care round will be defined by its use cases.

---

### Species Detail

Species detail provides concise reference information rather than an encyclopedic care guide.

```text id="kof45z"
┌─────────────────────────┐
│ ‹ Species               │
├─────────────────────────┤
│ Hoya linearis           │
│                         │
│ Care                    │
│ Moisture   Slightly dry │
│ Light      Bright       │
│ Temp       18–28 °C     │
│                         │
│ Seasonal                │
│ Growth     Spring–Autumn│
│ Bloom      Winter       │
│                         │
│ Fertilizer              │
│ Growth     Balanced     │
│ Bloom      Bloom-focused│
│                         │
│ Notes                   │
│ • ...                   │
│ • ...                   │
│                         │
│ Plants                  │
│ Hoya linearis #1        │
│ Hoya linearis #2        │
├─────────────────────────┤
│ Plants    Care     More │
└─────────────────────────┘
```

Species information should remain concise and structured.

Species knowledge cannot be maintained through the application UI. The UI may display species data, but authoritative species maintenance occurs only through the species Markdown definitions.

---

## Interaction Principles

### Fast Care Actions

Frequently performed care actions should require as few interactions as practical.

If an action can safely be represented by one explicit tap, avoid introducing an unnecessary confirmation or intermediate form.

### Optional Detail

Optional data must not obstruct common actions.

For example, recording watering should not require the user to provide:

* water quantity
* moisture measurement
* fertilizer amount
* notes

Such information may be offered as optional detail where relevant.

### Destructive Actions

Actions that permanently remove meaningful data should require deliberate confirmation.

The confirmation should clearly identify what will be removed.

### Forms

Forms should request only information required by the relevant use case.

Optional fields should be clearly distinguishable from required fields.

Avoid large forms where information can be collected progressively.

### Loading

Loading states should communicate that work is occurring without unnecessarily blocking unrelated parts of the interface.

Avoid full-page loading states when only a small portion of the page is being updated.

### Errors

Errors should:

* explain what failed
* preserve entered information where practical
* allow recovery where possible
* avoid exposing unnecessary technical details

Exact user-facing error copy may be defined by individual use cases or later UI copy decisions.

### Empty States

Empty states should explain the state and provide the most useful next action where one exists.

For example, an empty plant collection should guide the user toward adding the first plant rather than displaying only an empty container.

### Feedback

Successful quick actions should provide immediate but unobtrusive feedback.

Routine care logging should not require dismissing success dialogs.

---

## Responsive Design

Mobile is the primary layout target.

Larger screens may:

* increase content width
* display additional information side by side
* use multi-column collection layouts
* keep contextual information visible

Responsive layouts must preserve the same underlying workflows.

Do not create separate desktop-only product behavior.

---

## Accessibility

Interactive controls must be keyboard accessible where applicable.

Controls should have meaningful accessible labels.

Text and important interface elements must maintain sufficient contrast.

Touch targets should be appropriately sized for mobile interaction.

Do not rely solely on:

* color
* icon shape
* position

to communicate important state.

---

## Design Evolution

This document defines the shared design language, not a complete specification of every Plantly screen.

When implementing a use case with meaningful UI:

1. Read this document.
2. Reuse existing interaction and visual patterns.
3. Determine the minimum UI required by the use case.
4. Extend existing screens where appropriate.
5. Introduce new patterns only when existing patterns are insufficient.

If a new use case introduces a reusable UI/UX principle, update this document.

Implementation-specific React patterns belong in agent engineering guidance rather than this document.

Do not redesign unrelated existing screens while implementing a focused use case unless the existing design prevents the required behavior.
