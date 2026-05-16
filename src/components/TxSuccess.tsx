import { CheckCircle, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
    txHash: string;
    onClose: () => void;
    className?: string;
}

function truncateHash(hash: string) {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function TxSuccess({ txHash, onClose, className }: Props) {
    return (
        <div className={cn(
            'flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl',
            className
        )}>
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800">Stored on Midnight 🌙</p>
                <p className="text-xs text-green-600 mt-0.5">Your data is now encrypted on-chain.</p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-mono text-green-700">{truncateHash(txHash)}</span>
                    <a
                        href={`https://explorer.testnet.midnight.network/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700"
                        aria-label="View on explorer"
                    >
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
            <button
                onClick={onClose}
                className="text-green-400 hover:text-green-700 text-lg leading-none"
                aria-label="Dismiss"
            >
                ×
            </button>
        </div>
    );
}
