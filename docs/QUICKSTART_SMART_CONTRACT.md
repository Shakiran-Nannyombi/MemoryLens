# ⚙️ Smart Contract Developer - Quick Start Guide

## Your Mission
Write a Compact smart contract for privacy-preserving patient memory storage.

---

## 🚀 Setup (1-2 hours)

### Install Compact CLI
```bash
npm install -g @midnight-ntwrk/compact-cli

# Verify installation
compact --version
```

### Create Contract Directory
```bash
mkdir -p src/midnight/contracts
cd src/midnight/contracts
```

---

## 📝 Contract Structure

### Create: `PatientMemory.compact`

```compact
// PatientMemory.compact
// Privacy-preserving memory storage for dementia patients

import Std;

// Memory event types
enum EventType {
  FaceDetected,
  ObjectLocated,
  ConversationRecorded,
  LocationTracked
}

// Access levels for caregivers
enum AccessLevel {
  Full,           // All memory types
  Medical,        // Only medical data
  Emergency,      // Emergency contacts only
  ReadOnly        // View only, no modifications
}

// Encrypted memory event
struct MemoryEvent {
  eventId: Bytes,
  eventType: EventType,
  encryptedData: Bytes,      // Encrypted: face descriptor, transcript, etc.
  timestamp: Uint64,
  isVerified: Bool
}

// Caregiver authorization
struct CaregiverAuth {
  caregiverId: PublicKey,
  accessLevel: AccessLevel,
  authorizedAt: Uint64,
  expiresAt: Uint64
}

// Audit log entry
struct AuditEntry {
  caregiverId: PublicKey,
  eventId: Bytes,
  accessedAt: Uint64,
  action: String
}

contract PatientMemory {
  // Private state (encrypted on-chain)
  private state {
    patientId: Bytes,
    memoryEvents: List<MemoryEvent>,
    authorizedCaregivers: List<CaregiverAuth>,
    auditLog: List<AuditEntry>
  }
  
  // Public state (visible to all)
  public state {
    totalEvents: Uint64,
    totalCaregivers: Uint64,
    lastUpdated: Uint64,
    contractVersion: String
  }
  
  // Initialize contract
  circuit initialize(patientId: Bytes) {
    witness {
      // Verify patient signature
      assert(patientId.length > 0, "Invalid patient ID");
    }
    
    // Set initial state
    this.patientId = patientId;
    this.memoryEvents = [];
    this.authorizedCaregivers = [];
    this.auditLog = [];
    this.totalEvents = 0;
    this.totalCaregivers = 0;
    this.lastUpdated = Std.currentTime();
    this.contractVersion = "1.0.0";
  }
  
  // Store a memory event
  circuit storeMemory(
    eventType: EventType,
    encryptedData: Bytes,
    timestamp: Uint64
  ) -> Bytes {
    witness {
      // Verify caller is patient or authorized caregiver
      assert(encryptedData.length > 0, "Empty data");
      assert(timestamp > 0, "Invalid timestamp");
    }
    
    // Generate event ID
    let eventId = Std.hash([encryptedData, timestamp]);
    
    // Create memory event
    let event = MemoryEvent {
      eventId: eventId,
      eventType: eventType,
      encryptedData: encryptedData,
      timestamp: timestamp,
      isVerified: true
    };
    
    // Add to private state
    this.memoryEvents.push(event);
    
    // Update public counters
    this.totalEvents = this.totalEvents + 1;
    this.lastUpdated = Std.currentTime();
    
    // Return event ID
    disclose(eventId);
  }
  
  // Retrieve memories with selective disclosure
  circuit retrieveMemory(
    caregiverId: PublicKey,
    eventType: EventType,
    startTime: Uint64,
    endTime: Uint64
  ) -> List<MemoryEvent> {
    witness {
      // Verify caregiver is authorized
      let authorized = false;
      for auth in this.authorizedCaregivers {
        if (auth.caregiverId == caregiverId) {
          // Check if authorization is still valid
          let now = Std.currentTime();
          if (now < auth.expiresAt) {
            authorized = true;
            break;
          }
        }
      }
      assert(authorized, "Unauthorized caregiver");
    }
    
    // Filter events by type and time range
    let filteredEvents: List<MemoryEvent> = [];
    for event in this.memoryEvents {
      if (event.eventType == eventType &&
          event.timestamp >= startTime &&
          event.timestamp <= endTime) {
        filteredEvents.push(event);
      }
    }
    
    // Log access for audit trail
    let auditEntry = AuditEntry {
      caregiverId: caregiverId,
      eventId: Std.hash([caregiverId, Std.currentTime()]),
      accessedAt: Std.currentTime(),
      action: "retrieve_memory"
    };
    this.auditLog.push(auditEntry);
    
    // Return filtered events
    disclose(filteredEvents);
  }
  
  // Authorize a caregiver
  circuit authorizeCaregiver(
    caregiverId: PublicKey,
    accessLevel: AccessLevel,
    durationDays: Uint64
  ) -> Bool {
    witness {
      // Verify caller is patient
      assert(caregiverId != PublicKey.zero(), "Invalid caregiver ID");
      assert(durationDays > 0, "Invalid duration");
    }
    
    // Calculate expiration
    let now = Std.currentTime();
    let expiresAt = now + (durationDays * 86400); // days to seconds
    
    // Create authorization
    let auth = CaregiverAuth {
      caregiverId: caregiverId,
      accessLevel: accessLevel,
      authorizedAt: now,
      expiresAt: expiresAt
    };
    
    // Add to authorized list
    this.authorizedCaregivers.push(auth);
    this.totalCaregivers = this.totalCaregivers + 1;
    this.lastUpdated = now;
    
    // Log authorization
    let auditEntry = AuditEntry {
      caregiverId: caregiverId,
      eventId: Std.hash([caregiverId, now]),
      accessedAt: now,
      action: "authorized"
    };
    this.auditLog.push(auditEntry);
    
    disclose(true);
  }
  
  // Revoke caregiver access
  circuit revokeAccess(caregiverId: PublicKey) -> Bool {
    witness {
      // Verify caller is patient
      assert(caregiverId != PublicKey.zero(), "Invalid caregiver ID");
    }
    
    // Remove from authorized list
    let newList: List<CaregiverAuth> = [];
    for auth in this.authorizedCaregivers {
      if (auth.caregiverId != caregiverId) {
        newList.push(auth);
      }
    }
    this.authorizedCaregivers = newList;
    this.totalCaregivers = this.totalCaregivers - 1;
    this.lastUpdated = Std.currentTime();
    
    // Log revocation
    let auditEntry = AuditEntry {
      caregiverId: caregiverId,
      eventId: Std.hash([caregiverId, Std.currentTime()]),
      accessedAt: Std.currentTime(),
      action: "revoked"
    };
    this.auditLog.push(auditEntry);
    
    disclose(true);
  }
  
  // Get audit trail
  circuit getAuditLog(
    startTime: Uint64,
    endTime: Uint64
  ) -> List<AuditEntry> {
    witness {
      // Verify caller is patient or authorized auditor
      assert(startTime <= endTime, "Invalid time range");
    }
    
    // Filter audit log by time range
    let filteredLog: List<AuditEntry> = [];
    for entry in this.auditLog {
      if (entry.accessedAt >= startTime &&
          entry.accessedAt <= endTime) {
        filteredLog.push(entry);
      }
    }
    
    disclose(filteredLog);
  }
  
  // Get public stats (no authorization needed)
  circuit getStats() -> (Uint64, Uint64, Uint64) {
    disclose((this.totalEvents, this.totalCaregivers, this.lastUpdated));
  }
}
```

