## Product

# Plantly Product

Plantly is a minimal plant collection and care logging application. It stores simple species knowledge, allows extremely fast recording of care events, and retains historical data for future analysis.

It does not attempt to predict watering schedules. Watering decisions are made through observation and moisture measurement.

## Product Principles

* **Care first, logging second.**
  Using Plantly must not make normal plant care meaningfully slower or more cumbersome.

* **Observation beats prediction.**
  Plantly should not try to infer that a plant needs water when this can be determined more reliably by observing the plant or measuring the substrate.

* **Record facts, avoid invented urgency.**
  The application should primarily record what happened and surface useful known information rather than generating unnecessary "overdue" tasks.

* **Species information should be concise.**
  Plantly is a quick reference, not an encyclopedia. Store information that is useful during normal ownership: moisture preference, light, temperature, seasonal growth or flowering periods, fertiliser guidance, and exceptional notes.

* **Prefer simple categories over false precision.**
  Values such as `dry`, `slightly dry`, `moist`, or `wet` are preferable to precise-looking recommendations that cannot realistically be followed consistently.

* **Care events should be extremely cheap to record.**
  Common actions such as watering or watering with fertiliser should require as little interaction as possible.

* **Optional detail must stay optional.**
  Additional measurements, notes, fertiliser amounts, moisture readings, photos, or observations may enrich the dataset, but they must never be required for routine logging.

* **Preserve history.**
  Historical care data has value even when there is no current user interface for analysing it. Data should be retained so it can later support reports, experiments, and data-analysis projects. Permanently deleting an explicitly identified faulty plant record is the exception and removes the history belonging to that faulty record.

* **The application should support real behaviour rather than enforce ideal behaviour.**
  Plantly should adapt to how plants are actually cared for instead of requiring the user to follow rigid schedules simply because the software models them.

* **Seasonality matters more than schedules.**
  Guidance should focus on changing conditions such as active growth, flowering, dormancy, temperature, and light rather than fixed calendar intervals where possible.

* **Special cases belong in notes.**
  The core species model should remain small. Unusual requirements should not cause the general model to become increasingly complex.

* **Adding a species should be easy.**
  Maintaining the plant collection should require little manual data entry. Species knowledge should be simple enough to add or update without filling out large forms.

* **Useful data beats complete data.**
  A large history of simple, consistently recorded events is more valuable than a theoretically rich dataset that is too tedious to maintain.

* **Features must justify continued use.**
  New functionality should either reduce care effort, provide useful knowledge, or create data with plausible future value. Features should not exist purely because a plant-care application is expected to have them.
