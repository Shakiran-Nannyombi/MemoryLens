import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum EventType { FaceDetected = 0,
                        ObjectLocated = 1,
                        ConversationRecorded = 2,
                        LocationTracked = 3
}

export enum AccessLevel { Full = 0, Medical = 1, Emergency = 2, ReadOnly = 3 }

export type Witnesses<PS> = {
  patientSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  caregiverSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  caregiverPublicKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  storeMemory(context: __compactRuntime.CircuitContext<PS>,
              eventType_0: EventType,
              encryptedData_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  authorizeCaregiver(context: __compactRuntime.CircuitContext<PS>,
                     accessLevel_0: AccessLevel,
                     durationDays_0: bigint,
                     timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, boolean>;
  verifyAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  logMemoryAccess(context: __compactRuntime.CircuitContext<PS>,
                  eventCommit_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getStats(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                               bigint,
                                                                                               bigint]>;
}

export type ProvableCircuits<PS> = {
  storeMemory(context: __compactRuntime.CircuitContext<PS>,
              eventType_0: EventType,
              encryptedData_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  authorizeCaregiver(context: __compactRuntime.CircuitContext<PS>,
                     accessLevel_0: AccessLevel,
                     durationDays_0: bigint,
                     timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, boolean>;
  verifyAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  logMemoryAccess(context: __compactRuntime.CircuitContext<PS>,
                  eventCommit_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getStats(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [bigint,
                                                                                               bigint,
                                                                                               bigint]>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  storeMemory(context: __compactRuntime.CircuitContext<PS>,
              eventType_0: EventType,
              encryptedData_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  authorizeCaregiver(context: __compactRuntime.CircuitContext<PS>,
                     accessLevel_0: AccessLevel,
                     durationDays_0: bigint,
                     timestamp_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  revokeAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, boolean>;
  verifyAccess(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, bigint>;
  logMemoryAccess(context: __compactRuntime.CircuitContext<PS>,
                  eventCommit_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getStats(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, [bigint,
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

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initialPatientCommitment_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
