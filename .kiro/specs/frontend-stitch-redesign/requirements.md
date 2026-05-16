# Requirements Document

## Introduction

This document defines the requirements for rebuilding the MemoryLens frontend to match the Stitch-generated "Digital Sanctuary" design system. The redesign covers all 6 screens: Lens View, Assistant Help, Caregiver Dashboard, Caregiver Login, Privacy Comparison, and Privacy Portal. The implementation must faithfully translate the Stitch HTML designs into React/TypeScript components using Tailwind CSS v4, preserving all existing functionality while adopting the new visual language.

**Feature:** MemoryLens Frontend Redesign (Stitch Design System)  
**Spec Location:** `.kiro/specs/frontend-stitch-redesign/`  
**Design Reference:** `stitch_memorylens_ai_assistant/memorylens/DESIGN.md`

---

## Glossary

| Term | Definition |
|---|---|
| **Digital Sanctuary** | The design philosophy behind MemoryLens — a warm, non-clinical UI that reduces cognitive load and anxiety for dementia patients |
| **Stitch** | The AI design tool used to generate the HTML/CSS design prototypes for all 6 screens |
| **Midnight Purple** | The color `#831ada` reserved exclusively for privacy, blockchain, and zero-knowledge proof features |
| **Deep Olive** | The primary brand color `#42432a` used for main actions, headings, and grounding elements |
| **ZK Proof** | Zero-Knowledge Proof — a cryptographic method used by Midnight blockchain to verify data without revealing it |
| **Midnight Glow** | A CSS box-shadow effect (`0 0 20px 2px rgba(131, 26, 218, 0.15)`) applied to privacy-encrypted UI elements |
| **Privacy Glow** | Midnight glow combined with a `border-top: 4px solid #831ada` — used on AI response bubbles |
| **Surface Container** | A tiered system of background colors (`lowest` → `highest`) used to create visual depth without shadows |
| **Touch Target** | The minimum interactive area of 48×48px required for all buttons and controls |
| **Selective Disclosure** | A Midnight blockchain feature allowing patients to control which data types each caregiver can access |
| **Audit Trail** | An immutable on-chain log of all data access events, displayed as a vertical timeline |
| **Storage Toggle** | A pill-shaped UI control for switching between Supabase (fast) and Midnight (private) storage modes |
| **Face Recognition Card** | The floating card that slides up from the bottom of the Lens View when a person is identified |
| **Atkinson Hyperlegible Next** | An accessibility-focused font used for all body text, designed for users with low vision |
| **Manrope** | A modern geometric font used for all headings and display text |
| **FAB** | Floating Action Button — the circular mic button on the Lens View screen |

---

## Overview

Rebuild the MemoryLens frontend to match the Stitch-generated design system. The redesign covers all 6 screens: Lens View, Assistant Help, Caregiver Dashboard, Caregiver Login, Privacy Comparison, and Privacy Portal. The implementation must faithfully translate the Stitch HTML designs into React/TypeScript components using Tailwind CSS v4.

---

## Background

The current frontend uses a generic theme with placeholder components. The Stitch designs provide a complete, production-ready design system called "Digital Sanctuary" — a warm, accessible, non-clinical UI engineered for dementia patients and their caregivers. The redesign must preserve all existing functionality while adopting the new visual language.

---

## Design System Reference

All design decisions must follow the Stitch design system located at:
`stitch_memorylens_ai_assistant/memorylens/DESIGN.md`

Screen-specific HTML references:
- `stitch_memorylens_ai_assistant/lens_view/code.html`
- `stitch_memorylens_ai_assistant/assistant_help/code.html`
- `stitch_memorylens_ai_assistant/caregiver_dashboard/code.html`
- `stitch_memorylens_ai_assistant/caregiver_login/code.html`
- `stitch_memorylens_ai_assistant/privacy_comparison/code.html`
- `stitch_memorylens_ai_assistant/privacy_portal/code.html`

