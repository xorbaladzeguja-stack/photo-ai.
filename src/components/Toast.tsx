import { CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3600);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-500/30 bg-[#111420]/95 backdrop-blur-xl px-4 py-3 shadow-xl shadow-black/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
              <p className="text-sm font-medium text-slate-100 leading-snug">{message}</p>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
              aria-label="შეტყობინების დახურვა"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
