# Feature Specification: Goal Tracker Initial Page Setup

**Feature Branch**: `001-initial-page-setup`
**Created**: 2026-03-24
**Status**: Draft
**Input**: User description: "initial page setup - This application should be a goal tracking web app called do it. There should be two columns. a left one where current goals are shown along with how many days left the user has to achieve the goal and a right one where completed goals are. Each goal can be checked using a checkbox and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal title and end date fields. Goals reaching their end date within 3 days are highlighted. Let's use a modern light theme with fun pastel colors"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Current and Completed Goals (Priority: P1)

A user opens the "do it" app and sees a two-column layout. The left column displays their active goals, each showing the goal title and how many days remain until the end date. The right column displays goals they have previously completed. This provides an immediate overview of progress at a glance.

**Why this priority**: The core value of the app is giving users visibility into their active and completed goals. Without this view, no other functionality is meaningful.

**Independent Test**: Can be fully tested by loading the page with pre-existing goal data and verifying that active goals appear on the left with days remaining and completed goals appear on the right.

**Acceptance Scenarios**:

1. **Given** the user has active goals, **When** they open the app, **Then** they see each active goal in the left column with its title and days remaining until the end date.
2. **Given** the user has completed goals, **When** they open the app, **Then** they see each completed goal listed in the right column.
3. **Given** the user has no goals, **When** they open the app, **Then** they see empty states in both columns with a prompt to add their first goal.
4. **Given** an active goal has an end date within 3 days, **When** the user views the left column, **Then** that goal is visually highlighted to indicate urgency.
5. **Given** an active goal's end date has already passed, **When** the user views the left column, **Then** that goal is visually highlighted as overdue.

---

### User Story 2 - Add a New Goal (Priority: P2)

A user wants to set a new goal. They click an "Add Goal" button which opens a modal form. The form contains fields for the goal title and end date. After submitting the form, the new goal appears in the active goals column.

**Why this priority**: Users need to be able to create goals to populate the tracker. This is the primary input mechanism for the app.

**Independent Test**: Can be fully tested by clicking the add button, filling in the form, submitting, and verifying the new goal appears in the active goals column.

**Acceptance Scenarios**:

1. **Given** the user is on the main page, **When** they click the "Add Goal" button, **Then** a modal form opens with title and end date fields.
2. **Given** the modal is open, **When** the user enters a valid title and end date and submits, **Then** the modal closes and the new goal appears in the active goals column.
3. **Given** the modal is open, **When** the user submits without filling required fields, **Then** validation messages appear and the form is not submitted.
4. **Given** the modal is open, **When** the user clicks outside the modal or presses a close button, **Then** the modal closes without creating a goal.
5. **Given** the modal is open, **When** the user selects an end date in the past, **Then** a validation error prevents submission.

---

### User Story 3 - Complete a Goal (Priority: P3)

A user has achieved one of their active goals and wants to mark it as complete. They check the checkbox next to the goal, and the goal moves from the active goals column to the completed goals column.

**Why this priority**: Moving goals from active to completed is the core interaction loop that gives users a sense of accomplishment and keeps the active list clean.

**Independent Test**: Can be fully tested by checking a goal's checkbox and verifying it disappears from the active column and appears in the completed column.

**Acceptance Scenarios**:

1. **Given** the user has an active goal, **When** they check the goal's checkbox, **Then** the goal moves from the active column to the completed column.
2. **Given** the user completes a goal, **When** the goal appears in the completed column, **Then** it displays with a visual indication that it is complete.

---

### User Story 4 - Delete a Goal (Priority: P4)

A user wants to permanently remove a goal they no longer want to track. They can delete a goal from either the active or completed column, and it is permanently removed.

**Why this priority**: Users need a way to clean up goals that are no longer relevant, preventing clutter in either column.

**Independent Test**: Can be fully tested by clicking a delete action on a goal and verifying it is removed from the display and no longer persisted.

**Acceptance Scenarios**:

1. **Given** the user has an active or completed goal, **When** they click the delete action, **Then** a confirmation prompt appears asking if they want to permanently delete the goal.
2. **Given** the confirmation prompt is shown, **When** the user confirms deletion, **Then** the goal is permanently removed from the app.
3. **Given** the confirmation prompt is shown, **When** the user cancels, **Then** the goal remains unchanged.

---

### Edge Cases

- What happens when a goal's end date is exactly today? It should show "0 days left" and be highlighted as urgent.
- What happens when a user has a very long goal title? The title should be truncated or wrapped gracefully without breaking the layout.
- What happens when there are many goals in either column? The columns should scroll independently to keep the layout usable.
- How does the app handle goals with end dates far in the future (e.g., years)? Days remaining should still display correctly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a two-column layout with active goals on the left and completed goals on the right.
- **FR-002**: Each active goal MUST display the goal title and the number of days remaining until its end date.
- **FR-003**: Active goals with end dates within 3 days (inclusive) MUST be visually highlighted to indicate urgency.
- **FR-004**: Active goals that are past their end date MUST be visually highlighted as overdue.
- **FR-005**: System MUST provide an "Add Goal" button that opens a modal form.
- **FR-006**: The new goal modal form MUST include a title field and an end date field, both required.
- **FR-007**: The modal form MUST validate that the title is not empty and the end date is not in the past before allowing submission.
- **FR-008**: Each active goal MUST have a checkbox that, when checked, moves the goal to the completed column.
- **FR-009**: Users MUST be able to permanently delete a goal from either column, with a confirmation step.
- **FR-010**: System MUST persist goals so they are available when the user returns to the app.
- **FR-011**: System MUST display empty state messaging when there are no active or completed goals.
- **FR-012**: The app MUST use a modern light theme with pastel colors throughout the interface.
- **FR-013**: The app MUST be titled "do it" with consistent branding on the page.

### Key Entities

- **Goal**: Represents a user's objective. Key attributes: title, end date, status (active or completed), creation date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new goal in under 30 seconds from clicking "Add Goal" to seeing it in the active column.
- **SC-002**: Users can identify which goals are urgent (within 3 days) at a glance without reading individual dates.
- **SC-003**: Users can mark a goal complete with a single interaction (checkbox click).
- **SC-004**: The two-column layout remains usable and readable with up to 50 goals across both columns.
- **SC-005**: Users can distinguish between active and completed goals immediately upon viewing the page.
- **SC-006**: 90% of first-time users can successfully add, complete, and delete a goal without guidance.

## Assumptions

- Users access the app through a modern web browser with a screen width of at least 768px (responsive/mobile layout is out of scope for this initial setup).
- Goal data is persisted using browser local storage for this initial version; server-side storage is out of scope.
- There is a single user per browser instance; multi-user or authentication features are not included.
- The "days remaining" calculation uses calendar days, not business days.
- The pastel color theme applies globally; users cannot customize the theme in this version.
- Completed goals remain visible in the completed column indefinitely; archiving or auto-cleanup is out of scope.
