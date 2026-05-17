import { useStore } from '../store/useStore';
import { detectWallet } from '../midnight/lib/wallet';
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
    const walletError = useStore((s) => s.walletError);
    const isConnectingWallet = useStore((s) => s.isConnectingWallet);
    const contractStats = useStore((s) => s.contractStats);
    const connectWallet = useStore((s) => s.connectWallet);
    const disconnectWallet = useStore((s) => s.disconnectWallet);

    const walletInstalled = detectWallet();
    const encryptedMemoriesCount = contractStats?.totalEvents || 0;
    const caregiversCount = contractStats?.totalCaregivers || 0;

    const handleConnect = async () => {
        try {
            await connectWallet();
        } catch (error: any) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnectWallet();
        } catch (error: any) {
            console.error('Failed to disconnect wallet:', error);
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
                    disabled={isConnectingWallet}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg
                     text-white/70 hover:text-white hover:bg-white/10
                     transition-colors active:scale-95 duration-150 text-sm disabled:opacity-50"
                    aria-label="Disconnect wallet"
                >
                    <Icon name="logout" size={16} className="text-white/70" />
                    Disconnect
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
                disabled={isConnectingWallet || !walletInstalled}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg
                   bg-white/20 hover:bg-white/30 text-white font-label-lg
                   transition-colors active:scale-95 duration-150
                   min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Connect 1AM wallet"
            >
                <Icon name="account_balance_wallet" size={18} className="text-white" />
                {isConnectingWallet ? 'Connecting...' : 'Connect 1AM Wallet'}
            </button>

            {!walletInstalled && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                    <Icon name="warning" size={16} className="text-yellow-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200">
                        1AM wallet not detected. Using mock mode for demo.
                    </p>
                </div>
            )}

            {walletError && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <Icon name="error" size={16} className="text-red-300 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">{walletError}</p>
                </div>
            )}
        </div>
    );
}
