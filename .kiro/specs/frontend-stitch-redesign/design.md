# Design Document

## Overview

This document describes the technical architecture and component design for the MemoryLens frontend redesign. The implementation translates the Stitch "Digital Sanctuary" design system into a React/TypeScript component tree using Tailwind CSS v4, Material Symbols Outlined icons, and the existing Zustand state management layer.

The redesign is purely a frontend concern — no backend, blockchain, or database changes are required.

---

## Architecture

### Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | React 19 + TypeScript | Existing |
| Build tool | Vite 6 + `@tailwindcss/vite` | Existing |
| Styling | Tailwind CSS v4 (`@theme inline`) | Replace current tokens |
| Icons | Material Symbols Outlined (Google Fonts) | Replace Lucide React |
| Fonts | Manrope + Atkinson Hyperlegible Next | New — Google Fonts |
| State | Zustand | Existing — extend with Midnight state |
| Routing | React Router v7 | Existing |
| Animations | Tailwind utilities (`animate-pulse`, `animate-bounce`, `active:scale-*`) | No new animation library |

### Folder Structure

```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── button.tsx          # Update to Stitch tokens
│   │   └── input.tsx           # Update to Stitch tokens
│   ├── TopAppBar.tsx           # NEW — shared header
│   ├── BottomNav.tsx           # EXTRACT from App.tsx — update to Stitch
│   ├── PersonCard.tsx          # NEW — reusable person card
│   ├── StorageToggle.tsx       # NEW — Supabase/Midnight pill toggle
│   ├── NotificationToast.tsx   # NEW — dismissible toast
│   ├── FaceRecognitionCard.tsx # NEW — floating recognition card
│   ├── MidnightLoader.tsx      # UPDATE — match Stitch ZK stepper
│   ├── PrivacyToggle.tsx       # UPDATE — match Stitch toggle style
│   ├── WalletConnect.tsx       # UPDATE — match Stitch wallet card
│   └── TxSuccess.tsx           # UPDATE — match Stitch styling
├── pages/
│   ├── CameraView.tsx          # REBUILD to Stitch design
│   ├── AssistantMode.tsx       # REBUILD to Stitch design
│   ├── CaregiverDashboard.tsx  # REBUILD to Stitch design
│   ├── Login.tsx               # REBUILD to Stitch design
│   ├── ComparisonDemo.tsx      # REBUILD to Stitch design
│   └── PrivacyDashboard.tsx    # REBUILD to Stitch design
├── lib/
│   ├── supabase.ts             # Unchanged
│   ├── utils.ts                # Unchanged
│   └── mockMidnight.ts         # Unchanged
├── store/
│   └── useStore.ts             # Extend with Midnight state (already done)
├── types/
│   └── index.ts                # Unchanged
├── App.tsx                     # Update routing + extract BottomNav
├── index.css                   # REPLACE with Stitch design tokens
└── main.tsx                    # Add Google Fonts link
```

---

## Design Token System

### CSS Architecture (`frontend/src/index.css`)

Tailwind CSS v4 uses `@theme inline` to register custom tokens as utility classes. The full Stitch palette replaces the current simplified theme.

