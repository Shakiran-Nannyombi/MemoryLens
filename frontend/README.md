# 🎨 Frontend - React Application

**Owner:** Person 1 (Frontend Developer) — Kiran

---

## 📁 Folder Structure

```
src/                        # All React source code lives here
├── components/             # Reusable UI components
│   └── ui/                 # Base UI primitives (button, input)
├── pages/                  # Page-level components
│   ├── CameraView.tsx      # Main camera + AI recognition view
│   ├── AssistantMode.tsx   # Voice assistant interface
│   ├── CaregiverDashboard.tsx  # Caregiver control panel
│   └── Login.tsx           # Authentication page
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Helper utilities
├── store/
│   └── useStore.ts         # Zustand global state
├── types/
│   └── index.ts            # TypeScript interfaces
├── App.tsx                 # Root component + routing
├── main.tsx                # Entry point
└── index.css               # Global styles

index.html                  # HTML entry point
vite.config.ts              # Vite build config
tsconfig.json               # TypeScript config
```

---

## 🚀 Quick Start

```bash
# From project root
npm install
npm run dev

# Open browser
http://localhost:3000
```

---

## 🆕 New Components to Build (Midnight Integration)

| Component | File | Status |
|-----------|------|--------|
| Privacy Toggle | `src/components/PrivacyToggle.tsx` | 🔲 TODO |
| Wallet Connect | `src/components/WalletConnect.tsx` | 🔲 TODO |
| Midnight Loader | `src/components/MidnightLoader.tsx` | 🔲 TODO |
| Privacy Dashboard | `src/pages/PrivacyDashboard.tsx` | 🔲 TODO |
| Comparison Demo | `src/pages/ComparisonDemo.tsx` | 🔲 TODO |

---

## 🔄 State Management

Add to `src/store/useStore.ts`:
```typescript
// Midnight state
useMidnight: boolean
setUseMidnight: (value: boolean) => void
walletConnected: boolean
walletAddress: string | null
```

---

## 🔗 Integration with Backend

When Person 3 provides SDK functions, import from:
```typescript
import { connectWallet } from '../../../backend/lib/wallet';
import { storePersonMemory } from '../../../backend/lib/contract';
```

---

## 📚 Full Guide

See [`docs/QUICKSTART_FRONTEND.md`](../docs/QUICKSTART_FRONTEND.md) for detailed tasks and code snippets.

---

## 🎨 Design System

- **Colors:** Purple (`#9333EA`) for Midnight features, existing app palette for core UI
- **Icons:** `lucide-react` — `Wallet`, `Shield`, `Lock`, `Loader2`
- **Loading:** Always show spinner + message during ZK proof generation (2-5s)
