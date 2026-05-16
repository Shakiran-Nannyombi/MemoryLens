import { useState } from 'react';
import { Wallet, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '../store/useStore';
import { mockConnectWallet, mockDisconnectWallet } from '../lib/mockMidnight';
import { cn } from '../lib/utils';

interface Props {
    className?: string;
}

function truncateAddress(addr: string) {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WalletConnect({ className }: Props) {
    const walletConnected = useStore((s) => s.walletConnected);
    const walletAddress = useStore((s) => s.walletAddress);
    const setWalletConnected = useStore((s) => s.setWalletConnected);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            <div className={cn('flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200', className)}>
                <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-500 font-medium">1AM Wallet</p>
                    <p className="text-sm font-mono text-purple-800 truncate">{truncateAddress(walletAddress)}</p>
                </div>
                <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="text-purple-400 hover:text-purple-700 transition-colors"
                    aria-label="Disconnect wallet"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className={cn('space-y-2', className)}>
            <Button
                onClick={handleConnect}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
                <Wallet className="w-4 h-4" />
                {loading ? 'Connecting...' : 'Connect 1AM Wallet'}
            </Button>

            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
        </div>
    );
}
