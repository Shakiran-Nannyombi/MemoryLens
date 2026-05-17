/**
 * provider.ts - Midnight network provider module
 * Manages connection to the Midnight blockchain network
 */

interface NetworkInfo {
    network: string;
    proofServer: string;
    contractAddress: string;
}

interface MidnightProvider {
    network: string;
    proofServer: string;
    isConnected: boolean;
}

let providerInstance: MidnightProvider | null = null;

/**
 * Initialize the Midnight network provider
 */
export async function initProvider(): Promise<MidnightProvider> {
    // Validate environment variables
    const network = import.meta.env.VITE_MIDNIGHT_NETWORK || 'testnet';
    const proofServer = import.meta.env.VITE_MIDNIGHT_PROOF_SERVER || 'https://proof-server.testnet.midnight.network';
    const contractAddress = import.meta.env.VITE_MIDNIGHT_CONTRACT_ADDRESS;

    if (!contractAddress) {
        console.warn('VITE_MIDNIGHT_CONTRACT_ADDRESS not set, using mock mode');
    }

    // Create provider instance
    providerInstance = {
        network,
        proofServer,
        isConnected: true,
    };

    return providerInstance;
}

/**
 * Get the cached provider instance (singleton pattern)
 */
export function getProvider(): MidnightProvider {
    if (!providerInstance) {
        throw new Error('Provider not initialized. Call initProvider() first.');
    }
    return providerInstance;
}

/**
 * Get network information
 */
export async function getNetworkInfo(): Promise<NetworkInfo> {
    const provider = getProvider();
    return {
        network: provider.network,
        proofServer: provider.proofServer,
        contractAddress: import.meta.env.VITE_MIDNIGHT_CONTRACT_ADDRESS || '',
    };
}

/**
 * Check if provider is initialized
 */
export function isProviderInitialized(): boolean {
    return providerInstance !== null;
}
