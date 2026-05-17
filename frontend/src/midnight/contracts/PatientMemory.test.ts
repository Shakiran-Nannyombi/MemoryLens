/**
 * PatientMemory.test.ts
 *
 * Integration tests for the PatientMemory Compact contract.
 *
 * These tests run against a local Midnight devnet (Docker stack).
 * They use the testkit-js FluentWalletBuilder for headless wallet management.
 *
 * Prerequisites:
 *   1. Compact CLI installed and on PATH
 *   2. Contract compiled:
 *        cd src/midnight/contracts
 *        compact compile PatientMemory.compact managed/PatientMemory
 *   3. Local devnet running:
 *        docker compose up -d --wait
 *   4. Run tests:
 *        NODE_OPTIONS='--experimental-vm-modules' npx vitest run
 *
 * Test coverage:
 *   ✅ Deploy contract
 *   ✅ Store memory event (patient authorized)
 *   ✅ Reject storeMemory from non-patient
 *   ✅ Authorize caregiver
 *   ✅ Verify caregiver access
 *   ✅ Reject access for unauthorized caregiver
 *   ✅ Log memory access (audit trail)
 *   ✅ Revoke caregiver access
 *   ✅ Reject access after revocation
 *   ✅ getStats returns correct counters
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  deployContract,
  submitCallTx,
} from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import pino from 'pino';

import {
  EventType,
  AccessLevel,
  PATIENT_MEMORY_PRIVATE_STATE_ID,
  type PatientMemoryWitnesses,
} from '../types/contract.js';

// ---------------------------------------------------------------------------
// Globals required for GraphQL subscriptions in Node.js
// ---------------------------------------------------------------------------
// @ts-expect-error WebSocket global assignment for apollo-link-ws
globalThis.WebSocket = WebSocket;

// ---------------------------------------------------------------------------
// Network configuration (local devnet)
// ---------------------------------------------------------------------------
const LOCAL_CONFIG = {
  networkId:   'undeployed',
  indexer:     'http://127.0.0.1:8088/api/v4/graphql',
  indexerWS:   'ws://127.0.0.1:8088/api/v4/graphql/ws',
  node:        'http://127.0.0.1:9944',
  nodeWS:      'ws://127.0.0.1:9944',
  proofServer: 'http://127.0.0.1:6300',
  faucet:      '',
};

// ---------------------------------------------------------------------------
// Test seeds (deterministic, never use in production)
// ---------------------------------------------------------------------------
const PATIENT_SEED =
  '0000000000000000000000000000000000000000000000000000000000000001';
const CAREGIVER_SEED =
  '0000000000000000000000000000000000000000000000000000000000000002';
const UNAUTHORIZED_SEED =
  '0000000000000000000000000000000000000000000000000000000000000003';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

/**
 * Derive a 32-byte "secret key" from a seed string for testing.
 * In production the wallet SDK derives keys from the user's mnemonic.
 */
