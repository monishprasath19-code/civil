"use client";

import { Box } from '@react-three/drei';
import MaterialSurface from '../../materials/MaterialSurface';

interface ProceduralProps {
  width: number;
  height: number;
  depth: number;
  color?: string;
  materialId?: string;
}

export function ProceduralSofa({ width, height, depth, color = "#64748b", materialId }: ProceduralProps) {
  const armWidth = 0.2;
  const seatHeight = 0.4;
  const backDepth = 0.2;
  
  return (
    <group>
      {/* Base/Seat */}
      <Box args={[width - armWidth * 2, seatHeight, depth - backDepth]} position={[0, seatHeight / 2, backDepth / 2]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
      {/* Backrest */}
      <Box args={[width, height, backDepth]} position={[0, height / 2, -depth / 2 + backDepth / 2]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
      {/* Left Arm */}
      <Box args={[armWidth, height * 0.8, depth]} position={[-width / 2 + armWidth / 2, (height * 0.8) / 2, 0]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
      {/* Right Arm */}
      <Box args={[armWidth, height * 0.8, depth]} position={[width / 2 - armWidth / 2, (height * 0.8) / 2, 0]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
    </group>
  );
}

export function ProceduralBed({ width, height, depth, color = "#e2e8f0", materialId }: ProceduralProps) {
  const headboardHeight = height;
  const mattressHeight = 0.5;
  const frameThickness = 0.1;
  
  return (
    <group>
      {/* Headboard */}
      <Box args={[width, headboardHeight, frameThickness]} position={[0, headboardHeight / 2, -depth / 2 + frameThickness / 2]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor="#334155" />
      </Box>
      {/* Mattress */}
      <Box args={[width - 0.1, mattressHeight, depth - frameThickness]} position={[0, mattressHeight / 2, frameThickness / 2]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
    </group>
  );
}

export function ProceduralTable({ width, height, depth, color = "#78350f", materialId }: ProceduralProps) {
  const topThickness = 0.05;
  const legThickness = 0.08;
  
  return (
    <group>
      {/* Top */}
      <Box args={[width, topThickness, depth]} position={[0, height - topThickness / 2, 0]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
      {/* Legs */}
      <Box args={[legThickness, height - topThickness, legThickness]} position={[-width / 2 + legThickness, (height - topThickness) / 2, -depth / 2 + legThickness]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
      <Box args={[legThickness, height - topThickness, legThickness]} position={[width / 2 - legThickness, (height - topThickness) / 2, -depth / 2 + legThickness]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
      <Box args={[legThickness, height - topThickness, legThickness]} position={[-width / 2 + legThickness, (height - topThickness) / 2, depth / 2 - legThickness]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
      <Box args={[legThickness, height - topThickness, legThickness]} position={[width / 2 - legThickness, (height - topThickness) / 2, depth / 2 - legThickness]} castShadow receiveShadow>
        <MaterialSurface materialId={materialId} fallbackColor={color} />
      </Box>
    </group>
  );
}

export function ProceduralGenericBox({ width, height, depth, color = "#94a3b8", materialId }: ProceduralProps) {
  return (
    <Box args={[width, height, depth]} position={[0, height / 2, 0]} castShadow receiveShadow>
      <MaterialSurface materialId={materialId} fallbackColor={color} />
    </Box>
  );
}
