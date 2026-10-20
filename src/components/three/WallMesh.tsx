"use client";

import { Wall } from "@/models/project";
import { getWallTransform } from "@/utils/geometry";
import { useMemo } from "react";
import MaterialSurface from "../materials/MaterialSurface";
import { Edges } from "@react-three/drei";

export default function WallMesh({ wall, isSelected, onClick }: { wall: Wall; isSelected: boolean; onClick?: () => void }) {
  const { length, position, rotation } = useMemo(() => getWallTransform(wall.startPoint, wall.endPoint), [wall]);
  
  const baseboardHeight = 0.1;
  const baseboardThickness = wall.thickness + 0.015;

  return (
    <group position={[position[0], wall.height / 2, position[2]]} rotation={rotation}>
      {/* Main Wall Body */}
      <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <boxGeometry args={[length, wall.height, wall.thickness]} />
        {isSelected ? (
          <meshStandardMaterial color="#bae6fd" roughness={0.3} metalness={0.2} />
        ) : (
          <MaterialSurface 
            materialId={wall.materialId || 'mat_wall_white_plaster'} 
            fallbackColor="#fafafa" 
            category="wall" 
          />
        )}
        <Edges 
          color={isSelected ? "#f59e0b" : "#e2e8f0"} 
          threshold={25} 
        />
      </mesh>

      {/* Realistic Interior Architectural Baseboard / Skirting Trim */}
      <mesh 
        position={[0, -wall.height / 2 + baseboardHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[length + 0.01, baseboardHeight, baseboardThickness]} />
        <meshStandardMaterial 
          color="#f1f5f9" 
          roughness={0.3} 
          metalness={0.05} 
        />
      </mesh>
    </group>
  );
}
