"use client";

import { Room } from "@/models/project";
import MaterialSurface from "../materials/MaterialSurface";
import { Edges } from "@react-three/drei";

export default function FloorMesh({ room, isSelected, onClick }: { room: Room; isSelected: boolean; onClick?: () => void }) {
  const centerX = room.position.x + room.width / 2;
  const centerZ = room.position.y + room.height / 2;
  
  return (
    <group position={[centerX, 0.01, centerZ]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <planeGeometry args={[room.width, room.height]} />
        {isSelected ? (
          <meshStandardMaterial color="#bae6fd" roughness={0.3} />
        ) : (
          <MaterialSurface 
            materialId={room.floorMaterialId || 'mat_floor_white_marble'} 
            fallbackColor="#f8fafc" 
            category="floor" 
          />
        )}
        {isSelected && <Edges color="#f59e0b" threshold={15} />}
      </mesh>
    </group>
  );
}