```css
@import "tailwindcss";

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600&family=Manrope:wght@600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

@theme inline {
  /* ── Colors ── */
  --color-background:               #fcf9f4;
  --color-surface:                  #fcf9f4;
  --color-surface-dim:              #dcdad5;
  --color-surface-bright:           #fcf9f4;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low:    #f6f3ee;
  --color-surface-container:        #f0ede9;
  --color-surface-container-high:   #eae8e3;
  --color-surface-container-highest:#e5e2dd;
  --color-surface-variant:          #e5e2dd;
  --color-on-surface:               #1c1c19;
  --color-on-surface-variant:       #48473e;
  --color-inverse-surface:          #31302d;
  --color-inverse-on-surface:       #f3f0eb;
  --color-outline:                  #79776d;
  --color-outline-variant:          #c9c7ba;
  --color-primary:                  #42432a;
  --color-on-primary:               #ffffff;
  --color-primary-container:        #5a5a40;
  --color-on-primary-container:     #d3d1b0;
  --color-primary-fixed:            #e6e4c3;
  --color-primary-fixed-dim:        #c9c8a8;
  --color-inverse-primary:          #c9c8a8;
  --color-secondary:                #831ada;
  --color-on-secondary:             #ffffff;
  --color-secondary-container:      #9e41f5;
  --color-on-secondary-container:   #fffbff;
  --color-secondary-fixed:          #f0dbff;
  --color-secondary-fixed-dim:      #ddb8ff;
  --color-on-secondary-fixed:       #2c0051;
  --color-on-secondary-fixed-variant:#6800b4;
  --color-tertiary:                 #40423e;
  --color-on-tertiary:              #ffffff;
  --color-tertiary-container:       #575955;
  --color-on-tertiary-container:    #cfd0cb;
  --color-error:                    #ba1a1a;
  --color-on-error:                 #ffffff;
  --color-error-container:          #ffdad6;
  --color-on-error-container:       #93000a;
  --color-surface-tint:             #606045;
  --color-on-background:            #1c1c19;

  /* ── Typography ── */
  --font-display-lg:       "Manrope", sans-serif;
  --font-headline-lg:      "Manrope", sans-serif;
  --font-headline-md:      "Manrope", sans-serif;
  --font-headline-lg-mobile: "Manrope", sans-serif;
  --font-body-lg:          "Atkinson Hyperlegible Next", sans-serif;
  --font-body-md:          "Atkinson Hyperlegible Next", sans-serif;
  --font-body-lg-mobile:   "Atkinson Hyperlegible Next", sans-serif;
  --font-label-lg:         "Atkinson Hyperlegible Next", sans-serif;

  --text-display-lg:       48px;
  --text-display-lg--line-height: 56px;
  --text-display-lg--font-weight: 800;
  --text-display-lg--letter-spacing: -0.02em;

  --text-headline-lg:      32px;
  --text-headline-lg--line-height: 40px;
  --text-headline-lg--font-weight: 700;

  --text-headline-md:      24px;
  --text-headline-md--line-height: 32px;
  --text-headline-md--font-weight: 600;

  --text-headline-lg-mobile: 28px;
  --text-headline-lg-mobile--line-height: 36px;
  --text-headline-lg-mobile--font-weight: 700;

  --text-body-lg:          20px;
  --text-body-lg--line-height: 30px;
  --text-body-lg--font-weight: 400;

  --text-body-md:          18px;
  --text-body-md--line-height: 28px;
  --text-body-md--font-weight: 400;

  --text-body-lg-mobile:   18px;
  --text-body-lg-mobile--line-height: 28px;
  --text-body-lg-mobile--font-weight: 400;

  --text-label-lg:         18px;
  --text-label-lg--line-height: 24px;
  --text-label-lg--font-weight: 600;
  --text-label-lg--letter-spacing: 0.01em;

  /* ── Spacing ── */
  --spacing-unit:              8px;
  --spacing-gutter:            16px;
  --spacing-container-margin:  24px;
  --spacing-touch-target-min:  48px;
  --spacing-stack-gap:         24px;

  /* ── Border Radius ── */
  --radius:    4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}

/* ── Global CSS utilities ── */
.midnight-glow {
  box-shadow: 0 0 20px 2px rgba(131, 26, 218, 0.15);
}
.privacy-glow {
  box-shadow: 0 0 20px 2px rgba(131, 26, 218, 0.15);
  border-top: 4px solid #831ada;
}
.shadow-tactile {
  box-shadow: 0 20px 40px -10px rgba(66, 67, 42, 0.12);
}
.shadow-soft {
  box-shadow: 0 10px 40px -10px rgba(66, 67, 42, 0.15);
}
.gradient-midnight {
  background: linear-gradient(135deg, #2c0051 0%, #831ada 100%);
}
.chat-bubble-shadow {
  box-shadow: 0 10px 20px rgba(66, 67, 42, 0.05);
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* ── Base ── */
body {
  background-color: #fcf9f4;
  color: #1c1c19;
  font-family: "Atkinson Hyperlegible Next", sans-serif;
  -webkit-font-smoothing: antialiased;
  color-scheme: light;
}
```

