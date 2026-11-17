import { Home, Images, PlusSquare, User } from 'lucide-react';
import { TabId } from '../types/app';

interface BottomNavProps {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'მთავარი', Icon: Home },
  { id: 'create', label: 'შექმნა', Icon: PlusSquare },
  { id: 'gallery', label: 'ჩემი ფოტოები', Icon: Images },
  { id: 'profile', label: 'პროფილი', Icon: User },
];

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/[0.08] bg-[#080910]/90 backdrop-blur-xl pb-safe"
      aria-label="ქვედა მენიუ"
    >
      <div className="grid grid-cols-4 items-center h-16 px-1">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id || (id === 'profile' && activeTab === 'premium');
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] py-1.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute top-0.5 h-0.5 w-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
              )}
              <Icon
                className={`h-[21px] w-[21px] transition-transform duration-150 ${
                  isActive ? 'text-violet-400 scale-105' : 'text-slate-400'
                }`}
                strokeWidth={isActive ? 2.25 : 1.85}
              />
              <span className="mt-1 text-[10px] font-medium tracking-tight whitespace-nowrap truncate max-w-[82px]">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