---

## Requirements

### REQ-001: Design Token System

**Priority:** Critical

The Tailwind CSS v4 theme in `frontend/src/index.css` must be replaced with the full Stitch color palette and typography system.

**Acceptance Criteria:**
- [ ] All Stitch color tokens registered in `@theme inline` block
- [ ] `background: #fcf9f4` set as global page background
- [ ] `surface-container-lowest: #ffffff` used for card surfaces
- [ ] `primary: #42432a` (deep olive) used for main actions and headings
- [ ] `secondary: #831ada` (midnight purple) used exclusively for privacy/blockchain features
- [ ] `on-surface: #1c1c19` used for body text
- [ ] `on-surface-variant: #48473e` used for secondary/muted text
- [ ] `outline-variant: #c9c7ba` used for borders
- [ ] `error: #ba1a1a` used for destructive actions
- [ ] `inverse-surface: #31302d` used for dark action cards
- [ ] All surface container tiers registered (`surface-container-lowest` through `surface-container-highest`)
- [ ] `color-scheme: light` set on body to prevent OS dark mode override

---

### REQ-002: Typography System

**Priority:** Critical

**Acceptance Criteria:**
- [ ] Google Fonts loaded: `Manrope` (600, 700, 800) and `Atkinson Hyperlegible Next` (400, 600)
- [ ] `Manrope` applied to all headings (`display-lg`, `headline-lg`, `headline-md`, `headline-lg-mobile`)
- [ ] `Atkinson Hyperlegible Next` applied to all body text (`body-lg`, `body-md`, `body-lg-mobile`, `label-lg`)
- [ ] Minimum body font size is 18px — no text below this threshold
- [ ] Typography scale registered as Tailwind custom font sizes:
  - `display-lg`: 48px / 56px line-height / 800 weight
  - `headline-lg`: 32px / 40px / 700
  - `headline-md`: 24px / 32px / 600
  - `headline-lg-mobile`: 28px / 36px / 700
  - `body-lg`: 20px / 30px / 400
  - `body-md`: 18px / 28px / 400
  - `body-lg-mobile`: 18px / 28px / 400
  - `label-lg`: 18px / 24px / 600 / letter-spacing 0.01em

---

### REQ-003: Spacing & Layout Tokens

**Priority:** High

**Acceptance Criteria:**
- [ ] Custom spacing tokens registered in Tailwind:
  - `unit`: 8px
  - `container-margin`: 24px
  - `gutter`: 16px
  - `touch-target-min`: 48px
  - `stack-gap`: 24px
- [ ] All interactive elements have minimum 48×48px hit area
- [ ] Page max-width: 1280px (`max-w-7xl`) centered
- [ ] Mobile outer margins: 24px (`px-container-margin`)

---

### REQ-004: Border Radius Tokens

**Priority:** High

**Acceptance Criteria:**
- [ ] Custom border radius tokens registered:
  - `DEFAULT`: 4px (inputs, small elements)
  - `lg`: 8px
  - `xl`: 12px (cards, containers)
  - `2xl`: 16px (prominent cards, bottom sheets)
  - `full`: 9999px (pills, FABs)
- [ ] No sharp corners anywhere in the UI

---

### REQ-005: Global CSS Utilities

**Priority:** High

Custom CSS classes needed across multiple screens:

**Acceptance Criteria:**
- [ ] `.midnight-glow` — `box-shadow: 0 0 20px 2px rgba(131, 26, 218, 0.15)` applied to privacy-encrypted cards
- [ ] `.privacy-glow` — midnight glow + `border-top: 4px solid #831ada` for AI response bubbles
- [ ] `.shadow-tactile` — `box-shadow: 0 20px 40px -10px rgba(66, 67, 42, 0.12)` for login card
- [ ] `.shadow-soft` — `box-shadow: 0 10px 40px -10px rgba(66, 67, 42, 0.15)` for dashboard cards
- [ ] `.gradient-midnight` — `background: linear-gradient(135deg, #2c0051 0%, #831ada 100%)` for privacy portal header
- [ ] `.chat-bubble-shadow` — `box-shadow: 0 10px 20px rgba(66, 67, 42, 0.05)` for chat messages
- [ ] Material Symbols Outlined font loaded and configured with `font-variation-settings: 'FILL' 0, 'wght' 400`

