# PatientMemory Smart Contract

Privacy-preserving memory storage for dementia patients on the Midnight Network.

---

## Privacy Model

The contract is designed so **no patient data ever appears in plaintext on-chain**.

| Data | Where it lives | Who can see it |
|---|---|---|
| Patient secret key | Client only (witness) | Nobody except the patient |
| Caregiver secret key | Client only (witness) | Nobody except the caregiver |
| Encrypted memory payloads | Off-chain (Supabase) | Only authorized parties |
| Event commitment hashes | On-chain ledger | Everyone (but reveals nothing) |
| Caregiver commitment hashes | On-chain ledger | Everyone (but reveals nothing) |
| Audit commitment hashes | On-chain ledger | Everyone (but reveals nothing) |
| Public counters | On-chain ledger | Everyone |

The ZK proof proves that the circuit ran correctly (e.g., "the caller knows the patient's secret key") without revealing the key itself.

---

## Contract Circuits

### `storeMemory(eventType, encryptedData, timestamp) → Bytes<32>`
Store a new memory event. Only the patient can call this.

- Proves caller knows `patientSecretKey` whose commitment matches `patientCommitment`
- Stores `persistentHash([eventTypeBytes, encryptedData, timestampBytes])` in `eventCommitments`
- Returns the event commitment hash (save this — you need it for `logMemoryAccess`)

### `authorizeCaregiver(accessLevel, durationDays) → Bytes<32>`
Grant a caregiver access. Only the patient can call this.

- Proves caller is the patient
- Derives caregiver commitment from `caregiverPublicKey` witness
- Stores commitment → access level code in `caregiverAccessLevels`
- Returns the caregiver commitment hash

### `revokeAccess() → Boolean`
Remove a caregiver's authorization. Only the patient can call this.

- Proves caller is the patient
- Writes sentinel value `255` to the caregiver's entry (Map.remove doesn't exist in Compact)
- DApp must filter out entries with value `255`

### `verifyAccess() → Uint<8>`
Prove the calling caregiver is authorized. Read-only (but still a transaction).

- Proves caller knows `caregiverSecretKey` whose derived commitment is in `caregiverAccessLevels`
- Asserts the access level is not `255` (revoked)
- Appends an audit entry
- Returns the access level code: `0=Full, 1=Medical, 2=Emergency, 3=ReadOnly`

### `logMemoryAccess(eventCommit, timestamp) → []`
Record that a caregiver accessed a specific memory event.

- Proves caregiver is authorized (same check as `verifyAccess`)
- Proves the event commitment exists in `eventCommitments`
- Appends `persistentHash([cgCommit, eventCommit, timestampBytes])` to `auditCommitments`

### `getStats() → [Uint<64>, Uint<64>, Uint<64>]`
Return `(totalEvents, totalCaregivers, lastUpdated)`. No authorization required.

---

## Setup

### 1. Install Compact CLI

```bash
curl --proto '=https' --tlsv1.2 -sSf \
  https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
source $HOME/.local/bin/env
compact --version
```

### 2. Compile the Contract

```bash
cd frontend/src/midnight/contracts
compact compile PatientMemory.compact managed/PatientMemory
```

Expected output:
```
Compiling 6 circuits:
  circuit "storeMemory"        (k=..., rows=...)
  circuit "authorizeCaregiver" (k=..., rows=...)
  circuit "revokeAccess"       (k=..., rows=...)
  circuit "verifyAccess"       (k=..., rows=...)
  circuit "logMemoryAccess"    (k=..., rows=...)
  circuit "getStats"           (k=..., rows=...)
```

During development, use `--skip-zk` to skip proof key generation (much faster):
```bash
compact compile --skip-zk PatientMemory.compact managed/PatientMemory
```

### 3. Generate TypeScript Types (optional — types are hand-written in `../types/contract.ts`)

```bash
compact generate-types PatientMemory.compact --output ../types/
```

### 4. Export ABI

```bash
compact export-abi PatientMemory.compact --output PatientMemory.abi.json
```

### 5. Deploy to Testnet

```bash
# Start local devnet (for testing)
docker compose up -d --wait

# Or deploy to Midnight testnet
compact deploy --network testnet managed/PatientMemory/PatientMemory.wasm
```

Save the contract address and share it with Person 3:
```bash
echo "VITE_MIDNIGHT_CONTRACT_ADDRESS=<address>" >> ../../../../.env.local
```

---

## Running Tests

```bash
# Start local devnet
docker compose up -d --wait

# Run contract tests
NODE_OPTIONS='--experimental-vm-modules' npx vitest run \
  --config frontend/src/midnight/contracts/vitest.config.ts
```

---

## File Structure

```
frontend/src/midnight/contracts/
├── PatientMemory.compact       ← The contract (edit this)
├── PatientMemory.abi.json      ← ABI (regenerate with compact export-abi)
├── PatientMemory.test.ts       ← Integration tests
├── index.ts                    ← Barrel file for compiled contract exports
├── vitest.config.ts            ← Test runner config
├── README.md                   ← This file
└── managed/
    └── PatientMemory/          ← Compiler output (DO NOT EDIT)
        ├── contract/
        │   └── index.js        ← TypeScript bindings
        ├── keys/               ← Prover/verifier keys
        └── zkir/               ← ZK intermediate representation

frontend/src/midnight/types/
└── contract.ts                 ← Hand-written TypeScript types (share with Person 3)
```

---

## Sharing with the Team

**→ Person 3 (Backend/Integration):**
- Contract address (after deployment)
- `frontend/src/midnight/types/contract.ts` — type definitions
- `frontend/src/midnight/contracts/PatientMemory.abi.json` — ABI
- `frontend/src/midnight/contracts/index.ts` — compiled contract barrel file

**→ Person 1 (Frontend):**
- `frontend/src/midnight/types/contract.ts` — enums and labels
- Contract address for `.env.local`

---

## Common Issues

| Error | Fix |
|---|---|
| `compact: command not found` | `source $HOME/.local/bin/env` |
| `Cannot find module './managed/...'` | Run `compact compile` first |
| `assert failed: Not authorized` | Wrong secret key in witness |
| `assert failed: Caregiver not found` | Call `authorizeCaregiver` before `revokeAccess` |
| `assert failed: Caregiver access has been revoked` | Access was revoked; re-authorize if needed |
| `assert failed: Event not found` | Pass the correct event commitment from `storeMemory` |
| Version mismatch at runtime | Check `docs.midnight.network/relnotes/support-matrix` |
