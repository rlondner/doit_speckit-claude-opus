# Feature Specification: UI Enhancement with Orange Design System

**Feature Branch**: `002-ui-enhancement`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "ui-enhancement - enhance the look and feel of the UI by using Google Stitch DESIGN.md and mockups available in the ./design/orange folder"

## Clarifications

### Session 2026-03-25

- Q: The mockup shows UI elements not in the current app (Recently Completed sidebar, Pro Tip card, header icons, progress bars). How should these be handled? → A: The "Recently Completed" sidebar maps to the existing Completed Goals column and must use real dynamic data. All other new UI elements (Pro Tip card, notification/settings/profile icons, progress bars on goal cards) should be built as visual components with placeholder/local data — no new backend work required.
- Q: Should the Focus Area chip selection in the Add New Goal modal be persisted to the goal record? → A: Yes, save the selection. A minor schema/API addition to store the focus area value alongside the goal.
- Q: Should the code.html reference files in design/orange be explicitly referenced in the spec? → A: Yes. Each code.html file serves as the canonical HTML/CSS implementation blueprint for its corresponding UI component. Tasks MUST read and use these files to extract exact color tokens, Tailwind config, class names, layout structure, and component markup.

## Design Reference Files

The following files in the `./design/orange/` folder serve as the **canonical implementation blueprints**. Each `code.html` contains the exact Tailwind CSS configuration, color tokens, class names, layout structure, and component markup that tasks MUST read and use during implementation.

| Reference File | Purpose | Used By |
|----------------|---------|---------|
| `design/orange/do_it_dashboard/code.html` | Dashboard layout: header, greeting, active goal cards, Recently Completed sidebar, Pro Tip card, Add New Goal button. Contains the full Tailwind config with orange color tokens. | US-1 (P1), FR-001, FR-003, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010 |
| `design/orange/add_new_goal_modal_orange/code.html` | Add New Goal modal: gradient header, form inputs, focus area chips, action buttons, glassmorphism backdrop. Contains the orange-warm Tailwind config variant. | US-2 (P2), FR-004, FR-008 |
| `design/orange/do_it_pastel/DESIGN.md` | Design system strategy document: color theory, typography rules, elevation principles, component signature styles, do's and don'ts. Provides the rationale and rules behind the visual decisions. | US-3 (P3), FR-002, FR-005, FR-008, all components |
| `design/orange/do_it_dashboard/screen.png` | Visual mockup of the complete dashboard for side-by-side comparison during validation. | SC-001 |
| `design/orange/add_new_goal_modal_orange/screen.png` | Visual mockup of the Add New Goal modal for side-by-side comparison during validation. | SC-001, SC-003 |

**Implementation directive**: When implementing any UI component, the corresponding `code.html` file MUST be read first. Extract the Tailwind color token definitions, CSS custom properties, class compositions, and HTML structure as the starting point. Adapt the static HTML to React/Next.js components while preserving the exact visual output.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refreshed Dashboard Experience (Priority: P1)

As a user, I want to see a visually polished dashboard that follows the "Radiant Catalyst" orange design system so that the goal-tracking experience feels modern, warm, and motivating rather than generic.

**Why this priority**: The dashboard is the primary screen users interact with every session. Updating its visual language to the orange design system establishes the new brand identity and delivers the most visible impact.

**Independent Test**: Can be fully tested by opening the dashboard and verifying that the layout, colors, typography, and component styling match `design/orange/do_it_dashboard/code.html` and `screen.png`. Delivers a cohesive, premium visual experience on the main screen.

**Acceptance Scenarios**:

1. **Given** a user navigates to the dashboard, **When** the page loads, **Then** the header displays the "Do It" brand in the coral-orange accent color with navigation links styled per the design mockup
2. **Given** a user views the dashboard, **When** they see the greeting section, **Then** it uses Plus Jakarta Sans for headlines and Inter for body text, with the warm orange background palette
3. **Given** a user views active goals, **When** goals are displayed, **Then** each goal card uses rounded corners, the orange design color tokens, hover interactions (translate-x shift), and urgency badges with appropriate color coding
4. **Given** a user views the dashboard, **When** they look at the "Add New Goal" button, **Then** it appears as a pill-shaped button with the coral-orange gradient, white text, and a tinted shadow
5. **Given** a user views the sidebar, **When** the "Recently Completed" section is visible, **Then** completed goals show with coral-orange check icons, strikethrough text, and the sidebar uses the light grey-blue background with a rounded container

