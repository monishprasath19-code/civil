"use client";

import { Box, Cylinder } from '@react-three/drei';
import MaterialSurface from '../../materials/MaterialSurface';

interface ProceduralProps {
  width: number;
  height: number;
  depth: number;
  color?: string;
  materialId?: string;
}

/**
 * Ultra-realistic Designer 3-Seater Sofa with plush cushions, throw pillows, and brass legs
 */
export function ProceduralSofa({ width, height, depth, color = "#475569", materialId }: ProceduralProps) {
  const armW = 0.18;
  const seatH = 0.42;
  const backD = 0.22;
  const legH = 0.12;
  const legR = 0.02;

  return (
    <group>
      {/* 4 Tapered Brass/Black Metal Legs */}
      {[
        [-width / 2 + armW, -depth / 2 + backD],
        [width / 2 - armW, -depth / 2 + backD],
        [-width / 2 + armW, depth / 2 - 0.1],
        [width / 2 - armW, depth / 2 - 0.1]
      ].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, legH / 2, lz]} castShadow>
          <cylinderGeometry args={[legR * 0.7, legR, legH, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}

      {/* Main Base Plinth */}
      <mesh position={[0, legH + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* 3 Distinct Plush Seat Cushions */}
      {[-1, 0, 1].map((idx) => {
        const cushionW = (width - armW * 2 - 0.04) / 3;
        const cx = idx * (cushionW + 0.015);
        return (
          <mesh key={idx} position={[cx, legH + 0.1 + (seatH - legH) / 2, backD / 2]} castShadow receiveShadow>
            <boxGeometry args={[cushionW, seatH - legH, depth - backD - 0.04]} />
            <MaterialSurface materialId={materialId} fallbackColor={color} category="furniture" />
          </mesh>
        );
      })}

      {/* Full Backrest Spine */}
      <mesh position={[0, height / 2 + legH / 2, -depth / 2 + backD / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height - legH, backD]} />
        <MaterialSurface materialId={materialId} fallbackColor={color} category="furniture" />
      </mesh>

      {/* 3 Plush Tufted Backrest Pillows */}
      {[-1, 0, 1].map((idx) => {
        const pillowW = (width - armW * 2 - 0.04) / 3;
        const cx = idx * (pillowW + 0.015);
        return (
          <mesh key={idx} position={[cx, seatH + 0.22, -depth / 2 + backD + 0.04]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[pillowW - 0.02, 0.38, 0.12]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
        );
      })}

      {/* Left Sculpted Armrest */}
      <mesh position={[-width / 2 + armW / 2, (height * 0.72) / 2 + legH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[armW, height * 0.72 - legH / 2, depth]} />
        <MaterialSurface materialId={materialId} fallbackColor={color} category="furniture" />
      </mesh>

      {/* Right Sculpted Armrest */}
      <mesh position={[width / 2 - armW / 2, (height * 0.72) / 2 + legH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[armW, height * 0.72 - legH / 2, depth]} />
        <MaterialSurface materialId={materialId} fallbackColor={color} category="furniture" />
      </mesh>

      {/* Luxury Decorative Accent Throw Pillows (Ochre Gold & Charcoal) */}
      <mesh position={[-width / 2 + armW + 0.12, seatH + 0.12, 0]} rotation={[0.2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.28, 0.28, 0.09]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} />
      </mesh>
      <mesh position={[width / 2 - armW - 0.12, seatH + 0.12, 0]} rotation={[0.2, -0.3, 0]} castShadow>
        <boxGeometry args={[0.28, 0.28, 0.09]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Luxury Hotel Suite King Bed with Tufted Headboard, Duvet Runner & Nightstands
 */
export function ProceduralBed({ width, height, depth, color = "#f8fafc", materialId }: ProceduralProps) {
  const headboardH = height || 1.2;
  const mattressH = 0.32;
  const frameH = 0.22;
  const headboardThick = 0.14;

  return (
    <group>
      {/* Tall Vertical-Channeled Tufted Headboard */}
      <group position={[0, headboardH / 2, -depth / 2 + headboardThick / 2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width + 0.1, headboardH, headboardThick]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Decorative Channel Fluting */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset * (width / 1.5), 0, headboardThick / 2 + 0.005]}>
            <boxGeometry args={[0.015, headboardH * 0.9, 0.01]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Platform Bed Frame / Plinth */}
      <mesh position={[0, frameH / 2, headboardThick / 2]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.04, frameH, depth - headboardThick + 0.04]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Deep Pocket-Sprung Mattress with Crisp White Fitted Sheet */}
      <mesh position={[0, frameH + mattressH / 2, headboardThick / 2]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.04, mattressH, depth - headboardThick - 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* Draped Folded Duvet Layer */}
      <mesh position={[0, frameH + mattressH + 0.02, headboardThick / 2 + 0.15]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.02, 0.04, depth - headboardThick - 0.45]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>

      {/* Luxury Bed-Runner Accent Blanket (Ochre / Camel) */}
      <mesh position={[0, frameH + mattressH + 0.045, depth / 2 - 0.28]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.02, 0.45]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} />
      </mesh>

      {/* Dual Fluffy Sleeping Pillows */}
      {[-width / 4, width / 4].map((px, idx) => (
        <group key={idx} position={[px, frameH + mattressH + 0.08, -depth / 2 + headboardThick + 0.32]}>
          {/* Main Pillow */}
          <mesh rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[width * 0.38, 0.12, 0.38]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Accent Pillow */}
          <mesh position={[0, 0.06, 0.08]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[width * 0.28, 0.08, 0.24]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Left Matching Nightstand with Brass Lamp */}
      <group position={[-width / 2 - 0.32, 0, -depth / 2 + headboardThick + 0.25]}>
        {/* Table Body */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.5, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Brass Nightstand Lamp */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.24, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.18, 16]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.3} />
        </mesh>
      </group>

      {/* Right Matching Nightstand with Brass Lamp */}
      <group position={[width / 2 + 0.32, 0, -depth / 2 + headboardThick + 0.25]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.5, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.24, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.18, 16]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Architectural Dining Table with Carrara Marble / Walnut Beveled Slab & Set of Modern Chairs
 */
export function ProceduralTable({ width, height, depth, color = "#f8fafc", materialId }: ProceduralProps) {
  const topThick = 0.045;
  const legThick = 0.05;
  const h = height || 0.76;

  return (
    <group>
      {/* Polished Marble / Walnut Slab Top with Beveled Edge */}
      <mesh position={[0, h - topThick / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, topThick, depth]} />
        <MaterialSurface materialId={materialId || 'mat_floor_white_marble'} fallbackColor={color} category="countertop" />
      </mesh>

      {/* Architectural Matte Black Trestle / Angle Legs */}
      {[
        [-width / 2 + 0.12, -depth / 2 + 0.1],
        [width / 2 - 0.12, -depth / 2 + 0.1],
        [-width / 2 + 0.12, depth / 2 - 0.1],
        [width / 2 - 0.12, depth / 2 - 0.1]
      ].map(([lx, lz], idx) => (
        <mesh key={idx} position={[lx, (h - topThick) / 2, lz]} castShadow>
          <boxGeometry args={[legThick, h - topThick, legThick]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Centerpiece Ceramic Vase with Botanicals */}
      <group position={[0, h + 0.08, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.16, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.015, 0.005, 0.18, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.6} />
        </mesh>
      </group>

      {/* 4 Ergonomic Dining Chairs around the table */}
      {[
        [-width / 3, 0, depth / 2 + 0.38, 0],
        [width / 3, 0, depth / 2 + 0.38, 0],
        [-width / 3, 0, -depth / 2 - 0.38, Math.PI],
        [width / 3, 0, -depth / 2 - 0.38, Math.PI]
      ].map(([cx, cy, cz, rotY], idx) => (
        <group key={idx} position={[cx, cy, cz]} rotation={[0, rotY, 0]}>
          {/* Chair Seat */}
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          {/* Curved Backrest */}
          <mesh position={[0, 0.72, 0.18]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.32, 0.04]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Chair Legs */}
          {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([legX, legZ], lIdx) => (
            <mesh key={lIdx} position={[legX, 0.22, legZ]} castShadow>
              <cylinderGeometry args={[0.012, 0.016, 0.44, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Modern Media Entertainment Unit & OLED TV
 */
export function ProceduralTVUnit({ width = 1.8, height = 0.5, depth = 0.4 }: Partial<ProceduralProps>) {
  return (
    <group>
      {/* Floating Timber Credenza Cabinet */}
      <mesh position={[0, height / 2 + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      
      {/* Modern Fluted Drawer Lines */}
      {[-0.6, 0, 0.6].map((dx, i) => (
        <mesh key={i} position={[dx, height / 2 + 0.1, depth / 2 + 0.005]}>
          <boxGeometry args={[0.55, height - 0.06, 0.01]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      ))}

      {/* Wall-Mounted Ultra-Thin OLED TV */}
      <group position={[0, height + 0.7, -depth / 2 + 0.05]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.8, 0.03]} />
          <meshStandardMaterial color="#09090b" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Glossy OLED Display Screen */}
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[1.36, 0.76]} />
          <meshPhysicalMaterial 
            color="#050505" 
            roughness={0.05} 
            metalness={0.9} 
            clearcoat={1.0}
            reflectivity={0.95} 
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Potted Fiddle Leaf Fig Architectural Plant
 */
export function ProceduralPlant() {
  return (
    <group>
      {/* Ceramic Pot */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.5, 24]} />
        <meshStandardMaterial color="#fafaf9" roughness={0.3} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 16]} />
        <meshStandardMaterial color="#3f2e18" roughness={0.9} />
      </mesh>
      {/* Central Stem */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#2d4a22" roughness={0.8} />
      </mesh>
      {/* Broad Green Sculptural Leaves */}
      {[
        [0.15, 0.7, 0.1, 0.4, 0.6, 0.3],
        [-0.15, 0.85, -0.08, -0.4, 0.8, -0.2],
        [0.12, 1.05, -0.12, 0.5, 0.4, -0.5],
        [-0.1, 1.2, 0.12, -0.5, 0.5, 0.4],
        [0, 1.35, 0, 0, 0.2, 0]
      ].map(([x, y, z, rx, ry, rz], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[rx, ry, rz]} castShadow>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Default fallback item
 */
export function ProceduralGenericBox({ width, height, depth, color = "#94a3b8", materialId }: ProceduralProps) {
  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <MaterialSurface materialId={materialId} fallbackColor={color} category="furniture" />
    </mesh>
  );
}
