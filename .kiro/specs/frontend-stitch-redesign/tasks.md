# Implementation Plan: MemoryLens Frontend Stitch Redesign

## Overview

Rebuild the MemoryLens frontend to match the Stitch "Digital Sanctuary" design system. Tasks follow the Phase 1→4 dependency order defined in the design document: foundation tokens first, then shared components, then pages, then integration wiring. All code is TypeScript + React 19 + Tailwind CSS v4.

---

## Tasks

- [x] 1. Phase 1 — Foundation (design tokens, fonts, icon wrapper, navigation shells)
  - [x] 1.1 Replace `frontend/src/index.css` with Stitch design tokens
    - Delete all existing Tailwind theme overrides
    - Add `@import` for Google Fonts: Manrope (600, 700, 800) and Atkinson Hyperlegible Next (400, 600)
    - Add `@import` for Material Symbols Outlined
    - Write the full `@theme inline` block with all color tokens, typography scale, spacing tokens, and border-radius tokens exactly as specified in the design document
    - Add global CSS utility classes: `.midnight-glow`, `.privacy-glow`, `.shadow-tactile`, `.shadow-soft`, `.gradient-midnight`, `.chat-bubble-shadow`, `.material-symbols-outlined`
    - Set `body` base styles: `background-color: #fcf9f4`, `color: #1c1c19`, `font-family: "Atkinson Hyperlegible Next"`, `color-scheme: light`
    - _Requirements: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005_

  - [ ]* 1.2 Write property test for design token completeness
    - **Property 1: Token completeness** — parse `index.css` and assert every Tailwind color token referenced in the Stitch HTML files resolves to a non-empty hex value in the `@theme inline` block
    - **Validates: REQ-001**

  - [x] 1.3 Add Google Fonts and Material Symbols `<link>` tags to `frontend/index.html`
    - Add `<link rel="preconnect">` for `fonts.googleapis.com` and `fonts.gstatic.com`
    - Add `<link>` for Manrope and Atkinson Hyperlegible Next
    - Add `<link>` for Material Symbols Outlined with variable font axes
    - _Requirements: REQ-002, REQ-005_

  - [x] 1.4 Create `frontend/src/components/ui/Icon.tsx` — Material Symbols wrapper
    - Define `IconProps` interface: `name: string`, `filled?: boolean`, `size?: number`, `className?: string`
    - Render a `<span className="material-symbols-outlined">` with `fontVariationSettings` driven by `filled` and `size` props
    - Export named `Icon` component
    - _Requirements: REQ-005, REQ-006, REQ-007_

  - [ ]* 1.5 Write unit tests for Icon component
    - Test that `filled={true}` sets `FILL` to 1 in `fontVariationSettings`
    - Test that `filled={false}` (default) sets `FILL` to 0
    - Test that `size` prop sets both `fontSize` and `opsz` axis
    - _Requirements: REQ-005_

  - [x] 1.6 Create `frontend/src/components/TopAppBar.tsx`
    - Define `TopAppBarProps`: `transparent?: boolean`, `className?: string`
    - Default variant: `bg-surface shadow-sm sticky top-0 z-50`
    - Transparent variant: `bg-surface/80 backdrop-blur-md fixed top-0 z-50` (for Lens View)
    - Left slot: `<Icon name="visibility" />` + "MemoryLens" text in `text-primary font-headline-md`
    - Right slot: `<Icon name="shield" />` icon button with `aria-label="Privacy settings"` and `min-h-[48px] min-w-[48px]`
    - Max-width container: `max-w-7xl mx-auto px-container-margin h-touch-target-min`
    - _Requirements: REQ-007, REQ-016_

  - [x] 1.7 Extract and rebuild `frontend/src/components/BottomNav.tsx` from `App.tsx`
    - Define `BottomNavProps`: `currentPath: string`
    - Hard-code `NAV_ITEMS` array: Lens (`camera_front`), Help (`contact_support`), Compare (`compare_arrows`), Caregiver (`face`)
    - Active item: `bg-secondary-container text-on-secondary-container rounded-xl px-4 py-2`; active icon uses `filled={true}`
    - Inactive items: `text-on-surface-variant hover:bg-surface-container-highest`
    - Container: `fixed bottom-0 w-full bg-surface-container/90 backdrop-blur-xl rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`
    - All items: `active:scale-90 duration-150 transition-colors`, minimum `h-[48px]`
    - _Requirements: REQ-006, REQ-016, REQ-017_

  - [ ]* 1.8 Write property test for touch target compliance
    - **Property 3: Touch target compliance** — render `BottomNav` and `TopAppBar` in a test environment and assert every `<button>` and `<a>` has computed height and width ≥ 48px
    - **Validates: REQ-003, REQ-006, REQ-016**