---

### REQ-006: Bottom Navigation Bar

**Priority:** Critical

Shared across all patient-facing screens (Lens, Help, Compare). Hidden on dashboard routes.

**Acceptance Criteria:**
- [ ] Fixed to bottom of screen, full width
- [ ] Background: `bg-surface-container/90 backdrop-blur-xl`
- [ ] Top-rounded corners: `rounded-t-xl`
- [ ] Soft top shadow: `shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`
- [ ] 4 nav items: Lens (`camera_front`), Help (`contact_support`), Compare (`compare_arrows`), Caregiver (`face`)
- [ ] Active item: `bg-secondary-container text-on-secondary-container rounded-xl px-4 py-2`
- [ ] Inactive items: `text-on-surface-variant` with hover `bg-surface-container-highest`
- [ ] All items use `font-label-lg text-label-lg` typography
- [ ] Active icon uses `font-variation-settings: 'FILL' 1` (filled style)
- [ ] Minimum tap target: 48px height per item

---

### REQ-007: Top App Bar

**Priority:** High

Shared header component used across all screens.

**Acceptance Criteria:**
- [ ] Sticky positioned, `z-50`
- [ ] Background: `bg-surface` with `shadow-sm`
- [ ] Height: `h-touch-target-min` (48px)
- [ ] Left: `visibility` icon + "MemoryLens" text in `text-primary font-headline-md`
- [ ] Right: `shield` icon button for privacy shortcut
- [ ] Max width: `max-w-7xl mx-auto px-container-margin`

---

### REQ-008: Lens View (CameraView.tsx)

**Priority:** Critical

The primary patient-facing screen with full-screen camera feed.

**Acceptance Criteria:**
- [ ] Full-screen camera feed as fixed background (`fixed inset-0 z-0`)
- [ ] Subtle AR overlay tint: `bg-primary/5 mix-blend-multiply`
- [ ] Top app bar: frosted glass `bg-surface/80 backdrop-blur-md`
- [ ] Status indicator pill (camera, mic, location icons) in `bg-surface-container-highest rounded-full`
- [ ] Location icon uses `text-secondary` (purple) to indicate privacy-active
- [ ] Notification toast:
  - Positioned `fixed top-20` centered
  - White card with `border-t-4 border-secondary`
  - Purple icon in `bg-secondary/10 rounded-lg`
  - Dismissible with close button
- [ ] Face recognition card:
  - Slides up from bottom, above nav bar
  - `bg-surface/95 backdrop-blur-lg rounded-2xl`
  - Person avatar with olive border + person badge
  - Name in `font-headline-md`, relationship in `font-body-md italic`
  - Last conversation in `bg-surface-container rounded-xl` info box
  - Two action buttons: "Call [Name]" (primary filled) + "See Photos" (outline)
- [ ] Purple FAB mic button: `fixed bottom-28 right-container-margin`, `bg-secondary`, `w-16 h-16 rounded-full`

---

### REQ-009: Assistant Help Screen (AssistantMode.tsx)

**Priority:** High

Voice-first AI assistant interface for patients.

**Acceptance Criteria:**
- [ ] Scrollable chat history with `gap-stack-gap` between messages
- [ ] User messages:
  - Right-aligned, `max-w-[85%]`
  - `bg-primary-container text-on-primary`
  - `rounded-2xl rounded-tr-none` (speech bubble shape)
  - `.chat-bubble-shadow`
  - Timestamp below in `text-on-surface-variant font-label-lg text-sm`
