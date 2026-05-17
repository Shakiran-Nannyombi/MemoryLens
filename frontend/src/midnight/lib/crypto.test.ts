/**
 * crypto.test.ts
 * Unit tests for encryption, decryption, and ZK proof generation utilities
 */

import { describe, it, expect, vi } from 'vitest';
import {
    encryptData,
    decryptData,
    generateProof,
    verifyProof,
    EncryptionError,
    DecryptionError,
    ProofGenerationError,
    type EncryptedData,
    type Proof,
} from './crypto';

describe('Encryption and Decryption', () => {
    // Generate test keys (32 bytes)
    const testKey = new Uint8Array(32).fill(1);
    const testKeyHex = '0x' + Array.from(testKey).map(b => b.toString(16).padStart(2, '0')).join('');

    describe('encryptData', () => {
        it('should encrypt simple data successfully', async () => {
            const data = { name: 'John Doe', age: 65 };
            const encrypted = await encryptData(data, testKey);

            expect(encrypted).toBeDefined();
            expect(encrypted.ciphertext).toBeTruthy();
            expect(encrypted.nonce).toBeTruthy();
            expect(encrypted.algorithm).toBe('aes-256-gcm');
            expect(encrypted.version).toBe(1);
        });

        it('should encrypt data with hex string key', async () => {
            const data = { test: 'value' };
            const encrypted = await encryptData(data, testKeyHex);

            expect(encrypted).toBeDefined();
            expect(encrypted.ciphertext).toBeTruthy();
        });

        it('should encrypt complex nested objects', async () => {
            const data = {
                person: {
                    name: 'Jane Smith',
                    details: {
                        age: 70,
                        conditions: ['diabetes', 'hypertension'],
                    },
                },
                timestamp: Date.now(),
            };

            const encrypted = await encryptData(data, testKey);
            expect(encrypted.ciphertext).toBeTruthy();
        });

        it('should encrypt arrays', async () => {
            const data = [1, 2, 3, 4, 5];
            const encrypted = await encryptData(data, testKey);

            expect(encrypted.ciphertext).toBeTruthy();
        });

        it('should throw EncryptionError for null data', async () => {
            await expect(encryptData(null, testKey)).rejects.toThrow(EncryptionError);
        });

        it('should throw EncryptionError for undefined data', async () => {
            await expect(encryptData(undefined, testKey)).rejects.toThrow(EncryptionError);
        });

        it('should throw EncryptionError for missing public key', async () => {
            await expect(encryptData({ test: 'data' }, '')).rejects.toThrow(EncryptionError);
        });

        it('should throw EncryptionError for invalid key length', async () => {
            const invalidKey = new Uint8Array(16); // Wrong length
            await expect(encryptData({ test: 'data' }, invalidKey)).rejects.toThrow(EncryptionError);
        });

        it('should throw EncryptionError for non-serializable data', async () => {
            const circularRef: any = {};
            circularRef.self = circularRef;

            await expect(encryptData(circularRef, testKey)).rejects.toThrow(EncryptionError);
        });

        it('should produce different ciphertexts for same data (due to random nonce)', async () => {
            const data = { test: 'value' };
            const encrypted1 = await encryptData(data, testKey);
            const encrypted2 = await encryptData(data, testKey);

            expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
            expect(encrypted1.nonce).not.toBe(encrypted2.nonce);
        });
    });

    describe('decryptData', () => {
        it('should decrypt data successfully', async () => {
            const originalData = { name: 'John Doe', age: 65 };
            const encrypted = await encryptData(originalData, testKey);
            const decrypted = await decryptData(encrypted, testKey);

            expect(decrypted).toEqual(originalData);
        });

        it('should decrypt complex nested objects', async () => {
            const originalData = {
                person: {
                    name: 'Jane Smith',
                    details: {
                        age: 70,
                        conditions: ['diabetes', 'hypertension'],
                    },
                },
                timestamp: 1234567890,
            };

            const encrypted = await encryptData(originalData, testKey);
            const decrypted = await decryptData(encrypted, testKey);

            expect(decrypted).toEqual(originalData);
        });

        it('should decrypt arrays', async () => {
            const originalData = [1, 2, 3, 4, 5];
            const encrypted = await encryptData(originalData, testKey);
            const decrypted = await decryptData(encrypted, testKey);

            expect(decrypted).toEqual(originalData);
        });

        it('should decrypt data from JSON string', async () => {
            const originalData = { test: 'value' };
            const encrypted = await encryptData(originalData, testKey);
            const encryptedString = JSON.stringify(encrypted);
            const decrypted = await decryptData(encryptedString, testKey);

            expect(decrypted).toEqual(originalData);
        });

        it('should decrypt with hex string key', async () => {
            const originalData = { test: 'value' };
            const encrypted = await encryptData(originalData, testKeyHex);
            const decrypted = await decryptData(encrypted, testKeyHex);

            expect(decrypted).toEqual(originalData);
        });

        it('should throw DecryptionError for null encrypted data', async () => {
            await expect(decryptData(null as any, testKey)).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for missing private key', async () => {
            const encrypted = await encryptData({ test: 'data' }, testKey);
            await expect(decryptData(encrypted, '')).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for invalid key length', async () => {
            const encrypted = await encryptData({ test: 'data' }, testKey);
            const invalidKey = new Uint8Array(16);
            await expect(decryptData(encrypted, invalidKey)).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for invalid JSON string', async () => {
            await expect(decryptData('invalid json', testKey)).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for missing ciphertext', async () => {
            const invalidEncrypted = { nonce: 'abc', algorithm: 'aes-256-gcm', version: 1 } as any;
            await expect(decryptData(invalidEncrypted, testKey)).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for unsupported version', async () => {
            const encrypted = await encryptData({ test: 'data' }, testKey);
            encrypted.version = 999;
            await expect(decryptData(encrypted, testKey)).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for wrong decryption key', async () => {
            const encrypted = await encryptData({ test: 'data' }, testKey);
            const wrongKey = new Uint8Array(32).fill(2);
            await expect(decryptData(encrypted, wrongKey)).rejects.toThrow(DecryptionError);
        });
    });

    describe('Encryption/Decryption Round-trip', () => {
        it('should handle strings', async () => {
            const data = 'Hello, World!';
            const encrypted = await encryptData(data, testKey);
            const decrypted = await decryptData(encrypted, testKey);
            expect(decrypted).toBe(data);
        });

        it('should handle numbers', async () => {
            const data = 42;
            const encrypted = await encryptData(data, testKey);
            const decrypted = await decryptData(encrypted, testKey);
            expect(decrypted).toBe(data);
        });

        it('should handle booleans', async () => {
            const data = true;
            const encrypted = await encryptData(data, testKey);
            const decrypted = await decryptData(encrypted, testKey);
            expect(decrypted).toBe(data);
        });

        it('should handle null values in objects', async () => {
            const data = { value: null };
            const encrypted = await encryptData(data, testKey);
            const decrypted = await decryptData(encrypted, testKey);
            expect(decrypted).toEqual(data);
        });

        it('should handle empty objects', async () => {
            const data = {};
            const encrypted = await encryptData(data, testKey);
            const decrypted = await decryptData(encrypted, testKey);
            expect(decrypted).toEqual(data);
        });

        it('should handle empty arrays', async () => {
            const data: any[] = [];
            const encrypted = await encryptData(data, testKey);
            const decrypted = await decryptData(encrypted, testKey);
            expect(decrypted).toEqual(data);
        });
    });
});