---

## Component Design

### 1. `TopAppBar.tsx`

**Props:**
```typescript
interface TopAppBarProps {
  transparent?: boolean;  // frosted glass variant for Lens View
  className?: string;
}
```

**Variants:**
- Default: `bg-surface shadow-sm sticky top-0 z-50`
- Transparent: `bg-surface/80 backdrop-blur-md fixed top-0 z-50` (Lens View)

**Structure:**
```
<header>
  <div max-w-7xl px-container-margin h-touch-target-min>
    <div>  ← left: visibility icon + "MemoryLens" text
    <div>  ← right: status pill (Lens only) + shield button
```

---

### 2. `BottomNav.tsx` (extracted from App.tsx)

**Props:**
```typescript
interface BottomNavProps {
  currentPath: string;
}
```

**Nav items:**
```typescript
const NAV_ITEMS = [
  { path: '/',          icon: 'camera_front',    label: 'Lens'      },
  { path: '/assistant', icon: 'contact_support', label: 'Help'      },
  { path: '/compare',   icon: 'compare_arrows',  label: 'Compare'   },
  { path: '/login',     icon: 'face',            label: 'Caregiver' },
];
```

**Active state logic:**
- Active: `bg-secondary-container text-on-secondary-container rounded-xl px-4 py-2`
- Active icon: `font-variation-settings: 'FILL' 1`
- Inactive: `text-on-surface-variant hover:bg-surface-container-highest`

**Hidden on:** `/login` and `/dashboard/*` routes

---

### 3. `PersonCard.tsx`

**Props:**
```typescript
interface PersonCardProps {
  name: string;
  relationship: string;
  imageUrl?: string;
  lastSeen?: string;
  isPrimary?: boolean;    // drives text-secondary vs text-on-surface-variant
  isEncrypted?: boolean;  // drives midnight-glow + encrypted badge
  size?: 'sm' | 'lg';    // sm = Lens View card, lg = Dashboard card
}
```

**Encrypted badge:** Absolute positioned top-right, `bg-secondary/10 text-secondary p-2 rounded-full`

---

### 4. `StorageToggle.tsx`

**Props:**
```typescript
interface StorageToggleProps {
  className?: string;
}
```

**State:** Reads/writes `useMidnight` from Zustand store

**Structure:**
```
<div bg-surface-container-low rounded-xl>
  <div>  ← left: database icon + "Cloud Memory Status" label
  <div bg-surface-container-high rounded-full p-1>  ← pill
    <button>  ← "⚡ Fast (Supabase)"
    <button bg-secondary text-on-secondary midnight-glow>  ← "🌙 Private (Midnight)"
```

---

### 5. `NotificationToast.tsx`

**Props:**
```typescript
interface NotificationToastProps {
  icon: string;           // Material Symbol name
  message: React.ReactNode;
  onDismiss: () => void;
  visible: boolean;
}
```

**Structure:** `fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-48px)] max-w-md`

Card: `bg-surface rounded-xl shadow-xl border-t-4 border-secondary`

---

### 6. `FaceRecognitionCard.tsx`

**Props:**
```typescript
interface FaceRecognitionCardProps {
  person: PersonMemory;
  lastConversation: string;
  onCall: () => void;
  onPhotos: () => void;
}
```

**Structure:**
```
<div bg-surface/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl>
  <div>  ← avatar (w-16 h-16 rounded-full border-2 border-primary) + name/relationship
  <div bg-surface-container rounded-xl p-4>  ← last conversation text
  <div flex gap-stack-gap>  ← Call button (primary) + See Photos (outline)
```

---

### 7. `MidnightLoader.tsx` (updated)

