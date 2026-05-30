import { splitWishIntoLines } from './postcardWishText';

const POSTCARD_W = 1080;
const POSTCARD_H = 1350;

/** Manrope 700 — чуть шире, чем пожелание на пергаменте. */
const AUTHOR_CHAR_WIDTH_RATIO = 0.56;

export const POSTCARD_AUTHOR_LINE_HEIGHT = 1.2;

/** Ячейка «Автор» внизу открытки (px). */
export const POSTCARD_AUTHOR_BOX = {
  left: POSTCARD_W * 0.075,
  top: POSTCARD_H * 0.742,
  width: POSTCARD_W * 0.2,
  maxHeight: 54,
  paddingX: 6,
  maxLines: 2,
} as const;

function truncateToLine(
  text: string,
  maxWidthPx: number,
  fontSizePx: number,
): string {
  const maxChars = Math.max(
    4,
    Math.floor(maxWidthPx / (fontSizePx * AUTHOR_CHAR_WIDTH_RATIO)),
  );
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1)}…`;
}

function clampAuthorLines(
  lines: string[],
  maxLines: number,
  innerW: number,
  fontSize: number,
): string[] {
  if (lines.length <= maxLines) return lines;
  return [
    ...lines.slice(0, maxLines - 1),
    truncateToLine(lines.slice(maxLines - 1).join(' '), innerW, fontSize),
  ];
}

/** Подбирает размер шрифта и строки, чтобы имя не наезжало на подписи шаблона. */
export function fitAuthorTypography(name: string): {
  fontSize: number;
  lines: string[];
} {
  const text = name.trim();
  const innerW = POSTCARD_AUTHOR_BOX.width - POSTCARD_AUTHOR_BOX.paddingX * 2;
  const innerH = POSTCARD_AUTHOR_BOX.maxHeight;
  const { maxLines } = POSTCARD_AUTHOR_BOX;

  let best: { fontSize: number; lines: string[] } | null = null;

  for (let fontSize = 28; fontSize >= 14; fontSize -= 2) {
    const lines = splitWishIntoLines(
      text,
      innerW,
      fontSize,
      AUTHOR_CHAR_WIDTH_RATIO,
    );
    if (lines.length > maxLines) continue;

    const blockHeight = lines.length * fontSize * POSTCARD_AUTHOR_LINE_HEIGHT;
    if (blockHeight > innerH) continue;

    if (
      !best ||
      lines.length < best.lines.length ||
      (lines.length === best.lines.length && fontSize > best.fontSize)
    ) {
      best = { fontSize, lines };
    }
  }

  if (best) return best;

  const fontSize = 14;
  const lines = clampAuthorLines(
    splitWishIntoLines(text, innerW, fontSize, AUTHOR_CHAR_WIDTH_RATIO),
    maxLines,
    innerW,
    fontSize,
  );
  return { fontSize, lines };
}
