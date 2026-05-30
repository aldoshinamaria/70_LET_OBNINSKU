import { forwardRef, type CSSProperties } from 'react';
import postcardTemplate from '@/assets/postcard-template.png';
import { CAPSULE_OPEN_DATE_LABEL } from '@/utils/constants';
import {
  formatMessageNumber,
  formatPostcardDate,
  truncate,
} from '@/utils/format';
import { postcardMessageText } from '@/utils/message';
import { POSTCARD_LAYOUT } from '@/utils/postcardLayout';
import type { Message } from '@/types';

export const POSTCARD_WIDTH = 1080;
export const POSTCARD_HEIGHT = 1350;

interface PostcardProps {
  message: Message;
}

/** Размер шрифта пожелания на пергаменте в зависимости от длины. */
function wishFontSize(length: number): number {
  if (length > 320) return 26;
  if (length > 240) return 30;
  if (length > 160) return 34;
  if (length > 100) return 38;
  if (length > 60) return 42;
  return 46;
}

const fieldTextStyle: CSSProperties = {
  fontFamily: 'Manrope, Arial, sans-serif',
  fontSize: 28,
  fontWeight: 700,
  color: '#F5E6C8',
  textAlign: 'center',
  lineHeight: 1.2,
  textShadow: '0 1px 4px rgba(0,0,0,0.65)',
};

/**
 * Открытка 1080×1350 на основе шаблона «Шаблон открытки.png».
 * Динамические поля: пожелание на пергаменте, имя, дата, номер, дата открытия.
 * Все стили инлайн — для корректного экспорта через html-to-image.
 */
export const Postcard = forwardRef<HTMLDivElement, PostcardProps>(
  ({ message }, ref) => {
    const wish = truncate(postcardMessageText(message), 380);
    const wishSize = wishFontSize(wish.length);
    const number = formatMessageNumber(message.message_number);

    return (
      <div
        ref={ref}
        data-postcard
        style={{
          width: POSTCARD_WIDTH,
          height: POSTCARD_HEIGHT,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Manrope, Arial, sans-serif',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={postcardTemplate}
          alt=""
          width={POSTCARD_WIDTH}
          height={POSTCARD_HEIGHT}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
          }}
        />

        {/* Пожелание на пергаменте */}
        <div
          style={{
            position: 'absolute',
            left: POSTCARD_LAYOUT.message.left,
            top: POSTCARD_LAYOUT.message.top,
            width: POSTCARD_LAYOUT.message.width,
            height: POSTCARD_LAYOUT.message.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            boxSizing: 'border-box',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: wishSize,
              lineHeight: 1.35,
              textAlign: 'center',
              color: '#2A1F0E',
              textShadow: '0 0 1px rgba(255,255,255,0.35)',
            }}
          >
            {wish}
          </p>
        </div>

        {/* Номер на крышке капсулы */}
        <div
          style={{
            position: 'absolute',
            left: POSTCARD_LAYOUT.capsuleNumber.left,
            top: POSTCARD_LAYOUT.capsuleNumber.top,
            width: POSTCARD_LAYOUT.capsuleNumber.width,
            textAlign: 'center',
            fontFamily: 'Manrope, Arial, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 1,
            color: '#3D2E14',
            textShadow: '0 1px 0 rgba(255,220,160,0.35)',
          }}
        >
          № {number}
        </div>

        {/* Автор */}
        <div
          style={{
            position: 'absolute',
            left: POSTCARD_LAYOUT.author.left,
            top: POSTCARD_LAYOUT.author.top,
            width: POSTCARD_LAYOUT.author.width,
            ...fieldTextStyle,
          }}
        >
          {message.name}
        </div>

        {/* Дата отправки */}
        <div
          style={{
            position: 'absolute',
            left: POSTCARD_LAYOUT.sentDate.left,
            top: POSTCARD_LAYOUT.sentDate.top,
            width: POSTCARD_LAYOUT.sentDate.width,
            ...fieldTextStyle,
            fontSize: 24,
          }}
        >
          {formatPostcardDate(message.created_at)}
        </div>

        {/* Номер послания */}
        <div
          style={{
            position: 'absolute',
            left: POSTCARD_LAYOUT.messageNumber.left,
            top: POSTCARD_LAYOUT.messageNumber.top,
            width: POSTCARD_LAYOUT.messageNumber.width,
            ...fieldTextStyle,
          }}
        >
          {number}
        </div>

        {/* Открытие капсулы */}
        <div
          style={{
            position: 'absolute',
            left: POSTCARD_LAYOUT.openingDate.left,
            top: POSTCARD_LAYOUT.openingDate.top,
            width: POSTCARD_LAYOUT.openingDate.width,
            ...fieldTextStyle,
            fontSize: 22,
          }}
        >
          {CAPSULE_OPEN_DATE_LABEL.replace(' года', '')}
        </div>
      </div>
    );
  },
);

Postcard.displayName = 'Postcard';
