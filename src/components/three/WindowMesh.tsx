"use client";

import { Window as WindowModel } from "@/models/project";

export default function WindowMesh({ window, isSelected, onClick }: { window: WindowModel; isSelected: boolean; onClick?: () => void }) {
  // same rotation logic
  // no rotation prop defined in Window yet, assume 0 for now unless added
  const rotationY = 0; 
  
  return (
    <group position={[window.position.x, window.sillHeight + window.height / 2, window.position.y]} rotation={[0, rotationY, 0]}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <boxGeometry args={[window.width, window.height, 0.1]} />
        <meshStandardMaterial color={isSelected ? "#bae6fd" : "#38bdf8"} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