Matches the Stitch ZK proof stepper from `privacy_comparison/code.html`:

```
<div bg-surface/10 backdrop-blur-md rounded-xl p-8>
  <div>  ← animated shield icon (animate-pulse) + "ZK Proof Generation" heading
  <div space-y-6>
    Step 1: bg-secondary circle + check icon (done)
    Step 2: border-secondary circle + animate-bounce dot (active)
    Step 3: opacity-50 numbered circle (pending)
    Step 4: opacity-50 numbered circle (pending)
```

---

## Page Designs

### CameraView.tsx

**Layout layers (z-index stack):**
```
z-0  Fixed camera background (full screen)
z-10 AR overlay tint (bg-primary/5 mix-blend-multiply)
z-20 Accessibility grid overlay (pointer-events-none)
z-40 Notification toast (fixed top-20)
z-50 Top app bar (fixed, frosted glass)
z-50 FAB mic button (fixed bottom-28 right-container-margin)
z-50 Bottom nav (fixed bottom-0)
     Face recognition card (in main, above nav)
```

**State:**
```typescript
const [toastVisible, setToastVisible] = useState(true);
const [recognizedPerson, setRecognizedPerson] = useState<PersonMemory | null>(null);
```

---

### AssistantMode.tsx

**Layout:**
```
<header>  ← TopAppBar (sticky)
<main max-w-xl mx-auto px-container-margin pt-stack-gap pb-40>
  <div flex flex-col gap-stack-gap>
    UserMessage component (right-aligned)
    AIMessage component (left-aligned, privacy-glow)
    SuggestionChips section
<div fixed bottom-[88px]>  ← voice input bar
<nav>  ← BottomNav
```

**Message types:**
```typescript
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  location?: { label: string; imageUrl: string };
};
```

---

### Login.tsx

**Layout:**
```
<body flex flex-col min-h-screen>
  <div fixed -z-10>  ← decorative gradient blobs
  <main flex-grow flex items-center justify-center>
    <div max-w-md shadow-tactile>  ← login card
      Logo + title + subtitle
      Email field (always-visible label)
      Password field (show/hide toggle)
      Primary CTA
      Divider
      Secondary CTA
      Privacy note
  <footer>  ← copyright
```

**Form state:**
```typescript
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
```

---

### CaregiverDashboard.tsx

**Layout:**
```
<header>  ← TopAppBar (sticky)
<main max-w-7xl px-container-margin py-stack-gap pb-32>
  <StorageToggle />  ← full width at top
  <div flex flex-col lg:flex-row gap-stack-gap>
    <aside hidden lg:flex w-80>  ← desktop sidebar
    <div flex-1>
      PeopleSection
      <div grid grid-cols-1 lg:grid-cols-2>
        ObjectsSection
        PlacesSection
<button fixed bottom-24 md:hidden>  ← mobile FAB
<nav md:hidden>  ← BottomNav
```

**Active nav item tracking:**
```typescript
const [activeSection, setActiveSection] = useState<'people' | 'objects' | 'places' | 'events' | 'privacy'>('people');
```

---

### ComparisonDemo.tsx

**Layout:**
```
<header>  ← TopAppBar (sticky)
<main max-w-7xl px-container-margin pt-10 pb-32>
  <section text-center mb-12>  ← display-lg heading + subtitle
  <div grid lg:grid-cols-12 gap-stack-gap mb-12>
    SupabaseCard (col-span-5)
    VSDivider (col-span-2)
    MidnightCard (col-span-5)
  <div bg-inverse-surface rounded-xl p-10>  ← dark action card
    <div grid lg:grid-cols-2>
      Left: heading + description + CTA button
      Right: MidnightLoader (ZK stepper)
<nav>  ← BottomNav
```

**State:**
```typescript
const [zkStep, setZkStep] = useState<0 | 1 | 2 | 3>(1); // active step
const [isRunning, setIsRunning] = useState(false);
```

---

### PrivacyDashboard.tsx

