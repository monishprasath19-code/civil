"use client";

import { useTexture } from "@react-three/drei";
import { Material } from "@/models/project";
import * as THREE from "three";
import { Suspense, useMemo } from "react";

function TexturedMaterial({ material, fallbackColor }: { material: Material; fallbackColor: string }) {
  // If the material has a textureUrl, load it lazily via Drei's useTexture
  // In Phase 7 we mostly use procedural color+roughness, but this supports textures
  
  // Conditionally load textures (useTexture hooks must be called unconditionally though, 
  // so we build an array of urls or null)
  const textureMap = useTexture(material.textureUrl ? [material.textureUrl] : []) as THREE.Texture[];
  const normalMap = useTexture(material.normalMapUrl ? [material.normalMapUrl] : []) as THREE.Texture[];

  const map = textureMap.length > 0 ? textureMap[0] : null;
  const normal = normalMap.length > 0 ? normalMap[0] : null;

  useMemo(() => {
    if (map) {
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(material.scale || 1, material.scale || 1);
    }
    if (normal) {
      normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
      normal.repeat.set(material.scale || 1, material.scale || 1);
    }
  }, [map, normal, material.scale]);

  return (
    <meshStandardMaterial 
      color={map ? "#ffffff" : (material.color || fallbackColor)}
      roughness={material.roughness ?? 0.8}
      metalness={material.metallic ?? 0.0}
      map={map}
      normalMap={normal}
    />
  );
}

export default function MaterialSurface({ materialId, fallbackColor = "#ffffff" }: { materialId?: string, fallbackColor?: string }) {
  // Normally we would pull the full material from `plannerStore.materials` or `materialService`
  // But for performance in Phase 7, since the dataset is local and static, we can just fetch it directly.
  
  const { defaultMaterials } = require('@/data/materials');
  const material = defaultMaterials.find((m: Material) => m.id === materialId);

  if (!material) {
    return <meshStandardMaterial color={fallbackColor} roughness={0.8} />;
  }

  return (
    <Suspense fallback={<meshStandardMaterial color={material.color || fallbackColor} roughness={material.roughness ?? 0.8} />}>
      <TexturedMaterial material={material} fallbackColor={fallbackColor} />
    </Suspense>
  );
}
