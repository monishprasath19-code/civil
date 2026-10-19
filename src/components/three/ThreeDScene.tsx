"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { FloorData } from "@/models/project";
import WallMesh from "./WallMesh";
import FloorMesh from "./FloorMesh";
import DoorMesh from "./DoorMesh";
import WindowMesh from "./WindowMesh";
import FurnitureMesh from "./FurnitureMesh";
import FirstPersonCamera from "./FirstPersonCamera";
import { useState, useRef } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import ExteriorScene from "./exterior/ExteriorScene";
import RoofMesh from "./exterior/RoofMesh";

export default function ThreeDScene({ 
  floor, 
  showCeiling,
  cameraMode,
  viewTarget,
  selectedId,
  onSelect
}: { 
  floor: FloorData; 
  showCeiling: boolean;
  cameraMode: string;
  viewTarget: 'interior' | 'exterior' | 'full';
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const site = usePlannerStore(state => state.site);
  const exterior = usePlannerStore(state => state.exterior);
  const floors = usePlannerStore(state => state.floors);

  const initialCamPos = cameraMode === 'top' ? [5, 20, 5] : cameraMode === 'front' ? [5, 2, 20] : [10, 10, 10];

  const timeOfDay = exterior?.timeOfDay || 'afternoon';
  
  const skyColor = {
    morning: '#fef08a',
    afternoon: '#bae6fd',
    evening: '#fca5a5',
    night: '#1e1b4b'
  }[timeOfDay];

  const ambientInt = { morning: 0.6, afternoon: 0.8, evening: 0.4, night: 0.1 }[timeOfDay];
  const dirInt = { morning: 0.8, afternoon: 1.2, evening: 0.6, night: 0.2 }[timeOfDay];
  const dirColor = { morning: '#fef08a', afternoon: '#ffffff', evening: '#fdba74', night: '#93c5fd' }[timeOfDay];
  const envPreset = (timeOfDay === 'night' ? 'night' : 'city') as any;

  // Which floors to render?
  const floorsToRender = (viewTarget === 'exterior' || viewTarget === 'full') ? floors : (floor ? [floor] : []);
  const topFloor = floorsToRender.length > 0 ? floorsToRender.reduce((prev, curr) => (curr.elevation > prev.elevation ? curr : prev)) : null;

  return (
    <Canvas shadows camera={{ position: initialCamPos as any, fov: 50 }} onPointerMissed={() => onSelect(null)}>
      <color attach="background" args={[skyColor]} />
      <ambientLight intensity={ambientInt} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={dirInt} 
        color={dirColor}
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <Environment preset={envPreset} />

      {viewTarget === 'interior' && <Grid infiniteGrid fadeDistance={50} sectionColor="#cbd5e1" cellColor="#e2e8f0" position={[0, -0.01, 0]} />}

      {/* Exterior Site Logic */}
      {(viewTarget === 'exterior' || viewTarget === 'full') && (
        <ExteriorScene 
          site={site} 
          exterior={exterior} 
          isFullProperty={viewTarget === 'full'} 
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )}

      {/* Building Floors */}
      <group>
        {floorsToRender.map(f => {
          const showFurniture = viewTarget === 'interior' || viewTarget === 'full';
          return (
            <group key={f.id} position={[0, f.elevation, 0]}>
              {f.rooms.map(room => (
                <FloorMesh key={room.id} room={room} isSelected={selectedId === room.id} onClick={() => onSelect(room.id)} />
              ))}
              {f.walls.map(wall => (
                <WallMesh key={wall.id} wall={wall} isSelected={selectedId === wall.id} onClick={() => onSelect(wall.id)} />
              ))}
              {f.doors.map(door => (
                <DoorMesh key={door.id} door={door} isSelected={selectedId === door.id} onClick={() => onSelect(door.id)} />
              ))}
              {f.windows.map(window => (
                <WindowMesh key={window.id} window={window} isSelected={selectedId === window.id} onClick={() => onSelect(window.id)} />
              ))}
              {showFurniture && f.furniture.map(furn => (
                <FurnitureMesh key={furn.id} furniture={furn} isSelected={selectedId === furn.id} onClick={() => onSelect(furn.id)} />
              ))}
            </group>
          );
        })}
        
        {/* Roof rendering on the top-most floor if exterior view and roof is toggled */}
        {(viewTarget === 'exterior' || viewTarget === 'full') && exterior?.showRoof && topFloor && (
          <RoofMesh floor={topFloor} type={exterior.roofType} materialId={exterior.roofMaterialId} />
        )}
      </group>

      {cameraMode !== 'walkthrough' ? (
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
      ) : (
        <FirstPersonCamera isWalkthrough={true} />
      )}
    </Canvas>
  );
}
