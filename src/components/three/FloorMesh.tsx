"use client";

import { Room } from "@/models/project";
import MaterialSurface from "../materials/MaterialSurface";
import { Edges } from "@react-three/drei";

export default function FloorMesh({ room, isSelected, onClick }: { room: Room; isSelected: boolean; onClick?: () => void }) {
  // room.position is the top-left corner in 2D
  // BoxGeometry origin is its center.
  // So position needs to be center of the room.
  const centerX = room.position.x + room.width / 2;
  const centerZ = room.position.y + room.height / 2; // y in 2D is Z in 3D
  
  return (
    <group position={[centerX, 0.01, centerZ]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <planeGeometry args={[room.width, room.height]} />
        {isSelected ? (
          <meshStandardMaterial color="#bae6fd" roughness={0.4} />
        ) : (
          <MaterialSurface materialId={room.floorMaterialId} fallbackColor="#e2e8f0" />
        )}
        {isSelected && <Edges color="#0284c7" threshold={15} />}
      </mesh>
    </group>
  );
}
