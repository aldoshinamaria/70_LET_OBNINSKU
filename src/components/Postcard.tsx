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
import {
  fitAuthorTypography,
  POSTCARD_AUTHOR_BOX,
  POSTCARD_AUTHOR_LINE_HEIGHT,
} from '@/utils/postcardAuthorText';
import {
  fitWishTypography,
  POSTCARD_WISH_BOX,
  POSTCARD_WISH_LINE_HEIGHT,
} from '@/utils/postcardWishText';
import type { Message } from '@/types';

export const POSTCARD_WIDTH = 1080;
export const POSTCARD_HEIGHT = 1350;

interface PostcardProps {
  message: Message;
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

const wishFontFamily =
  '"Cormorant Garamond", Georgia, "Times New Roman", serif';

/**
 * Открытка 1080×1350 на основе шаблона «Шаблон открытки.png».
 * Пожелание на пергаменте — перенос только по словам, без «съезда» при экспорте.
 */
export const Postcard = forwardRef<HTMLDivElement, PostcardProps>(
  ({ message }, ref) => {
    const wish = truncate(postcardMessageText(message), 380);
    const { fontSize, lines } = fitWishTypography(wish);
    const authorTypography = fitAuthorTypography(message.name);
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
            left: POSTCARD_WISH_BOX.left,
            top: POSTCARD_WISH_BOX.top,
            width: POSTCARD_WISH_BOX.width,
            height: POSTCARD_WISH_BOX.height,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${POSTCARD_WISH_BOX.paddingY}px ${POSTCARD_WISH_BOX.paddingX}px`,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
            }}
          >
            {lines.map((line, index) => (
              <span
                key={`${index}-${line}`}
                style={{
                  display: 'block',
                  width: '100%',
                  fontFamily: wishFontFamily,
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize,
                  lineHeight: POSTCARD_WISH_LINE_HEIGHT,
                  textAlign: 'center',
                  color: '#2A1F0E',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 1px rgba(255,255,255,0.35)',
                }}
              >
                {line}
              </span>
            ))}
          </div>
          <svg
            aria-hidden
            viewBox="0 0 32 28"
            style={{
              position: 'absolute',
              right: 28,
              bottom: 10,
              width: 34,
              height: 30,
              opacity: 0.92,
            }}
          >
            <path
              d="M16 24.5c-.4 0-.8-.2-1.1-.5C9.2 19.2 4 15.1 4 10.2 4 6.8 6.8 4 10.2 4c2.2 0 4.2 1.1 5.4 2.9.5-.7 1.2-1.3 2-1.7 1.2-.6 2.6-.9 4-.9 3.4 0 6.2 2.8 6.2 6.2 0 4.9-5.2 9-10.9 13.8-.3.3-.7.5-1.1.5z"
              fill="none"
              stroke="#2A1F0E"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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

        {/* Автор — размер шрифта под длину имени (до 2 строк) */}
        <div
          style={{
            position: 'absolute',
            left: POSTCARD_AUTHOR_BOX.left,
            top: POSTCARD_AUTHOR_BOX.top,
            width: POSTCARD_AUTHOR_BOX.width,
            height: POSTCARD_AUTHOR_BOX.maxHeight,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxSizing: 'border-box',
            padding: `0 ${POSTCARD_AUTHOR_BOX.paddingX}px`,
          }}
        >
          {authorTypography.lines.map((line, index) => (
            <span
              key={`author-${index}-${line}`}
              style={{
                display: 'block',
                width: '100%',
                fontFamily: fieldTextStyle.fontFamily,
                fontWeight: 700,
                fontSize: authorTypography.fontSize,
                lineHeight: POSTCARD_AUTHOR_LINE_HEIGHT,
                textAlign: 'center',
                color: fieldTextStyle.color,
                textShadow: fieldTextStyle.textShadow,
                whiteSpace: 'nowrap',
              }}
            >
              {line}
            </span>
          ))}
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
