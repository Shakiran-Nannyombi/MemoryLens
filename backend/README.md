# 🔌 Backend - Midnight Blockchain Integration

**Owner:** Person 3 (Backend/Integration Developer)  
**Smart Contract:** Person 2 (Smart Contract Developer)

---

## 📁 Folder Structure

```
backend/
├── contracts/              # Compact smart contracts (Person 2)
│   ├── PatientMemory.compact
│   └── PatientMemory.abi.json
├── lib/                    # Midnight SDK integration (Person 3)
│   ├── provider.ts         # Midnight network provider
│   ├── wallet.ts           # 1AM wallet integration
│   ├── contract.ts         # Contract interaction layer
│   └── crypto.ts           # Encryption/ZK proof utilities
├── types/                  # Shared TypeScript types (Person 2 generates)
│   └── contract.ts
├── supabase_schema.sql     # Supabase database schema
└── README.md               # This file
```

---

## 🚀 Quick Start

### Person 2 - Smart Contract
```bash
# Install Compact CLI
npm install -g @midnight-ntwrk/compact-cli

# Compile contract
cd backend/contracts
compact compile PatientMemory.compact

# Deploy to testnet
compact deploy --network testnet PatientMemory.wasm

# Share contract address with team!
```

### Person 3 - SDK Integration
```bash
# Install dependencies (from root)
npm install

# Set env variables in .env.local
VITE_MIDNIGHT_NETWORK=testnet
VITE_MIDNIGHT_CONTRACT_ADDRESS=<from-person-2>
VITE_MIDNIGHT_PROOF_SERVER=https://proof-server.testnet.midnight.network
```

---

## 📚 Full Guide

See [`docs/QUICKSTART_SMART_CONTRACT.md`](../docs/QUICKSTART_SMART_CONTRACT.md) for Person 2  
See [`docs/QUICKSTART_BACKEND.md`](../docs/QUICKSTART_BACKEND.md) for Person 3

---

## 🔗 Resources

- [Compact Language Reference](https://docs.midnight.network/compact/reference/compact-reference)
- [Midnight.js SDK](https://docs.midnight.network/guides/compact-javascript-runtime)
- [1AM Wallet](https://docs.midnight.network/how-to/1am-wallet)
- Midnight Skills: `../.kiro/skills/Midnight-skills/`
