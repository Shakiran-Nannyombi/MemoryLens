# 🔌 Backend/Integration Developer - Quick Start Guide

## Your Mission
Connect the React frontend to Midnight blockchain via SDK integration.

---

## 🚀 Day 1 Tasks (First 12 hours)

### Task 1: Midnight Provider Setup (2-3 hours)

**Create:** `src/midnight/lib/provider.ts`

```typescript
import { MidnightProvider } from '@midnight-ntwrk/midnight-js-types';

const NETWORK = import.meta.env.VITE_MIDNIGHT_NETWORK || 'testnet';
const PROOF_SERVER = import.meta.env.VITE_MIDNIGHT_PROOF_SERVER;

let provider: MidnightProvider | null = null;

export async function initProvider(): Promise<MidnightProvider> {
  if (provider) return provider;
  
  try {
    // Initialize Midnight provider
    provider = await MidnightProvider.connect({
      network: NETWORK,
      proofServer: PROOF_SERVER,
    });
    
    console.log('✅ Midnight provider initialized');
    return provider;
  } catch (error) {
    console.error('❌ Failed to initialize provider:', error);
    throw new Error('Could not connect to Midnight network');
  }
}

export function getProvider(): MidnightProvider {
  if (!provider) {
    throw new Error('Provider not initialized. Call initProvider() first.');
  }
  return provider;
}

export async function getNetworkInfo() {
  const p = getProvider();
  return {
    network: NETWORK,
    chainId: await p.getChainId(),
    blockNumber: await p.getBlockNumber(),
  };
}
```

---

### Task 2: Wallet Integration (4-5 hours)

**Create:** `src/midnight/lib/wallet.ts`

```typescript
import { getProvider } from './provider';

interface WalletState {
  connected: boolean;
  address: string | null;
}

let walletState: WalletState = {
  connected: false,
  address: null,
};

const listeners: Array<(state: WalletState) => void> = [];

// Detect 1AM wallet extension
export function detectWallet(): boolean {
  return typeof window !== 'undefined' && 
         'midnight' in window && 
         'wallet' in (window as any).midnight;
}

// Connect to 1AM wallet
export async function connectWallet(): Promise<string> {
  if (!detectWallet()) {
    throw new Error('1AM Wallet not installed. Please install from https://1am.midnight.network');
  }
  
  try {
    const midnight = (window as any).midnight;
    
    // Request account access
    const accounts = await midnight.wallet.requestAccounts();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
    
    const address = accounts[0];
    
    // Update state
    walletState = {
      connected: true,
      address,
    };
    
    // Notify listeners
    notifyListeners();
    
    console.log('✅ Wallet connected:', address);
    return address;
  } catch (error) {
    console.error('❌ Wallet connection failed:', error);
    throw error;
  }
}

// Disconnect wallet
export async function disconnectWallet(): Promise<void> {
  walletState = {
    connected: false,
    address: null,
  };
  
  notifyListeners();
  console.log('✅ Wallet disconnected');
}

// Get current wallet address
export function getWalletAddress(): string | null {
  return walletState.address;
}

// Check if wallet is connected
export function isWalletConnected(): boolean {
  return walletState.connected;
}

// Subscribe to wallet changes
export function onWalletChange(callback: (state: WalletState) => void): () => void {
  listeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

// Notify all listeners
function notifyListeners() {
  listeners.forEach(callback => callback(walletState));
}

// Listen for account changes from wallet
if (typeof window !== 'undefined' && detectWallet()) {
  const midnight = (window as any).midnight;
  
  midnight.wallet.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      walletState.address = accounts[0];
      notifyListeners();
    }
  });
}

// Sign transaction
export async function signTransaction(tx: any): Promise<any> {
  if (!isWalletConnected()) {
    throw new Error('Wallet not connected');
  }
  
  const midnight = (window as any).midnight;
  return await midnight.wallet.signTransaction(tx);
}
```

---

### Task 3: Contract Interaction Layer (6-8 hours)

