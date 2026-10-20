"use client";

import { Window as WindowModel } from "@/models/project";

export default function WindowMesh({ window, isSelected, onClick }: { window: WindowModel; isSelected: boolean; onClick?: () => void }) {
  const w = window.width;
  const h = window.height;
  const frameWidth = 0.05;
  const frameDepth = 0.1;
  const glassThickness = 0.015;

  return (
    <group position={[window.position.x, window.sillHeight + h / 2, window.position.y]}>
      <group onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        
        {/* Outer Architectural Frame (Anthracite Powder-Coated Aluminium) */}
        {/* Top Header */}
        <mesh position={[0, h / 2 - frameWidth / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, frameWidth, frameDepth]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Bottom Sill Base */}
        <mesh position={[0, -h / 2 + frameWidth / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, frameWidth, frameDepth]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Left Jamb */}
        <mesh position={[-w / 2 + frameWidth / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[frameWidth, h - frameWidth * 2, frameDepth]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Right Jamb */}
        <mesh position={[w / 2 - frameWidth / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[frameWidth, h - frameWidth * 2, frameDepth]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Central Vertical Mullion Divider */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[frameWidth * 0.7, h - frameWidth * 2, frameDepth * 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Horizontal Transom Bar */}
        <mesh position={[0, h * 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[w - frameWidth * 2, frameWidth * 0.6, frameDepth * 0.7]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Projecting Architectural Window Sill */}
        <mesh position={[0, -h / 2 - 0.015, 0.03]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.08, 0.03, frameDepth + 0.06]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Realistic Multi-Layer Physical Glass Panes */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w - frameWidth * 2, h - frameWidth * 2, glassThickness]} />
          <meshPhysicalMaterial 
            color={isSelected ? "#38bdf8" : "#e0f2fe"} 
            transparent 
            opacity={0.35} 
            roughness={0.03}
            metalness={0.1}
            transmission={0.92}
            ior={1.52}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
        </mesh>
      </group>
    </group>
  );
}
