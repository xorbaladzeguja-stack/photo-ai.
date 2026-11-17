import { Download, Images, Plus, Share2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { SavedPhotoItem, TabId } from '../types/app';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface MyPhotosViewProps {
  photos: SavedPhotoItem[];
  onDelete: (id: string) => void;
  onNavigate: (tab: TabId) => void;
  onNotify: (msg: string) => void;
}

export function MyPhotosView({ photos, onDelete, onNavigate, onNotify }: MyPhotosViewProps) {
  const [activePhoto, setActivePhoto] = useState<SavedPhotoItem | null>(null);

  const handleDownload = (photo: SavedPhotoItem) => {
    const link = document.createElement('a');
    link.href = photo.afterDataUrl;
    link.download = `photo-ai-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('ფოტო ჩამოიტვირთა');
  };

  const handleShare = async (photo: SavedPhotoItem) => {
    try {
      const response = await fetch(photo.afterDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'photo-ai.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `PHOTO AI — ${photo.styleName}`,
          files: [file],
        });
        return;
      }
      handleDownload(photo);
      onNotify('ფოტო ჩამოიტვირთა გასაზიარებლად');
    } catch {
      // Cancelled share
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">ჩემი ფოტოები</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
            შენახული დემო ნამუშევრები · <span className="font-mono tabular-nums">{photos.length}</span> ფოტო
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('create')}
          className="flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-xs sm:text-sm font-semibold text-white shadow-md shadow-violet-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>ახალი ფოტო</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0B0E17] p-8 sm:p-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 border border-violet-500/25 text-violet-300">
            <Images className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-base sm:text-lg font-semibold text-white">
            შენახული ფოტოები ჯერ არ არის
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-xs sm:text-sm text-slate-400">
            ატვირთე ფოტო, გამოსცადე სასურველი სტილი დემო რეჟიმში და შეინახე შედეგი აქ.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="mt-6 inline-flex items-center gap-2 min-h-[46px] px-6 py-2.5 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-sm font-medium text-white transition-colors"
          >
            <span>სტუდიაში გადასვლა</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1019] flex flex-col"
            >
              <button
                type="button"
                onClick={() => setActivePhoto(photo)}
                className="relative aspect-[3/4] w-full overflow-hidden bg-[#06070B] text-left"
              >
                <img
                  src={photo.afterDataUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-[11px] text-slate-300 truncate">{photo.createdAt} · დემო</p>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{photo.styleName}</p>
                </div>
              </button>

              <div className="flex items-center justify-between gap-1 px-2 py-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleDownload(photo)}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  aria-label="ჩამოტვირთვა"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(photo)}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  aria-label="გაზიარება"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(photo.id)}
                  className="flex h-10 flex-1 items-center justify-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label="წაშლა"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Inspector with Before/After Slider */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="ფოტოს შედარება"
        >
          <div className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl border border-white/[0.1] bg-[#0B0D16] p-5 max-h-[92dvh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">{activePhoto.styleName}</h2>
                <p className="text-xs text-slate-400">
                  {activePhoto.featureLabel} · {activePhoto.createdAt} · დემო რეჟიმი
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-slate-300 hover:text-white"
                aria-label="დახურვა"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <BeforeAfterSlider beforeSrc={activePhoto.beforeDataUrl} afterSrc={activePhoto.afterDataUrl} />

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleDownload(activePhoto)}
                className="flex-1 flex items-center justify-center gap-2 min-h-[46px] rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white"
              >
                <Download className="h-4 w-4" />
                <span>ჩამოტვირთვა</span>
              </button>
              <button
                type="button"
                onClick={() => handleShare(activePhoto)}
                className="flex-1 flex items-center justify-center gap-2 min-h-[46px] rounded-xl border border-white/[0.1] bg-[#121624] text-sm font-medium text-white"
              >
                <Share2 className="h-4 w-4" />
                <span>გაზიარება</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
