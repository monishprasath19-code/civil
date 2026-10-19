"use client";

import { Door } from "@/models/project";

export default function DoorMesh({ door, isSelected, onClick }: { door: Door; isSelected: boolean; onClick?: () => void }) {
  // rotation is in degrees from 2D planner (or 0 if not set)
  // 3D rotation around Y axis: 2D positive is clockwise (screen), which means -Y in 3D.
  const rotationY = -(door.rotation || 0) * (Math.PI / 180);
  
  return (
    <group position={[door.position.x, (door.height || 2.1) / 2, door.position.y]} rotation={[0, rotationY, 0]}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <boxGeometry args={[door.width || 0.9, door.height || 2.1, 0.1]} />
        <meshStandardMaterial color={isSelected ? "#bae6fd" : "#8b5a2b"} />
      </mesh>
    </group>
  );
}
