/**
 * wallet.ts - 1AM wallet integration module
 * Manages wallet connection and transaction signing
 */

export interface WalletState {
    connected: boolean;
    address: string | null;
}

// Extend window type for 1AM wallet
declare global {
    interface Window {
        midnight?: {
            isInstalled: boolean;
            connect: () => Promise<{ address: string }>;
            disconnect: () => Promise<void>;
            getAddress: () => Promise<string>;
            signTransaction: (tx: any) => Promise<any>;
            on: (event: string, callback: (data: any) => void) => void;
            off: (event: string, callback: (data: any) => void) => void;
        };
    }
}

let walletState: WalletState = {
    connected: false,
    address: null,
};

const listeners: Array<(state: WalletState) => void> = [];

/**
 * Detect if 1AM wallet extension is installed
 */
export function detectWallet(): boolean {
    return typeof window !== 'undefined' && window.midnight?.isInstalled === true;
}

/**
 * Connect to 1AM wallet
 */
export async function connectWallet(): Promise<string> {
    if (!detectWallet()) {
        throw new Error('1AM wallet not installed');
    }

    try {
        const result = await window.midnight!.connect();
        walletState = {
            connected: true,
            address: result.address,
        };
        notifyListeners();
        return result.address;
    } catch (error) {
        throw new Error(`Failed to connect wallet: ${error}`);
    }
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet(): Promise<void> {
    if (!detectWallet()) {
        return;
    }

    try {
        await window.midnight!.disconnect();
        walletState = {
            connected: false,
            address: null,
        };
        notifyListeners();
    } catch (error) {
        console.error('Failed to disconnect wallet:', error);
    }
}

/**
 * Get current wallet address
 */
export function getWalletAddress(): string | null {
    return walletState.address;
}

/**
 * Check if wallet is connected
 */
export function isWalletConnected(): boolean {
    return walletState.connected;
}

/**
 * Listen for wallet state changes
 */
export function onWalletChange(callback: (state: WalletState) => void): () => void {
    listeners.push(callback);

    // Return unsubscribe function
    return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}

/**
 * Sign a transaction with the wallet
 */
export async function signTransaction(tx: any): Promise<any> {
    if (!isWalletConnected()) {
        throw new Error('Wallet not connected');
    }

    if (!detectWallet()) {
        throw new Error('1AM wallet not installed');
    }

    try {
        return await window.midnight!.signTransaction(tx);
    } catch (error) {
        throw new Error(`Failed to sign transaction: ${error}`);
    }
}

/**
 * Notify all listeners of state changes
 */
function notifyListeners() {
    listeners.forEach(listener => listener(walletState));
}

/**
 * Initialize wallet event listeners
 */
export function initWalletListeners(): void {
    if (!detectWallet()) {
        return;
    }

    // Listen for account changes
    window.midnight!.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
            walletState = {
                connected: true,
                address: accounts[0],
            };
        } else {
            walletState = {
                connected: false,
                address: null,
            };
        }
        notifyListeners();
    });
}
