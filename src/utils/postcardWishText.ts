/** Прямоугольник пергамента на открытке 1080×1350 (px). */
export const POSTCARD_WISH_BOX = {
  left: 248,
  top: 547,
  width: 583,
  height: 283,
  paddingX: 20,
  paddingY: 14,
} as const;

export const POSTCARD_WISH_LINE_HEIGHT = 1.32;
const CHAR_WIDTH_RATIO = 0.52;

/** Разбивает текст по пробелам, не рвёт слова без необходимости. */
export function splitWishIntoLines(
  text: string,
  maxWidthPx: number,
  fontSizePx: number,
): string[] {
  const charWidth = fontSizePx * CHAR_WIDTH_RATIO;
  const maxChars = Math.max(10, Math.floor(maxWidthPx / charWidth));
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    if (word.length > maxChars) {
      let rest = word;
      while (rest.length > maxChars) {
        lines.push(rest.slice(0, maxChars));
        rest = rest.slice(maxChars);
      }
      line = rest;
    } else {
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines.length > 0 ? lines : [''];
}

/** Подбирает размер шрифта и строки, чтобы текст поместился в пергамент. */
export function fitWishTypography(text: string): {
  fontSize: number;
  lines: string[];
} {
  const innerW = POSTCARD_WISH_BOX.width - POSTCARD_WISH_BOX.paddingX * 2;
  const innerH = POSTCARD_WISH_BOX.height - POSTCARD_WISH_BOX.paddingY * 2;

  let best: { fontSize: number; lines: string[] } | null = null;

  for (let fontSize = 42; fontSize >= 20; fontSize -= 2) {
    const lines = splitWishIntoLines(text, innerW, fontSize);
    const blockHeight = lines.length * fontSize * POSTCARD_WISH_LINE_HEIGHT;
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

  const fontSize = 20;
  return {
    fontSize,
    lines: splitWishIntoLines(text, innerW, fontSize),
  };
}
