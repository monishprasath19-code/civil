"use client";

import { Window as WindowModel } from "@/models/project";
import { Edges } from "@react-three/drei";

export default function WindowMesh({ window, isSelected, onClick }: { window: WindowModel; isSelected: boolean; onClick?: () => void }) {
  const rotationY = 0; 
  
  return (
    <group position={[window.position.x, window.sillHeight + window.height / 2, window.position.y]} rotation={[0, rotationY, 0]}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <boxGeometry args={[window.width, window.height, 0.08]} />
        <meshPhysicalMaterial 
          color={isSelected ? "#38bdf8" : "#bae6fd"} 
          transparent 
          opacity={0.55} 
          roughness={0.08}
          metalness={0.1}
          transmission={0.6}
          ior={1.52}
        />
        <Edges color={isSelected ? "#0284c7" : "#475569"} threshold={15} />
      </mesh>
    </group>
  );
}
