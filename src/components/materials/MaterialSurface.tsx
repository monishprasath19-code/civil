"use client";

import { Material } from "@/models/project";
import * as THREE from "three";
import { Suspense, useMemo } from "react";
import { getProceduralPBR } from "@/utils/pbrTextures";

function TexturedMaterial({ 
  material, 
  fallbackColor,
  category
}: { 
  material?: Material; 
  fallbackColor: string;
  category?: string;
}) {
  const pbr = useMemo(() => {
    // Generate high-resolution procedural architectural PBR texture if in browser
    if (typeof window !== 'undefined') {
      return getProceduralPBR(material?.id, category || material?.category);
    }
    return null;
  }, [material?.id, material?.category, category]);

  return (
    <meshStandardMaterial 
      color={material?.color || fallbackColor}
      roughness={material?.roughness ?? pbr?.roughness ?? 0.4}
      metalness={material?.metallic ?? pbr?.metalness ?? 0.05}
      map={pbr?.map || undefined}
      normalMap={pbr?.normalMap || undefined}
      normalScale={new THREE.Vector2(0.6, 0.6)}
    />
  );
}

export default function MaterialSurface({ 
  materialId, 
  fallbackColor = "#ffffff",
  category
}: { 
  materialId?: string; 
  fallbackColor?: string;
  category?: string;
}) {
  const { defaultMaterials } = require('@/data/materials');
  const material = defaultMaterials.find((m: Material) => m.id === materialId);

  return (
    <Suspense fallback={<meshStandardMaterial color={material?.color || fallbackColor} roughness={0.4} />}>
      <TexturedMaterial 
        material={material} 
        fallbackColor={fallbackColor} 
        category={category} 
      />
    </Suspense>
  );
}