- [ ] AI response messages:
  - Left-aligned
  - `bg-surface-container-lowest`
  - `rounded-2xl rounded-tl-none`
  - `.privacy-glow` (purple top border + glow)
  - "PRIVATE MEMORY RETRIEVAL" label with filled lock icon in `text-secondary`
  - Location thumbnail image with detected location label
  - "Assistant • Active Now" label below
- [ ] Suggestion chips section:
  - Label: "Common Questions" in `text-on-surface-variant font-label-lg`
  - Chips: `bg-surface-container-low border-2 border-outline-variant rounded-full px-5 py-3`
  - Hover: `bg-surface-container-high`
- [ ] Fixed voice input bar above bottom nav:
  - Input area: `bg-surface-container-highest rounded-full h-14` with placeholder text
  - Mic button: `w-16 h-16 bg-primary rounded-full`
  - Positioned `fixed bottom-[88px]`

---

### REQ-010: Caregiver Login (Login.tsx)

**Priority:** High

Authentication screen for caregivers.

**Acceptance Criteria:**
- [ ] Full-screen centered layout with decorative gradient blobs in background
- [ ] Gradient blobs: `bg-primary-fixed-dim` (top-right) and `bg-secondary-fixed-dim` (bottom-left), `blur-[100px] opacity-40`
- [ ] Login card: `max-w-md`, `bg-surface-container-lowest`, `rounded-xl p-10`, `.shadow-tactile`
- [ ] Logo area: `w-16 h-16 bg-primary-container/20 rounded-full` with `visibility` icon
- [ ] Subtitle: "Welcome to your digital sanctuary" in `text-on-surface-variant`
- [ ] Email field: always-visible label, `h-touch-target-min`, `bg-surface-container-low`, `border-2 border-outline-variant`, focus → `border-primary`
- [ ] Password field: same styling + show/hide toggle button
- [ ] "Forgot?" link in `text-secondary`
- [ ] Primary CTA: `w-full h-14 bg-primary text-on-primary rounded-xl` — "Sign in as Caregiver"
- [ ] Divider: `bg-outline-variant` lines with "Secure Login" text
- [ ] Secondary CTA: outline style — "Request Access"
- [ ] Privacy note at bottom: `bg-secondary/5 border border-secondary/10 rounded-lg` with lock icon

---

### REQ-011: Caregiver Dashboard (CaregiverDashboard.tsx)

**Priority:** Critical

Main management interface for caregivers.

**Acceptance Criteria:**
- [ ] Storage toggle at top of content area:
  - Container: `bg-surface-container-low rounded-xl`
  - Toggle pill: `bg-surface-container-high rounded-full p-1`
  - Inactive option: `text-on-surface-variant`
  - Active Midnight option: `bg-secondary text-on-secondary` with lock icon + `.midnight-glow`
- [ ] Desktop sidebar navigation (hidden on mobile, `lg:flex`):
  - Width: `w-80`, sticky `top-24`
  - Active item: `bg-primary-container text-on-primary-container rounded-lg`
  - Inactive items: `text-on-surface-variant` with hover `bg-surface-container-low`
  - Privacy item separated by `border-t border-outline-variant`
- [ ] People section:
  - Section heading with animated `security` icon in `text-secondary`
  - Count badge: `bg-surface-container rounded-full px-4 py-1`
  - Person cards: `bg-surface-container-lowest rounded-xl`, encrypted cards have `.midnight-glow` + `border-secondary/10`
  - Encrypted badge: `bg-secondary/10 text-secondary p-2 rounded-full` with `encrypted` icon (top-right)
  - Avatar: `w-24 h-24 rounded-full border-4 border-surface`
  - Relationship in `text-secondary` for primary caregiver, `text-on-surface-variant` for others
  - "Add New Trusted Person" card: dashed border, centered icon + label
