"use client";

import { Furniture } from "@/models/project";
import { FurnitureRegistry } from "./furniture/Registry";
import { ProceduralSofa, ProceduralBed, ProceduralTable, ProceduralGenericBox } from "./furniture/ProceduralModels";
import { TransformControls } from "@react-three/drei";
import GlbModel from "./furniture/GlbModel";
import { usePlannerStore } from "@/store/plannerStore";
import { useEffect, useState } from "react";
import * as THREE from 'three';

export default function FurnitureMesh({ furniture, isSelected, onClick }: { furniture: Furniture; isSelected: boolean; onClick?: () => void }) {
  const rotationY = -(furniture.rotation || 0) * (Math.PI / 180);
  const updateFurniture = usePlannerStore(state => state.updateFurniture);
  const activeTool = usePlannerStore(state => state.activeTool);
  
  const w = furniture.dimensions.width;
  const d = furniture.dimensions.height; // mapped from 2d depth/height
  const h = 0.8; // default height if missing
  
  const floors = usePlannerStore(state => state.floors);
  const activeFloorId = usePlannerStore(state => state.activeFloorId);
  const floor = floors.find(f => f.id === activeFloorId);
  
  const [groupRef, setGroupRef] = useState<THREE.Group | null>(null);
  
  // Validation: Check if center is inside any room (simplified check for Phase 5A)
  const isValidPlacement = floor?.rooms.some(r => 
    furniture.position.x >= r.position.x && 
    furniture.position.x <= r.position.x + r.width &&
    furniture.position.y >= r.position.y && 
    furniture.position.y <= r.position.y + r.height
  ) ?? true;
  
  const renderModel = () => {
    const assetDef = FurnitureRegistry[furniture.type];
    const matId = furniture.materialId;

    if (assetDef && assetDef.modelType === 'glb' && assetDef.modelUrl) {
      return (
        <GlbModel 
          url={assetDef.modelUrl} 
          materialId={matId}
          fallback={renderProcedural(matId)}
        />
      );
    }

    return renderProcedural(matId);
  };

  const renderProcedural = (matId?: string) => {
    const type = furniture.type.toLowerCase();
    const name = furniture.name.toLowerCase();
    
    if (type.includes('sofa') || name.includes('sofa')) return <ProceduralSofa width={w} height={h} depth={d} materialId={matId} />;
    if (type.includes('bed') || name.includes('bed')) return <ProceduralBed width={w} height={h} depth={d} materialId={matId} />;
    if (type.includes('table') || name.includes('table')) return <ProceduralTable width={w} height={h} depth={d} materialId={matId} />;
    
    return <ProceduralGenericBox width={w} height={h} depth={d} materialId={matId} />;
  };

  const handleTransformChange = (e: any) => {
    // Only update on drag end to avoid spamming the store and causing massive re-renders
  };

  const handleDragEnd = (e: any) => {
    if (!groupRef) return;
    const pos = groupRef.position;
    const rot = groupRef.rotation;
    // Map back to 2D project coordinates
    updateFurniture(furniture.id, {
      position: { x: pos.x, y: pos.z },
      rotation: (-rot.y * 180) / Math.PI
    });
  };

  return (
    <>
      <group 
        ref={setGroupRef}
        position={[furniture.position.x, 0, furniture.position.y]} 
        rotation={[0, rotationY, 0]}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      >
        {renderModel()}
        
        {/* Selection / Validation Highlight */}
        {(isSelected || !isValidPlacement) && (
          <mesh position={[0, h/2, 0]}>
            <boxGeometry args={[w + 0.05, h + 0.05, d + 0.05]} />
            <meshBasicMaterial 
              color={!isValidPlacement ? "#ef4444" : "#3b82f6"} 
              wireframe 
              opacity={0.5} 
              transparent 
            />
          </mesh>
        )}
      </group>

      {isSelected && activeTool === 'select' && groupRef && (
        <TransformControls 
          object={groupRef} 
          mode="translate" 
          onMouseUp={handleDragEnd}
          showY={false} // lock to floor plan
        />
      )}
    </>
  );
}
