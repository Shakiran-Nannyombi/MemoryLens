# MemoryLens - Team Roles & Tasks

## 🎯 Project Overview
**MemoryLens** is a privacy-first AI memory assistant for dementia patients, integrating Midnight blockchain for zero-knowledge data protection.

**Hackathon:** Midnight Network Hackathon (May 2026)  
**Track:** AI Track - Building AI that processes sensitive data without exposing it  
**Timeline:** 24-48 hours  
**Team Size:** 3 developers

---

## 👥 Team Structure

### 🎨 **Role 1: Frontend Developer**
**Responsibility:** React UI/UX for Midnight integration

#### Tasks Breakdown

##### 1. Privacy Toggle Component (2-3 hours)
**File:** `src/components/PrivacyToggle.tsx`
```typescript
// Add toggle to switch between Supabase and Midnight storage
// Visual: 🔒 Midnight (Private) vs ⚡ Supabase (Fast)
```

**Integration Points:**
- Add to `CaregiverDashboard.tsx`
- Store preference in Zustand: `useStore.ts`
- Persist user choice in localStorage

##### 2. Wallet Connection UI (3-4 hours)
**Files:** 
- `src/components/WalletConnect.tsx`
- `src/components/WalletStatus.tsx`

**Features:**
- "Connect 1AM Wallet" button
- Display wallet address (truncated: 0x1234...5678)
- Connection status indicator
- Disconnect functionality
- Error handling UI

##### 3. Memory Storage Interface (4-5 hours)
**Files to modify:**
- `src/pages/CaregiverDashboard.tsx`
- `src/components/AddPersonForm.tsx` (or equivalent)

**Features:**
- Add "Store on Midnight" checkbox to forms
- Loading spinner during ZK proof generation
- Success notification with transaction hash
- Error handling with retry option
- Progress indicator for blockchain operations

##### 4. Privacy Dashboard (3-4 hours)
**File:** `src/pages/PrivacyDashboard.tsx`

**Features:**
- New tab in caregiver dashboard
- List of authorized caregivers
- Selective disclosure controls per memory type:
  - ☑️ Face Recognition Data
  - ☑️ Voice Transcripts
  - ☑️ Object Locations
  - ☑️ GPS Coordinates
- Audit trail viewer (who accessed what, when)
- Revoke access button

##### 5. Demo Comparison View (2-3 hours)
**File:** `src/pages/ComparisonDemo.tsx`

**Features:**
- Side-by-side comparison table
- Metrics: Speed, Privacy, Security, Compliance
- Visual indicators for each storage method
- Live demo toggle

#### State Management Updates
**File:** `src/store/useStore.ts`

Add to store:
```typescript
interface MidnightState {
  walletConnected: boolean;
  walletAddress: string | null;
  useMidnight: boolean;
  contractAddress: string;
  pendingTransactions: string[];
}
```

#### Deliverables
- [ ] Privacy toggle component
- [ ] Wallet connection UI
- [ ] Modified forms with Midnight option
- [ ] Privacy dashboard page
- [ ] Comparison demo view
- [ ] Updated Zustand store
- [ ] UI/UX documentation

---

### ⚙️ **Role 2: Smart Contract Developer**
**Responsibility:** Compact smart contract for encrypted memory storage

#### Tasks Breakdown

##### 1. Development Environment Setup (1-2 hours)
```bash
# Install Compact CLI
npm install -g @midnight-ntwrk/compact-cli

# Verify installation
compact --version

# Create contract directory
mkdir -p src/midnight/contracts
cd src/midnight/contracts
```

##### 2. PatientMemory Smart Contract (6-8 hours)
**File:** `src/midnight/contracts/PatientMemory.compact`

**Contract Structure:**
```compact
contract PatientMemory {
  // Private state (encrypted on-chain)
  private state {
    patientId: Bytes,
    memoryEvents: List<MemoryEvent>,
    authorizedCaregivers: Map<PublicKey, AccessLevel>
  }
  
  // Public state (visible to all)
  public state {
    totalEvents: Uint64,
    lastUpdated: Timestamp,
    contractVersion: String
  }
  
  // Circuits (functions)
  circuit storeMemory(...)
  circuit retrieveMemory(...)
  circuit authorizeCaregiver(...)
  circuit revokeAccess(...)
  circuit getAuditLog(...)
}
```

**Key Circuits to Implement:**

1. **storeMemory** - Store encrypted memory event
   - Input: eventType, encryptedData, timestamp
   - Verify: Patient authorization
   - Action: Add to private state, increment counter
   - Output: Event ID

2. **retrieveMemory** - Selective disclosure
   - Input: caregiverId, eventType, dateRange
   - Verify: Caregiver authorization for event type
   - Action: Filter events, log access
   - Output: Encrypted events (only authorized types)

3. **authorizeCaregiver** - Grant access
   - Input: caregiverId, accessLevel (full/partial)
   - Verify: Patient signature
   - Action: Add to authorized list
   - Output: Success confirmation

4. **revokeAccess** - Remove caregiver
   - Input: caregiverId
   - Verify: Patient signature
   - Action: Remove from authorized list
   - Output: Success confirmation

