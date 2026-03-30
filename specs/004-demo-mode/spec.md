# Feature Specification: Browser-based Demo Mode

**Feature Branch**: `004-demo-mode`  
**Created**: Friday, March 27, 2026  
**Status**: Draft  
**Input**: User description: "Create a demo/showcase mode for this Next.js app that replaces all Postgres database calls with a localStorage-backed mock data layer, so the app can run fully in the browser without any backend or database. Requirements: - Intercept or replace all API route handlers (or data-fetching functions) with equivalents that read/write from localStorage instead of Postgres Seed localStorage with a realistic set of pre-configured demo items on first load (if no data exists yet), covering the main entities in the app - The mock layer should mirror the same data shapes/schemas returned by the real API so the frontend components require zero changes - Add a visible 'Demo Mode' banner in the UI so viewers know they're seeing a showcase build - Changes made during the demo (creates, updates, deletes) should persist within the same browser session via localStorage, but a 'Reset Demo Data' button should restore the original seed data - The switch between real-database mode and demo mode should be controlled by a single environment variable (e.g. NEXT_PUBLIC_DEMO_MODE=true)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initial Demo Load with Seed Data (Priority: P1)

A first-time visitor opens the application in demo mode. The system automatically populates the dashboard with realistic goals and tasks so the visitor immediately sees a fully functional showcase without needing to manually enter data.

**Why this priority**: Essential for the "showcase" value proposition. Users must see a populated app immediately.

**Independent Test**: Clear browser storage, set `NEXT_PUBLIC_DEMO_MODE=true`, and load the app. Verify that pre-defined goals appear.

**Acceptance Scenarios**:

1. **Given** no data in localStorage and demo mode enabled, **When** the app loads, **Then** a set of realistic seed goals is created and displayed.
2. **Given** demo mode is enabled, **When** any page loads, **Then** a "Demo Mode" banner is clearly visible to the user.

---

### User Story 2 - Interacting with Demo Data (Priority: P1)

A user interacts with the demo app by creating, editing, or deleting goals. These changes are saved immediately to their local browser session, allowing them to test the full application flow as if it were connected to a real database.

**Why this priority**: The demo must be interactive and functional to effectively showcase the application's capabilities.

**Independent Test**: In demo mode, create a new goal, refresh the page, and verify the goal still exists.

**Acceptance Scenarios**:

1. **Given** the app is in demo mode, **When** a user creates a new goal, **Then** it is saved to localStorage and appears in the list.
2. **Given** a goal exists in demo mode, **When** it is updated or deleted, **Then** the change persists after a page refresh.

---

### User Story 3 - Resetting Demo Data (Priority: P2)

A user who has modified the demo data wants to return to the original "clean" showcase state. They use a reset feature to wipe their local changes and re-apply the original seed data.

**Why this priority**: Important for reviewers who want to explore different scenarios or restart the guided experience.

**Independent Test**: Modify several items in demo mode, click "Reset Demo Data", and verify the list returns to the initial seed state.

**Acceptance Scenarios**:

1. **Given** modified data in localStorage, **When** the "Reset Demo Data" button is clicked, **Then** all local changes are removed and the original seed data is restored.

---

### User Story 4 - Toggling Demo Mode (Priority: P3)

A developer or administrator toggles the `NEXT_PUBLIC_DEMO_MODE` environment variable. The application switches between using the real PostgreSQL database and the browser-based localStorage mock without requiring code changes to the UI components.

**Why this priority**: Facilitates easy switching between development/production and showcase modes.

**Independent Test**: Switch the environment variable from `true` to `false` (or unset) and verify the app attempts to connect to the real API/database.

**Acceptance Scenarios**:

1. **Given** `NEXT_PUBLIC_DEMO_MODE` is not set or is false, **When** the app loads, **Then** no "Demo Mode" banner is shown and real API calls are performed.

---

### Edge Cases

- **Quota Exceeded**: How does the system handle a situation where `localStorage` is full? (Default: Inform the user and potentially clear oldest demo data).
- **Schema Mismatch**: What happens if the seed data format differs from what the UI expects? (Default: Seed data must be strictly validated against the app's TypeScript types).
- **Incognito Mode**: How does demo mode behave in browsers that restrict `localStorage` access? (Default: Provide a read-only fallback or alert the user).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST detect the active mode using the `NEXT_PUBLIC_DEMO_MODE` environment variable.
- **FR-002**: System MUST intercept or substitute all data-fetching functions (e.g., goals retrieval) with localStorage-based equivalents when demo mode is active.
- **FR-003**: System MUST provide a "Seed" mechanism that populates `localStorage` with a pre-defined set of realistic "Goal" entities on the first visit.
- **FR-004**: System MUST ensure that the mock data layer returns objects that match the existing TypeScript interfaces and API response shapes exactly.
- **FR-005**: System MUST display a global, non-intrusive "Demo Mode" banner in the UI when active.
- **FR-006**: System MUST provide a "Reset Demo Data" button, accessible from the UI, that clears local changes and triggers re-seeding.
- **FR-007**: System MUST persist all CRUD operations (Create, Read, Update, Delete) to `localStorage` while in demo mode.

### Key Entities *(include if feature involves data)*

- **Goal**: The primary entity in the app, representing a user-defined objective with a title, status, and associated tasks/metadata.
- **Demo Seed**: A static collection of "Goal" entities used to initialize the demo experience.
- **Local Persistence Layer**: A wrapper around `localStorage` that manages the storage, retrieval, and resetting of demo data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can perform 100% of the core "Goal" CRUD operations in demo mode without any server-side database connectivity.
- **SC-002**: Data persists across 100% of browser refreshes and tab re-opens within the same session.
- **SC-003**: Zero modifications are required to the visual React components to support the switch between real and mock data layers.
- **SC-004**: The "Reset Demo Data" operation completes in under 1 second.
- **SC-005**: The "Demo Mode" banner is visible on every page within the application when the mode is active.

## Assumptions

- **Local Storage Capacity**: It is assumed that the demo data will not exceed the standard 5MB `localStorage` limit.
- **Entity Scope**: The demo mode primarily focuses on the "Goals" entities, which are the main focus of the current application version.
- **No Multi-user Demo**: Demo mode is session-based and local to the browser; it does not support sharing demo state between different users or devices.
- **Environment Variable**: `NEXT_PUBLIC_DEMO_MODE` is the agreed-upon mechanism for toggling this behavior at build/runtime.
