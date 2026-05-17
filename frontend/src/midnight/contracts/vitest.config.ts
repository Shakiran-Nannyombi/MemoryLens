import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration for PatientMemory contract integration tests.
 *
 * Run with:
 *   NODE_OPTIONS='--experimental-vm-modules' npx vitest run --config frontend/src/midnight/contracts/vitest.config.ts
 *
 * Or add to package.json scripts:
 *   "test:contract": "NODE_OPTIONS='--experimental-vm-modules' vitest run --config frontend/src/midnight/contracts/vitest.config.ts"
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Each test deploys a contract and waits for blockchain confirmations.
    testTimeout: 10 * 60_000, // 10 minutes per test
    hookTimeout: 15 * 60_000, // 15 minutes for beforeAll
    include: ['frontend/src/midnight/contracts/**/*.test.ts'],
    reporters: ['default'],
    sequence: { concurrent: false }, // tests must run sequentially (shared contract state)
  },
});
