import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <span className="font-display text-7xl font-bold gold-gradient-text">404</span>
      <h1 className="text-2xl font-semibold">Страница не найдена</h1>
      <p className="max-w-md text-secondary">
        Кажется, эта страница затерялась во времени. Вернитесь к капсуле.
      </p>
      <Link to="/">
        <Button size="lg">На главную</Button>
      </Link>
    </div>
  );
}
