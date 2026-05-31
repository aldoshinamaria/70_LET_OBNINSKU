import { lazy, Suspense, useState, type ChangeEvent, type FormEvent } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { TextArea } from '@/components/ui/TextArea';
import { SelectField } from '@/components/ui/SelectField';
import { Checkbox } from '@/components/ui/Checkbox';

// Экран успеха с открыткой и html-to-image грузится лениво — он нужен
// только после отправки формы и не влияет на стартовую загрузку.
const SuccessModal = lazy(() =>
  import('./SuccessModal').then((m) => ({ default: m.SuccessModal })),
);
import { useSubmitMessage } from '@/hooks/useSubmitMessage';
import {
  EMPTY_FORM,
  hasErrors,
  validateMessageForm,
  type FormErrors,
} from '@/utils/validation';
import {
  CATEGORY_OPTIONS,
  FORM_LIMITS,
  LOCATION_OPTIONS,
  SECTION_IDS,
} from '@/utils/constants';
import type { Message, MessageCategory, MessageFormData, MessageLocation } from '@/types';

interface MessageFormProps {
  onSubmitted?: () => void;
}

export function MessageForm({ onSubmitted }: MessageFormProps) {
  const [form, setForm] = useState<MessageFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedMessage, setSavedMessage] = useState<Message | null>(null);
  const { submit, submitting, error, clearError } = useSubmitMessage();

  const update = <K extends keyof MessageFormData>(
    key: K,
    value: MessageFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleText =
    (key: keyof MessageFormData) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      update(key, event.target.value as MessageFormData[typeof key]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    const validation = validateMessageForm(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    const result = await submit(form);
    if (result) {
      setSavedMessage(result);
      setForm(EMPTY_FORM);
      setErrors({});
      onSubmitted?.();
    }
  };

  const handleModalClose = () => setSavedMessage(null);

  return (
    <section id={SECTION_IDS.form} className="section-spacing relative">
      <div className="mx-auto max-w-content section-padding">
        <SectionHeading
          eyebrow="Ваше послание"
          title="Оставьте свой след в истории"
          description="Заполните форму — и ваши слова навсегда останутся в цифровой капсуле времени Обнинска."
          descriptionClassName="mx-auto max-w-full text-center xl:block xl:w-max xl:max-w-none xl:whitespace-nowrap xl:text-lg"
        />
      </div>

      <div className="mx-auto max-w-3xl section-padding">
        <Reveal className="mt-12 lg:mt-8" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass-card flex flex-col gap-6 rounded-3xl p-6 sm:p-9"
          >
            <TextField
              name="name"
              label="Имя"
              required
              maxLength={FORM_LIMITS.nameMax}
              placeholder="Как вас зовут?"
              value={form.name}
              onChange={handleText('name')}
              error={errors.name}
              hint={`До ${FORM_LIMITS.nameMax} символов`}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField
                name="category"
                label="Категория"
                required
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={(event) =>
                  update('category', event.target.value as MessageCategory)
                }
                error={errors.category}
              />
              <SelectField
                name="location"
                label="Место проживания"
                required
                options={LOCATION_OPTIONS}
                value={form.location}
                onChange={(event) =>
                  update('location', event.target.value as MessageLocation)
                }
                error={errors.location}
              />
            </div>

            <TextArea
              name="wish_to_city"
              label="Пожелание Обнинску"
              required
              value={form.wish_to_city}
              onChange={handleText('wish_to_city')}
              current={form.wish_to_city.length}
              max={FORM_LIMITS.wishMax}
              placeholder={`Чего вы желаете родному городу? (минимум ${FORM_LIMITS.wishMin} символов)`}
              error={errors.wish_to_city}
            />

            <TextArea
              name="future_city"
              label="Каким вы видите Обнинск через 70 лет"
              required
              value={form.future_city}
              onChange={handleText('future_city')}
              current={form.future_city.length}
              max={FORM_LIMITS.futureMax}
              placeholder={`Опишите город будущего (минимум ${FORM_LIMITS.futureMin} символов)`}
              error={errors.future_city}
            />

            <TextArea
              name="message_to_2096"
              label="Послание жителям 2096 года"
              value={form.message_to_2096}
              onChange={handleText('message_to_2096')}
              current={form.message_to_2096.length}
              max={FORM_LIMITS.messageMax}
              placeholder="Необязательно. Что бы вы хотели сказать тем, кто откроет капсулу?"
              error={errors.message_to_2096}
            />

            <Checkbox
              name="consent"
              checked={form.consent}
              onChange={(event) => update('consent', event.target.checked)}
              error={errors.consent}
              label="Я согласен на обработку и публикацию моего послания в рамках проекта «Капсула времени Обнинск-70»."
            />

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={submitting}
              className="gap-2 px-5 py-3.5 text-sm leading-snug sm:px-8 sm:py-4 sm:text-lg [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5"
            >
              {!submitting && <Send className="shrink-0" aria-hidden />}
              Отправить в капсулу времени
            </Button>
          </form>
        </Reveal>
      </div>

      {savedMessage && (
        <Suspense fallback={null}>
          <SuccessModal message={savedMessage} onClose={handleModalClose} />
        </Suspense>
      )}
    </section>
  );
}
