"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Sky } from "@react-three/drei";
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
import { RenderMode } from "./ArchitecturalHUD";

export default function ThreeDScene({ 
  floor, 
  showCeiling,
  cameraMode,
  viewTarget,
  selectedId,
  onSelect,
  renderMode = 'photoreal',
  isDroneTour = false
}: { 
  floor: FloorData; 
  showCeiling: boolean;
  cameraMode: string;
  viewTarget: 'interior' | 'exterior' | 'full';
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  renderMode?: RenderMode;
  isDroneTour?: boolean;
}) {
  const site = usePlannerStore(state => state.site);
  const exterior = usePlannerStore(state => state.exterior);
  const floors = usePlannerStore(state => state.floors);

  const initialCamPos = cameraMode === 'top' ? [5, 20, 5] : cameraMode === 'front' ? [5, 2, 20] : [10, 10, 10];

  const timeOfDay = exterior?.timeOfDay || 'afternoon';
  
  // Real Sun Positions according to time of day
  const sunPositionMap: Record<string, [number, number, number]> = {
    morning: [25, 12, 18],
    afternoon: [8, 30, 12],
    evening: [-25, 8, 12],
    night: [0, -30, 0]
  };
  const sunPos = sunPositionMap[timeOfDay] || [8, 30, 12];

  // Visual Atmosphere properties
  const skyColor = renderMode === 'cyber' ? '#030712' : renderMode === 'clay' ? '#f1f5f9' : {
    morning: '#fef08a',
    afternoon: '#bae6fd',
    evening: '#fed7aa',
    night: '#0f172a'
  }[timeOfDay];

  const ambientInt = renderMode === 'cyber' ? 0.3 : renderMode === 'clay' ? 0.9 : { morning: 0.6, afternoon: 0.8, evening: 0.5, night: 0.15 }[timeOfDay];
  const dirInt = renderMode === 'cyber' ? 1.0 : renderMode === 'clay' ? 1.4 : { morning: 1.1, afternoon: 1.5, evening: 0.9, night: 0.25 }[timeOfDay];
  const dirColor = renderMode === 'cyber' ? '#38bdf8' : renderMode === 'clay' ? '#ffffff' : { morning: '#fef08a', afternoon: '#ffffff', evening: '#fdba74', night: '#93c5fd' }[timeOfDay];
  const envPreset = (timeOfDay === 'night' || renderMode === 'cyber' ? 'night' : 'city') as any;

  // Which floors to render?
  const floorsToRender = (viewTarget === 'exterior' || viewTarget === 'full') ? floors : (floor ? [floor] : []);
  const topFloor = floorsToRender.length > 0 ? floorsToRender.reduce((prev, curr) => (curr.elevation > prev.elevation ? curr : prev)) : null;

  return (
    <Canvas 
      id="civil-3d-canvas"
      shadows 
      camera={{ position: initialCamPos as any, fov: 50 }} 
      onPointerMissed={() => onSelect(null)}
      gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[skyColor]} />
      
      {/* Photorealistic Atmospheric Sky */}
      {renderMode === 'photoreal' && (
        <>
          <Sky 
            sunPosition={sunPos} 
            turbidity={timeOfDay === 'morning' || timeOfDay === 'evening' ? 10 : 6} 
            rayleigh={timeOfDay === 'evening' ? 3 : 1.5} 
            mieCoefficient={0.005} 
            mieDirectionalG={0.8} 
          />
          <fog attach="fog" args={[skyColor, 35, 110]} />
        </>
      )}

      {/* Cyber Grid Fog */}
      {renderMode === 'cyber' && (
        <fog attach="fog" args={['#030712', 20, 85]} />
      )}

      {/* Architectural Clay Fog */}
      {renderMode === 'clay' && (
        <fog attach="fog" args={['#f1f5f9', 25, 95]} />
      )}

      <ambientLight intensity={ambientInt} />
      
      <directionalLight 
        position={sunPos} 
        intensity={dirInt} 
        color={dirColor}
        castShadow 
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0001}
        shadow-radius={3.5}
      />

      {/* Secondary fill light for soft architectural GI feeling */}
      <directionalLight position={[-sunPos[0], 15, -sunPos[2]]} intensity={dirInt * 0.25} color="#94a3b8" />

      {renderMode !== 'cyber' && <Environment preset={envPreset} />}

      {/* Futuristic Cyber Laser Grid or Precision CAD Grid */}
      {viewTarget === 'interior' && (
        <Grid 
          infiniteGrid 
          fadeDistance={65} 
          sectionColor={renderMode === 'cyber' ? '#06b6d4' : '#94a3b8'} 
          cellColor={renderMode === 'cyber' ? '#0e7490' : '#cbd5e1'} 
          sectionSize={renderMode === 'cyber' ? 2 : 1}
          cellSize={0.5}
          position={[0, -0.01, 0]} 
        />
      )}

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
        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.05} 
          autoRotate={isDroneTour}
          autoRotateSpeed={1.4}
        />
      ) : (
        <FirstPersonCamera isWalkthrough={true} />
      )}
    </Canvas>
  );
}
