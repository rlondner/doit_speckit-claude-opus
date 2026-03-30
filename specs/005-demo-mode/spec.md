# Feature Specification: Demo/Showcase Mode

**Feature Branch**: `005-demo-mode`
**Created**: 2026-03-27
**Status**: Draft
**Input**: User description: "Create a demo/showcase mode for this Next.js app that replaces all Postgres database calls with a localStorage-backed mock data layer, so the app can run fully in the browser without any backend or database."

## Clarifications

### Session 2026-03-27

- Q: Should seed data use dates relative to today or fixed calendar dates? → A: Relative to today — urgency variety is always maintained regardless of when the demo is viewed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Demo Without Setup (Priority: P1)

A visitor opens the app in demo mode and immediately sees a pre-populated set of realistic goals — active and completed — without needing to configure a database or backend. The app behaves identically to the production version, giving the visitor a full picture of the feature set.

**Why this priority**: This is the core value of demo mode — allowing anyone to experience the app instantly without infrastructure. Without this, no other demo stories are possible.

**Independent Test**: Can be fully tested by setting `NEXT_PUBLIC_DEMO_MODE=true`, opening the app in a fresh browser, and verifying that seed goals appear in both the active and completed sections with realistic titles, dates, and focus areas.

**Acceptance Scenarios**:

1. **Given** the app is running with `NEXT_PUBLIC_DEMO_MODE=true` and no prior localStorage data, **When** a visitor opens the app, **Then** they see a pre-populated list of at least 5 active goals and 2 completed goals with varied titles, end dates, focus areas, and urgency levels (normal, urgent, overdue).
2. **Given** the app is running with `NEXT_PUBLIC_DEMO_MODE=true`, **When** the visitor interacts with goal lists, **Then** sorting and display behave identically to the production app (active goals sorted by end date ascending, completed goals sorted by completion date descending).
3. **Given** the app is running without `NEXT_PUBLIC_DEMO_MODE` set (or set to `false`), **When** a visitor opens the app, **Then** the app connects to Postgres as normal and no demo behavior is activated.

---

### User Story 2 - Interact With Demo Data (Priority: P2)

A visitor creates, edits, completes, uncompletes, and deletes goals during the demo session. All changes persist within the browser session via localStorage, so the visitor can fully explore the app's capabilities.

**Why this priority**: Interactivity is what distinguishes a live demo from a static screenshot. Visitors need to experience the full CRUD workflow to evaluate the app.

**Independent Test**: Can be tested by creating a new goal, editing its title, toggling its status, and deleting it — verifying each operation persists across page refreshes within the same browser session.

**Acceptance Scenarios**:

1. **Given** the app is in demo mode with seed data loaded, **When** the visitor creates a new goal, **Then** the goal appears in the active list and persists after a page refresh.
2. **Given** the app is in demo mode, **When** the visitor edits a goal's title, end date, or focus area, **Then** the changes are saved and reflected in the UI immediately and after refresh.
3. **Given** the app is in demo mode with an active goal, **When** the visitor marks it as completed, **Then** it moves to the completed section with a completion timestamp and persists after refresh.
4. **Given** the app is in demo mode, **When** the visitor deletes a goal, **Then** it is removed from the list and does not reappear after refresh.

---

### User Story 3 - Reset Demo Data (Priority: P3)

A visitor who has modified demo data wants to return to the original seed state. They click a "Reset Demo Data" button and the app restores the initial set of pre-configured goals, discarding any changes made during the session.

**Why this priority**: Enables repeatable demos and prevents a broken state from accumulating. Important for showcase scenarios where multiple people may use the same browser.

**Independent Test**: Can be tested by modifying several goals, clicking the reset button, and verifying that the original seed data is fully restored.

**Acceptance Scenarios**:

1. **Given** the app is in demo mode and the visitor has created, edited, or deleted goals, **When** the visitor clicks "Reset Demo Data", **Then** all goals revert to the original seed data set and any visitor-created goals are removed.
2. **Given** the app is in demo mode, **When** the visitor clicks "Reset Demo Data", **Then** a confirmation prompt appears before the reset executes to prevent accidental data loss.

---

### User Story 4 - Demo Mode Banner (Priority: P3)

A visitor sees a clearly visible banner indicating they are viewing a demo/showcase build, so they understand the data is not real and the experience is sandboxed.