- [x] 2. Checkpoint — Phase 1 complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Phase 2 — Shared Components
  - [x] 3.1 Create `frontend/src/components/StorageToggle.tsx`
    - Define `StorageToggleProps`: `className?: string`
    - Read and write `useMidnight` from Zustand store via `useStore`
    - Container: `bg-surface-container-low rounded-xl p-4 flex items-center justify-between`
    - Left: `<Icon name="database" />` + "Cloud Memory Status" label
    - Pill: `bg-surface-container-high rounded-full p-1 flex`
    - Supabase option: active when `!useMidnight` → `bg-surface-container-highest text-on-surface`; inactive → `text-on-surface-variant`
    - Midnight option: active when `useMidnight` → `bg-secondary text-on-secondary midnight-glow` + `<Icon name="lock" />`; inactive → `text-on-surface-variant`
    - Add `role="switch"` and `aria-checked={useMidnight}` on the Midnight button
    - Minimum height 48px per option
    - _Requirements: REQ-011, REQ-015, REQ-016_

  - [x] 3.2 Create `frontend/src/components/PersonCard.tsx`
    - Define `PersonCardProps`: `name`, `relationship`, `imageUrl?`, `lastSeen?`, `isPrimary?`, `isEncrypted?`, `size?: 'sm' | 'lg'`
    - Card container: `bg-surface-container-lowest rounded-xl`; encrypted variant adds `midnight-glow border border-secondary/10`
    - Avatar: `rounded-full border-4 border-surface`; size `sm` → `w-16 h-16`, `lg` → `w-24 h-24`
    - Encrypted badge: absolute top-right, `bg-secondary/10 text-secondary p-2 rounded-full` with `<Icon name="encrypted" />`
    - Name: `font-headline-md text-on-surface`
    - Relationship: `font-label-lg` — `text-secondary` if `isPrimary`, else `text-on-surface-variant`
    - Last seen: `<Icon name="history" />` + text in `text-on-surface-variant font-body-md`
    - _Requirements: REQ-014, REQ-016_

  - [ ]* 3.3 Write property test for privacy color isolation
    - **Property 4: Privacy color isolation** — render `PersonCard` with `isEncrypted={false}` and assert no element has `color`, `background-color`, or `border-color` resolving to `#831ada` or its variants; render with `isEncrypted={true}` and assert the encrypted badge does use `#831ada`
    - **Validates: REQ-001, REQ-014**

  - [x] 3.4 Create `frontend/src/components/NotificationToast.tsx`
    - Define `NotificationToastProps`: `icon: string`, `message: React.ReactNode`, `onDismiss: () => void`, `visible: boolean`
    - Position: `fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-48px)] max-w-md`
    - Card: `bg-surface rounded-xl shadow-xl border-t-4 border-secondary`
    - Icon container: `bg-secondary/10 rounded-lg p-2`
    - Dismiss button: `<Icon name="close" />` with `aria-label="Dismiss notification"` and `min-h-[48px] min-w-[48px]`
    - Slide-in animation from top using Tailwind `translate-y` transition
    - Hidden when `visible={false}`
    - _Requirements: REQ-008, REQ-016, REQ-017_

  - [x] 3.5 Create `frontend/src/components/FaceRecognitionCard.tsx`
    - Define `FaceRecognitionCardProps`: `person: PersonMemory`, `lastConversation: string`, `onCall: () => void`, `onPhotos: () => void`
    - Container: `bg-surface/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl`
    - Avatar: `w-16 h-16 rounded-full border-2 border-primary`
    - Name: `font-headline-md`, relationship: `font-body-md italic`
    - Last conversation box: `bg-surface-container rounded-xl p-4`
    - "Call" button: `bg-primary text-on-primary rounded-xl h-[48px] active:scale-95 duration-150`
    - "See Photos" button: outline style, `border-2 border-primary text-primary rounded-xl h-[48px] active:scale-95 duration-150`
    - Slide-up animation from bottom using Tailwind `translate-y` transition
    - _Requirements: REQ-008, REQ-016, REQ-017_

  - [x] 3.6 Update `frontend/src/components/MidnightLoader.tsx` to match Stitch ZK stepper
    - Accept `activeStep: 0 | 1 | 2 | 3` prop
    - Container: `bg-surface/10 backdrop-blur-md rounded-xl p-8`
    - Header: `animate-pulse` shield icon + "ZK Proof Generation" heading
    - Step 1 (done): `bg-secondary` filled circle + `<Icon name="check" filled />`
    - Step 2 (active): `border-2 border-secondary` circle + `animate-bounce` dot inside
    - Steps 3–4: `opacity-50` numbered circles
    - Active step label: `font-bold`
    - _Requirements: REQ-012, REQ-017_

  - [x] 3.7 Update `frontend/src/components/PrivacyToggle.tsx` to match Stitch toggle style
    - Toggle track: `w-14 h-8 rounded-full` — ON: `bg-secondary`, OFF: `bg-outline-variant`
    - Knob: `w-6 h-6 rounded-full bg-white shadow` — ON: `translate-x-6`, OFF: `translate-x-1`
    - Smooth `transition-all duration-200`
    - Add `role="switch"` and `aria-checked` props
    - Minimum touch target wrapper: `min-h-[48px] min-w-[48px] flex items-center`
    - _Requirements: REQ-013, REQ-016, REQ-017_

  - [x] 3.8 Update `frontend/src/components/WalletConnect.tsx` to match Stitch wallet card
    - Card: `bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4`
    - Wallet address: `font-mono text-white font-bold tracking-wider`
    - Connected status: green pulse dot (`animate-pulse bg-green-400 w-2 h-2 rounded-full`)
    - Stats row: encrypted memories count + caregivers count
    - _Requirements: REQ-013_

  - [x] 3.9 Update `frontend/src/components/ui/button.tsx` and `frontend/src/components/ui/input.tsx` with Stitch tokens
    - `button.tsx`: primary variant → `bg-primary text-on-primary rounded-xl h-[56px] active:scale-95 duration-150 transition-colors`; outline variant → `border-2 border-primary text-primary`; destructive → `bg-error text-on-error`
    - `input.tsx`: `h-touch-target-min bg-surface-container-low border-2 border-outline-variant rounded-lg focus:border-primary transition-colors`; always-visible `<label>` required
    - _Requirements: REQ-010, REQ-016_

