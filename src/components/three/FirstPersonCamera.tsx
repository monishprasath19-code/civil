"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePlannerStore } from "@/store/plannerStore";

export default function FirstPersonCamera({ isWalkthrough }: { isWalkthrough: boolean }) {
  const { camera, scene } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  // Velocity and direction
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const speed = 5.0; // m/s
  const eyeHeight = 1.6;
  const floors = usePlannerStore(state => state.floors);
  const activeFloorId = usePlannerStore(state => state.activeFloorId);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (isWalkthrough) {
      camera.position.set(5, eyeHeight, 5); // default start
    }
  }, [isWalkthrough, camera]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isWalkthrough) return;
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': setMoveForward(true); break;
        case 'ArrowLeft':
        case 'KeyA': setMoveLeft(true); break;
        case 'ArrowDown':
        case 'KeyS': setMoveBackward(true); break;
        case 'ArrowRight':
        case 'KeyD': setMoveRight(true); break;
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isWalkthrough) return;
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': setMoveForward(false); break;
        case 'ArrowLeft':
        case 'KeyA': setMoveLeft(false); break;
        case 'ArrowDown':
        case 'KeyS': setMoveBackward(false); break;
        case 'ArrowRight':
        case 'KeyD': setMoveRight(false); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isWalkthrough]);

  useFrame((state, delta) => {
    if (!isWalkthrough) return;
    
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(moveForward) - Number(moveBackward);
    direction.current.x = Number(moveRight) - Number(moveLeft);
    direction.current.normalize(); // consistent movement in all directions

    if (moveForward || moveBackward) velocity.current.z -= direction.current.z * speed * delta;
    if (moveLeft || moveRight) velocity.current.x -= direction.current.x * speed * delta;

    controlsRef.current?.moveRight(-velocity.current.x);
    controlsRef.current?.moveForward(-velocity.current.z);
    
    // Lock height to floor
    camera.position.y = eyeHeight;

    // Extremely basic AABB collision logic against walls
    // We fetch the active floor walls from the store
    const floor = floors.find(f => f.id === activeFloorId);
    if (floor) {
      const margin = 0.3; // camera collision radius
      const camPos = camera.position;
      
      // Simple bounding box checks (this is a very rough approach just for Phase 5A requirements)
      for (const wall of floor.walls) {
        const minX = Math.min(wall.startPoint.x, wall.endPoint.x) - wall.thickness/2 - margin;
        const maxX = Math.max(wall.startPoint.x, wall.endPoint.x) + wall.thickness/2 + margin;
        const minZ = Math.min(wall.startPoint.y, wall.endPoint.y) - wall.thickness/2 - margin;
        const maxZ = Math.max(wall.startPoint.y, wall.endPoint.y) + wall.thickness/2 + margin;
        
        if (camPos.x > minX && camPos.x < maxX && camPos.z > minZ && camPos.z < maxZ) {
          // Push back
          controlsRef.current?.moveRight(velocity.current.x);
          controlsRef.current?.moveForward(velocity.current.z);
          velocity.current.set(0,0,0);
          break;
        }
      }
    }
  });

  if (!isWalkthrough) return null;

  return <PointerLockControls ref={controlsRef} />;
}