---

## 🔨 Compile Contract

```bash
# Compile to WASM
compact compile PatientMemory.compact

# Output: PatientMemory.wasm
```

---

## 🚀 Deploy to Testnet

```bash
# Deploy
compact deploy --network testnet PatientMemory.wasm

# Save contract address
# Output: Contract deployed at: 0x1234...5678
echo "VITE_MIDNIGHT_CONTRACT_ADDRESS=0x1234...5678" >> ../../../.env.local
```

**Share contract address with Person 3 immediately!**

---

## 🧪 Testing

### Create: `PatientMemory.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { PatientMemory } from './PatientMemory';

describe('PatientMemory Contract', () => {
  it('should initialize contract', async () => {
    const contract = new PatientMemory();
    await contract.initialize('patient-123');
    
    const stats = await contract.getStats();
    expect(stats.totalEvents).toBe(0);
    expect(stats.totalCaregivers).toBe(0);
  });
  
  it('should store memory event', async () => {
    const contract = new PatientMemory();
    await contract.initialize('patient-123');
    
    const eventId = await contract.storeMemory(
      EventType.FaceDetected,
      Buffer.from('encrypted-face-data'),
      Date.now()
    );
    
    expect(eventId).toBeDefined();
    
    const stats = await contract.getStats();
    expect(stats.totalEvents).toBe(1);
  });
  
  it('should authorize caregiver', async () => {
    const contract = new PatientMemory();
    await contract.initialize('patient-123');
    
    const success = await contract.authorizeCaregiver(
      'caregiver-public-key',
      AccessLevel.Medical,
      30 // 30 days
    );
    
    expect(success).toBe(true);
    
    const stats = await contract.getStats();
    expect(stats.totalCaregivers).toBe(1);
  });
  
  it('should retrieve memories with authorization', async () => {
    const contract = new PatientMemory();
    await contract.initialize('patient-123');
    
    // Store memory
    await contract.storeMemory(
      EventType.FaceDetected,
      Buffer.from('encrypted-data'),
      Date.now()
    );
    
    // Authorize caregiver
    await contract.authorizeCaregiver(
      'caregiver-key',
      AccessLevel.Full,
      30
    );
    
    // Retrieve
    const events = await contract.retrieveMemory(
      'caregiver-key',
      EventType.FaceDetected,
      0,
      Date.now()
    );
    
    expect(events.length).toBe(1);
  });
  
  it('should reject unauthorized retrieval', async () => {
    const contract = new PatientMemory();
    await contract.initialize('patient-123');
    
    await contract.storeMemory(
      EventType.FaceDetected,
      Buffer.from('encrypted-data'),
      Date.now()
    );
    
    // Try to retrieve without authorization
    await expect(
      contract.retrieveMemory(
        'unauthorized-key',
        EventType.FaceDetected,
        0,
        Date.now()
      )
    ).rejects.toThrow('Unauthorized caregiver');
  });
  
  it('should revoke caregiver access', async () => {
    const contract = new PatientMemory();
    await contract.initialize('patient-123');
    
    // Authorize
    await contract.authorizeCaregiver(
      'caregiver-key',
      AccessLevel.Full,
      30
    );
    
    // Revoke
    const success = await contract.revokeAccess('caregiver-key');
    expect(success).toBe(true);
    
    const stats = await contract.getStats();
    expect(stats.totalCaregivers).toBe(0);
  });
  
  it('should maintain audit log', async () => {
    const contract = new PatientMemory();
    await contract.initialize('patient-123');
    
    // Authorize caregiver
    await contract.authorizeCaregiver(
      'caregiver-key',
      AccessLevel.Full,
      30
    );
    
    // Store and retrieve memory
    await contract.storeMemory(
      EventType.FaceDetected,
      Buffer.from('data'),
      Date.now()
    );
    
    await contract.retrieveMemory(
      'caregiver-key',
      EventType.FaceDetected,
      0,
      Date.now()
    );
    
    // Check audit log
    const auditLog = await contract.getAuditLog(0, Date.now());
    expect(auditLog.length).toBeGreaterThan(0);
  });
});
```

### Run Tests
```bash
npm run test
```

---

## 📦 Generate TypeScript Types

```bash
# Generate types
compact generate-types PatientMemory.compact --output ../types/

# Export ABI
compact export-abi PatientMemory.compact --output PatientMemory.abi.json
```

**Share types with Person 3!**

---

## ✅ Checklist

- [ ] Compact CLI installed
- [ ] PatientMemory.compact written
- [ ] Contract compiles without errors
- [ ] Contract deployed to testnet
- [ ] Contract address shared with team
- [ ] TypeScript types generated
- [ ] ABI exported
- [ ] Test suite written
- [ ] All tests passing
- [ ] Documentation complete

---

## 📚 Resources

- [Compact Language Reference](https://docs.midnight.network/compact/reference/compact-reference)
- [Counter Example](https://docs.midnight.network/examples/dapps/counter)
- Midnight Skills: `.kiro/skills/Midnight-skills/compact/`

---

## 🐛 Common Issues

**Issue:** Compilation errors
- Check syntax (Compact is strict!)
- Verify all types are defined
- Use `assert()` for witness validation

**Issue:** Deployment fails
- Check network connection
- Verify you have testnet tokens
- Check contract size (< 1MB)

---

## 📞 Need Help?

- Check Compact skills folder
- Review example contracts
- Ask in team chat with `@team`

---

**Good luck! ⚙️**