- [x] 4. Checkpoint — Phase 2 complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Phase 3 — Pages
  - [x] 5.1 Rebuild `frontend/src/pages/Login.tsx` to Stitch design
    - Full-screen centered layout: `flex flex-col min-h-screen`
    - Decorative gradient blobs: `fixed -z-10`, `bg-primary-fixed-dim blur-[100px] opacity-40` (top-right) and `bg-secondary-fixed-dim blur-[100px] opacity-40` (bottom-left)
    - Login card: `max-w-md bg-surface-container-lowest rounded-xl p-10 shadow-tactile`
    - Logo: `w-16 h-16 bg-primary-container/20 rounded-full` with `<Icon name="visibility" />`
    - Subtitle: "Welcome to your digital sanctuary" in `text-on-surface-variant`
    - Email and password fields using updated `input.tsx` with always-visible labels
    - Password show/hide toggle: `<Icon name="visibility" />` / `<Icon name="visibility_off" />` with `aria-label`
    - "Forgot?" link: `text-secondary`
    - Primary CTA: `w-full h-14 bg-primary text-on-primary rounded-xl active:scale-95 duration-150`
    - Divider with "Secure Login" text
    - Secondary CTA: outline style
    - Privacy note: `bg-secondary/5 border border-secondary/10 rounded-lg` with lock icon
    - Footer: copyright text
    - _Requirements: REQ-010, REQ-016, REQ-017, REQ-018_

  - [x] 5.2 Rebuild `frontend/src/pages/CameraView.tsx` to Stitch design
    - Fixed camera background: `fixed inset-0 z-0 bg-surface-container-highest` (placeholder for camera feed)
    - AR overlay tint: `fixed inset-0 z-10 bg-primary/5 mix-blend-multiply pointer-events-none`
    - Accessibility grid overlay: `fixed inset-0 z-20 pointer-events-none`
    - `<TopAppBar transparent />` at `z-50`
    - `<NotificationToast>` wired to `activeToast` from Zustand store
    - `<FaceRecognitionCard>` wired to `recognizedPerson` from Zustand store; positioned above bottom nav
    - Purple FAB mic button: `fixed bottom-28 right-container-margin bg-secondary text-on-secondary w-16 h-16 rounded-full shadow-2xl active:scale-95 duration-150` with `aria-label="Activate voice assistant"`
    - `<BottomNav currentPath="/" />`
    - _Requirements: REQ-008, REQ-016, REQ-017_

  - [x] 5.3 Rebuild `frontend/src/pages/AssistantMode.tsx` to Stitch design
    - `<TopAppBar />` sticky
    - Scrollable chat area: `max-w-xl mx-auto px-container-margin pt-stack-gap pb-40 flex flex-col gap-stack-gap`
    - User messages: right-aligned, `max-w-[85%] bg-primary-container text-on-primary rounded-2xl rounded-tr-none chat-bubble-shadow`; timestamp in `text-on-surface-variant font-label-lg text-sm`
    - AI messages: left-aligned, `bg-surface-container-lowest rounded-2xl rounded-tl-none privacy-glow`; "PRIVATE MEMORY RETRIEVAL" label with filled lock icon in `text-secondary`; location thumbnail; "Assistant • Active Now" label
    - Suggestion chips: `bg-surface-container-low border-2 border-outline-variant rounded-full px-5 py-3 hover:bg-surface-container-high transition-colors`
    - Fixed voice input bar: `fixed bottom-[88px] left-0 right-0 px-container-margin`; input area `bg-surface-container-highest rounded-full h-14`; mic button `w-16 h-16 bg-primary rounded-full active:scale-95 duration-150`
    - `<BottomNav currentPath="/assistant" />`
    - _Requirements: REQ-009, REQ-016, REQ-017, REQ-018_

  - [x] 5.4 Rebuild `frontend/src/pages/CaregiverDashboard.tsx` to Stitch design
    - `<TopAppBar />` sticky
    - `<StorageToggle />` full-width at top of content
    - Desktop sidebar: `hidden lg:flex flex-col w-80 sticky top-24`; active item `bg-primary-container text-on-primary-container rounded-lg`; privacy item separated by `border-t border-outline-variant`
    - People section: heading with `animate-pulse` `<Icon name="security" className="text-secondary" />`; count badge `bg-surface-container rounded-full px-4 py-1`; `<PersonCard size="lg" />` for each person; "Add New Trusted Person" card with dashed border
    - Objects section: white card, image thumbnails `w-16 h-16 rounded-lg`, chevron right icon
    - Places section: image cards with gradient overlay, active place has green dot indicator
    - Mobile FAB: `fixed bottom-24 right-container-margin bg-primary rounded-full w-14 h-14 md:hidden active:scale-95 duration-150` with `aria-label`
    - `<BottomNav currentPath="/dashboard" />` hidden on desktop (`md:hidden`)
    - _Requirements: REQ-011, REQ-016, REQ-017, REQ-018_

  - [ ] 5.5 Rebuild `frontend/src/pages/ComparisonDemo.tsx` to Stitch design
    - `<TopAppBar />` sticky
    - Page heading: `font-display-lg text-display-lg text-primary` (48px Manrope 800)
    - Subtitle: `font-body-lg text-on-surface-variant max-w-2xl mx-auto text-center`
    - Comparison grid: `grid lg:grid-cols-12 gap-stack-gap`
    - Supabase card (col-span-5): `border-t-4 border-outline-variant`; feature rows with `<Icon name="close" className="text-error" />`
    - VS divider (col-span-2): `bg-primary text-on-primary w-14 h-14 rounded-full mx-auto`
    - Midnight card (col-span-5): `border-t-4 border-secondary shadow-[0_20px_40px_rgba(131,26,218,0.08)]`; feature rows with `<Icon name="check" className="text-secondary" />`
    - Dark action card: `bg-inverse-surface text-white rounded-xl p-10`; decorative shield `text-[120px] opacity-10`; "Store Sample Memory" button `bg-secondary h-[56px] px-8 rounded-xl active:scale-95 duration-150`
    - `<MidnightLoader activeStep={zkStep} />` wired to local `zkStep` state
    - `<BottomNav currentPath="/compare" />`
    - _Requirements: REQ-012, REQ-016, REQ-017, REQ-018_

  - [x] 5.6 Rebuild `frontend/src/pages/PrivacyDashboard.tsx` to Stitch design
    - `<TopAppBar />` sticky
    - Header section: `gradient-midnight rounded-xl p-8`; shield icon + "Privacy Dashboard" in white; `<WalletConnect />` card
    - Layout: `grid lg:grid-cols-12 gap-stack-gap` (7 + 5)
    - Selective disclosure section: each row `bg-surface-container-low rounded-lg p-4`; icon `text-secondary`; `<PrivacyToggle />` wired to `permissions` state; `role="switch"` and `aria-checked`
    - Audit trail: vertical line via `before:` pseudo-element `bg-outline-variant`; active node `bg-secondary ring-4 ring-background w-6 h-6 rounded-full`; inactive nodes `bg-surface-container-highest`; timestamp `text-xs text-outline`
    - Authorized caregivers: cards `bg-surface rounded-xl border border-outline-variant/20`; revoke button `text-error hover:bg-error/10 rounded-lg h-[48px]`; info note `bg-secondary/5 border-secondary/20 border-dashed rounded-xl`
    - Privacy tips card: `bg-primary p-6 rounded-xl text-white`; CTA `bg-white text-primary rounded-lg`
    - `<BottomNav currentPath="/privacy" />`
    - _Requirements: REQ-013, REQ-016, REQ-017, REQ-018_

  - [ ]* 5.7 Write property test for typography floor
    - **Property 2: Typography floor** — render each rebuilt page in a jsdom environment and assert no text node has a computed `font-size` below 18px
    - **Validates: REQ-002, REQ-016**

  - [ ]* 5.8 Write property test for dark mode immunity
    - **Property 5: Dark mode immunity** — render each page with `prefers-color-scheme: dark` media query mocked and assert that `background-color` of `body` remains `#fcf9f4` and no color token changes
    - **Validates: REQ-001**

