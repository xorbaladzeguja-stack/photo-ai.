import {
  ArrowRight,
  Coins,
  Crown,
  ImagePlus,
  Layers,
  Palette,
  Sparkles,
  Upload,
  UserCheck,
  Wand2,
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useRef, useState } from 'react';
import { FEATURE_CARDS, HERO_IMAGE_URL, POPULAR_STYLES } from '../data/catalog';
import { FeatureId, TabId, UserProfile } from '../types/app';
import { normalizeUploadedImage } from '../utils/imageProcessor';

interface HomeViewProps {
  user: UserProfile;
  onSelectFeature: (featureId: FeatureId, styleId?: string) => void;
  onUploadPhoto: (dataUrl: string) => void;
  onNavigate: (tab: TabId) => void;
  onNotify: (msg: string) => void;
}

const FEATURE_ICONS: Record<FeatureId, typeof Wand2> = {
  enhance: Wand2,
  portrait: UserCheck,
  styles: Palette,
  background: Layers,
};

export function HomeView({
  user,
  onSelectFeature,
  onUploadPhoto,
  onNavigate,
  onNotify,
}: HomeViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [heroLoaded, setHeroLoaded] = useState(true);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('გთხოვთ აირჩიოთ სურათის ფაილი (JPG, PNG, WEBP)');
      return;
    }
    setIsReadingFile(true);
    try {
      const dataUrl = await normalizeUploadedImage(file);
      onUploadPhoto(dataUrl);
    } catch {
      onNotify('ფოტოს წაკითხვა ვერ მოხერხდა, სცადეთ სხვა ფაილი');
    } finally {
      setIsReadingFile(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0B0D16]">
        {/* Ambient Violet & Blue Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 lg:p-10 z-10">
            <div className="space-y-4">
              <p className="text-xs font-medium text-violet-300/90 tracking-wide">
                PHOTO AI სტუდია · დემო რეჟიმი
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.16] tracking-tight text-white [text-wrap:balance]">
                შენი ფოტო, ახალი შესაძლებლობები
              </h1>

              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                გააუმჯობესე ფოტოს ხარისხი, სცადე სტუდიური პორტრეტები, შეარჩიე სტილები და შეცვალე ფონი პირდაპირ სმარტფონიდან.
              </p>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                disabled={isReadingFile}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2.5 min-h-[50px] px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-[0.99] text-white text-sm sm:text-base font-semibold shadow-lg shadow-violet-600/25 transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <Upload className="h-5 w-5 shrink-0" />
                <span>{isReadingFile ? 'იტვირთება...' : 'ატვირთე ფოტო'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('create')}
                className="flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-slate-200 text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <ImagePlus className="h-4 w-4 text-blue-400 shrink-0" />
                <span>სტუდიის გახსნა</span>
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative lg:col-span-5 min-h-[220px] sm:min-h-[260px] lg:min-h-[340px] overflow-hidden border-t lg:border-t-0 lg:border-l border-white/[0.07]">
            {heroLoaded ? (
              <img
                src={HERO_IMAGE_URL}
                alt="PHOTO AI სტუდიური პორტრეტის მაგალითი"
                referrerPolicy="no-referrer"
                onError={() => setHeroLoaded(false)}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-950/60 via-[#0B0D16] to-blue-950/60 p-6">
                <Sparkles className="h-10 w-10 text-violet-400/70" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0D16] via-[#0B0D16]/30 to-transparent lg:bg-gradient-to-r lg:from-[#0B0D16] lg:via-transparent lg:to-transparent" />
            <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
              <span>სტუდიური განათების პრევიუ</span>
              <span className="text-slate-400">85mm პორტრეტი</span>
            </div>
          </div>
        </div>
      </section>

      {/* Credits Strip */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#0D1019] px-4 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 shrink-0">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">ხელმისაწვდომი ბალანსი</p>
            <p className="text-sm sm:text-base font-semibold text-white">
              <span className="font-mono tabular-nums text-violet-300">{user.credits}</span> კრედიტი
              <span className="mx-2 text-slate-600" aria-hidden="true">·</span>
              <span className="text-xs font-normal text-slate-400">
                {user.plan === 'free' ? 'საბაზისო პაკეტი' : user.plan === 'pro' ? 'PHOTO AI Pro' : 'Studio Max'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!user.isRegistered && (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
            >
              რეგისტრაცია (+10 კრედიტი)
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('premium')}
            className="flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/30 text-xs font-semibold text-violet-200 transition-colors whitespace-nowrap"
          >
            <Crown className="h-3.5 w-3.5 text-violet-300 shrink-0" />
            <span>Premium</span>
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">AI ინსტრუმენტები</h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
              აირჩიე ფუნქცია და სცადე შენს ფოტოზე · დემო რეჟიმი
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {FEATURE_CARDS.map((card, index) => {
            const Icon = FEATURE_ICONS[card.id];
            const glowStyle =
              card.accentHue === 'violet'
                ? 'from-violet-500/15 to-transparent text-violet-300 border-violet-500/25'
                : card.accentHue === 'blue'
                ? 'from-blue-500/15 to-transparent text-blue-300 border-blue-500/25'
                : card.accentHue === 'indigo'
                ? 'from-indigo-500/15 to-transparent text-indigo-300 border-indigo-500/25'
                : 'from-sky-500/15 to-transparent text-sky-300 border-sky-500/25';

            return (
              <motion.button
                key={card.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                onClick={() => onSelectFeature(card.id)}
                className="group relative flex flex-col justify-between text-left rounded-2xl border border-white/[0.08] bg-[#0D1019] hover:bg-[#121624] hover:border-violet-500/35 p-5 transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <div>
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br border ${glowStyle}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-400">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-slate-400">
                  <span>დემო რეჟიმი · {card.creditCost} კრედიტი</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Popular AI Styles Gallery */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">პოპულარული AI სტილები</h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
              დააჭირე სასურველ სტილს ფოტოზე გამოსაცდელად
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectFeature('styles')}
            className="text-xs sm:text-sm font-medium text-violet-300 hover:text-violet-200 whitespace-nowrap min-h-[44px] flex items-center"
          >
            ყველა სტილი
          </button>
        </div>

        <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
          {POPULAR_STYLES.map((style) => (
            <StyleGalleryCard
              key={style.id}
              name={style.name}
              category={style.category}
              imageUrl={style.imageUrl}
              creditCost={style.creditCost}
              onClick={() => onSelectFeature(style.featureId, style.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

interface StyleGalleryCardProps {
  name: string;
  category: string;
  imageUrl: string;
  creditCost: number;
  onClick: () => void;
}

function StyleGalleryCard({ name, category, imageUrl, creditCost, onClick }: StyleGalleryCardProps) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-[168px] sm:w-[190px] md:w-auto shrink-0 aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E111A] text-left transition-all hover:border-violet-500/45 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {imgOk ? (
        <img
          src={imageUrl}
          alt={name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgOk(false)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-violet-950/70 to-blue-950/70 p-4 text-center">
          <Palette className="h-7 w-7 text-violet-300 mb-2" />
          <span className="text-xs font-medium text-slate-200">{name}</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className="text-[11px] text-slate-300">
          {category} · {creditCost} კრ.
        </p>
        <h3 className="mt-0.5 text-sm font-semibold text-white truncate">{name}</h3>
      </div>
    </button>
  );
}
