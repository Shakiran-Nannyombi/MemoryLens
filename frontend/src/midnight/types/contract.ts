/**
 * contract.ts
 * TypeScript type definitions for the PatientMemory Compact contract.
 *
 * These types mirror the on-chain ledger state and circuit signatures so that
 * Person 3 (backend/integration) can wire up the Midnight.js SDK without
 * waiting for the compiler to generate bindings.
 *
 * Once the contract is compiled, import the generated `Ledger`, `ImpureCircuits`,
 * and `PureCircuits` types from:
 *   src/midnight/contracts/managed/PatientMemory/contract/index.js
 *
 * The hand-written types below are intentionally kept in sync with those
 * generated types and serve as documentation + fallback.
 */

// ---------------------------------------------------------------------------
// Enums  (match the Compact enum variants exactly)
// ---------------------------------------------------------------------------

export enum EventType {
  FaceDetected = 0,
  ObjectLocated = 1,
  ConversationRecorded = 2,
  LocationTracked = 3,
}

export enum AccessLevel {
  Full = 0,
  Medical = 1,
  Emergency = 2,
  ReadOnly = 3,
  Revoked = 255, // sentinel value written by revokeAccess()
}

// ---------------------------------------------------------------------------
// On-chain ledger state  (public, readable by anyone)
// ---------------------------------------------------------------------------

/**
 * Snapshot of the PatientMemory contract's public ledger state.
 * Returned by `providers.publicDataProvider.queryContractState(address)`.
 */
export interface PatientMemoryLedger {
  /** Monotonically increasing count of stored memory events. */
  totalEvents: bigint;

  /** Count of currently authorized (non-revoked) caregivers. */
  totalCaregivers: bigint;

  /** Unix timestamp (seconds) of the last state-changing transaction. */
  lastUpdated: bigint;

  /** Semantic version string, padded to 32 bytes. Always "1.0.0" for v1. */
  contractVersion: Uint8Array;

  /**
   * Commitment to the patient's identity.
   * = persistentHash(["memorylens:patient:v1", patientSecretKey])
   * Set once in the constructor; never changes.
   */
  patientCommitment: Uint8Array;

  /**
   * Set of event commitment hashes.
   * Each = persistentHash([eventTypeBytes, encryptedData, timestampBytes])
   */
  eventCommitments: Set<string>; // hex-encoded Bytes<32>

  /**
   * Map from caregiver commitment hash → access level code.
   * Key   = persistentHash(["memorylens:caregiver:v1", caregiverPublicKey])
   * Value = 0 (Full) | 1 (Medical) | 2 (Emergency) | 3 (ReadOnly) | 255 (Revoked)
   */
  caregiverAccessLevels: Map<string, number>; // hex key → AccessLevel code

  /**
   * Set of audit entry commitment hashes.
   * Append-only; each entry proves an action occurred without revealing details.
   */
  auditCommitments: Set<string>; // hex-encoded Bytes<32>
}

// ---------------------------------------------------------------------------
// Circuit argument / return types
// ---------------------------------------------------------------------------

/** Arguments for the `storeMemory` circuit. */
export interface StoreMemoryArgs {
  /** Category of the memory event. */
  eventType: EventType;
  /**
   * 32-byte fingerprint / hash of the client-side encrypted payload.
   * The actual encrypted blob is stored off-chain (Supabase); only this
   * commitment goes on-chain.
   */
  encryptedData: Uint8Array;
  /** Unix timestamp in seconds. */
  timestamp: bigint;
}

/** Return value of `storeMemory`: the event commitment hash (32 bytes). */
export type EventCommitment = Uint8Array;

/** Arguments for the `authorizeCaregiver` circuit. */
export interface AuthorizeCaregiverArgs {
  /** Access level to grant. */
  accessLevel: AccessLevel;
  /**
   * How many days the authorization should be valid.
   * Expiry is enforced off-chain by the DApp; the contract stores the
   * commitment indefinitely (revoke explicitly when needed).
   */
  durationDays: bigint;
  /** Unix timestamp in seconds (used for lastUpdated and audit). */
  timestamp: bigint;
}

/** Return value of `authorizeCaregiver`: the caregiver commitment hash (32 bytes). */
export type CaregiverCommitment = Uint8Array;

