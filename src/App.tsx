import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BackgroundDecor } from '@/components/layout/BackgroundDecor';
import { HomePage } from '@/pages/HomePage';

// Маршруты вне главной страницы загружаются лениво — это уменьшает
// стартовый бандл и улучшает производительность главной.
const AdminPage = lazy(() =>
  import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

export default function App() {
  return (
    <div className="relative min-h-screen">
      <BackgroundDecor />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}
