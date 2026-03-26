# Feature Specification: Edit Goal and Uncheck Completed

**Feature Branch**: `003-edit-goal-uncheck`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "Edit existing goal and uncheck completed goal - add a new modal form to edit an existing goal from the list of Active Goals only. Use all the design instructions, static HTML code and screenshot in the ./specs/design/orange/edit_existing_goal folder. Add an edit button for each active goal in the main view. Make the checked button of the Completed Goals column clickable so a user can uncheck a goal and put it back in the Active Goals column (in case he made a mistake while completing a goal)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit an Active Goal (Priority: P1)

A user sees an edit button on each active goal card in the main dashboard view. Clicking it opens a modal form pre-populated with the goal's current data (title, end date, focus area). The user modifies any field and saves changes, which updates the goal and returns them to the dashboard with the updated information visible.

**Why this priority**: Editing goals is the core functionality requested. Users need to correct mistakes, adjust deadlines, or change focus areas on their active goals without deleting and recreating them.

**Independent Test**: Can be fully tested by clicking the edit button on any active goal, modifying the title or end date, saving, and verifying the updated data appears on the dashboard.

**Acceptance Scenarios**:

1. **Given** a user is on the dashboard with active goals displayed, **When** they click the edit button on an active goal, **Then** a modal opens with the goal's current title, end date, and focus area pre-filled.
2. **Given** the edit modal is open with pre-filled data, **When** the user changes the goal title and clicks "Save Changes", **Then** the modal closes and the dashboard shows the updated title.
3. **Given** the edit modal is open, **When** the user changes the end date to a future date and saves, **Then** the goal's urgency badge updates accordingly on the dashboard.
4. **Given** the edit modal is open, **When** the user changes the focus area chip selection and saves, **Then** the updated focus area is reflected on the goal card.
5. **Given** the edit modal is open, **When** the user clicks "Cancel" or the close (X) button, **Then** the modal closes without saving any changes.

---

### User Story 2 - Uncheck a Completed Goal (Priority: P1)

A user notices they accidentally marked a goal as completed. In the Completed Goals sidebar, they click the checked checkbox on that goal. The goal moves back to the Active Goals column with its original data restored and the completion timestamp removed.

**Why this priority**: Equally critical as editing — users make mistakes when checking off goals and need a quick, intuitive way to reverse that action. Without this, users would have to delete and recreate the goal.

**Independent Test**: Can be fully tested by completing a goal, then clicking its checkbox in the Completed Goals sidebar, and verifying it reappears in the Active Goals list.

**Acceptance Scenarios**:

1. **Given** a user has completed goals in the Completed Goals sidebar, **When** they click the checked checkbox on a completed goal, **Then** the goal moves back to the Active Goals column.
2. **Given** a completed goal is unchecked, **When** it reappears in Active Goals, **Then** the completion timestamp is removed and the goal retains its original title, end date, and focus area.
3. **Given** a completed goal is unchecked, **When** it returns to Active Goals, **Then** the urgency badge recalculates based on the goal's end date relative to today.

---

### User Story 3 - Delete a Goal from the Edit Modal (Priority: P2)

While editing an active goal, the user decides the goal is no longer relevant. They click the "Delete Goal" button in the edit modal footer. A confirmation step ensures they don't delete by accident, and upon confirmation the goal is permanently removed.

**Why this priority**: The design includes a delete action in the edit modal. This is secondary to editing and unchecking but provides a convenient shortcut to remove a goal without returning to the dashboard first.

**Independent Test**: Can be tested by opening the edit modal, clicking "Delete Goal", confirming deletion, and verifying the goal no longer appears on the dashboard.

**Acceptance Scenarios**:

1. **Given** the edit modal is open for an active goal, **When** the user clicks "Delete Goal", **Then** a confirmation step is presented before the goal is deleted.
2. **Given** the user confirms deletion from the edit modal, **When** the deletion completes, **Then** the modal closes and the goal is removed from the Active Goals list.
3. **Given** the user clicks "Delete Goal" then cancels the confirmation, **When** the confirmation is dismissed, **Then** the edit modal remains open with no changes.

---

### Edge Cases

