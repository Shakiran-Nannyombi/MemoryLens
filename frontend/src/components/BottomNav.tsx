import { Link } from 'react-router-dom';
import { Icon } from './ui/Icon';

interface BottomNavProps {
    currentPath: string;
}

const NAV_ITEMS = [
    { path: '/', icon: 'camera_front', label: 'Lens' },
    { path: '/assistant', icon: 'contact_support', label: 'Help' },
    { path: '/login', icon: 'face', label: 'Caregiver' },
];

export default function BottomNav({ currentPath }: BottomNavProps) {
    return (
        <nav className="fixed bottom-0 w-full bg-surface-container/90 backdrop-blur-xl rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
            <div className="max-w-7xl mx-auto px-container-margin flex items-center justify-around py-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                            className={[
                                'flex flex-col items-center gap-1 min-h-[48px] justify-center px-3',
                                'active:scale-90 duration-150 transition-colors rounded-xl',
                                isActive
                                    ? 'bg-secondary-container text-on-secondary-container px-4 py-2'
                                    : 'text-on-surface-variant hover:bg-surface-container-highest',
                            ].join(' ')}
                        >
                            <Icon
                                name={item.icon}
                                filled={isActive}
                                size={24}
                            />
                            <span className="font-label-lg text-label-lg text-xs">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
