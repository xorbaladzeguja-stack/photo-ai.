import {
  ArrowLeft,
  BookmarkCheck,
  Check,
  Download,
  Image as ImageIcon,
  Info,
  Layers,
  Palette,
  RefreshCw,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Upload,
  UserCheck,
  Wand2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  BACKGROUND_PRESETS,
  DEMO_SAMPLE_PORTRAIT_URL,
  FEATURE_CARDS,
  POPULAR_STYLES,
} from '../data/catalog';
import { DemoFilterProfile, FeatureId, SavedPhotoItem, TabId } from '../types/app';
import {
  applyDemoVisualPreview,
  loadImageAsDataUrl,
  normalizeUploadedImage,
} from '../utils/imageProcessor';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface CreateViewProps {
  selectedFeature: FeatureId;
  onSelectFeature: (id: FeatureId) => void;
  selectedStyleId: string;
  onSelectStyleId: (id: string) => void;
  pendingUploadUrl: string | null;
  onClearPendingUpload: () => void;
  userCredits: number;
  onConsumeCredit: (cost: number, label: string) => boolean;
  onSavePhoto: (item: Omit<SavedPhotoItem, 'id' | 'createdAt' | 'isDemo'>) => void;
  onNavigate: (tab: TabId) => void;
  onNotify: (msg: string) => void;
}