- What happens when the user submits the edit form with an empty title? The system shows a validation error and prevents saving.
- What happens when the user sets the end date to a past date? The system allows it (the goal becomes overdue), since the user may be tracking a goal that is already past due.
- What happens when a user unchecks a completed goal that has an end date in the past? The goal returns to Active Goals as overdue, displaying the appropriate urgency indicator.
- What happens if the edit modal is open and the user navigates away or refreshes? Unsaved changes are lost, consistent with standard modal behavior.
- What happens when the user tries to save without making any changes? The system saves without error (no-op update) and closes the modal.
- What happens when an API call fails during edit save, delete, or uncheck? The system displays a brief inline error message (toast/banner) and keeps the modal open so the user can retry. For uncheck failures, an inline error is shown near the completed goal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an icon-only edit button (pencil/edit icon, colored `primary-fixed-dim` #f3683b) on each active goal card in the main dashboard view.
- **FR-002**: System MUST NOT display an edit button on completed goal cards.
- **FR-003**: System MUST open an edit modal when the user clicks an active goal's edit button.
- **FR-004**: The edit modal MUST pre-populate with the selected goal's current title, end date, and focus area.
- **FR-005**: System MUST allow users to modify the goal title, end date, and focus area in the edit modal.
- **FR-006**: System MUST validate that the goal title is not empty and does not exceed 255 characters before saving.
- **FR-007**: System MUST persist edited goal data upon clicking "Save Changes" and close the modal.
- **FR-008**: System MUST discard changes and close the modal when the user clicks "Cancel" or the close (X) button.
- **FR-009**: System MUST provide a "Delete Goal" action within the edit modal with a `window.confirm()` confirmation dialog before deletion, matching the existing delete pattern.
- **FR-010**: The edit modal MUST follow the design specified in the `design/orange/edit_existing_goal` reference files (gradient header reading "Refine Your Ambition", input styling, button placement, and overall layout).
- **FR-011**: The checked checkbox on each completed goal in the Completed Goals sidebar MUST be clickable.
- **FR-012**: Clicking a completed goal's checkbox MUST change the goal's status from completed to active and move it to the Active Goals column.
- **FR-013**: When a completed goal is unchecked, the system MUST remove the completion timestamp and recalculate the urgency based on the goal's end date.
- **FR-014**: The dashboard MUST immediately reflect changes after editing, deleting, or unchecking a goal without requiring a page refresh.

### Key Entities

- **Goal**: Existing entity extended with edit capability. Key attributes: id, title, endDate, status (active/completed), focusArea (Professional/Personal), createdAt, completedAt.
- **Edit Modal State**: Tracks which goal is being edited, holds form field values during editing, manages open/closed state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can edit any active goal's title, end date, or focus area and see the updated information on the dashboard within 2 seconds of saving.
- **SC-002**: Users can uncheck a completed goal and see it reappear in the Active Goals column within 2 seconds.
- **SC-003**: The edit modal visually matches the provided design reference (gradient header, input styling, layout, button placement) as validated by visual comparison.
- **SC-004**: 100% of active goal cards display an accessible edit button; 0% of completed goal cards display one.
- **SC-005**: Users can complete the full edit-and-save flow in under 30 seconds.

## Clarifications

### Session 2026-03-26

- Q: What type of delete confirmation should the edit modal use? → A: Browser `window.confirm()` dialog, matching the existing delete pattern on goal cards.
- Q: How should the UI handle API errors during edit save, delete, or uncheck? → A: Show a brief inline error message (toast/banner) and keep the modal open so the user can retry.
- Q: What style should the edit button on active goal cards use? → A: Icon-only button (pencil/edit icon) using the design system's `primary-fixed-dim` (#f3683b) color.

## Assumptions

- The existing goal data model already supports all fields shown in the edit modal (title, endDate, focusArea), so no data model changes are needed.
- The existing PATCH API endpoint for goals can be extended to support updating title, endDate, and focusArea (currently it only toggles status).
- The "uncheck completed goal" feature reuses the existing status-toggle mechanism already wired to the checkbox, just making it available in the Completed Goals sidebar.
- Focus area options are limited to "Professional" and "Personal" as shown in the design, matching the existing add goal modal.
- The edit modal is only accessible for active goals; completed goals cannot be edited directly (they must first be unchecked).
- The delete confirmation in the edit modal follows the same pattern as the existing delete confirmation on goal cards.
