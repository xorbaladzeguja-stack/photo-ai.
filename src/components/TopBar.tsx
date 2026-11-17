import { Coins, User } from 'lucide-react';
import { TabId, UserProfile } from '../types/app';

interface TopBarProps {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
  user: UserProfile;
}

const NAV_ITEMS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'მთავარი' },
  { id: 'create', label: 'შექმნა' },
  { id: 'gallery', label: 'ჩემი ფოტოები' },
  { id: 'profile', label: 'პროფილი' },
];

export function TopBar({ activeTab, onNavigate, user }: TopBarProps) {
  const initials = user.isRegistered && user.name.trim()
    ? user.name.trim().slice(0, 1).toUpperCase()
    : null;

  return (
    <header className="sticky top-0 z-30 h-[52px] md:h-16 border-b border-white/[0.08] bg-[#06070B]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 md:gap-8 px-4 md:px-6">
        {/* Zone 1: Brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 min-h-[44px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg"
          aria-label="PHOTO AI მთავარი"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-md shadow-violet-600/25">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="7.5" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-base md:text-lg font-extrabold tracking-tight text-white">
            PHOTO <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">AI</span>
          </span>
        </button>

        {/* Zone 2: Desktop single-line nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="ძირითადი ნავიგაცია">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-md ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Credits & Profile access */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('premium')}
            className="flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl bg-[#11131E] border border-white/[0.09] hover:border-violet-500/40 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            title="კრედიტების ბალანსი და Premium"
          >
            <Coins className="h-4 w-4 text-violet-400 shrink-0" />
            <span className="font-mono text-xs md:text-sm font-semibold tabular-nums text-white">
              {user.credits}
            </span>
            <span className="hidden sm:inline text-xs text-slate-400">კრედიტი</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#11131E] border border-white/[0.09] hover:border-blue-500/40 transition-colors text-slate-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="მომხმარებლის პროფილი"
          >
            {initials ? (
              <span className="text-sm font-bold text-violet-300">{initials}</span>
            ) : (
              <User className="h-4 w-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