/** Arguments for the `logMemoryAccess` circuit. */
export interface LogMemoryAccessArgs {
  /** The event commitment hash returned by `storeMemory`. */
  eventCommit: Uint8Array;
  /** Unix timestamp of the access in seconds. */
  timestamp: bigint;
}

/** Return value of `getStats`. */
export interface ContractStats {
  totalEvents: bigint;
  totalCaregivers: bigint;
  lastUpdated: bigint;
}

// ---------------------------------------------------------------------------
// Witness context helpers  (used when implementing witness bodies in TS)
// ---------------------------------------------------------------------------

/**
 * Shape of the witness context object passed to each witness function
 * by the Midnight.js runtime.
 *
 * The actual type comes from `@midnight-ntwrk/compact-runtime`.
 * This interface documents the fields we use.
 */
export interface PatientMemoryWitnessContext {
  /** Current on-chain ledger state snapshot. */
  ledger: PatientMemoryLedger;
  /** The calling wallet's coin public key (32 bytes). */
  coinPublicKey: Uint8Array;
}

/**
 * Witness implementations for the PatientMemory contract.
 * Pass this object to `CompiledContract.withWitnesses(witnesses)` when
 * building the contract instance in Person 3's integration layer.
 */
export interface PatientMemoryWitnesses {
  /**
   * Returns the patient's 32-byte secret key.
   * Only called when the patient is performing an action (storeMemory,
   * authorizeCaregiver, revokeAccess).
   */
  patientSecretKey: (context: PatientMemoryWitnessContext) => Uint8Array;

  /**
   * Returns the calling caregiver's 32-byte secret key.
   * Only called when a caregiver is performing an action (verifyAccess,
   * logMemoryAccess).
   */
  caregiverSecretKey: (context: PatientMemoryWitnessContext) => Uint8Array;

  /**
   * Returns the caregiver's 32-byte public key (their identity).
   * Used by authorizeCaregiver and revokeAccess to derive the on-chain
   * commitment without revealing the key itself.
   */
  caregiverPublicKey: (context: PatientMemoryWitnessContext) => Uint8Array;
}

// ---------------------------------------------------------------------------
// Deployment helpers
// ---------------------------------------------------------------------------

/**
 * Arguments passed to `deployContract` when deploying PatientMemory.
 * `initialPatientCommitment` is the only constructor argument.
 *
 * Compute it off-chain before deploying:
 *   persistentHash(["memorylens:patient:v1", patientSecretKey])
 */
export interface PatientMemoryDeployArgs {
  /** 32-byte commitment derived from the patient's secret key. */
  initialPatientCommitment: Uint8Array;
}

/** Identifier used for the private state store (must be unique per deployment). */
export const PATIENT_MEMORY_PRIVATE_STATE_ID = 'PatientMemoryPrivateState';

// ---------------------------------------------------------------------------
// Utility: access level helpers
// ---------------------------------------------------------------------------

/** Convert an on-chain access level code back to the enum. */
export function decodeAccessLevel(code: number): AccessLevel {
  switch (code) {
    case 0:   return AccessLevel.Full;
    case 1:   return AccessLevel.Medical;
    case 2:   return AccessLevel.Emergency;
    case 3:   return AccessLevel.ReadOnly;
    case 255: return AccessLevel.Revoked;
    default:  throw new Error(`Unknown access level code: ${code}`);
  }
}

/** Human-readable label for an access level. */
export function accessLevelLabel(level: AccessLevel): string {
  switch (level) {
    case AccessLevel.Full:      return 'Full Access';
    case AccessLevel.Medical:   return 'Medical Only';
    case AccessLevel.Emergency: return 'Emergency Only';
    case AccessLevel.ReadOnly:  return 'Read Only';
    case AccessLevel.Revoked:   return 'Revoked';
  }
}

/** Human-readable label for an event type. */
export function eventTypeLabel(type: EventType): string {
  switch (type) {
    case EventType.FaceDetected:         return 'Face Detected';
    case EventType.ObjectLocated:        return 'Object Located';
    case EventType.ConversationRecorded: return 'Conversation Recorded';
    case EventType.LocationTracked:      return 'Location Tracked';
  }
}
