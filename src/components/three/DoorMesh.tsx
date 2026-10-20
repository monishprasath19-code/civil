"use client";

import { Door } from "@/models/project";
import { Edges } from "@react-three/drei";

export default function DoorMesh({ door, isSelected, onClick }: { door: Door; isSelected: boolean; onClick?: () => void }) {
  const rotationY = -(door.rotation || 0) * (Math.PI / 180);
  const w = door.width || 0.9;
  const h = door.height || 2.1;
  const frameThick = 0.06;
  const jambDepth = 0.12;
  const leafThick = 0.045;

  return (
    <group position={[door.position.x, h / 2, door.position.y]} rotation={[0, rotationY, 0]}>
      {/* Outer Architectural Door Casing / Frame */}
      <group onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        {/* Top Header */}
        <mesh position={[0, h / 2 - frameThick / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w + frameThick * 2, frameThick, jambDepth]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Left Jamb */}
        <mesh position={[-w / 2 - frameThick / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[frameThick, h, jambDepth]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Right Jamb */}
        <mesh position={[w / 2 + frameThick / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[frameThick, h, jambDepth]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Main Solid Inset Door Leaf */}
        <mesh position={[0, -frameThick / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w - 0.02, h - frameThick, leafThick]} />
          <meshStandardMaterial 
            color={isSelected ? "#38bdf8" : "#78350f"} 
            roughness={0.4} 
            metalness={0.08} 
          />
          <Edges color={isSelected ? "#0284c7" : "#451a03"} threshold={20} />
        </mesh>

        {/* Recessed Architectural Panels (Classic Luxury 2-Panel Detail) */}
        <mesh position={[0, (h / 2) * 0.45, leafThick / 2 + 0.002]}>
          <boxGeometry args={[w * 0.65, h * 0.32, 0.005]} />
          <meshStandardMaterial color="#5c2409" roughness={0.35} />
        </mesh>
        <mesh position={[0, -(h / 2) * 0.35, leafThick / 2 + 0.002]}>
          <boxGeometry args={[w * 0.65, h * 0.42, 0.005]} />
          <meshStandardMaterial color="#5c2409" roughness={0.35} />
        </mesh>

        {/* Brushed Brass / Satin Steel Architectural Lever Handle (Both Sides) */}
        {[-leafThick / 2 - 0.015, leafThick / 2 + 0.015].map((sideZ, idx) => (
          <group key={idx} position={[w * 0.35, -h / 2 + 0.95, sideZ]}>
            {/* Escutcheon Rosette Backplate */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.006, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Spindle Post */}
            <mesh position={[0, 0, idx === 0 ? -0.015 : 0.015]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.03, 12]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Ergonomic Lever Bar */}
            <mesh position={[-0.05, 0, idx === 0 ? -0.03 : 0.03]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.1, 12]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Metallic Bottom Threshold */}
        <mesh position={[0, -h / 2 + 0.005, 0]}>
          <boxGeometry args={[w + frameThick * 2, 0.01, jambDepth + 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
