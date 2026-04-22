# Weather Dashboard Rules

## Purpose
This file defines how Plantly displays weather information and weather warnings on the dashboard.

## General principles
- Weather is contextual information only.
- Weather must not influence plant task logic.
- The dashboard weather feature should stay simple and deterministic.
- Warnings and infos are based only on the next 24 hours.
- The 3-day forecast is display-only and does not affect warning generation.

## Data shown on the dashboard
The weather section should display:
- current weather summary
- 3-day forecast
- weather warnings and info messages

## Warning window
Only the next 24 hours are used to generate warnings and info messages.

Forecast data after the next 24 hours:
- may be displayed in the 3-day forecast
- must not affect warning or info generation

## Severity levels
Weather messages are grouped into these levels:
- red warning
- yellow warning
- info

## Display order
If multiple messages are shown, they must be ordered as follows:
1. red warnings
2. yellow warnings
3. info messages

## Temperature rules

### Frost warning
Show a red warning if:
- the minimum temperature in the next 24 hours is below 0°C

### Cold warning
Show a yellow warning if:
- the minimum temperature in the next 24 hours is below 10°C
- and the minimum temperature is not below 0°C

### Heat warning
Show a red warning if:
- the maximum temperature in the next 24 hours is above 30°C

### Warm warning
Show a yellow warning if:
- the maximum temperature in the next 24 hours is above 25°C
- and the maximum temperature is not above 30°C

## Wind rules

### Strong wind warning
Show a red warning if:
- the maximum wind speed in the next 24 hours is above 40 km/h

### Wind warning
Show a yellow warning if:
- the maximum wind speed in the next 24 hours is above 25 km/h
- and the maximum wind speed is not above 40 km/h

## Rain rules

### Rain info
Show an info message if:
- forecasted precipitation in the next 24 hours is greater than 1 mm

## Behavior notes
- The rules above are intentionally generic and should not be plant-specific.
- No weather rule should automatically create, modify, or suppress plant tasks.
- Weather warnings are meant to inform the user, not replace human judgment.
- Future plant/location-specific weather logic is out of scope for this version.