describe('ZK Proof Generation', () => {
    describe('generateProof', () => {
        it('should generate proof successfully', async () => {
            const witness = { value: 42, secret: 'test' };
            const proof = await generateProof(witness);

            expect(proof).toBeDefined();
            expect(proof.proof).toBeInstanceOf(Uint8Array);
            expect(proof.proof.length).toBeGreaterThan(0);
            expect(proof.publicInputs).toBeDefined();
            expect(proof.timestamp).toBeGreaterThan(0);
        });

        it('should call progress callback during generation', async () => {
            const witness = { value: 42 };
            const progressCalls: Array<{ message: string; progress: number }> = [];

            await generateProof(witness, (message, progress) => {
                progressCalls.push({ message, progress });
            });

            expect(progressCalls.length).toBeGreaterThan(0);
            expect(progressCalls[0].progress).toBe(0);
            expect(progressCalls[progressCalls.length - 1].progress).toBe(100);
        });

        it('should report progress in ascending order', async () => {
            const witness = { value: 42 };
            const progressValues: number[] = [];

            await generateProof(witness, (_, progress) => {
                progressValues.push(progress);
            });

            for (let i = 1; i < progressValues.length; i++) {
                expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
            }
        });

        it('should take at least 2 seconds (simulated)', async () => {
            const witness = { value: 42 };
            const startTime = Date.now();

            await generateProof(witness);

            const duration = Date.now() - startTime;
            expect(duration).toBeGreaterThanOrEqual(2000); // At least 2 seconds
        });

        it('should extract public inputs from witness', async () => {
            const witness = { publicValue: 42, secretValue: 'hidden' };
            const proof = await generateProof(witness);

            expect(proof.publicInputs).toBeDefined();
            expect(proof.publicInputs.length).toBeGreaterThan(0);
        });

        it('should throw ProofGenerationError for null witness', async () => {
            await expect(generateProof(null as any)).rejects.toThrow(ProofGenerationError);
        });

        it('should throw ProofGenerationError for undefined witness', async () => {
            await expect(generateProof(undefined as any)).rejects.toThrow(ProofGenerationError);
        });

        it('should handle simple witness values', async () => {
            const proof = await generateProof(42);
            expect(proof).toBeDefined();
            expect(proof.publicInputs).toEqual([42]);
        });

        it('should handle array witness', async () => {
            const witness = [1, 2, 3];
            const proof = await generateProof(witness);
            expect(proof).toBeDefined();
        });
    });

    describe('verifyProof', () => {
        it('should verify valid proof', async () => {
            const witness = { value: 42 };
            const proof = await generateProof(witness);
            const isValid = await verifyProof(proof, proof.publicInputs);

            expect(isValid).toBe(true);
        });

        it('should reject proof with mismatched public inputs', async () => {
            const witness = { value: 42 };
            const proof = await generateProof(witness);
            const wrongInputs = [999];

            const isValid = await verifyProof(proof, wrongInputs);
            expect(isValid).toBe(false);
        });

        it('should reject proof with empty proof data', async () => {
            const invalidProof: Proof = {
                proof: new Uint8Array(0),
                publicInputs: [42],
                timestamp: Date.now(),
            };

            const isValid = await verifyProof(invalidProof, [42]);
            expect(isValid).toBe(false);
        });

        it('should reject null proof', async () => {
            const isValid = await verifyProof(null as any, [42]);
            expect(isValid).toBe(false);
        });

        it('should reject proof without proof data', async () => {
            const invalidProof = {
                publicInputs: [42],
                timestamp: Date.now(),
            } as any;

            const isValid = await verifyProof(invalidProof, [42]);
            expect(isValid).toBe(false);
        });

        it('should reject proof with null public inputs', async () => {
            const witness = { value: 42 };
            const proof = await generateProof(witness);

            const isValid = await verifyProof(proof, null as any);
            expect(isValid).toBe(false);
        });

        it('should handle verification errors gracefully', async () => {
            const witness = { value: 42 };
            const proof = await generateProof(witness);

            // Should not throw, just return false
            const isValid = await verifyProof(proof, []);
            expect(typeof isValid).toBe('boolean');
        });
    });

    describe('Proof Generation and Verification Flow', () => {
        it('should complete full proof lifecycle', async () => {
            // Generate witness
            const witness = {
                patientId: 'patient-123',
                memoryType: 'face',
                timestamp: Date.now(),
            };

            // Generate proof with progress tracking
            let progressComplete = false;
            const proof = await generateProof(witness, (message, progress) => {
                if (progress === 100) {
                    progressComplete = true;
                }
            });

            expect(progressComplete).toBe(true);

            // Verify proof
            const isValid = await verifyProof(proof, proof.publicInputs);
            expect(isValid).toBe(true);
        });
    });
});

