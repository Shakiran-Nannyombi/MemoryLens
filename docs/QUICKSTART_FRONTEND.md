# 🎨 Frontend Developer - Quick Start Guide

## Your Mission
Add Midnight blockchain UI to MemoryLens for privacy-preserving memory storage.

---

## 🚀 Day 1 Tasks (First 12 hours)

### Task 1: Privacy Toggle (2-3 hours)

**Create:** `src/components/PrivacyToggle.tsx`
```typescript
import { useState } from 'react';
import { useStore } from '../store/useStore';

export function PrivacyToggle() {
  const { useMidnight, setUseMidnight } = useStore();
  
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={useMidnight}
          onChange={(e) => setUseMidnight(e.target.checked)}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">
          {useMidnight ? '🔒 Private (Midnight)' : '⚡ Fast (Supabase)'}
        </span>
      </label>
    </div>
  );
}
```

**Update:** `src/store/useStore.ts`
```typescript
// Add to interface
interface AppState {
  // ... existing fields
  useMidnight: boolean;
  setUseMidnight: (value: boolean) => void;
}

// Add to store
export const useStore = create<AppState>((set) => ({
  // ... existing state
  useMidnight: false,
  setUseMidnight: (value) => set({ useMidnight: value }),
}));
```

**Integrate:** Add to `src/pages/CaregiverDashboard.tsx`
```typescript
import { PrivacyToggle } from '../components/PrivacyToggle';

// Inside component
<div className="mb-4">
  <PrivacyToggle />
</div>
```

---

### Task 2: Wallet Connection UI (3-4 hours)

**Create:** `src/components/WalletConnect.tsx`
```typescript
import { useState } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

export function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      // TODO: Person 3 will provide this function
      // const addr = await connectWallet();
      const addr = '0x1234...5678'; // Mock for now
      setAddress(addr);
      setConnected(true);
      setError(null);
    } catch (err) {
      setError('Failed to connect wallet. Is 1AM installed?');
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress(null);
  };

  if (connected) {
    return (
      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
        <Wallet className="w-5 h-5 text-purple-600" />
        <span className="text-sm font-medium text-purple-900">
          {address}
        </span>
        <button
          onClick={handleDisconnect}
          className="ml-auto text-sm text-purple-600 hover:text-purple-800"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleConnect}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        <Wallet className="w-5 h-5" />
        Connect 1AM Wallet
      </button>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}
    </div>
  );
}
```

---

### Task 3: Loading States (1-2 hours)

**Create:** `src/components/MidnightLoader.tsx`
```typescript
import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
}

export function MidnightLoader({ message = 'Generating ZK proof...' }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      <p className="text-sm text-gray-600">{message}</p>
      <p className="text-xs text-gray-400">This may take a few seconds</p>
    </div>
  );
}
```

---

## 🚀 Day 2 Tasks (Next 12 hours)

### Task 4: Privacy Dashboard (3-4 hours)

**Create:** `src/pages/PrivacyDashboard.tsx`
```typescript
import { Shield, Users, Clock } from 'lucide-react';

export default function PrivacyDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Privacy Settings</h1>
      
      {/* Authorized Caregivers */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Authorized Caregivers</h2>
        </div>
        <div className="space-y-3">
          {/* TODO: Map over caregivers */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Dr. Smith</span>
            <button className="text-sm text-red-600">Revoke</button>
          </div>
        </div>
      </section>

      {/* Selective Disclosure */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Data Access Control</h2>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Face Recognition Data</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Voice Transcripts</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>GPS Locations</span>
          </label>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Access History</h2>
        </div>
        <div className="space-y-2 text-sm">
          {/* TODO: Map over audit logs */}
          <div className="p-2 bg-gray-50 rounded">
            Dr. Smith accessed medication data - 2 hours ago
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Add route:** `src/App.tsx`
```typescript
import PrivacyDashboard from './pages/PrivacyDashboard';

// In Routes
<Route path="/privacy" element={<PrivacyDashboard />} />
```

---

### Task 5: Comparison Demo (2-3 hours)

**Create:** `src/pages/ComparisonDemo.tsx`
```typescript
export default function ComparisonDemo() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Storage Comparison</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Supabase */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">⚡ Supabase</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Fast storage (< 100ms)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">✗</span>
              Centralized (single point of failure)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">✗</span>
              Admin can see all data
            </li>
          </ul>
        </div>

        {/* Midnight */}
        <div className="bg-purple-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔒 Midnight</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Encrypted by default
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Patient controls access
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Immutable audit trail
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-600">⚠</span>
              Slower (ZK proof: ~2-5s)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## 📦 Integration Points

### When Person 3 provides SDK functions:

**Update:** `src/components/WalletConnect.tsx`
```typescript
import { connectWallet, disconnectWallet } from '../midnight/lib/wallet';

// Replace mock with real functions
const handleConnect = async () => {
  const addr = await connectWallet();
  setAddress(addr);
  setConnected(true);
};
```

**Update:** `src/pages/CaregiverDashboard.tsx`
```typescript
import { storePersonMemory } from '../midnight/lib/contract';
import { useStore } from '../store/useStore';

const handleAddPerson = async (data) => {
  const { useMidnight } = useStore.getState();
  
  if (useMidnight) {
    setLoading(true);
    try {
      const txHash = await storePersonMemory(
        data.name,
        data.relationship,
        data.faceDescriptor,
        data.imageUrl
      );
      console.log('Stored on Midnight:', txHash);
    } catch (error) {
      console.error('Midnight error:', error);
    } finally {
      setLoading(false);
    }
  } else {
    // Existing Supabase logic
    await supabase.from('people').insert(data);
  }
};
```

---

## ✅ Checklist

- [ ] Privacy toggle component created
- [ ] Wallet connect UI working
- [ ] Loading states implemented
- [ ] Privacy dashboard page created
- [ ] Comparison demo view created
- [ ] State management updated
- [ ] Routes added to App.tsx
- [ ] Integration with Person 3's SDK
- [ ] Error handling added
- [ ] UI testing complete

---

## 🎨 Design Guidelines

**Colors:**
- Primary: Purple (#9333EA) - Midnight brand
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

**Icons:**
- Use `lucide-react` for consistency
- Wallet: `<Wallet />`
- Privacy: `<Shield />`, `<Lock />`
- Loading: `<Loader2 className="animate-spin" />`

---

## 🐛 Common Issues

**Issue:** Wallet not connecting
- Check if 1AM extension is installed
- Verify network is set to testnet
- Check browser console for errors

**Issue:** Slow ZK proof generation
- Expected! Show loading state
- Add progress indicator
- Set user expectations (2-5 seconds)

---

## 📞 Need Help?

- Check Person 3's API documentation
- Review Midnight UI examples in skills folder
- Ask in team chat with `@backend`

---

**Good luck! 🚀**
