/**
 * index.ts — barrel file for the compiled PatientMemory contract.
 *
 * This file imports from the Compact compiler output in `managed/PatientMemory/`.
 * It will NOT resolve until you run:
 *
 *   cd frontend/src/midnight/contracts
 *   compact compile PatientMemory.compact managed/PatientMemory
 *
 * After compilation, the managed/ directory contains:
 *   managed/PatientMemory/contract/index.js   ← TypeScript bindings
 *   managed/PatientMemory/keys/               ← Prover/verifier keys
 *   managed/PatientMemory/zkir/               ← ZK intermediate representation
 *
 * Usage (integration layer):
 *   import { CompiledPatientMemoryContract, ledger, zkConfigPath } from
 *     './midnight/contracts/index.js';
 */

import { CompiledContract } from '@midnight-ntwrk/compact-runtime';

export {
  Contract,
  ledger,
  pureCircuits,
  type Ledger,
  type ImpureCircuits,
  type PureCircuits,
} from './managed/PatientMemory/contract/index.js';

import { Contract } from './managed/PatientMemory/contract/index.js';

/**
 * Relative path to the managed/ output directory.
 * In a browser environment, this is used as a reference path for loading
 * compiled assets. The actual loading mechanism depends on the runtime provider.
 */
export const zkConfigPath = './managed/PatientMemory';

/**
 * Compiled contract instance ready for deployment and circuit calls.
 *
 * - `withVacantWitnesses` means witnesses are provided at call time via the
 *   providers object (see PatientMemoryWitnesses in types/contract.ts).
 * - `withCompiledFileAssets` loads the prover/verifier keys from the managed directory.
 *
 * Note: In a browser environment, you may need to use a different asset loading
 * strategy depending on your build tool and Midnight SDK version.
 */
export const CompiledPatientMemoryContract = CompiledContract.make(
  'PatientMemoryContract',
  Contract,
).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);