**Create:** `src/midnight/lib/contract.ts`

```typescript
import { getProvider } from './provider';
import { getWalletAddress, signTransaction } from './wallet';
import { encryptData, decryptData, generateProof } from './crypto';

const CONTRACT_ADDRESS = import.meta.env.VITE_MIDNIGHT_CONTRACT_ADDRESS;

interface MemoryEvent {
  eventId: string;
  eventType: 'face' | 'object' | 'speech' | 'location';
  encryptedData: string;
  timestamp: number;
  isVerified: boolean;
}

interface AuditEntry {
  caregiverId: string;
  eventId: string;
  accessedAt: number;
  action: string;
}

// Initialize contract instance
let contractInstance: any = null;

export async function initContract() {
  if (contractInstance) return contractInstance;
  
  const provider = getProvider();
  
  // Load contract ABI
  const abi = await import('../contracts/PatientMemory.abi.json');
  
  // Create contract instance
  contractInstance = provider.getContract(CONTRACT_ADDRESS, abi.default);
  
  console.log('✅ Contract initialized:', CONTRACT_ADDRESS);
  return contractInstance;
}

// Store person memory (face recognition)
export async function storePersonMemory(
  name: string,
  relationship: string,
  faceDescriptor: number[],
  imageUrl: string
): Promise<string> {
  const contract = await initContract();
  const address = getWalletAddress();
  
  if (!address) {
    throw new Error('Wallet not connected');
  }
  
  try {
    // Prepare data
    const data = {
      name,
      relationship,
      faceDescriptor,
      imageUrl,
      timestamp: Date.now(),
    };
    
    // Encrypt data
    const encryptedData = await encryptData(data, address);
    
    // Generate ZK proof
    const proof = await generateProof({
      eventType: 'face',
      data: encryptedData,
      timestamp: data.timestamp,
    });
    
    // Call contract
    const tx = await contract.storeMemory(
      0, // EventType.FaceDetected
      encryptedData,
      data.timestamp,
      proof
    );
    
    // Sign transaction
    const signedTx = await signTransaction(tx);
    
    // Wait for confirmation
    const receipt = await signedTx.wait();
    
    console.log('✅ Memory stored on Midnight:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('❌ Failed to store memory:', error);
    throw error;
  }
}

// Store object memory
export async function storeObjectMemory(
  objectClass: string,
  customLabel: string,
  location: { x: number; y: number }
): Promise<string> {
  const contract = await initContract();
  const address = getWalletAddress();
  
  if (!address) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const data = {
      objectClass,
      customLabel,
      location,
      timestamp: Date.now(),
    };
    
    const encryptedData = await encryptData(data, address);
    const proof = await generateProof({
      eventType: 'object',
      data: encryptedData,
      timestamp: data.timestamp,
    });
    
    const tx = await contract.storeMemory(
      1, // EventType.ObjectLocated
      encryptedData,
      data.timestamp,
      proof
    );
    
    const signedTx = await signTransaction(tx);
    const receipt = await signedTx.wait();
    
    console.log('✅ Object memory stored:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('❌ Failed to store object memory:', error);
    throw error;
  }
}

// Store speech event
export async function storeSpeechEvent(
  transcript: string,
  extractedNames: string[],
  timestamp: number
): Promise<string> {
  const contract = await initContract();
  const address = getWalletAddress();
  
  if (!address) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const data = {
      transcript,
      extractedNames,
      timestamp,
    };
    
    const encryptedData = await encryptData(data, address);
    const proof = await generateProof({
      eventType: 'speech',
      data: encryptedData,
      timestamp,
    });
    
    const tx = await contract.storeMemory(
      2, // EventType.ConversationRecorded
      encryptedData,
      timestamp,
      proof
    );
    
    const signedTx = await signTransaction(tx);
    const receipt = await signedTx.wait();
    
    console.log('✅ Speech event stored:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('❌ Failed to store speech event:', error);
    throw error;
  }
}

// Retrieve memories
export async function retrieveMemories(
  eventType: 'face' | 'object' | 'speech' | 'location',
  dateRange?: { start: Date; end: Date }
): Promise<MemoryEvent[]> {
  const contract = await initContract();
  const address = getWalletAddress();
  
  if (!address) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const eventTypeMap = {
      face: 0,
      object: 1,
      speech: 2,
      location: 3,
    };
    
    const startTime = dateRange?.start.getTime() || 0;
    const endTime = dateRange?.end.getTime() || Date.now();
    
    const events = await contract.retrieveMemory(
      address,
      eventTypeMap[eventType],
      startTime,
      endTime
    );
    
    // Decrypt events
    const decryptedEvents = await Promise.all(
      events.map(async (event: any) => ({
        eventId: event.eventId,
        eventType,
        encryptedData: event.encryptedData,
        timestamp: event.timestamp,
        isVerified: event.isVerified,
        decryptedData: await decryptData(event.encryptedData, address),
      }))
    );
    
    console.log('✅ Retrieved', decryptedEvents.length, 'memories');
    return decryptedEvents;
  } catch (error) {
    console.error('❌ Failed to retrieve memories:', error);
    throw error;
  }
}

// Authorize caregiver
export async function authorizeCaregiver(
  caregiverId: string,
  accessLevel: 'full' | 'medical' | 'emergency' | 'readonly',
  durationDays: number
): Promise<string> {
  const contract = await initContract();
  const address = getWalletAddress();
  
  if (!address) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const accessLevelMap = {
      full: 0,
      medical: 1,
      emergency: 2,
      readonly: 3,
    };
    
    const tx = await contract.authorizeCaregiver(
      caregiverId,
      accessLevelMap[accessLevel],
      durationDays
    );
    
    const signedTx = await signTransaction(tx);
    const receipt = await signedTx.wait();
    
    console.log('✅ Caregiver authorized:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('❌ Failed to authorize caregiver:', error);
    throw error;
  }
}

// Revoke caregiver access
export async function revokeCaregiver(caregiverId: string): Promise<string> {
  const contract = await initContract();
  const address = getWalletAddress();
  
  if (!address) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const tx = await contract.revokeAccess(caregiverId);
    const signedTx = await signTransaction(tx);
    const receipt = await signedTx.wait();
    
    console.log('✅ Caregiver access revoked:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('❌ Failed to revoke access:', error);
    throw error;
  }
}

// Get audit trail
export async function getAuditTrail(
  dateRange?: { start: Date; end: Date }
): Promise<AuditEntry[]> {
  const contract = await initContract();
  
  try {
    const startTime = dateRange?.start.getTime() || 0;
    const endTime = dateRange?.end.getTime() || Date.now();
    
    const auditLog = await contract.getAuditLog(startTime, endTime);
    
    console.log('✅ Retrieved', auditLog.length, 'audit entries');
    return auditLog;
  } catch (error) {
    console.error('❌ Failed to get audit trail:', error);
    throw error;
  }
}

// Get contract stats
export async function getContractStats() {
  const contract = await initContract();
  
  try {
    const [totalEvents, totalCaregivers, lastUpdated] = await contract.getStats();
    
    return {
      totalEvents: totalEvents.toNumber(),
      totalCaregivers: totalCaregivers.toNumber(),
      lastUpdated: new Date(lastUpdated.toNumber()),
    };
  } catch (error) {
    console.error('❌ Failed to get stats:', error);
    throw error;
  }
}
```

