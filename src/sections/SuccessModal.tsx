import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clock3, Download, Loader2, PenLine } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShareButtons } from '@/components/ShareButtons';
import {
  Postcard,
  POSTCARD_HEIGHT,
  POSTCARD_WIDTH,
} from '@/components/Postcard';
import { useCountdown } from '@/hooks/useCountdown';
import { downloadPostcard } from '@/utils/postcard';
import { formatDate, formatMessageNumber, pluralRu } from '@/utils/format';
import { primaryMessageLabel, primaryMessageText } from '@/utils/message';
import { scrollToSection } from '@/utils/scroll';
import {
  CAPSULE_OPEN_DATE,
  CAPSULE_OPEN_DATE_LABEL,
  HISTORY_NOTE,
  SECTION_IDS,
} from '@/utils/constants';
import type { Message } from '@/types';

interface SuccessModalProps {
  message: Message | null;
  onClose: () => void;
}

const PREVIEW_WIDTH = 248;
const PREVIEW_SCALE = PREVIEW_WIDTH / POSTCARD_WIDTH;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function SuccessModal({ message, onClose }: SuccessModalProps) {
  const postcardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const countdown = useCountdown(CAPSULE_OPEN_DATE);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const handleDownload = async () => {
    if (!postcardRef.current || !message) return;
    setDownloading(true);
    try {
      await downloadPostcard(
        postcardRef.current,
        `obninsk-70-poslanie-${formatMessageNumber(message.message_number)}.png`,
      );
      setToast('Открытка сохранена');
    } catch {
      setToast('Не удалось создать открытку');
    } finally {
      setDownloading(false);
    }
  };

  const handleWriteNew = () => {
    onClose();
    window.setTimeout(() => scrollToSection(SECTION_IDS.form), 320);
  };

  const countdownCells = message
    ? [
        {
          value: countdown.years,
          label: pluralRu(countdown.years, 'год', 'года', 'лет'),
        },
        {
          value: countdown.months,
          label: pluralRu(countdown.months, 'месяц', 'месяца', 'месяцев'),
        },
        {
          value: countdown.days,
          label: pluralRu(countdown.days, 'день', 'дня', 'дней'),
        },
        {
          value: countdown.hours,
          label: pluralRu(countdown.hours, 'час', 'часа', 'часов'),
        },
      ]
    : [];

  return (
    <Modal
      open={Boolean(message)}
      onClose={onClose}
      closeOnBackdrop={false}
      className="max-w-2xl"
    >
      {message && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7 p-6 sm:p-9"
        >
          {/* Блок 1 — статус успеха */}
          <motion.div variants={item} className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <span className="absolute inset-0 animate-pulse-glow rounded-full bg-success/30 blur-xl" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-success/40 bg-success/10">
                <Check className="h-8 w-8 text-success" strokeWidth={2.5} />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-2xl font-semibold leading-tight text-balance sm:text-3xl">
                Послание сохранено в цифровой капсуле времени
              </h3>
              <p className="text-sm text-secondary sm:text-base">
                Ваш голос станет частью истории Обнинска.
              </p>
            </div>
          </motion.div>

          {/* Блок 2 — текст послания (главный объект) */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.08] to-transparent p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
              {primaryMessageLabel(message)}
            </p>
            <p className="relative mt-3 font-display text-xl font-medium leading-relaxed text-text text-balance sm:text-2xl">
              <span className="mr-1 font-display text-3xl text-primary/50">«</span>
              {primaryMessageText(message)}
              <span className="ml-1 font-display text-3xl text-primary/50">»</span>
            </p>
          </motion.div>

          {/* Блок 3 — автор (вторичный уровень) */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-secondary"
          >
            <span className="font-semibold text-text">{message.name}</span>
            <span className="h-1 w-1 rounded-full bg-secondary/40" />
            <span>{formatDate(message.created_at)}</span>
            <span className="h-1 w-1 rounded-full bg-secondary/40" />
            <span className="capitalize">{message.category}</span>
            <span className="ml-auto rounded-full border border-primary/20 px-3 py-1 text-xs font-medium tabular-nums text-primary">
              № {formatMessageNumber(message.message_number)}
            </span>
          </motion.div>

          {/* Блок 4 — таймер открытия */}
          <motion.div variants={item} className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-secondary">
              <Clock3 className="h-4 w-4 text-primary" />
              До открытия капсулы · {CAPSULE_OPEN_DATE_LABEL}
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {countdownCells.map((cell, index) => (
                <div
                  key={index}
                  className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4"
                >
                  <span className="font-display text-2xl font-semibold tabular-nums text-primary sm:text-3xl">
                    {cell.value}
                  </span>
                  <span className="text-[11px] text-secondary">{cell.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Блок 5 — исторический контекст */}
          <motion.p
            variants={item}
            className="border-l-2 border-primary/40 pl-4 text-sm italic leading-relaxed text-secondary"
          >
            {HISTORY_NOTE}
          </motion.p>

          {/* Блок 6 — распространение */}
          <motion.div variants={item} className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              {/* Превью открытки */}
              <div
                className="shrink-0 overflow-hidden rounded-xl border border-border shadow-card"
                style={{
                  width: PREVIEW_WIDTH,
                  height: POSTCARD_HEIGHT * PREVIEW_SCALE,
                }}
              >
                <div
                  style={{
                    width: POSTCARD_WIDTH,
                    height: POSTCARD_HEIGHT,
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <Postcard ref={postcardRef} message={message} />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <p className="text-sm font-medium text-text">
                  Поделитесь письмом в будущее
                </p>
                <p className="text-xs leading-relaxed text-secondary">
                  Покажите друзьям, что вы стали частью истории города. Каждая
                  открытка приглашает новых жителей.
                </p>
              </div>
            </div>

            <ShareButtons onNotify={setToast} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                fullWidth
                size="lg"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Download className="h-5 w-5" />
                )}
                Скачать открытку
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="secondary"
                onClick={handleWriteNew}
              >
                <PenLine className="h-5 w-5" />
                Написать новое
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Тост — через портал, чтобы позиционироваться относительно окна */}
      {createPortal(
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
            >
              <span className="flex items-center gap-2 rounded-full border border-primary/30 bg-surface-elevated/95 px-5 py-2.5 text-sm text-text shadow-card backdrop-blur">
                <Check className="h-4 w-4 text-success" />
                {toast}
              </span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Modal>
  );
}