5. **getAuditLog** - Immutable access trail
   - Input: dateRange
   - Verify: Patient or authorized auditor
   - Action: Return access logs
   - Output: List of access events

##### 3. Compile & Deploy (2-3 hours)
```bash
# Compile contract
compact compile PatientMemory.compact

# Deploy to testnet
compact deploy --network testnet PatientMemory.wasm

# Save contract address
echo "CONTRACT_ADDRESS=<address>" >> .env
```

##### 4. Testing (3-4 hours)
**File:** `src/midnight/contracts/PatientMemory.test.ts`

**Test Cases:**
- ✅ Store memory event successfully
- ✅ Retrieve memory with valid authorization
- ✅ Reject retrieval without authorization
- ✅ Authorize caregiver
- ✅ Revoke caregiver access
- ✅ Audit log records all access
- ✅ Selective disclosure works correctly

##### 5. Type Generation (1-2 hours)
```bash
# Generate TypeScript types from contract
compact generate-types PatientMemory.compact --output ../types/

# Create ABI export
compact export-abi PatientMemory.compact --output PatientMemory.abi.json
```

#### Deliverables
- [ ] `PatientMemory.compact` contract
- [ ] Compiled WASM binary
- [ ] Deployed contract address (testnet)
- [ ] `PatientMemory.abi.json`
- [ ] TypeScript type definitions
- [ ] Test suite with >80% coverage
- [ ] Contract documentation

