import { ArrowLeft, Check, Coins, Crown, Info } from 'lucide-react';
import { CREDIT_PACKS, PREMIUM_PLANS } from '../data/catalog';
import { TabId, UserProfile } from '../types/app';

interface PremiumViewProps {
  user: UserProfile;
  onActivatePlan: (amount: number, label: string, plan?: 'free' | 'pro' | 'studio') => void;
  onNavigate: (tab: TabId) => void;
}

export function PremiumView({ user, onActivatePlan, onNavigate }: PremiumViewProps) {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white min-h-[36px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>პროფილზე დაბრუნება</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white">PHOTO AI Premium და კრედიტები</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            აირჩიე პაკეტი ან შეავსე კრედიტების ბალანსი
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.09] bg-[#0D1019] px-4 py-2.5 text-right shrink-0">
          <p className="text-[11px] text-slate-400">მიმდინარე ბალანსი</p>
          <p className="font-mono text-base font-bold tabular-nums text-violet-300">
            {user.credits} კრედიტი
          </p>
        </div>
      </div>

      {/* Demo billing disclosure */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-blue-500/25 bg-blue-950/20 p-3.5 text-xs leading-relaxed text-slate-300">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold text-white">დემო რეჟიმი:</strong> გადახდის სისტემა ჯერ არ არის მიბმული — პაკეტის ან კრედიტების არჩევისას ბალანსი განახლდება სატესტოდ.
        </p>
      </div>

      {/* Subscription Plans */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PREMIUM_PLANS.map((plan) => {
          const isCurrent = user.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-3xl border p-6 transition-all ${
                plan.highlighted
                  ? 'border-violet-500/50 bg-gradient-to-b from-violet-950/35 via-[#0E111B] to-[#0B0D16] shadow-lg shadow-violet-900/15'
                  : 'border-white/[0.08] bg-[#0D1019]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                  {plan.highlighted && <Crown className="h-5 w-5 text-violet-400 shrink-0" />}
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-bold tabular-nums text-white">
                    {plan.priceLabel}
                  </span>
                  <span className="text-xs text-slate-400">/ {plan.periodLabel}</span>
                </div>

                <p className="mt-2 text-xs font-medium text-violet-300">{plan.creditsLabel}</p>

                <ul className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-4">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <Check className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isCurrent && plan.id === 'free'}
                onClick={() =>
                  onActivatePlan(
                    plan.creditsToAdd,
                    `${plan.name} პაკეტი`,
                    plan.id
                  )
                }
                className={`mt-6 w-full min-h-[48px] rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'border border-violet-400/40 bg-violet-500/15 text-violet-200'
                    : plan.highlighted
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-md shadow-violet-600/25'
                    : 'bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.1] text-white'
                }`}
              >
                {isCurrent ? 'აქტიური პაკეტი' : 'არჩევა (დემო)'}
              </button>
            </div>
          );
        })}
      </section>

      {/* Credit Packs */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">ერთჯერადი კრედიტების პაკეტები</h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
            შეავსე ბალანსი გამოწერის გარეშე
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {CREDIT_PACKS.map((pack) => (
            <button
              key={pack.id}
              type="button"
              onClick={() => onActivatePlan(pack.credits, `+${pack.credits} კრედიტის შევსება`)}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0D1019] hover:border-blue-500/40 hover:bg-[#121625] p-5 text-left transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-300 shrink-0">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-base font-bold tabular-nums text-white">
                    +{pack.credits} კრედიტი
                  </p>
                  <p className="text-xs text-slate-400">{pack.description}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold tabular-nums text-violet-300 shrink-0">
                {pack.priceLabel}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
