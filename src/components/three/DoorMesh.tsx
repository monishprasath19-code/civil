"use client";

import { Door } from "@/models/project";
import { Edges } from "@react-three/drei";

export default function DoorMesh({ door, isSelected, onClick }: { door: Door; isSelected: boolean; onClick?: () => void }) {
  // rotation is in degrees from 2D planner (or 0 if not set)
  // 3D rotation around Y axis: 2D positive is clockwise (screen), which means -Y in 3D.
  const rotationY = -(door.rotation || 0) * (Math.PI / 180);
  
  return (
    <group position={[door.position.x, (door.height || 2.1) / 2, door.position.y]} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <boxGeometry args={[door.width || 0.9, door.height || 2.1, 0.08]} />
        <meshStandardMaterial 
          color={isSelected ? "#bae6fd" : "#78350f"} 
          roughness={0.65} 
          metalness={0.05} 
        />
        <Edges color={isSelected ? "#0284c7" : "#451a03"} threshold={20} />
      </mesh>
    </group>
  );
}
