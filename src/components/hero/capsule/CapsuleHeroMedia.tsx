import { Component, lazy, Suspense, type ReactNode } from 'react';
import { useWebGLAvailable } from '@/hooks/useWebGLAvailable';
import { CapsuleHeroImage } from './CapsuleHeroImage';

const CapsuleHeroModel = lazy(() =>
  import('./CapsuleHeroModel').then((m) => ({ default: m.CapsuleHeroModel })),
);

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

interface CapsuleHeroMediaProps {
  /** false при prefers-reduced-motion — только PNG. */
  use3D: boolean;
}

const fallback = <CapsuleHeroImage />;

/** 3D GLB или запасное 2D-изображение. */
export function CapsuleHeroMedia({ use3D }: CapsuleHeroMediaProps) {
  const webgl = useWebGLAvailable();

  if (!use3D || !webgl) {
    return fallback;
  }

  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <CapsuleHeroModel />
      </Suspense>
    </ModelErrorBoundary>
  );
}
