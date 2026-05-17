import { useState } from 'react';
import { useStore } from '../store/useStore';
import { mockConnectWallet, mockDisconnectWallet } from '../lib/mockMidnight';
import { cn } from '../lib/utils';
import { Icon } from './ui/Icon';

interface Props {
    className?: string;
}

function truncateAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WalletConnect({ className }: Props) {
    const walletConnected = useStore((s) => s.walletConnected);
    const walletAddress = useStore((s) => s.walletAddress);
    const setWalletConnected = useStore((s) => s.setWalletConnected);
    const people = useStore((s) => s.people);
    const objects = useStore((s) => s.objects);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const encryptedMemoriesCount = objects.length;
    const caregiversCount = people.length;

    const handleConnect = async () => {
        setLoading(true);
        setError(null);
        try {
            // TODO: swap mockConnectWallet with real connectWallet() from backend/lib/wallet.ts
            const address = await mockConnectWallet();
            setWalletConnected(true, address);
        } catch {
            setError('Could not connect wallet. Is 1AM installed?');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setLoading(true);
        try {
            // TODO: swap with real disconnectWallet()
            await mockDisconnectWallet();
            setWalletConnected(false);
        } finally {
            setLoading(false);
        }
    };

    if (walletConnected && walletAddress) {
        return (
            <div
                className={cn(
                    'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[280px]',
                    className
                )}
            >
                {/* Header row: label + connected status */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 font-label-lg text-sm">Secure Wallet</span>
                    <div className="flex items-center gap-2">
                        <span
                            className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                            aria-label="Connected"
                        />
                    </div>
                </div>

                {/* Wallet address */}
                <p className="font-mono text-white font-bold tracking-wider">
                    {truncateAddress(walletAddress)}
                </p>

                {/* Stats row */}
                <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                        <p className="text-white/60 text-sm">Encrypted Memories</p>
                        <p className="text-xl font-bold text-white">{encryptedMemoriesCount}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-white/60 text-sm">Caregivers</p>
                        <p className="text-xl font-bold text-white">{caregiversCount}</p>
                    </div>
                </div>

                {/* Disconnect button */}
                <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg
                     text-white/70 hover:text-white hover:bg-white/10
                     transition-colors active:scale-95 duration-150 text-sm"
                    aria-label="Disconnect wallet"
                >
                    <Icon name="logout" size={16} className="text-white/70" />
                    {loading ? 'Disconnecting...' : 'Disconnect'}
                </button>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[280px]',
                className
            )}
        >
            {/* Header row: label + disconnected indicator */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 font-label-lg text-sm">Secure Wallet</span>
                <span
                    className="w-2 h-2 bg-white/30 rounded-full"
                    aria-label="Disconnected"
                />
            </div>

            <p className="font-mono text-white/50 font-bold tracking-wider mb-4">
                Not connected
            </p>

            {/* Connect button */}
            <button
                onClick={handleConnect}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
                   bg-white/20 hover:bg-white/30 text-white font-label-lg
                   transition-colors active:scale-95 duration-150
                   min-h-[48px]"
                aria-label="Connect 1AM wallet"
            >
                <Icon name="account_balance_wallet" size={18} className="text-white" />
                {loading ? 'Connecting...' : 'Connect 1AM Wallet'}
            </button>

            {error && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <Icon name="error" size={16} className="text-red-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}
        </div>
    );
}
