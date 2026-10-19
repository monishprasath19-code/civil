"use client";

import { FloorData } from "@/models/project";
import { Box } from "@react-three/drei";
import MaterialSurface from "../../materials/MaterialSurface";

export default function RoofMesh({ floor, type, materialId }: { floor: FloorData; type: 'flat' | 'sloped'; materialId?: string }) {
  // Calculate bounding box of the floor's rooms/walls
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  
  floor.rooms.forEach(r => {
    if (r.position.x < minX) minX = r.position.x;
    if (r.position.x + r.width > maxX) maxX = r.position.x + r.width;
    if (r.position.y < minZ) minZ = r.position.y;
    if (r.position.y + r.height > maxZ) maxZ = r.position.y + r.height;
  });

  if (minX === Infinity) {
    // Try walls
    floor.walls.forEach(w => {
      minX = Math.min(minX, w.startPoint.x, w.endPoint.x);
      maxX = Math.max(maxX, w.startPoint.x, w.endPoint.x);
      minZ = Math.min(minZ, w.startPoint.y, w.endPoint.y);
      maxZ = Math.max(maxZ, w.startPoint.y, w.endPoint.y);
    });
  }

  if (minX === Infinity) return null; // empty floor

  // Overhang for roof
  const overhang = 0.5;
  minX -= overhang;
  maxX += overhang;
  minZ -= overhang;
  maxZ += overhang;
  
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const cx = (maxX + minX) / 2;
  const cz = (maxZ + minZ) / 2;

  // Assuming height is the wall height. Let's use 3m as default if not derived.
  const elevation = floor.elevation + floor.height;

  if (type === 'flat') {
    return (
      <Box args={[width, 0.3, depth]} position={[cx, elevation + 0.15, cz]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor="#64748b" />
      </Box>
    );
  }

  // Sloped (Basic wedge or pyramid for phase 6)
  return (
    <group position={[cx, elevation, cz]}>
      {/* Base slab */}
      <Box args={[width, 0.1, depth]} position={[0, 0.05, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </Box>
      {/* Simple pyramid roof approximation using a cylinder with 4 radial segments */}
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0, Math.max(width, depth) * 0.8, 3, 4]} />
        <MaterialSurface materialId={materialId} fallbackColor="#991b1b" />
      </mesh>
    </group>
  );
}