---

### Task 4: Encryption Utilities (3-4 hours)

**Create:** `src/midnight/lib/crypto.ts`

```typescript
import { encrypt as midnightEncrypt, decrypt as midnightDecrypt } from '@midnight-ntwrk/zswap';

// Encrypt data before storing on-chain
export async function encryptData(
  data: any,
  publicKey: string
): Promise<string> {
  try {
    const jsonData = JSON.stringify(data);
    const encrypted = await midnightEncrypt(jsonData, publicKey);
    return encrypted;
  } catch (error) {
    console.error('❌ Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt retrieved data
export async function decryptData(
  encryptedData: string,
  privateKey: string
): Promise<any> {
  try {
    const decrypted = await midnightDecrypt(encryptedData, privateKey);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('❌ Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Generate ZK proof
export async function generateProof(witness: any): Promise<any> {
  try {
    // This is a simplified version
    // In production, use Midnight's proof generation
    console.log('🔄 Generating ZK proof...');
    
    // Simulate proof generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const proof = {
      witness,
      timestamp: Date.now(),
      signature: 'proof-signature',
    };
    
    console.log('✅ ZK proof generated');
    return proof;
  } catch (error) {
    console.error('❌ Proof generation failed:', error);
    throw new Error('Failed to generate proof');
  }
}

// Verify proof
export async function verifyProof(
  proof: any,
  publicInputs: any[]
): Promise<boolean> {
  try {
    // Simplified verification
    // In production, use Midnight's proof verification
    console.log('🔄 Verifying ZK proof...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Proof verified');
    return true;
  } catch (error) {
    console.error('❌ Proof verification failed:', error);
    return false;
  }
}
```

