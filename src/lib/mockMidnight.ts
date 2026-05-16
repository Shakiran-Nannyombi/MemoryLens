/**
 * mockMidnight.ts
 * Fake Midnight SDK functions for frontend development.
 * Person 3 will replace these with real SDK calls.
 */

export async function mockConnectWallet(): Promise<string> {
    await new Promise((r) => setTimeout(r, 1000));
    return '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12';
}

export async function mockDisconnectWallet(): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
}

export async function mockStoreMemory(data: object): Promise<string> {
    // Simulate ZK proof generation delay (2-4 seconds)
    await new Promise((r) => setTimeout(r, 2500));
    const hash = '0x' + Math.random().toString(16).slice(2, 66).padEnd(64, '0');
    console.log('[Mock Midnight] Stored memory:', data, '→ tx:', hash);
    return hash;
}

export async function mockGetAuditTrail() {
    await new Promise((r) => setTimeout(r, 500));
    return [
        { caregiverId: 'Dr. Smith', action: 'retrieve_memory', accessedAt: Date.now() - 7200000 },
        { caregiverId: 'Nurse Joy', action: 'retrieve_memory', accessedAt: Date.now() - 3600000 },
        { caregiverId: 'Dr. Smith', action: 'authorized', accessedAt: Date.now() - 86400000 },
    ];
}

export async function mockGetStats() {
    return { totalEvents: 12, totalCaregivers: 2, lastUpdated: new Date() };
}
