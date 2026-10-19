"use client";

import { SiteInfo, ExteriorData } from "@/models/project";
import { Box, Plane } from "@react-three/drei";
import TreeMesh from "./TreeMesh";
import MaterialSurface from "../../materials/MaterialSurface";

export default function ExteriorScene({ 
  site, 
  exterior, 
  isFullProperty,
  selectedId,
  onSelect
}: { 
  site: SiteInfo | null; 
  exterior?: ExteriorData; 
  isFullProperty: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (!site || !exterior) return null;

  const { plotWidth, plotLength, roadDirection } = site;
  
  // By default, let's say the plot starts at 0,0 and goes to plotWidth, plotLength.
  // We offset it so the center is aligned with the building logic if needed, but in our building logic, we assume 2D coordinates map 1:1.
  // The user typically draws the building near the origin or some offset.
  
  // Actually, plot boundaries: let's anchor the plot at (0, 0) being the top-left or center?
  // Let's place it at x=plotWidth/2, z=plotLength/2
  const centerX = plotWidth / 2;
  const centerZ = plotLength / 2;

  return (
    <group>
      {/* Plot Surface (Grass/Soil) */}
      <Plane 
        args={[plotWidth, plotLength]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[centerX, -0.01, centerZ]} 
        receiveShadow
      >
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </Plane>

      {/* Road */}
      {roadDirection === 'N' && (
        <Plane args={[plotWidth * 1.5, 6]} rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.02, -3]} receiveShadow>
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </Plane>
      )}
      {roadDirection === 'S' && (
        <Plane args={[plotWidth * 1.5, 6]} rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.02, plotLength + 3]} receiveShadow>
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </Plane>
      )}

      {/* Compound Wall */}
      {exterior.compoundWall.show && (
        <group>
          {/* North Wall */}
          <Box args={[plotWidth, exterior.compoundWall.height, exterior.compoundWall.thickness]} position={[centerX, exterior.compoundWall.height/2, 0]} castShadow receiveShadow>
            <MaterialSurface materialId={exterior.compoundWall.materialId} fallbackColor="#e2e8f0" />
          </Box>
          {/* South Wall */}
          <Box args={[plotWidth, exterior.compoundWall.height, exterior.compoundWall.thickness]} position={[centerX, exterior.compoundWall.height/2, plotLength]} castShadow receiveShadow>
            <MaterialSurface materialId={exterior.compoundWall.materialId} fallbackColor="#e2e8f0" />
          </Box>
          {/* West Wall */}
          <Box args={[exterior.compoundWall.thickness, exterior.compoundWall.height, plotLength]} position={[0, exterior.compoundWall.height/2, centerZ]} castShadow receiveShadow>
            <MaterialSurface materialId={exterior.compoundWall.materialId} fallbackColor="#e2e8f0" />
          </Box>
          {/* East Wall */}
          <Box args={[exterior.compoundWall.thickness, exterior.compoundWall.height, plotLength]} position={[plotWidth, exterior.compoundWall.height/2, centerZ]} castShadow receiveShadow>
            <MaterialSurface materialId={exterior.compoundWall.materialId} fallbackColor="#e2e8f0" />
          </Box>
        </group>
      )}

      {/* Gate (Placeholder sliding/swing logic, simple box for now) */}
      {exterior.gate && (
        <Box 
          args={[exterior.gate.width, exterior.gate.height, 0.1]} 
          position={[exterior.gate.position.x, exterior.gate.height / 2, exterior.gate.position.y]} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </Box>
      )}

      {/* Driveway */}
      {exterior.driveway && (
        <Plane 
          args={[exterior.driveway.width, 8]} // Just an arbitrary length extending inward
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[exterior.driveway.position.x, 0.01, exterior.driveway.position.y]} 
          receiveShadow
        >
          <MaterialSurface materialId={exterior.driveway.materialId} fallbackColor="#94a3b8" />
        </Plane>
      )}

      {/* Parking Area */}
      {exterior.parking && exterior.parking.spaces > 0 && (
        <Plane 
          args={[3 * exterior.parking.spaces, 5]} // Standard car is ~2.5x5, 3 width per space
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[exterior.parking.position.x, 0.02, exterior.parking.position.y]} 
          receiveShadow
        >
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </Plane>
      )}

      {/* Placeholder Car for Parking */}
      {exterior.parking && exterior.parking.spaces > 0 && (
        <Box 
          args={[2, 1.2, 4]} 
          position={[exterior.parking.position.x, 0.6, exterior.parking.position.y]} 
          castShadow 
          receiveShadow
        >
          <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.2} />
        </Box>
      )}

      {/* Procedural Trees */}
      {exterior.trees.map(tree => (
        <TreeMesh 
          key={tree.id} 
          tree={tree} 
          isSelected={selectedId === tree.id} 
          onClick={() => onSelect(tree.id)} 
        />
      ))}

    </group>
  );
}
