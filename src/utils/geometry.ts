import { Position } from '@/models/project';

/**
 * Calculates the center, length, and rotation for a wall based on its start and end points.
 */
export function getWallTransform(start: Position, end: Position) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  const length = Math.sqrt(dx * dx + dy * dy);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  // In 2D, angle is atan2(dy, dx). 
  // In 3D (X-Z plane), we want the box (which extends along X) to rotate around Y.
  // Three.js Y-axis rotation: +ve is counter-clockwise looking from top. 
  // 2D SVG/Canvas: +ve is clockwise (y goes down).
  // So rotation around Y should be -atan2(dy, dx).
  const rotationY = -Math.atan2(dy, dx);
  
  return {
    length,
    position: [midX, 0, midY] as [number, number, number],
    rotation: [0, rotationY, 0] as [number, number, number]
  };
}