---

### User Story 2 - Redesigned Add New Goal Modal (Priority: P2)

As a user, I want the "Add New Goal" modal to feature a vibrant orange gradient header, refined input fields, and focus area chips so that creating a new goal feels inspiring and visually distinct from the standard form experience.

**Why this priority**: Goal creation is the core action in the app. A polished modal with the orange gradient header ("Ignite a New Path"), improved input styling, and focus area selection elevates the experience for the most frequent user action.

**Independent Test**: Can be fully tested by clicking "Add New Goal" and verifying the modal matches `design/orange/add_new_goal_modal_orange/code.html` and `screen.png` -- gradient header, styled inputs, focus area chips, and pill-shaped CTA button.

**Acceptance Scenarios**:

1. **Given** a user clicks "Add New Goal", **When** the modal opens, **Then** it displays a warm orange gradient header with the title "Ignite a New Path" and a descriptive subtitle in white text
2. **Given** the modal is open, **When** the user views the form fields, **Then** the "Goal Title" input uses a borderless style with a warm surface background, rounded corners, and transitions to a focused state with a primary color ring
3. **Given** the modal is open, **When** the user views the form, **Then** "End Date" and "Focus Area" fields are displayed in a two-column layout, with Focus Area offering pill-shaped selectable chips (e.g., "Professional", "Personal")
4. **Given** the modal is open, **When** the user looks at the action buttons, **Then** "Cancel" is a ghost-style text button and "Create Goal" is a pill-shaped button with the orange gradient and tinted shadow
5. **Given** the modal is open, **When** a backdrop blur overlay is visible behind the modal, **Then** the background is dimmed with a glassmorphism effect (blurred, semi-transparent overlay)

---

### User Story 3 - Consistent Typography and Color Token System (Priority: P3)

As a user, I want all text and UI elements to use a consistent, warm color palette and editorial typography so that the entire application feels cohesive and professionally designed.

**Why this priority**: Consistent design tokens across all screens prevent visual fragmentation. This ensures the new orange design language applies uniformly, not just to individual components.

**Independent Test**: Can be fully tested by navigating through all pages and verifying that typography, color tokens, and spacing follow `design/orange/do_it_pastel/DESIGN.md` guidelines and are consistent with the token definitions in both `code.html` files.

**Acceptance Scenarios**:

1. **Given** any page in the application, **When** rendered, **Then** all headline text uses Plus Jakarta Sans with tight tracking and all body/label text uses Inter with generous line-height
2. **Given** any page in the application, **When** rendered, **Then** text colors use warm dark tones for primary text and muted variants for secondary text -- never pure black
3. **Given** any interactive element, **When** rendered, **Then** pill-shaped (fully rounded) styling is used for all buttons and chips, following the "Pill Standard" from the design system
4. **Given** any card or container, **When** rendered, **Then** boundaries are defined through background color shifts (surface hierarchy) rather than visible borders, following the "No-Line Rule"

---

### Edge Cases