export function CreateView({
  selectedFeature,
  onSelectFeature,
  selectedStyleId,
  onSelectStyleId,
  pendingUploadUrl,
  onClearPendingUpload,
  userCredits,
  onConsumeCredit,
  onSavePhoto,
  onNavigate,
  onNotify,
}: CreateViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [selectedBgId, setSelectedBgId] = useState<string>(BACKGROUND_PRESETS[0].id);
  const [intensity, setIntensity] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSavedCurrent, setHasSavedCurrent] = useState(false);
  const [appliedSummary, setAppliedSummary] = useState<{ featureLabel: string; styleName: string } | null>(
    null
  );

  useEffect(() => {
    if (pendingUploadUrl) {
      setBeforeUrl(pendingUploadUrl);
      setAfterUrl(null);
      setHasSavedCurrent(false);
      onClearPendingUpload();
    }
  }, [pendingUploadUrl, onClearPendingUpload]);

  const activeFeature = FEATURE_CARDS.find((f) => f.id === selectedFeature) ?? FEATURE_CARDS[0];
  const activeStyle = POPULAR_STYLES.find((s) => s.id === selectedStyleId) ?? POPULAR_STYLES[0];
  const activeBg = BACKGROUND_PRESETS.find((b) => b.id === selectedBgId) ?? BACKGROUND_PRESETS[0];

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('გთხოვთ აირჩიოთ სურათის ფაილი (JPG, PNG, WEBP)');
      return;
    }

    try {
      const normalized = await normalizeUploadedImage(file);
      setBeforeUrl(normalized);
      setAfterUrl(null);
      setHasSavedCurrent(false);
    } catch {
      onNotify('ფოტოს გახსნა ვერ მოხერხდა');
    } finally {
      e.target.value = '';
    }
  };

  const handleLoadSample = async () => {
    try {
      const dataUrl = await loadImageAsDataUrl(DEMO_SAMPLE_PORTRAIT_URL);
      setBeforeUrl(dataUrl);
      setAfterUrl(null);
      setHasSavedCurrent(false);
    } catch {
      onNotify('საცდელი ფოტოს ჩატვირთვა ვერ მოხერხდა');
    }
  };

  const resolveDemoProfile = (): { profile: DemoFilterProfile; styleLabel: string } => {
    if (selectedFeature === 'enhance') {
      return { profile: 'enhance_hd', styleLabel: 'სიმკვეთრე და კონტრასტი' };
    }
    if (selectedFeature === 'background') {
      return { profile: activeBg.filterProfile, styleLabel: activeBg.name };
    }
    return { profile: activeStyle.filterProfile, styleLabel: activeStyle.name };
  };

  const handleRunDemoProcess = async () => {
    if (!beforeUrl) return;
    if (userCredits < activeFeature.creditCost) {
      onNotify('კრედიტები არასაკმარისია — გადადით Premium გვერდზე');
      return;
    }

    const { profile, styleLabel } = resolveDemoProfile();
    setIsProcessing(true);

    try {
      const resultDataUrl = await applyDemoVisualPreview(beforeUrl, profile, intensity);
      const ok = onConsumeCredit(activeFeature.creditCost, activeFeature.title);
      if (!ok) {
        setIsProcessing(false);
        return;
      }
      setAfterUrl(resultDataUrl);
      setHasSavedCurrent(false);
      setAppliedSummary({
        featureLabel: activeFeature.title,
        styleName: styleLabel,
      });
    } catch {
      onNotify('ვიზუალური პრევიუს შექმნა ვერ მოხერხდა');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToGallery = () => {
    if (!beforeUrl || !afterUrl || !appliedSummary || hasSavedCurrent) return;
    onSavePhoto({
      title: `${appliedSummary.styleName}`,
      featureLabel: appliedSummary.featureLabel,
      styleName: appliedSummary.styleName,
      beforeDataUrl: beforeUrl,
      afterDataUrl: afterUrl,
    });
    setHasSavedCurrent(true);
  };

  const handleDownload = () => {
    if (!afterUrl) return;
    const link = document.createElement('a');
    link.href = afterUrl;
    link.download = `photo-ai-demo-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('ფოტო ჩამოიტვირთა მოწყობილობაზე');
  };

  const handleShare = async () => {
    if (!afterUrl) return;
    try {
      const response = await fetch(afterUrl);
      const blob = await response.blob();
      const file = new File([blob], 'photo-ai-demo.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'PHOTO AI — დემო შედეგი',
          text: 'შექმნილია PHOTO AI აპლიკაციაში (დემო რეჟიმი)',
          files: [file],
        });
        onNotify('ფოტო გაზიარდა');
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: 'PHOTO AI',
          text: 'ჩემი ფოტო PHOTO AI სტუდიიდან',
        });
        return;
      }

      handleDownload();
      onNotify('ბრაუზერში გაზიარება შეზღუდულია — ფოტო ჩამოიტვირთა გასაზიარებლად');
    } catch {
      // User cancelled native share sheet
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFilePick}
        className="hidden"
        aria-hidden="true"
      />

      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">ფოტო სტუდია</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
            დემო რეჟიმი · აირჩიე ფოტო ტელეფონიდან და შეადარე შედეგი Before / After სლაიდერით
          </p>
        </div>

        {beforeUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-white/[0.1] bg-[#10131F] hover:bg-[#171B2B] text-xs font-medium text-slate-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-violet-400" />
            <span>სხვა ფოტო</span>
          </button>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FEATURE_CARDS.map((feature) => {
          const active = feature.id === selectedFeature;
          const Icon =
            feature.id === 'enhance'
              ? Wand2
              : feature.id === 'portrait'
              ? UserCheck
              : feature.id === 'styles'
              ? Palette
              : Layers;

          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => {
                onSelectFeature(feature.id);
                setAfterUrl(null);
              }}
              className={`flex items-center gap-2.5 min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                active
                  ? 'border-violet-500/60 bg-violet-500/15 text-white shadow-sm shadow-violet-500/10'
                  : 'border-white/[0.08] bg-[#0D1019] text-slate-300 hover:bg-[#131725]'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-violet-300' : 'text-slate-400'}`} />
              <span className="text-xs font-medium leading-tight line-clamp-2">{feature.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace */}
      {!beforeUrl ? (
        <div className="rounded-3xl border border-dashed border-white/[0.16] bg-[#0B0E17] p-7 sm:p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/30 text-violet-300">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-lg sm:text-xl font-semibold text-white">
            აირჩიე ფოტო დასაწყებად
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-slate-400">
            ატვირთე ფოტო შენი ტელეფონის გალერეიდან წინასწარი დათვალიერებისა და Before / After შედარებისთვის.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>ატვირთე ფოტო</span>
            </button>

            <button
              type="button"
              onClick={handleLoadSample}
              className="w-full sm:w-auto flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-2xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-sm font-medium text-slate-200 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>საცდელი ფოტოთი ცდა</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Top: Photo Preview or Before-After Result */}
          <div className="lg:col-span-7 space-y-4">
            {afterUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAfterUrl(null)}
                    className="flex items-center gap-1.5 min-h-[40px] text-xs font-medium text-slate-300 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>პარამეტრებზე დაბრუნება</span>
                  </button>
                  <span className="text-xs text-slate-400">
                    {appliedSummary?.styleName} · დემო რეჟიმი
                  </span>
                </div>

                <BeforeAfterSlider beforeSrc={beforeUrl} afterSrc={afterUrl} />

                {/* Save & Share Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveToGallery}
                    disabled={hasSavedCurrent}
                    className={`flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      hasSavedCurrent
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-md shadow-violet-600/20'
                    }`}
                  >
                    {hasSavedCurrent ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>შენახულია</span>
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="h-4 w-4" />
                        <span>გალერეაში შენახვა</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl border border-white/[0.1] bg-[#10131F] hover:bg-[#161A2B] text-sm font-medium text-white transition-colors"
                  >
                    <Download className="h-4 w-4 text-blue-400" />
                    <span>ჩამოტვირთვა</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl border border-white/[0.1] bg-[#10131F] hover:bg-[#161A2B] text-sm font-medium text-white transition-colors"
                  >
                    <Share2 className="h-4 w-4 text-violet-400" />
                    <span>გაზიარება</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0B0E17] p-3">
                <div className="relative aspect-[3/4] max-h-[520px] w-full overflow-hidden rounded-xl bg-[#06070B]">
                  <img
                    src={beforeUrl}
                    alt="არჩეული ფოტოს წინასწარი დათვალიერება"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                  <span className="absolute top-3 left-3 rounded-lg bg-black/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-white/10">
                    წინასწარი დათვალიერება
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right / Bottom: Controls & Demo Disclosure */}
          <div className="lg:col-span-5 space-y-5 rounded-2xl border border-white/[0.08] bg-[#0D1019] p-5">
            <div>
              <h2 className="text-base font-semibold text-white">{activeFeature.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{activeFeature.subtitle}</p>
            </div>

            {/* Sub-options depending on selected tool */}
            {(selectedFeature === 'styles' || selectedFeature === 'portrait') && (
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-slate-300">აირჩიე სტილი</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5">
                  {POPULAR_STYLES.map((style) => {
                    const isSelected = style.id === selectedStyleId;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          onSelectStyleId(style.id);
                          setAfterUrl(null);
                        }}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all min-h-[52px] ${
                          isSelected
                            ? 'border-violet-500/70 bg-violet-500/15 text-white'
                            : 'border-white/[0.07] bg-[#080A11] text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <img
                          src={style.imageUrl}
                          alt={style.name}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-lg object-cover shrink-0 bg-slate-800"
                        />
                        <span className="text-xs font-medium leading-tight line-clamp-2">
                          {style.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedFeature === 'background' && (
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-slate-300">ფონის ვარიანტი</p>
                <div className="space-y-2">
                  {BACKGROUND_PRESETS.map((bg) => {
                    const isSelected = bg.id === selectedBgId;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => {
                          setSelectedBgId(bg.id);
                          setAfterUrl(null);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all min-h-[52px] ${
                          isSelected
                            ? 'border-violet-500/70 bg-violet-500/15 text-white'
                            : 'border-white/[0.07] bg-[#080A11] text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <span
                          className="h-9 w-9 rounded-lg border border-white/15 shrink-0"
                          style={{ background: bg.previewGradient }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{bg.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{bg.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Effect intensity slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-blue-400" />
                  <span>ეფექტის ინტენსივობა</span>
                </span>
                <span className="font-mono tabular-nums text-violet-300">{intensity}%</span>
              </div>
              <input
                type="range"
                min={25}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-violet-500 rounded-lg bg-white/10"
              />
            </div>

            {/* Honest Demo Mode Notice */}
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/25 bg-blue-950/20 p-3 text-xs leading-relaxed text-slate-300">
              <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                <strong className="font-semibold text-white">დემო რეჟიმი:</strong> სანამ რეალური AI სერვისი დაუკავშირდება, ნაჩვენებია ლოკალური ვიზუალური პრევიუ ყალბი გენერაციის გარეშე.
              </p>
            </div>

            {/* Process CTA */}
            {userCredits < activeFeature.creditCost ? (
              <button
                type="button"
                onClick={() => onNavigate('premium')}
                className="w-full min-h-[50px] px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-violet-600 text-sm font-semibold text-white shadow-lg transition-all"
              >
                კრედიტები ამოიწურა · Premium-ზე გადასვლა
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleRunDemoProcess}
                className="w-full flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:scale-[0.99] text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isProcessing
                    ? 'მუშავდება...'
                    : `დემო შედეგის ნახვა · -${activeFeature.creditCost} კრედიტი`}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