---

### Task 5: Storage Abstraction Layer (4-5 hours)

**Create:** `src/lib/storage.ts`

```typescript
import { supabase } from './supabase';
import {
  storePersonMemory as storeMidnightPerson,
  storeObjectMemory as storeMidnightObject,
  storeSpeechEvent as storeMidnightSpeech,
} from '../midnight/lib/contract';

// Unified storage interface
export async function storePersonMemory(
  data: {
    name: string;
    relationship: string;
    note: string;
    image_url?: string;
    face_descriptor?: number[];
  },
  useMidnight: boolean
): Promise<string> {
  if (useMidnight) {
    // Store on Midnight blockchain
    return await storeMidnightPerson(
      data.name,
      data.relationship,
      data.face_descriptor || [],
      data.image_url || ''
    );
  } else {
    // Store on Supabase
    const { data: result, error } = await supabase
      .from('people')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  }
}

export async function storeObjectMemory(
  data: {
    coco_class: string;
    custom_label: string;
  },
  useMidnight: boolean
): Promise<string> {
  if (useMidnight) {
    return await storeMidnightObject(
      data.coco_class,
      data.custom_label,
      { x: 0, y: 0 } // TODO: Add actual location
    );
  } else {
    const { data: result, error } = await supabase
      .from('objects')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  }
}

export async function storeSpeechMemory(
  data: {
    transcript: string;
    extracted_names: string[];
  },
  useMidnight: boolean
): Promise<string> {
  if (useMidnight) {
    return await storeMidnightSpeech(
      data.transcript,
      data.extracted_names,
      Date.now()
    );
  } else {
    const { data: result, error } = await supabase
      .from('speech_events')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  }
}
```

---

## ✅ Checklist

- [ ] Provider setup complete
- [ ] Wallet integration working
- [ ] Contract interaction layer complete
- [ ] Encryption utilities implemented
- [ ] Storage abstraction layer created
- [ ] Integration with existing code
- [ ] End-to-end tests passing
- [ ] API documentation written
- [ ] Shared with Person 1 (Frontend)

---

## 📚 Resources

- [Midnight.js SDK](https://docs.midnight.network/guides/compact-javascript-runtime)
- [1AM Wallet Docs](https://docs.midnight.network/how-to/1am-wallet)
- Midnight Skills: `.kiro/skills/Midnight-skills/midnight-js/`

---

## 🐛 Common Issues

**Issue:** Provider connection fails
- Check network configuration
- Verify proof server URL
- Check firewall settings

**Issue:** Wallet not detected
- Ensure 1AM extension is installed
- Check browser compatibility
- Try refreshing the page

**Issue:** Transaction fails
- Check wallet has DUST tokens
- Verify contract address is correct
- Check gas limits

---

## 📞 Need Help?

- Check Person 2's contract documentation
- Review Midnight.js skills folder
- Ask in team chat with `@contract`

---

**Good luck! 🔌**
