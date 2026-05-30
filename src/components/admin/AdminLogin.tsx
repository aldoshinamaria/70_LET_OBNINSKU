import { useState, type FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';

interface AdminLoginProps {
  onSubmit: (password: string) => boolean;
}

export function AdminLogin({ onSubmit }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim()) {
      setError('Введите пароль.');
      return;
    }
    const ok = onSubmit(password);
    if (!ok) {
      setError('Неверный пароль. Попробуйте ещё раз.');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="glass-card w-full max-w-sm rounded-3xl p-8">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Админ-панель</h1>
            <p className="mt-1 text-sm text-secondary">
              Капсула времени Обнинск-70
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <TextField
            name="password"
            type="password"
            label="Пароль"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            error={error ?? undefined}
            autoFocus
          />
          <Button type="submit" fullWidth size="lg">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
