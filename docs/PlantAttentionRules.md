# Plant Attention Rules

## Purpose
This file defines how Plantly determines whether a plant currently needs attention.

## General principles
- Not every care log type resets the attention timer.
- Different care log types have different attention requirements.
- Some care logs override the default attention timer.
- Base attention logic should stay simple and deterministic.
- Species-specific logic should only be used where the data is reliable.

## Log Types
- WATER
- CHECK
- FERTILIZE
- PRUNE
- REPOT
- MOVE_INSIDE
- MOVE_OUTSIDE
- PEST_TREATMENT

## V1 rules
- The base attention timer is 7 days. If no other rules apply, the plant needs attention again after the base attention timer.
- Growth season and dormant season are not considered yet.
- The default assumption is growing season.
- If both min and max interval fields exist, V1 uses the min field only.
- For V1, the last relevant log means the most recent care log of any type listed in these rules.

### No logs
If a plant has no care logs, it needs attention immediately.

### Last relevant log = WATER
If the last relevant log is WATER, the next attention date depends on the species watering interval.

Relevant field:
- watering_growing_min_days

Wait amount:
- species-defined watering_growing_min_days

### Last relevant log = CHECK
If the last relevant log is CHECK, the plant needs attention again after a short default interval.

Wait amount:
- 3 days

### Last relevant log = FERTILIZE
FERTILIZE logs count as WATER logs.

Effective wait amount:
- same as WATER

### Last relevant log = PRUNE
PRUNE logs count as CHECK logs.

Effective wait amount:
- same as CHECK

### Last relevant log = REPOT
REPOT logs count as WATER logs.

Effective wait amount:
- same as WATER

### Last relevant log = MOVE_INSIDE
MOVE_INSIDE logs count as CHECK logs.

Effective wait amount:
- same as CHECK

### Last relevant log = MOVE_OUTSIDE
MOVE_OUTSIDE logs count as CHECK logs.

Effective wait amount:
- same as CHECK

### Last relevant log = PEST_TREATMENT
If the last relevant log is PEST_TREATMENT, the plant needs attention again after a short default interval.

Wait amount:
- 1 day