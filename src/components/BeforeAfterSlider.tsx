import { MoveHorizontal } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt = 'ფოტოს შედარება მანამდე და შემდეგ',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(4, Math.min(96, Math.round(pct))));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-[3/4] max-h-[540px] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B0D14] select-none touch-none cursor-ew-resize"
      >
        {/* After image (full background) */}
        <img
          src={afterSrc}
          alt={`${alt} — შემდეგ`}
          referrerPolicy="no-referrer"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain bg-[#06070B]"
        />

        {/* Before image (clipped left side) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeSrc}
            alt={`${alt} — მანამდე`}
            referrerPolicy="no-referrer"
            draggable={false}
            className="h-full w-full object-contain bg-[#06070B]"
          />
        </div>

        {/* Corner labels */}
        <span className="pointer-events-none absolute top-3 left-3 rounded-lg bg-black/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-slate-200 border border-white/10">
          მანამდე
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-lg bg-violet-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-violet-200 border border-violet-400/30">
          შემდეგ (დემო)
        </span>

        {/* Divider line & thumb handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(139,92,246,0.9)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-[#0D101B]/95 border border-violet-400/70 text-white shadow-lg shadow-violet-600/30">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Accessible range control for precision & keyboard users */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs text-slate-400 whitespace-nowrap">მანამდე</span>
        <input
          type="range"
          min={4}
          max={96}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Before და After შედარების სლაიდერი"
          className="h-2 w-full cursor-pointer accent-violet-500 rounded-lg bg-white/10"
        />
        <span className="text-xs text-violet-300 whitespace-nowrap">შემდეგ</span>
      </div>
    </div>
  );
}