- [x] 6. Checkpoint — Phase 3 complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Phase 4 — Integration and wiring
  - [ ] 7.1 Update `frontend/src/store/useStore.ts` — add `ToastData` type and new state fields
    - Define `ToastData` interface: `icon: string`, `message: React.ReactNode`, `id: string`
    - Add `activeToast: ToastData | null` to `AppState`
    - Add `recognizedPerson: PersonMemory | null` to `AppState`
    - Add `activeNavSection: string` to `AppState`
    - Add `setActiveToast`, `setRecognizedPerson`, `setActiveNavSection` actions
    - _Requirements: REQ-008, REQ-011_

  - [x] 7.2 Update `frontend/src/App.tsx` — wire `BottomNav`, update routes, remove inline nav
    - Remove any inline bottom navigation markup from `App.tsx`
    - Import and render `<BottomNav currentPath={location.pathname} />` using `useLocation()`
    - Hide `BottomNav` on `/login` and `/dashboard/*` routes using conditional rendering
    - Verify all routes still render: `/`, `/assistant`, `/compare`, `/dashboard/*`, `/login`
    - _Requirements: REQ-006, REQ-018_

  - [ ]* 7.3 Write property test for routing integrity
    - **Property 6: Routing integrity** — for each route (`/`, `/assistant`, `/compare`, `/dashboard`, `/login`), render the full `App` component with `MemoryRouter` and assert no uncaught errors and the expected page component is mounted
    - **Validates: REQ-006, REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013**

  - [ ]* 7.4 Write property test for state preservation across navigation
    - **Property 7: State preservation** — set Zustand store state (people, objects, useMidnight, walletConnected), navigate between routes, and assert all state values remain unchanged after each navigation
    - **Validates: REQ-015**

- [x] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each phase boundary
- Property tests validate the 7 correctness properties defined in the design document
- Unit tests validate specific component behaviors and edge cases
- The design uses TypeScript throughout — no language selection was needed
- Keep `lucide-react` installed; only replace icons in redesigned components

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3"] },
    { "id": 1, "tasks": ["1.2", "1.4"] },
    { "id": 2, "tasks": ["1.5", "1.6", "1.7"] },
    { "id": 3, "tasks": ["1.8", "3.1", "3.2", "3.6", "3.7", "3.8", "3.9"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.5"] },
    { "id": 5, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6"] },
    { "id": 6, "tasks": ["5.7", "5.8", "7.1"] },
    { "id": 7, "tasks": ["7.2"] },
    { "id": 8, "tasks": ["7.3", "7.4"] }
  ]
}
```
