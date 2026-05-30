/**
 * Координаты текстовых полей на шаблоне открытки 1080×1350.
 * Подогнаны под «Шаблон открытки.png» (после ресайза из 1122×1402).
 */
export const POSTCARD_LAYOUT = {
  /** Текст пожелания на пергаменте внутри капсулы */
  message: {
    left: '23%',
    top: '40.5%',
    width: '54%',
    height: '21%',
  },
  /** Номер на золотой крышке капсулы */
  capsuleNumber: {
    left: '79.5%',
    top: '46.8%',
    width: '14%',
  },
  author: { left: '5.5%', top: '74.2%', width: '20%' },
  sentDate: { left: '27%', top: '74.2%', width: '21%' },
  messageNumber: { left: '49%', top: '74.2%', width: '21%' },
  openingDate: { left: '71%', top: '74.2%', width: '24%' },
} as const;