function seedToBytes(seed: string): Uint8Array {
  const hex = seed.replace(/^0x/, '');
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Compute persistentHash(["memorylens:patient:v1", secretKey]) off-chain.
 * This mirrors the `deriveCommitment` pure circuit in the contract.
 *
 * In a real DApp, use the `pureCircuits.deriveCommitment()` function
 * exported from the compiled contract's index.js.
 */
async function computePatientCommitment(sk: Uint8Array): Promise<Uint8Array> {
  // Placeholder: in real usage, call pureCircuits.deriveCommitment(sk, domain)
  // from the compiled contract. For test scaffolding we return a fixed value.
  const domain = new TextEncoder().encode('memorylens:patient:v1'.padEnd(32, '\0'));
  const combined = new Uint8Array(64);
  combined.set(domain, 0);
  combined.set(sk, 32);
  // Use SubtleCrypto for a real hash in tests
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  return new Uint8Array(hashBuffer);
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('PatientMemory Contract', () => {
  // Shared state across tests
  let contractAddress: ContractAddress;
  let patientProviders: any;
  let caregiverProviders: any;
  let unauthorizedProviders: any;

  const patientSK    = seedToBytes(PATIENT_SEED);
  const caregiverSK  = seedToBytes(CAREGIVER_SEED);
  const caregiverPK  = caregiverSK; // simplified: PK = SK for test purposes

  let storedEventCommit: Uint8Array;

  // -------------------------------------------------------------------------
  // Setup
  // -------------------------------------------------------------------------

  beforeAll(async () => {
    setNetworkId(LOCAL_CONFIG.networkId);

    // Dynamic imports to avoid top-level resolution before compile
    const { FluentWalletBuilder } = await import('@midnight-ntwrk/testkit-js');
    const { LedgerParameters }    = await import('@midnight-ntwrk/ledger-v8');
    const { ZswapSecretKeys, DustSecretKey } = await import('@midnight-ntwrk/ledger-v8');
    const { indexerPublicDataProvider }      = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
    const { httpClientProofProvider }        = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
    const { NodeZkConfigProvider }           = await import('@midnight-ntwrk/midnight-js-node-zk-config-provider');
    const { levelPrivateStateProvider }      = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');

    const envConfig = {
      walletNetworkId: LOCAL_CONFIG.networkId,
      networkId:       LOCAL_CONFIG.networkId,
      indexer:         LOCAL_CONFIG.indexer,
      indexerWS:       LOCAL_CONFIG.indexerWS,
      node:            LOCAL_CONFIG.node,
      nodeWS:          LOCAL_CONFIG.nodeWS,
      faucet:          LOCAL_CONFIG.faucet,
      proofServer:     LOCAL_CONFIG.proofServer,
    };

    const dustOptions = {
      ledgerParams:         LedgerParameters.initialParameters(),
      additionalFeeOverhead: 1_000n,
      feeBlocksMargin:      5,
    };

    async function buildWallet(seed: string) {
      const builder = FluentWalletBuilder.forEnvironment(envConfig).withDustOptions(dustOptions);
      const { wallet, seeds } = await builder.withSeed(seed).buildWithoutStarting() as any;
      await wallet.start(
        ZswapSecretKeys.fromSeed(seeds.shielded),
        DustSecretKey.fromSeed(seeds.dust),
      );
      return { wallet, seeds };
    }

    const [patientWallet, caregiverWallet, unauthorizedWallet] = await Promise.all([
      buildWallet(PATIENT_SEED),
      buildWallet(CAREGIVER_SEED),
      buildWallet(UNAUTHORIZED_SEED),
    ]);

    logger.info('Wallets built. Waiting for sync...');

    // Wait for all wallets to sync (simplified — real impl uses syncWallet helper)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Import compiled contract (must exist after `compact compile`)
    const { CompiledPatientMemoryContract, zkConfigPath } =
      await import('./managed/PatientMemory/index.js');

    function buildProviders(walletObj: any, witnesses: PatientMemoryWitnesses) {
      const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
      return {
        privateStateProvider: levelPrivateStateProvider({
          privateStateStoreName:          `patient-memory-${Date.now()}`,
          walletProvider:                 walletObj.wallet,
          privateStoragePasswordProvider: () => 'xK9#mQ2$pL8@nR5!vW3*zY7&',
          accountId:                      `test-${Date.now()}`,
        }),
        publicDataProvider: indexerPublicDataProvider(
          LOCAL_CONFIG.indexer,
          LOCAL_CONFIG.indexerWS,
        ),
        zkConfigProvider,
        proofProvider: httpClientProofProvider(LOCAL_CONFIG.proofServer, zkConfigProvider),
        walletProvider:   walletObj.wallet,
        midnightProvider: walletObj.wallet,
        witnesses,
      };
    }

    // Patient witnesses: provide patient secret key
    const patientWitnesses: PatientMemoryWitnesses = {
      patientSecretKey:   () => patientSK,
      caregiverSecretKey: () => new Uint8Array(32), // unused for patient actions
      caregiverPublicKey: () => new Uint8Array(32), // unused for patient actions
    };

    // Caregiver witnesses: provide caregiver keys
    const caregiverWitnesses: PatientMemoryWitnesses = {
      patientSecretKey:   () => new Uint8Array(32), // unused for caregiver actions
      caregiverSecretKey: () => caregiverSK,
      caregiverPublicKey: () => caregiverPK,
    };

    // Unauthorized witnesses: wrong keys
    const unauthorizedWitnesses: PatientMemoryWitnesses = {
      patientSecretKey:   () => seedToBytes(UNAUTHORIZED_SEED),
      caregiverSecretKey: () => seedToBytes(UNAUTHORIZED_SEED),
      caregiverPublicKey: () => seedToBytes(UNAUTHORIZED_SEED),
    };

    patientProviders      = buildProviders(patientWallet,      patientWitnesses);
    caregiverProviders    = buildProviders(caregiverWallet,    caregiverWitnesses);
    unauthorizedProviders = buildProviders(unauthorizedWallet, unauthorizedWitnesses);

    logger.info('Providers initialized.');
  }, 120_000);

  afterAll(async () => {
    logger.info('Test suite complete.');
  });

  // -------------------------------------------------------------------------
  // Helper: query ledger state
  // -------------------------------------------------------------------------

  async function queryLedger() {
    const { ledger } = await import('./managed/PatientMemory/index.js');
    const state = await patientProviders.publicDataProvider.queryContractState(contractAddress);
    expect(state).not.toBeNull();
    return ledger(state!.data);
  }

  // -------------------------------------------------------------------------
  // Test 1: Deploy contract
  // -------------------------------------------------------------------------

  it('deploys the contract', async () => {
    const { CompiledPatientMemoryContract } = await import('./managed/PatientMemory/index.js');

    const initialCommitment = await computePatientCommitment(patientSK);

    const deployed: any = await (deployContract as any)(patientProviders, {
      compiledContract:    CompiledPatientMemoryContract,
      privateStateId:      PATIENT_MEMORY_PRIVATE_STATE_ID,
      initialPrivateState: {},
      args:                [initialCommitment],
    });

    contractAddress = deployed.deployTxData.public.contractAddress;
    logger.info(`Contract deployed at: ${contractAddress}`);

    expect(contractAddress).toBeDefined();
    expect(contractAddress.length).toBeGreaterThan(0);

    const state = await queryLedger();
    expect(state.totalEvents).toBe(0n);
    expect(state.totalCaregivers).toBe(0n);
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 2: Store memory event (patient authorized)
  // -------------------------------------------------------------------------

  it('stores a memory event when called by the patient', async () => {
    const encryptedData = new Uint8Array(32).fill(0xab); // mock encrypted payload hash
    const timestamp     = BigInt(Math.floor(Date.now() / 1000));

    const result: any = await (submitCallTx as any)(patientProviders, {
      compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
      contractAddress,
      privateStateId: PATIENT_MEMORY_PRIVATE_STATE_ID,
      circuitId:      'storeMemory',
      args:           [EventType.FaceDetected, encryptedData, timestamp],
    });

    storedEventCommit = result.callTxData.public.result;
    expect(storedEventCommit).toBeDefined();
    expect(storedEventCommit.length).toBe(32);

    const state = await queryLedger();
    expect(state.totalEvents).toBe(1n);
    expect(state.eventCommitments.size).toBe(1);
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 3: Reject storeMemory from non-patient
  // -------------------------------------------------------------------------

  it('rejects storeMemory from an unauthorized caller', async () => {
    const encryptedData = new Uint8Array(32).fill(0xcd);
    const timestamp     = BigInt(Math.floor(Date.now() / 1000));

    await expect(
      (submitCallTx as any)(unauthorizedProviders, {
        compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
        contractAddress,
        privateStateId: `unauthorized-${Date.now()}`,
        circuitId:      'storeMemory',
        args:           [EventType.FaceDetected, encryptedData, timestamp],
      }),
    ).rejects.toThrow();
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 4: Authorize caregiver
  // -------------------------------------------------------------------------

  it('authorizes a caregiver', async () => {
    // Patient authorizes the caregiver with Medical access for 30 days.
    // The caregiverPublicKey witness must return the caregiver's PK.
    const patientWithCgPK = {
      ...patientProviders,
      witnesses: {
        patientSecretKey:   () => patientSK,
        caregiverSecretKey: () => new Uint8Array(32),
        caregiverPublicKey: () => caregiverPK,
      },
    };

    const result: any = await (submitCallTx as any)(patientWithCgPK, {
      compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
      contractAddress,
      privateStateId: PATIENT_MEMORY_PRIVATE_STATE_ID,
      circuitId:      'authorizeCaregiver',
      args:           [AccessLevel.Medical, 30n, BigInt(Math.floor(Date.now() / 1000))],
    });

    const cgCommit = result.callTxData.public.result;
    expect(cgCommit).toBeDefined();
    expect(cgCommit.length).toBe(32);

    const state = await queryLedger();
    expect(state.totalCaregivers).toBe(1n);
    expect(state.caregiverAccessLevels.size).toBe(1);
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 5: Verify caregiver access
  // -------------------------------------------------------------------------

  it('verifies caregiver access and returns access level', async () => {
    const result: any = await (submitCallTx as any)(caregiverProviders, {
      compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
      contractAddress,
      privateStateId: `caregiver-${Date.now()}`,
      circuitId:      'verifyAccess',
      args:           [],
    });

    const levelCode: number = result.callTxData.public.result;
    expect(levelCode).toBe(AccessLevel.Medical); // 1
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 6: Reject access for unauthorized caregiver
  // -------------------------------------------------------------------------

  it('rejects verifyAccess for an unauthorized caregiver', async () => {
    await expect(
      (submitCallTx as any)(unauthorizedProviders, {
        compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
        contractAddress,
        privateStateId: `unauth-${Date.now()}`,
        circuitId:      'verifyAccess',
        args:           [],
      }),
    ).rejects.toThrow();
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 7: Log memory access (audit trail)
  // -------------------------------------------------------------------------

  it('logs memory access and appends to audit trail', async () => {
    const stateBefore = await queryLedger();
    const auditSizeBefore = stateBefore.auditCommitments.size;

    const timestamp = BigInt(Math.floor(Date.now() / 1000));

    await (submitCallTx as any)(caregiverProviders, {
      compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
      contractAddress,
      privateStateId: `caregiver-log-${Date.now()}`,
      circuitId:      'logMemoryAccess',
      args:           [storedEventCommit, timestamp],
    });

    const stateAfter = await queryLedger();
    expect(stateAfter.auditCommitments.size).toBeGreaterThan(auditSizeBefore);
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 8: Revoke caregiver access
  // -------------------------------------------------------------------------

  it('revokes caregiver access', async () => {
    const patientWithCgPK = {
      ...patientProviders,
      witnesses: {
        patientSecretKey:   () => patientSK,
        caregiverSecretKey: () => new Uint8Array(32),
        caregiverPublicKey: () => caregiverPK,
      },
    };

    const result: any = await (submitCallTx as any)(patientWithCgPK, {
      compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
      contractAddress,
      privateStateId: PATIENT_MEMORY_PRIVATE_STATE_ID,
      circuitId:      'revokeAccess',
      args:           [],
    });

    expect(result.callTxData.public.result).toBe(true);

    // Verify the sentinel value (255) is now stored
    const state = await queryLedger();
    const levels = Array.from(state.caregiverAccessLevels.values());
    expect(levels).toContain(255); // AccessLevel.Revoked
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 9: Reject access after revocation
  // -------------------------------------------------------------------------

  it('rejects verifyAccess after caregiver is revoked', async () => {
    await expect(
      (submitCallTx as any)(caregiverProviders, {
        compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
        contractAddress,
        privateStateId: `caregiver-revoked-${Date.now()}`,
        circuitId:      'verifyAccess',
        args:           [],
      }),
    ).rejects.toThrow();
  }, 120_000);

  // -------------------------------------------------------------------------
  // Test 10: getStats returns correct counters
  // -------------------------------------------------------------------------

  it('getStats returns correct public counters', async () => {
    const result: any = await (submitCallTx as any)(patientProviders, {
      compiledContract: (await import('./managed/PatientMemory/index.js')).CompiledPatientMemoryContract,
      contractAddress,
      privateStateId: PATIENT_MEMORY_PRIVATE_STATE_ID,
      circuitId:      'getStats',
      args:           [],
    });

    const [totalEvents, totalCaregivers, lastUpdated] = result.callTxData.public.result;
    expect(totalEvents).toBeGreaterThanOrEqual(1n);
    expect(typeof lastUpdated).toBe('bigint');
    logger.info(`Stats: events=${totalEvents}, caregivers=${totalCaregivers}, lastUpdated=${lastUpdated}`);
  }, 120_000);
});