- [ ] Objects section: white card, image thumbnails `w-16 h-16 rounded-lg`, chevron right
- [ ] Places section: image cards with gradient overlay, active place has green dot indicator
- [ ] Mobile FAB: `bg-primary rounded-full w-14 h-14`, hidden on desktop

---

### REQ-012: Privacy Comparison (ComparisonDemo.tsx)

**Priority:** High

Educational screen comparing Supabase vs Midnight storage.

**Acceptance Criteria:**
- [ ] Page heading: `font-display-lg text-display-lg text-primary` (48px Manrope 800)
- [ ] Subtitle: `font-body-lg text-on-surface-variant max-w-2xl mx-auto` centered
- [ ] Two comparison cards in `lg:grid-cols-12` layout (5 + 2 + 5):
  - Supabase card: `border-t-4 border-outline-variant`, grey database icon
  - VS divider: olive circle `bg-primary text-on-primary w-14 h-14 rounded-full`
  - Midnight card: `border-t-4 border-secondary`, purple security icon, `shadow-[0_20px_40px_rgba(131,26,218,0.08)]`
  - Feature rows: `close` icon in `text-error` for negatives, `check` in `text-secondary` for Midnight positives
- [ ] Dark action card: `bg-inverse-surface text-white rounded-xl p-10`
  - Large decorative shield icon: `text-[120px] opacity-10` (background)
  - "Store Sample Memory" button: `bg-secondary h-[56px] px-8 rounded-xl`
  - ZK proof stepper:
    - Step 1 (done): `bg-secondary` filled circle with check
    - Step 2 (active): border circle with `animate-bounce` dot
    - Steps 3-4: `opacity-50` with numbered circles
    - Active step text: `font-bold`

---

### REQ-013: Privacy Portal (PrivacyDashboard.tsx)

**Priority:** High

Midnight blockchain privacy management screen.

**Acceptance Criteria:**
- [ ] Header section: `.gradient-midnight` (`linear-gradient(135deg, #2c0051, #831ada)`)
  - Shield icon + "Privacy Dashboard" heading in white
  - Wallet card: `bg-white/10 backdrop-blur-md border border-white/20 rounded-xl`
  - Wallet address in `font-mono text-white font-bold tracking-wider`
  - Green pulse dot for connected status
  - Stats: encrypted memories count + caregivers count
- [ ] Layout: `lg:grid-cols-12` (7 + 5)
- [ ] Selective disclosure section:
  - Each row: `bg-surface-container-low rounded-lg p-4`
  - Icon in `text-secondary`
  - Toggle: `w-14 h-8 rounded-full` — ON: `bg-secondary` with knob right, OFF: `bg-outline-variant` with knob left
  - Smooth transition on toggle
- [ ] Audit trail timeline:
  - Vertical line: `before:` pseudo-element, `bg-outline-variant`, 2px wide
  - Active node: `bg-secondary ring-4 ring-background` with icon
  - Inactive nodes: `bg-surface-container-highest` with icon
  - Node size: `w-6 h-6 rounded-full`
  - Timestamp: `text-xs text-outline`
- [ ] Authorized caregivers:
  - Cards: `bg-surface rounded-xl border border-outline-variant/20`
  - Avatar: `w-12 h-12 rounded-full`
  - Revoke button: `text-error hover:bg-error/10 rounded-lg`
  - Info note: `bg-secondary/5 border-secondary/20 border-dashed rounded-xl`
- [ ] Privacy tips card: `bg-primary p-6 rounded-xl text-white`
  - CTA button: `bg-white text-primary rounded-lg`

---

### REQ-014: Shared Component — Person Card

**Priority:** High

Reusable card used in both Lens View and Caregiver Dashboard.

**Acceptance Criteria:**
- [ ] Supports `encrypted` prop — shows `.midnight-glow` + encrypted badge when true
- [ ] Avatar: `rounded-full border-4 border-surface`
- [ ] Name: `font-headline-md text-on-surface`
- [ ] Relationship: `font-label-lg` — `text-secondary` if primary, `text-on-surface-variant` otherwise
- [ ] Last seen: history icon + text in `text-on-surface-variant font-body-md`

