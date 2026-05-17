/**
 * mockMidnight.ts
 * Mock Midnight SDK functions for fallback when wallet is unavailable
 * Simulates blockchain operations with realistic delays
 */

export async function mockConnectWallet(): Promise<string> {
    console.log('[Mock Midnight] Connecting wallet...');
    await new Promise((r) => setTimeout(r, 1000));
    return '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12';
}

export async function mockDisconnectWallet(): Promise<void> {
    console.log('[Mock Midnight] Disconnecting wallet...');
    await new Promise((r) => setTimeout(r, 300));
}

export async function mockStoreMemory(data: object, onProgress?: (msg: string) => void): Promise<string> {
    console.log('[Mock Midnight] Storing memory:', data);

    onProgress?.('Encrypting data...');
    await new Promise((r) => setTimeout(r, 500));

    onProgress?.('Generating ZK proof...');
    await new Promise((r) => setTimeout(r, 2000));

    onProgress?.('Submitting transaction...');
    await new Promise((r) => setTimeout(r, 500));

    onProgress?.('Waiting for confirmation...');
    await new Promise((r) => setTimeout(r, 500));

    const hash = '0x' + Math.random().toString(16).slice(2, 66).padEnd(64, '0');
    console.log('[Mock Midnight] Memory stored → tx:', hash);
    return hash;
}

export async function mockStorePersonMemory(
    name: string,
    relationship: string,
    faceDescriptor: number[],
    imageUrl: string,
    onProgress?: (msg: string) => void
): Promise<string> {
    return mockStoreMemory({ name, relationship, faceDescriptor, imageUrl }, onProgress);
}

export async function mockStoreObjectMemory(
    objectClass: string,
    customLabel: string,
    location: { x: number; y: number },
    onProgress?: (msg: string) => void
): Promise<string> {
    return mockStoreMemory({ objectClass, customLabel, location }, onProgress);
}

export async function mockStoreSpeechEvent(
    transcript: string,
    extractedNames: string[],
    timestamp: number,
    onProgress?: (msg: string) => void
): Promise<string> {
    return mockStoreMemory({ transcript, extractedNames, timestamp }, onProgress);
}

export async function mockRetrieveMemories(
    eventType: string,
    dateRange?: { start: Date; end: Date }
): Promise<any[]> {
    console.log('[Mock Midnight] Retrieving memories:', eventType, dateRange);
    await new Promise((r) => setTimeout(r, 800));
    return [];
}

export async function mockAuthorizeCaregiver(
    caregiverId: string,
    accessLevel: string,
    durationDays: number
): Promise<string> {
    console.log('[Mock Midnight] Authorizing caregiver:', caregiverId, accessLevel);
    await new Promise((r) => setTimeout(r, 1500));
    const hash = '0x' + Math.random().toString(16).slice(2, 66).padEnd(64, '0');
    return hash;
}

export async function mockRevokeCaregiver(caregiverId: string): Promise<string> {
    console.log('[Mock Midnight] Revoking caregiver:', caregiverId);
    await new Promise((r) => setTimeout(r, 1000));
    const hash = '0x' + Math.random().toString(16).slice(2, 66).padEnd(64, '0');
    return hash;
}

export async function mockGetAuditTrail(dateRange?: { start: Date; end: Date }) {
    console.log('[Mock Midnight] Fetching audit trail:', dateRange);
    await new Promise((r) => setTimeout(r, 500));
    return [
        { caregiverId: 'Dr. Smith', eventId: '0x123', action: 'retrieve_memory', accessedAt: Date.now() - 7200000 },
        { caregiverId: 'Nurse Joy', eventId: '0x456', action: 'retrieve_memory', accessedAt: Date.now() - 3600000 },
        { caregiverId: 'Dr. Smith', eventId: '0x789', action: 'authorized', accessedAt: Date.now() - 86400000 },
    ];
}

export async function mockGetStats() {
    console.log('[Mock Midnight] Fetching contract stats');
    await new Promise((r) => setTimeout(r, 300));
    return { totalEvents: 12, totalCaregivers: 2, lastUpdated: new Date() };
}
