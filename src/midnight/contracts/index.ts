/**
 * index.ts — barrel file for the compiled PatientMemory contract.
 *
 * This file imports from the Compact compiler output in `managed/PatientMemory/`.
 * It will NOT resolve until you run:
 *
 *   cd src/midnight/contracts
 *   compact compile PatientMemory.compact managed/PatientMemory
 *
 * After compilation, the managed/ directory contains:
 *   managed/PatientMemory/contract/index.js   ← TypeScript bindings
 *   managed/PatientMemory/keys/               ← Prover/verifier keys
 *   managed/PatientMemory/zkir/               ← ZK intermediate representation
 *
 * Usage (Person 3 integration layer):
 *   import { CompiledPatientMemoryContract, ledger, zkConfigPath } from
 *     '../contracts/index.js';
 */

import { CompiledContract } from '@midnight-ntwrk/compact-runtime';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export {
  Contract,
  ledger,
  pureCircuits,
  type Ledger,
  type ImpureCircuits,
  type PureCircuits,
} from './managed/PatientMemory/contract/index.js';

import { Contract } from './managed/PatientMemory/contract/index.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the managed/ output directory (used by NodeZkConfigProvider). */
export const zkConfigPath = path.resolve(currentDir, 'managed', 'PatientMemory');

/**
 * Compiled contract instance ready for deployment and circuit calls.
 *
 * - `withVacantWitnesses` means witnesses are provided at call time via the
 *   providers object (see PatientMemoryWitnesses in types/contract.ts).
 * - `withCompiledFileAssets` loads the prover/verifier keys from disk.
 */
export const CompiledPatientMemoryContract = CompiledContract.make(
  'PatientMemoryContract',
  Contract,
).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);