---

### REQ-015: Shared Component — Storage Toggle

**Priority:** High

Reusable toggle for switching between Supabase and Midnight storage.

**Acceptance Criteria:**
- [ ] Pill container: `bg-surface-container-high rounded-full p-1`
- [ ] Two options side by side
- [ ] Active Midnight: `bg-secondary text-on-secondary` + lock icon + `.midnight-glow`
- [ ] Active Supabase: `bg-surface-container-highest text-on-surface`
- [ ] Inactive: `text-on-surface-variant`
- [ ] Wired to `useMidnight` state in Zustand store
- [ ] Minimum height: 48px per option

---

### REQ-016: Accessibility Requirements

**Priority:** High

**Acceptance Criteria:**
- [ ] All interactive elements have minimum 48×48px touch target
- [ ] All images have descriptive `alt` text
- [ ] All form inputs have always-visible `<label>` elements (no placeholder-only labels)
- [ ] Color contrast meets WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- [ ] Focus states visible on all interactive elements
- [ ] `role="switch"` and `aria-checked` on all toggle components
- [ ] Screen reader labels on icon-only buttons (`aria-label`)
- [ ] No text below 18px

---

### REQ-017: Animation & Interaction

**Priority:** Medium

**Acceptance Criteria:**
- [ ] Button press: `active:scale-95 duration-150` on all buttons
- [ ] Nav item press: `active:scale-90 duration-150`
- [ ] Hover transitions: `transition-colors` on all interactive elements
- [ ] Notification toast: slide-in animation from top
- [ ] Face recognition card: slide-up from bottom
- [ ] ZK proof stepper: `animate-pulse` on active shield icon, `animate-bounce` on active step dot
- [ ] Encrypted badge: `animate-pulse` on security icon in dashboard heading
- [ ] No jarring or fast animations — all transitions ≤ 200ms

---

### REQ-018: Responsive Behavior

**Priority:** High

**Acceptance Criteria:**
- [ ] Mobile-first layout (single column by default)
- [ ] Dashboard sidebar: hidden on mobile (`hidden lg:flex`), visible on desktop
- [ ] Bottom nav: visible on mobile, hidden on desktop (`md:hidden`) for dashboard
- [ ] Desktop nav: floating pill nav bar for desktop on dashboard
- [ ] People grid: 1 col mobile → 2 col md → 3 col xl
- [ ] Comparison grid: 1 col mobile → 12-col grid on lg
- [ ] Privacy portal: 1 col mobile → 7+5 grid on lg
- [ ] All text scales appropriately (mobile variants use `headline-lg-mobile` and `body-lg-mobile`)

---

## Out of Scope

- Backend/blockchain integration (handled by Person 2 & 3)
- New AI/ML features
- Authentication logic changes
- Database schema changes
- PWA manifest or service worker changes

---

## File Map

| Requirement | File to Modify/Create |
|---|---|
| REQ-001 to REQ-005 | `frontend/src/index.css` |
| REQ-006 | `frontend/src/App.tsx` (BottomNav component) |
| REQ-007 | `frontend/src/components/TopAppBar.tsx` (new) |
| REQ-008 | `frontend/src/pages/CameraView.tsx` |
| REQ-009 | `frontend/src/pages/AssistantMode.tsx` |
| REQ-010 | `frontend/src/pages/Login.tsx` |
| REQ-011 | `frontend/src/pages/CaregiverDashboard.tsx` |
| REQ-012 | `frontend/src/pages/ComparisonDemo.tsx` |
| REQ-013 | `frontend/src/pages/PrivacyDashboard.tsx` |
| REQ-014 | `frontend/src/components/PersonCard.tsx` (new) |
| REQ-015 | `frontend/src/components/StorageToggle.tsx` (new) |
| REQ-016 to REQ-018 | All files above |
