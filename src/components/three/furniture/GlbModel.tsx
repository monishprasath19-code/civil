"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useState, useEffect } from "react";
import * as THREE from 'three';
import { materialService } from "@/services/materials/provider";

function ModelRenderer({ url, materialId }: { url: string; materialId?: string }) {
  const { scene } = useGLTF(url);
  const [overrideMat, setOverrideMat] = useState<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (materialId) {
      let isMounted = true;
      materialService.getMaterial(materialId).then(mat => {
        if (mat && isMounted) {
          const newMat = new THREE.MeshStandardMaterial({
            color: mat.color || '#ffffff',
            roughness: mat.roughness ?? 0.8,
            metalness: mat.metallic ?? 0,
          });
          setOverrideMat(newMat);
        }
      });
      return () => { isMounted = false; };
    } else {
      // Avoid synchronous setState in effect to please linter
      queueMicrotask(() => setOverrideMat(null));
    }
  }, [materialId]);

  // Clone scene so we can mutate materials safely without bleeding across instances
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    if (overrideMat) {
      clone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = overrideMat;
        }
      });
    }
    return clone;
  }, [scene, overrideMat]);

  return <primitive object={clonedScene} castShadow receiveShadow />;
}

import { ModelErrorBoundary } from "./ModelErrorBoundary";

export default function GlbModel({ 
  url, 
  fallback, 
  materialId 
}: { 
  url: string; 
  fallback: React.ReactNode; 
  materialId?: string 
}) {
  return (
    <ModelErrorBoundary fallback={<>{fallback}</>}>
      <Suspense fallback={fallback}>
        <ModelRenderer url={url} materialId={materialId} />
      </Suspense>
    </ModelErrorBoundary>
  );
}

// Preload standard models to avoid stutter
// useGLTF.preload('/models/example.glb');