**Why this priority**: Prevents confusion between demo and production environments. Important for credibility and user trust but not functionally blocking.

**Independent Test**: Can be tested by opening the app in demo mode and verifying the banner is visible, contains the text "Demo Mode", and includes the reset button.

**Acceptance Scenarios**:

1. **Given** the app is running in demo mode, **When** the visitor views the page, **Then** a persistent banner is visible indicating "Demo Mode" along with the "Reset Demo Data" button.
2. **Given** the app is running in normal (non-demo) mode, **When** the visitor views the page, **Then** no demo banner is displayed.

---

### Edge Cases

- What happens when localStorage is full or unavailable (e.g., private browsing with storage limits)? The app should display a user-friendly error message explaining that demo mode requires localStorage.
- What happens when demo seed data format changes between app versions but stale localStorage data exists? The app should detect a version mismatch and re-seed automatically.
- What happens when the visitor opens the app in two browser tabs in demo mode? Both tabs should reflect the same localStorage state; changes in one tab are visible after refresh in the other.
- What happens when `NEXT_PUBLIC_DEMO_MODE=true` is set but the real database is also available? Demo mode takes precedence — no database calls are made.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read the `NEXT_PUBLIC_DEMO_MODE` environment variable and route all data operations through either the localStorage mock layer (when `true`) or the existing database layer (when `false` or unset).
- **FR-002**: System MUST seed localStorage with a realistic set of demo goals on first load when no existing demo data is found, including at least 5 active goals and 2 completed goals with varied titles, end dates (computed relative to today to ensure varied urgency levels), focus areas, and urgency levels.
- **FR-003**: The mock data layer MUST implement all four existing operations (list, create, update/patch, delete) with the same data shapes as the real data layer, including validation rules (title length, date format, focus area length).
- **FR-004**: The mock data layer MUST compute `daysRemaining` and `urgency` fields identically to the real data layer for every goal returned.
- **FR-005**: The mock data layer MUST sort results identically to the real data layer — active goals by end date ascending, completed goals by completion date descending.
- **FR-006**: System MUST persist all demo changes (creates, updates, deletes) to localStorage so they survive page refreshes within the same browser session.
- **FR-007**: System MUST provide a "Reset Demo Data" button that restores the original seed data, discarding all visitor modifications, after user confirmation.
- **FR-008**: System MUST display a persistent "Demo Mode" banner when running in demo mode, visible without scrolling.
- **FR-009**: System MUST NOT make any network requests to the database when running in demo mode.
- **FR-010**: System MUST include a version identifier with the seed data so that stale localStorage data from a previous version is automatically re-seeded.
- **FR-011**: System MUST display a user-friendly error if localStorage is unavailable or full.
- **FR-012**: The existing frontend components (goal cards, goal lists, modals) MUST require zero changes — the mock layer must be transparent to the UI.

### Key Entities

- **Goal**: The single entity in the system — represents a user goal with title, end date, status (active/completed), optional focus area, creation timestamp, and optional completion timestamp. Extended with computed urgency fields for display.
- **Demo Seed Data**: A fixed, versioned collection of realistic goals used to initialize the demo experience. Covers a range of urgency levels, focus areas, and statuses.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor sees a fully populated demo within 2 seconds of opening the app, with zero setup or configuration required on their part.
- **SC-002**: All four core operations (create, read, update, delete) work identically in demo mode as in normal mode from the visitor's perspective — no visual or behavioral differences.
- **SC-003**: Demo data persists across page refreshes within the same browser session with 100% reliability.
- **SC-004**: The "Reset Demo Data" action restores the exact original seed state within 1 second.
- **SC-005**: Switching between demo mode and normal mode requires changing only a single environment variable — no code changes, no additional configuration.
- **SC-006**: The demo mode banner is visible without scrolling on page load, clearly communicating the demo context to the visitor.

## Assumptions

- The app has a single page (`/`) so the demo banner and behavior only need to apply to one view.
- localStorage is available in the target browsers (all modern browsers support it; private/incognito may have limits which are handled as an edge case).
- The existing client-side cache mechanism will continue to function as-is in demo mode since the mock layer replaces the data source, not the caching mechanism.
- Demo mode is intended for public showcases and portfolio demonstrations, not for automated testing.
- The seed data will use English-language goal titles that are generic and professional (e.g., "Complete quarterly report", "Learn a new programming language").
- The environment variable approach works with static site deployments where the value is inlined at build time.
