"use client";

import { Wall } from "@/models/project";
import { getWallTransform } from "@/utils/geometry";
import { useMemo } from "react";
import MaterialSurface from "../materials/MaterialSurface";

export default function WallMesh({ wall, isSelected, onClick }: { wall: Wall; isSelected: boolean; onClick?: () => void }) {
  const { length, position, rotation } = useMemo(() => getWallTransform(wall.startPoint, wall.endPoint), [wall]);
  
  return (
    <group position={[position[0], wall.height / 2, position[2]]} rotation={rotation}>
      <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <boxGeometry args={[length, wall.height, wall.thickness]} />
        {isSelected ? (
          <meshStandardMaterial color="#bae6fd" />
        ) : (
          <MaterialSurface materialId={wall.materialId} fallbackColor="#f8fafc" />
        )}
      </mesh>
    </group>
  );
}
