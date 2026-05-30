import { CATEGORY_OPTIONS, FORM_LIMITS, LOCATION_OPTIONS } from './constants';
import type { MessageFormData } from '@/types';

export type FormErrors = Partial<Record<keyof MessageFormData, string>>;

/** Полная валидация формы послания. Возвращает карту ошибок по полям. */
export function validateMessageForm(data: MessageFormData): FormErrors {
  const errors: FormErrors = {};
  const name = data.name.trim();
  const wish = data.wish_to_city.trim();
  const future = data.future_city.trim();
  const future2096 = data.message_to_2096.trim();

  if (!name) {
    errors.name = 'Пожалуйста, укажите имя.';
  } else if (name.length > FORM_LIMITS.nameMax) {
    errors.name = `Имя не должно превышать ${FORM_LIMITS.nameMax} символов.`;
  }

  if (!CATEGORY_OPTIONS.includes(data.category)) {
    errors.category = 'Выберите категорию из списка.';
  }

  if (!LOCATION_OPTIONS.includes(data.location)) {
    errors.location = 'Выберите место проживания.';
  }

  if (wish.length < FORM_LIMITS.wishMin) {
    errors.wish_to_city = `Минимум ${FORM_LIMITS.wishMin} символов.`;
  } else if (wish.length > FORM_LIMITS.wishMax) {
    errors.wish_to_city = `Максимум ${FORM_LIMITS.wishMax} символов.`;
  }

  if (future.length < FORM_LIMITS.futureMin) {
    errors.future_city = `Минимум ${FORM_LIMITS.futureMin} символов.`;
  } else if (future.length > FORM_LIMITS.futureMax) {
    errors.future_city = `Максимум ${FORM_LIMITS.futureMax} символов.`;
  }

  if (future2096.length > FORM_LIMITS.messageMax) {
    errors.message_to_2096 = `Максимум ${FORM_LIMITS.messageMax} символов.`;
  }

  if (!data.consent) {
    errors.consent = 'Необходимо согласие на обработку данных.';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const EMPTY_FORM: MessageFormData = {
  name: '',
  category: 'житель города',
  location: 'Обнинск',
  wish_to_city: '',
  future_city: '',
  message_to_2096: '',
  consent: false,
};
