import { ArrowUpRight, Coins, Crown, History, LogOut, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { CreditTransaction, TabId, UserProfile } from '../types/app';

interface ProfileViewProps {
  user: UserProfile;
  transactions: CreditTransaction[];
  savedCount: number;
  onRegister: (name: string, email: string) => void;
  onLogout: () => void;
  onNavigate: (tab: TabId) => void;
}

export function ProfileView({
  user,
  transactions,
  savedCount,
  onRegister,
  onLogout,
  onNavigate,
}: ProfileViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('გთხოვთ შეიყვანოთ მინიმუმ 2 სიმბოლო სახელში');
      return;
    }
    if (!email.includes('@') || email.trim().length < 5) {
      setError('გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის მისამართი');
      return;
    }
    if (password.length < 6) {
      setError('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
      return;
    }
    setError(null);
    onRegister(name, email);
    setName('');
    setEmail('');
    setPassword('');
  };

  const planLabel =
    user.plan === 'pro' ? 'PHOTO AI Pro' : user.plan === 'studio' ? 'Studio Max' : 'საბაზისო';

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">მომხმარებლის პროფილი</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
          ანგარიში, კრედიტების ბალანსი და პრემიუმ წვდომა
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: User Card or Registration Form */}
        <div className="lg:col-span-7 space-y-5">
          {user.isRegistered ? (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0D1019] p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl font-bold text-white shrink-0">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-white truncate">{user.name}</h2>
                    <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 min-h-[42px] px-3 py-2 rounded-xl border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>გასვლა</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                <div>
                  <p className="text-[11px] text-slate-400">კრედიტები</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-violet-300">
                    {user.credits}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">პაკეტი</p>
                  <p className="mt-0.5 text-sm font-semibold text-white truncate">{planLabel}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">შენახული</p>
                  <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-blue-300">
                    {savedCount}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/[0.09] bg-[#0D1019] p-6 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 shrink-0">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">მომხმარებლის რეგისტრაცია</h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    დარეგისტრირდი და მიიღე +10 საჩუქარი კრედიტი ფოტოების შესანახად
                  </p>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                  {error}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                    სახელი და გვარი
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="მაგ: გიორგი ბერიძე"
                    className="w-full min-h-[46px] rounded-xl border border-white/[0.1] bg-[#070910] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                    ელ-ფოსტა
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full min-h-[46px] rounded-xl border border-white/[0.1] bg-[#070910] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="reg-pass" className="block text-xs font-medium text-slate-300 mb-1.5">
                    პაროლი
                  </label>
                  <input
                    id="reg-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="მინიმუმ 6 სიმბოლო"
                    className="w-full min-h-[46px] rounded-xl border border-white/[0.1] bg-[#070910] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
              >
                რეგისტრაცია (+10 კრედიტი)
              </button>

              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>მონაცემები ინახება ლოკალურად ბრაუზერში (დემო რეჟიმი).</span>
              </p>
            </form>
          )}

          {/* Premium Promo Banner */}
          <button
            type="button"
            onClick={() => onNavigate('premium')}
            className="w-full flex items-center justify-between gap-4 rounded-2xl border border-violet-500/35 bg-gradient-to-r from-violet-950/60 via-[#101322] to-blue-950/50 p-5 text-left hover:border-violet-400/60 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 shrink-0">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-white">გახდი PHOTO AI Premium</p>
                <p className="text-xs text-slate-300">
                  მეტი კრედიტი, HD ექსპორტი და პრიორიტეტული სტილები
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-violet-300 shrink-0" />
          </button>
        </div>

        {/* Right: Credits & History */}
        <div className="lg:col-span-5 rounded-3xl border border-white/[0.08] bg-[#0D1019] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-blue-400" />
              <h2 className="text-sm sm:text-base font-semibold text-white">კრედიტების ისტორია</h2>
            </div>
            <span className="flex items-center gap-1 text-xs font-mono tabular-nums text-violet-300">
              <Coins className="h-3.5 w-3.5" />
              {user.credits}
            </span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {transactions.slice(0, 8).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-3 py-3 text-xs sm:text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-slate-200 truncate">{tx.label}</p>
                  <p className="text-[11px] text-slate-500">{tx.timestamp}</p>
                </div>
                <span
                  className={`font-mono text-xs font-semibold tabular-nums shrink-0 ${
                    tx.amount >= 0 ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} კრ.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
