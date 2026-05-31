import { Suspense, useLayoutEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Mesh, Vector3 } from 'three';
import { CAPSULE_HEIGHT_CLASS } from './capsuleConstants';
import {
  CAPSULE_MODEL_SCALE,
  CAPSULE_MODEL_URL,
} from './capsuleModelConstants';

useGLTF.preload(CAPSULE_MODEL_URL);

function CapsuleMesh() {
  const { scene } = useGLTF(CAPSULE_MODEL_URL);

  const transform = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = CAPSULE_MODEL_SCALE / maxDim;
    return {
      scale,
      position: center.multiplyScalar(-scale),
    };
  }, [scene]);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group
      position={transform.position}
      scale={transform.scale}
      rotation={[0.08, 0.42, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

function CapsuleScene() {
  return (
    <>
      <ambientLight intensity={0.55} color="#e8eef5" />
      <directionalLight
        position={[2.5, 4, 3.5]}
        intensity={1.35}
        color="#fff6e8"
      />
      <directionalLight
        position={[-2.8, 1.2, -2]}
        intensity={0.55}
        color="#d9b36c"
      />
      <pointLight position={[0, -1.2, 1.8]} intensity={0.35} color="#6eb8ff" />
      <Suspense fallback={null}>
        <CapsuleMesh />
      </Suspense>
    </>
  );
}

const canvasClass = `${CAPSULE_HEIGHT_CLASS} w-[min(420px,92vw)] max-w-[min(420px,92vw)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]`;

/** 3D-капсула (GLB) в hero — прозрачный фон, покачивание задаёт родитель. */
export function CapsuleHeroModel() {
  return (
    <div
      className={`relative z-[2] ${canvasClass}`}
      role="img"
      aria-label="Капсула времени Обнинск-70"
    >
      <Canvas
        className="h-full w-full touch-none"
        camera={{ position: [0, 0.12, 2.65], fov: 38, near: 0.1, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <CapsuleScene />
      </Canvas>
      <span className="sr-only">Капсула времени Обнинск-70</span>
    </div>
  );
}
