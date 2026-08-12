# UC-033: Navigate Application

## Status

Implemented

## Goal

Allow the user to move predictably between Plantly's implemented application areas on mobile and desktop without relying on browser controls or breadcrumbs as the only way to leave a module.

## Preconditions

* The user has opened a normal Plantly application screen.
* The Home behaviour defined by UC-034 is available.

## Behaviour

1. Plantly displays shared application navigation containing Home, My Plants, Species, and Locations.
2. Plantly identifies the destination corresponding to the current screen.
3. The user may select any available destination to open that application area.
4. Plantly displays the navigation persistently alongside content in the desktop layout.
5. In the mobile layout, Plantly displays a compact application header and keeps the navigation collapsed until the user opens it.
6. When the user opens mobile navigation, Plantly displays the same destinations as the desktop navigation without replacing or modifying page data.
7. The user may close the mobile navigation without navigating, or select a destination and continue to that area.
8. Plantly closes the mobile navigation after a destination is selected.
9. The Plantly identity provides access to Home.
10. Detail and form screens provide contextual return navigation to their parent overview in addition to the shared application navigation.
11. Plantly only presents destinations whose behaviour is available through implemented use cases.

## Edge Cases

### Current destination

Selecting the destination for the area already being viewed does not create a duplicate navigation layer or modify application data.

### Mobile navigation dismissed

If the user dismisses mobile navigation without selecting a destination, Plantly closes it and leaves the current screen and its data unchanged.

### Nested screen

When the user views a nested screen such as plant detail, plant editing, or species detail, Plantly identifies the corresponding primary application area and provides contextual return navigation.

### Destination unavailable

Functionality without an implemented use case is not presented as an available destination. When a future destination becomes implemented, it may be added without changing the behaviour of existing destinations.

### Navigation target cannot be loaded

If the selected destination cannot be loaded, Plantly communicates the failure and provides recovery appropriate to that destination without navigating to unrelated data.

## Postconditions

* After successful navigation, the selected application area is displayed and identified as current.
* Opening, closing, or using navigation does not modify plants, species, locations, care events, or entered form data except where leaving an unfinished form naturally discards changes that were never submitted.

## Acceptance Criteria

* [ ] Given any normal application screen is displayed, when the user views the shared navigation, then Home, My Plants, Species, and Locations are available.
* [ ] Given an application area or one of its nested screens is displayed, when the shared navigation is shown, then the corresponding destination is identified as current without relying on colour alone.
* [ ] Given the desktop layout is displayed, when the user navigates through Plantly, then the shared navigation remains visible alongside the current page content.
* [ ] Given the mobile layout is displayed, when the navigation is closed, then a compact application header provides a control to open it without obscuring the page content.
* [ ] Given the mobile navigation is closed, when the user opens it, then the same destinations available in desktop navigation are displayed over the current page.
* [ ] Given the mobile navigation is open, when the user uses its close control, dismisses its backdrop, or presses Escape, then it closes and the current screen remains unchanged.
* [ ] Given the mobile navigation is open, when the user selects a destination, then Plantly displays that application area and closes the navigation.
* [ ] Given the user selects the Plantly identity, when navigation succeeds, then Home is displayed.
* [ ] Given a plant detail or plant form is displayed, when contextual navigation is shown, then the user can return to My Plants without relying on browser controls.
* [ ] Given a species detail is displayed, when contextual navigation is shown, then the user can return to Species without relying on browser controls.
* [ ] Given a nested plant or species screen is displayed, when the shared navigation is shown, then My Plants or Species respectively is identified as the current application area.
* [ ] Given a future application area has not been implemented, when navigation destinations are displayed, then that area is not presented as available.
* [ ] Given the user opens, closes, or follows application navigation, when navigation occurs, then no stored plant, species, location, or care-event data is modified.
* [ ] Given navigation can be operated by keyboard, when the user opens, moves through, selects, or dismisses it, then focus remains visible and follows a predictable order.

## Out of Scope

* Defining behaviour within Home, My Plants, Species, or Locations.
* Implementing care-event or care-round navigation before the corresponding use cases are implemented.
* Adding global create or care actions to the navigation.
* Preserving unsaved form input after the user deliberately navigates away.