- What happens when the user has no active goals? The dashboard should still render the greeting, empty state messaging, and the "Add New Goal" button in the new design language
- How does the UI appear on mobile viewports? The two-column dashboard layout should collapse to a single column, and the modal should adapt to smaller screens while maintaining the orange design aesthetic
- What happens with very long goal titles? Text should truncate with ellipsis rather than breaking the card layout
- How do urgency states (overdue, due soon, normal) visually differ? Each state should use distinct color treatments from the design token palette while remaining accessible

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST apply the warm orange/coral color palette across all dashboard components, replacing the current pastel color scheme. Color tokens MUST be extracted from the Tailwind config in `design/orange/do_it_dashboard/code.html`
- **FR-002**: System MUST use Plus Jakarta Sans as the headline/display font and Inter as the body/label font throughout the application, following the typography rules in `design/orange/do_it_pastel/DESIGN.md` (Section 3)
- **FR-003**: System MUST render all primary action buttons as pill-shaped elements with the coral-orange gradient and tinted shadows, matching the `.bg-radiant-primary` class and button markup in `design/orange/do_it_dashboard/code.html`
- **FR-004**: System MUST display the "Add New Goal" modal matching the structure and styling in `design/orange/add_new_goal_modal_orange/code.html` — including the orange gradient header, glassmorphism backdrop, borderless input fields, focus area chip selectors, and pill-shaped action buttons. The selected focus area value MUST be persisted to the goal record
- **FR-005**: System MUST implement surface hierarchy using background color shifts instead of visible borders for section boundaries, per the "No-Line Rule" in `design/orange/do_it_pastel/DESIGN.md` (Section 2)
- **FR-006**: System MUST display goal cards with rounded corners, hover translate interactions, and urgency-based color coding, matching the goal card markup in `design/orange/do_it_dashboard/code.html`
- **FR-007**: System MUST restyle the existing Completed Goals column as the "Recently Completed" sidebar with coral-orange check icons, a light grey-blue background container, and dynamic data from the existing backend, matching the aside markup in `design/orange/do_it_dashboard/code.html`. A "Pro Tip" card with decorative icon should be added as a static visual element
- **FR-008**: System MUST apply tinted ambient shadows using primary color tint instead of standard black drop shadows on floating elements, per the elevation rules in `design/orange/do_it_pastel/DESIGN.md` (Section 4)
- **FR-009**: System MUST maintain a sticky header with the "Do It" brand in coral-orange, navigation links with active indicator, and notification/settings/profile icons, matching the header markup in `design/orange/do_it_dashboard/code.html`
- **FR-010**: System MUST ensure responsive layout where the dashboard collapses from a multi-column grid to a single column on mobile viewports, following the grid structure in `design/orange/do_it_dashboard/code.html`

### Key Entities

- **Design Token Set**: The complete color, typography, spacing, and elevation token system extracted from the Tailwind configs in `design/orange/do_it_dashboard/code.html` and `design/orange/add_new_goal_modal_orange/code.html`, with design rationale from `design/orange/do_it_pastel/DESIGN.md`
- **Goal Card**: The visual representation of an active goal, incorporating urgency states, progress indicators, and interactive behaviors styled per the new design system
- **Goal Creation Modal**: The overlay dialog for creating new goals, featuring a gradient header, structured form inputs, focus area chips, and glassmorphism effects

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All dashboard components visually match the design mockups in the ./design/orange folder when compared side-by-side at desktop viewport widths
- **SC-002**: Users can identify the brand and navigate the dashboard within 3 seconds of page load, with the new design not introducing any layout shift or rendering delay
- **SC-003**: The "Add New Goal" modal opens with the gradient header, styled inputs, and focus area chips, and users can complete goal creation without any confusion caused by the redesign
- **SC-004**: No pure black text or standard visible borders appear anywhere in the rendered UI, validating adherence to the "No-Line Rule" and soft contrast guidelines
- **SC-005**: All interactive elements (buttons, chips, checkboxes) use pill-shaped or rounded styling with smooth hover/active transitions, providing tactile feedback to users
- **SC-006**: The application renders correctly and maintains usability on viewports from 320px to 1920px wide

## Assumptions

- The existing application structure (pages, components, API routes) will be preserved; only the visual layer is being updated
- The Google Fonts (Plus Jakarta Sans, Inter) and Material Symbols icon font are acceptable external dependencies
- The orange design system from ./design/orange is the authoritative visual reference, taking precedence over the existing pastel color scheme and the green design variant. The `code.html` files are the primary implementation blueprints; the `screen.png` files are for visual validation
- The "Focus Area" chip selector in the modal persists the selected value (e.g., "Professional", "Personal") to the goal record, requiring a minor schema and API update
- Accessibility requirements (contrast ratios, focus indicators) must still be met with the new color palette
- The "Recently Completed" sidebar is a restyled version of the existing Completed Goals column and uses real dynamic data. Other new mockup elements (Pro Tip card, notification/settings/profile icons in header, progress bars on goal cards) are built as visual placeholders with local/static data — no new backend endpoints required