describe('Error Handling', () => {
    it('should have proper error names', () => {
        const encError = new EncryptionError('test');
        expect(encError.name).toBe('EncryptionError');

        const decError = new DecryptionError('test');
        expect(decError.name).toBe('DecryptionError');

        const proofError = new ProofGenerationError('test');
        expect(proofError.name).toBe('ProofGenerationError');
    });

    it('should preserve error causes', () => {
        const cause = new Error('Original error');
        const encError = new EncryptionError('Wrapped error', cause);

        expect(encError.cause).toBe(cause);
    });
});

describe('Type Definitions', () => {
    it('should have correct EncryptedData structure', async () => {
        const data = { test: 'value' };
        const testKey = new Uint8Array(32).fill(1);
        const encrypted = await encryptData(data, testKey);

        // Type check
        const typedEncrypted: EncryptedData = encrypted;
        expect(typedEncrypted.ciphertext).toBeTruthy();
        expect(typedEncrypted.nonce).toBeTruthy();
        expect(typedEncrypted.algorithm).toBe('aes-256-gcm');
        expect(typedEncrypted.version).toBe(1);
    });

    it('should have correct Proof structure', async () => {
        const witness = { value: 42 };
        const proof = await generateProof(witness);

        // Type check
        const typedProof: Proof = proof;
        expect(typedProof.proof).toBeInstanceOf(Uint8Array);
        expect(Array.isArray(typedProof.publicInputs)).toBe(true);
        expect(typeof typedProof.timestamp).toBe('number');
    });
});