#### Resources
- [Compact Language Reference](https://docs.midnight.network/compact/reference/compact-reference)
- [Counter Example](https://docs.midnight.network/examples/dapps/counter)
- Midnight Skills: `.kiro/skills/Midnight-skills/compact/`

---

### 🔌 **Role 3: Backend/Integration Developer**
**Responsibility:** Connect frontend to Midnight blockchain

#### Tasks Breakdown

##### 1. Midnight SDK Setup (2-3 hours)
**File:** `src/midnight/lib/provider.ts`

```typescript
// Initialize Midnight provider
// Configure network (testnet/mainnet)
// Setup proof server connection
// Export provider instance
```

**Configuration:**
- Network: Midnight testnet
- Proof server URL
- Contract address (from Role 2)
- RPC endpoints

##### 2. Wallet Integration (4-5 hours)
**File:** `src/midnight/lib/wallet.ts`

**Functions to implement:**
```typescript
export async function detectWallet(): Promise<boolean>
export async function connectWallet(): Promise<string>
export async function disconnectWallet(): Promise<void>
export async function getWalletAddress(): Promise<string | null>
export async function signTransaction(tx: Transaction): Promise<Signature>
export function onWalletChange(callback: (address: string) => void)
```

**Features:**
- Detect 1AM wallet extension
- Handle wallet not installed
- Auto-reconnect on page reload
- Listen for account changes
- Error handling & user feedback

##### 3. Contract Interaction Layer (6-8 hours)
**File:** `src/midnight/lib/contract.ts`

**Core Functions:**
```typescript
// Initialize contract
export async function initContract(address: string): Promise<Contract>

// Memory storage
export async function storePersonMemory(
  name: string,
  relationship: string,
  faceDescriptor: number[],
  imageUrl: string
): Promise<string> // Returns transaction hash

export async function storeObjectMemory(
  objectClass: string,
  customLabel: string,
  location: { x: number, y: number }
): Promise<string>

export async function storeSpeechEvent(
  transcript: string,
  extractedNames: string[],
  timestamp: number
): Promise<string>

// Memory retrieval
export async function retrieveMemories(
  eventType: string,
  dateRange?: { start: Date, end: Date }
): Promise<MemoryEvent[]>

// Authorization
export async function authorizeCaregiver(
  caregiverId: string,
  accessLevel: AccessLevel
): Promise<string>

export async function revokeCaregiver(
  caregiverId: string
): Promise<string>

// Audit
export async function getAuditTrail(
  dateRange?: { start: Date, end: Date }
): Promise<AuditEvent[]>
```

##### 4. Encryption/Decryption Utils (3-4 hours)
**File:** `src/midnight/lib/crypto.ts`

**Functions:**
```typescript
// Encrypt data before storing on-chain
export function encryptMemoryData(
  data: any,
  publicKey: string
): Promise<EncryptedData>

// Decrypt retrieved data
export function decryptMemoryData(
  encryptedData: EncryptedData,
  privateKey: string
): Promise<any>

// Generate ZK proof
export function generateProof(
  circuit: Circuit,
  witness: Witness
): Promise<Proof>

// Verify proof
export function verifyProof(
  proof: Proof,
  publicInputs: any[]
): Promise<boolean>
```

##### 5. Integration with Existing Code (4-5 hours)
**File:** `src/lib/storage.ts` (new abstraction layer)

**Dual Storage Pattern:**
```typescript
export async function storeMemory(
  type: 'person' | 'object' | 'speech',
  data: any,
  useMidnight: boolean
): Promise<string> {
  if (useMidnight) {
    // Store on Midnight blockchain
    return await midnightContract.storeMemory(...)
  } else {
    // Store on Supabase
    return await supabase.from(type).insert(...)
  }
}
```

**Files to modify:**
- `src/pages/CaregiverDashboard.tsx` - Use new storage abstraction
- `src/lib/supabase.ts` - Keep existing Supabase logic

##### 6. Testing & Documentation (2-3 hours)
**File:** `src/midnight/lib/__tests__/integration.test.ts`

**Test Scenarios:**
- ✅ Connect wallet
- ✅ Store memory on Midnight
- ✅ Retrieve memory
- ✅ Authorize caregiver
- ✅ Selective disclosure works
- ✅ Audit trail records access
- ✅ Error handling

#### Deliverables
- [ ] `provider.ts` - Midnight provider setup
- [ ] `wallet.ts` - Wallet integration
- [ ] `contract.ts` - Contract interaction layer
- [ ] `crypto.ts` - Encryption utilities
- [ ] `storage.ts` - Dual storage abstraction
- [ ] Integration tests
- [ ] API documentation
- [ ] Setup guide for team

#### Resources
- [Midnight.js SDK Docs](https://docs.midnight.network/guides/compact-javascript-runtime)
- [1AM Wallet Integration](https://docs.midnight.network/how-to/1am-wallet)
- Midnight Skills: `.kiro/skills/Midnight-skills/midnight-js/`

---

## 🔄 Coordination & Dependencies

### Critical Path
```
Day 1 Morning:
  Role 2 → Write contract → Compile → Deploy
  Role 3 → Setup SDK → Wallet integration
  Role 1 → UI mockups → Toggle component

Day 1 Afternoon:
  Role 2 → Share contract address with Role 3
  Role 3 → Contract integration → Test
  Role 1 → Connect wallet UI

Day 2 Morning:
  Role 3 → Complete integration → Share API with Role 1
  Role 1 → Wire up UI to backend
  Role 2 → Final testing

Day 2 Afternoon:
  All → Integration testing → Bug fixes → Demo prep
```

### Communication Protocol
- **Daily Standups:** 9am, 3pm, 9pm
- **Blockers:** Post immediately in team chat
- **Code Reviews:** Required before merging to main
- **Shared Docs:** Update progress in this file

### Shared Resources
- **Contract Address:** Role 2 → Role 3 (ASAP after deployment)
- **Type Definitions:** Role 2 → Role 3 → Role 1
- **API Methods:** Role 3 → Role 1 (share signatures early)
- **UI Mockups:** Role 1 → All (for alignment)

---

## 📋 Checklist

### Role 1 (Frontend)
- [ ] Privacy toggle component
- [ ] Wallet connection UI
- [ ] Memory storage forms updated
- [ ] Privacy dashboard
- [ ] Comparison demo view
- [ ] State management updated
- [ ] UI testing complete

### Role 2 (Smart Contract)
- [ ] Development environment setup
- [ ] PatientMemory.compact written
- [ ] Contract compiled
- [ ] Contract deployed to testnet
- [ ] Contract address shared with team
- [ ] TypeScript types generated
- [ ] Test suite passing
- [ ] Documentation complete

### Role 3 (Backend/Integration)
- [ ] Midnight SDK configured
- [ ] Wallet integration working
- [ ] Contract interaction layer complete
- [ ] Encryption utilities implemented
- [ ] Storage abstraction layer
- [ ] Integration with existing code
- [ ] End-to-end tests passing
- [ ] API documentation

---

## 🚀 Getting Started

### For All Team Members
```bash
# Clone repo
git clone <repo-url>
cd MemoryLens

# Install dependencies
npm install

# Create your branch
git checkout -b <role>/<your-name>

# Start development
npm run dev
```

### Environment Setup
Create `.env.local`:
```bash
# Existing
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-key>
VITE_GEMINI_API_KEY=<your-key>

# New - Midnight (Role 2 will provide)
VITE_MIDNIGHT_NETWORK=testnet
VITE_MIDNIGHT_CONTRACT_ADDRESS=<from-role-2>
VITE_MIDNIGHT_PROOF_SERVER=https://proof-server.testnet.midnight.network
```

---

## 📞 Support

**Questions?**
- Compact syntax: Check `.kiro/skills/Midnight-skills/compact/`
- SDK issues: Check `.kiro/skills/Midnight-skills/midnight-js/`
- General: [Midnight Docs](https://docs.midnight.network)

**Stuck?**
- Post in team chat with `@role` mention
- Schedule pair programming session
- Review example projects in skills folder

---

## 🎯 Success Criteria

### Minimum Viable Demo
- ✅ User can connect 1AM wallet
- ✅ User can store one memory on Midnight
- ✅ User can retrieve stored memory
- ✅ UI shows comparison: Supabase vs Midnight
- ✅ Demo video recorded

### Stretch Goals
- ✅ Selective disclosure working
- ✅ Audit trail visible in UI
- ✅ Multiple memory types supported
- ✅ Performance optimizations
- ✅ Comprehensive error handling

---

**Last Updated:** May 16, 2026  
**Version:** 1.0  
**Team:** MemoryLens Hackathon Squad 🚀