**Layout:**
```
<header>  ← TopAppBar (sticky)
<main max-w-7xl px-container-margin pt-stack-gap space-y-stack-gap pb-32>
  <section gradient-midnight rounded-xl>  ← header with wallet card
  <div grid lg:grid-cols-12>
    <div lg:col-span-7>
      SelectiveDisclosureCard
      AuditTrailCard
    <div lg:col-span-5>
      AuthorizedCaregiversCard
      PrivacyTipsCard
<nav>  ← BottomNav
```

**State:**
```typescript
const [permissions, setPermissions] = useState({
  face: true, voice: true, location: false, biometrics: true
});
```

---

## Data Flow

### Zustand Store Shape (current + additions)

```typescript
interface AppState {
  // Existing
  people: PersonMemory[];
  objects: ObjectMemory[];
  places: PlaceMemory[];
  events: SpeechEvent[];
  user: any;
  currentLocation: { lat: number; lng: number } | null;

  // Midnight (already added)
  useMidnight: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  pendingTx: boolean;
  lastTxHash: string | null;

  // New for redesign
  activeToast: ToastData | null;
  recognizedPerson: PersonMemory | null;
  activeNavSection: string;
}

interface ToastData {
  icon: string;
  message: React.ReactNode;
  id: string;
}
```

---

## Icon Strategy

The Stitch designs use **Material Symbols Outlined** exclusively. The current codebase uses `lucide-react`. The redesign will:

1. Load Material Symbols via Google Fonts in `index.html`
2. Create a thin `<Icon>` wrapper component for type safety:

```typescript
// src/components/ui/Icon.tsx
interface IconProps {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
}

export function Icon({ name, filled = false, size = 24, className }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ''}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
```

3. Keep `lucide-react` installed — only replace icons in redesigned components

---

## Correctness Properties

The following properties must hold after implementation:

1. **Token completeness** — Every Tailwind class used in the Stitch HTML files (`text-primary`, `bg-secondary`, `bg-surface-container-low`, etc.) must resolve to a valid color. No undefined token warnings in the browser console.

2. **Typography floor** — No rendered text node in the app has a computed `font-size` below 18px.

3. **Touch target compliance** — Every `<button>`, `<a>`, and interactive `<div>` has a computed height and width ≥ 48px.

4. **Privacy color isolation** — The color `#831ada` (secondary) and its variants appear only on components related to Midnight blockchain, privacy, or ZK proofs. It must not appear on general UI elements.

5. **Dark mode immunity** — The app renders identically regardless of OS color scheme preference (`prefers-color-scheme: dark` must have no effect).

6. **Routing integrity** — All existing routes (`/`, `/assistant`, `/compare`, `/dashboard/*`, `/login`) continue to render without errors after the redesign.

7. **State preservation** — All Zustand state (people, objects, places, events, user, Midnight state) persists correctly across page navigation after the redesign.

---

## Implementation Order

The tasks should be executed in this dependency order to avoid broken states:

```
Phase 1 — Foundation (no visual breakage risk)
  1. index.css — replace tokens
  2. index.html — add Google Fonts
  3. Icon.tsx — new wrapper component
  4. TopAppBar.tsx — new shared component
  5. BottomNav.tsx — extract + update

Phase 2 — Shared Components
  6. StorageToggle.tsx — new
  7. PersonCard.tsx — new
  8. NotificationToast.tsx — new
  9. FaceRecognitionCard.tsx — new
  10. MidnightLoader.tsx — update
  11. PrivacyToggle.tsx — update
  12. WalletConnect.tsx — update
  13. button.tsx + input.tsx — update tokens

Phase 3 — Pages (each independently testable)
  14. Login.tsx
  15. CameraView.tsx
  16. AssistantMode.tsx
  17. CaregiverDashboard.tsx
  18. ComparisonDemo.tsx
  19. PrivacyDashboard.tsx

Phase 4 — Integration
  20. App.tsx — wire BottomNav, update routes
  21. useStore.ts — add ToastData + recognizedPerson state
  22. End-to-end review
```
