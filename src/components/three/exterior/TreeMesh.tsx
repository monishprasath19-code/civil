"use client";

import { TreeData } from "@/models/project";
import { usePlannerStore } from "@/store/plannerStore";
import { TransformControls } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from 'three';
import { Cylinder, Sphere } from "@react-three/drei";

export default function TreeMesh({ tree, isSelected, onClick }: { tree: TreeData; isSelected: boolean; onClick?: () => void }) {
  const updateExterior = usePlannerStore(state => state.updateExterior);
  const exterior = usePlannerStore(state => state.exterior);
  
  const [groupRef, setGroupRef] = useState<THREE.Group | null>(null);

  const handleDragEnd = () => {
    if (!groupRef || !exterior) return;
    const pos = groupRef.position;
    
    const newTrees = exterior.trees.map(t => 
      t.id === tree.id ? { ...t, position: { x: pos.x, y: pos.z } } : t
    );
    updateExterior({ trees: newTrees });
  };

  return (
    <>
      <group 
        ref={setGroupRef}
        position={[tree.position.x, 0, tree.position.y]} 
        scale={tree.scale}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      >
        <Cylinder args={[0.2, 0.3, 2]} position={[0, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </Cylinder>
        <Sphere args={[1.5, 16, 16]} position={[0, 2.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#22c55e" roughness={0.8} emissive={isSelected ? "#3b82f6" : "#000000"} emissiveIntensity={isSelected ? 0.3 : 0} />
        </Sphere>
      </group>

      {isSelected && groupRef && (
        <TransformControls 
          object={groupRef} 
          mode="translate" 
          onMouseUp={handleDragEnd}
          showY={false}
        />
      )}
    </>
  );
}
