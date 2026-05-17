import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  caregiverPublicKey(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  authorizeCaregiver(context: __compactRuntime.CircuitContext<T>,
                     accessLevel_0: bigint,
                     durationDays_0: bigint): __compactRuntime.CircuitResults<T, Uint8Array>;
  registerCaregiver(context: __compactRuntime.CircuitContext<T>,
                    cgCommit_0: Uint8Array,
                    accessLevel_0: bigint): __compactRuntime.CircuitResults<T, []>;
  finalizeCaregiverAudit(context: __compactRuntime.CircuitContext<T>,
                         cgCommit_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  finalizeCaregiverMetadata(context: __compactRuntime.CircuitContext<T>,
                            timestamp_0: bigint): __compactRuntime.CircuitResults<T, []>;
  storeMemory(context: __compactRuntime.CircuitContext<T>,
              eventType_0: bigint,
              encryptedData_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<T, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<T>,
               cgCommit_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
  verifyAccess(context: __compactRuntime.CircuitContext<T>,
               cgCommit_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
  logMemoryAccess(context: __compactRuntime.CircuitContext<T>,
                  cgCommit_0: Uint8Array,
                  eventCommit_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<T, []>;
  getStats(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, [bigint,
                                                                                             bigint,
                                                                                             bigint]>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  authorizeCaregiver(context: __compactRuntime.CircuitContext<T>,
                     accessLevel_0: bigint,
                     durationDays_0: bigint): __compactRuntime.CircuitResults<T, Uint8Array>;
  registerCaregiver(context: __compactRuntime.CircuitContext<T>,
                    cgCommit_0: Uint8Array,
                    accessLevel_0: bigint): __compactRuntime.CircuitResults<T, []>;
  finalizeCaregiverAudit(context: __compactRuntime.CircuitContext<T>,
                         cgCommit_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  finalizeCaregiverMetadata(context: __compactRuntime.CircuitContext<T>,
                            timestamp_0: bigint): __compactRuntime.CircuitResults<T, []>;
  storeMemory(context: __compactRuntime.CircuitContext<T>,
              eventType_0: bigint,
              encryptedData_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<T, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<T>,
               cgCommit_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<T, boolean>;
  verifyAccess(context: __compactRuntime.CircuitContext<T>,
               cgCommit_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
  logMemoryAccess(context: __compactRuntime.CircuitContext<T>,
                  cgCommit_0: Uint8Array,
                  eventCommit_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<T, []>;
  getStats(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, [bigint,
                                                                                             bigint,
                                                                                             bigint]>;
}

export type Ledger = {
  readonly totalEvents: bigint;
  readonly totalCaregivers: bigint;
  readonly lastUpdated: bigint;
  readonly contractVersion: Uint8Array;
  readonly patientCommitment: Uint8Array;
  eventCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  caregiverAccessLevels: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  auditCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>,
               initialPatientCommitment_0: Uint8Array): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
