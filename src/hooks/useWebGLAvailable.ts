import { useEffect, useState } from 'react';

function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

/** Проверка поддержки WebGL для 3D-капсулы в hero. */
export function useWebGLAvailable(): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(detectWebGL());
  }, []);

  return available;
}
