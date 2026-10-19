"use client";

import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Line, Rect, Circle, Group, Text, Transformer } from "react-konva";
import { usePlannerStore } from "@/store/plannerStore";
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { useResizeObserver } from 'use-resize-observer';

export default function CanvasArea() {
  const { ref, width = 800, height = 600 } = useResizeObserver<HTMLDivElement>();
  
  const { 
    floors, activeFloorId, 
    scale, setScale,
    pan, setPan,
    activeTool, selectedIds, select,
    addWall, updateWall, deleteObject,
    addFurniture, updateFurniture, addRoom, updateRoom, addDoor, updateDoor, addWindow, updateWindow,
    snapToGrid, gridSize
  } = usePlannerStore();

  const floor = floors.find(f => f.id === activeFloorId);
  
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [newWallPoints, setNewWallPoints] = useState<{x: number, y: number}[]>([]);

  // Attach transformer to selected shapes
  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    const nodes = selectedIds.map(id => stageRef.current!.findOne(`#${id}`)).filter(Boolean) as Konva.Node[];
    trRef.current.nodes(nodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds]);

  const getPointerPos = () => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    let { x, y } = transform.point(pos);
    
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }
    return { x, y };
  };

  const handleMouseDown = (e: any) => {
    // If clicking on empty space in select mode, clear selection
    const clickedOnEmpty = e.target === e.target.getStage();
    
    if (activeTool === 'select') {
      if (clickedOnEmpty) select([]);
      return;
    }

    if (activeTool === 'wall') {
      const pos = getPointerPos();
      setIsDrawingWall(true);
      setNewWallPoints([pos, pos]);
    } else if (activeTool === 'furniture') {
      const pos = getPointerPos();
      addFurniture({
        type: 'sofa', name: 'New Sofa', position: pos, rotation: 0, dimensions: { width: 2, height: 1 }
      });
      select([]);
    } else if (activeTool === 'room') {
      const pos = getPointerPos();
      addRoom({
        name: 'New Room', type: 'Custom', position: pos, width: 4, height: 4, ceilingHeight: 3, floorId: activeFloorId!
      });
      select([]);
    } else if (activeTool === 'door') {
      const pos = getPointerPos();
      addDoor({ wallId: '', position: pos, width: 0.9, height: 2.1, type: 'single' });
      select([]);
    } else if (activeTool === 'window') {
      const pos = getPointerPos();
      addWindow({ wallId: '', position: pos, width: 1.5, height: 1.2, sillHeight: 0.9, type: 'sliding' });
      select([]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (isDrawingWall && newWallPoints.length === 2) {
      const pos = getPointerPos();
      setNewWallPoints([newWallPoints[0], pos]);
    }
  };

  const handleMouseUp = (e: any) => {
    if (isDrawingWall && newWallPoints.length === 2) {
      setIsDrawingWall(false);
      // Validate length
      const dx = newWallPoints[1].x - newWallPoints[0].x;
      const dy = newWallPoints[1].y - newWallPoints[0].y;
      const length = Math.sqrt(dx*dx + dy*dy);
      
      if (length > 0.1) {
        addWall({
          startPoint: newWallPoints[0],
          endPoint: newWallPoints[1],
          thickness: 0.2, // standard 200mm wall
          height: floor?.height || 3
        });
      }
      setNewWallPoints([]);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(newScale);

    setPan({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  if (!floor) return <div ref={ref} className="flex-1" />;

  // Grid drawing
  const gridLines = [];
  const startX = -pan.x / scale;
  const endX = startX + width / scale;
  const startY = -pan.y / scale;
  const endY = startY + height / scale;

  for (let i = Math.floor(startX); i <= Math.ceil(endX); i += gridSize) {
    gridLines.push(<Line key={`v${i}`} points={[i, startY, i, endY]} stroke="#e2e8f0" strokeWidth={1/scale} />);
  }
  for (let j = Math.floor(startY); j <= Math.ceil(endY); j += gridSize) {
    gridLines.push(<Line key={`h${j}`} points={[startX, j, endX, j]} stroke="#e2e8f0" strokeWidth={1/scale} />);
  }

  return (
    <div ref={ref} className="flex-1 relative cursor-crosshair overflow-hidden bg-slate-50">
      <Stage
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={pan.x}
        y={pan.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        draggable={activeTool === 'select'}
        onDragEnd={(e) => {
          if (e.target === e.target.getStage()) {
            setPan({ x: e.target.x(), y: e.target.y() });
          }
        }}
        ref={stageRef}
      >
        <Layer>
          {/* Grid */}
          <Group>{gridLines}</Group>

          {/* Rooms */}
          {floor.rooms.map(room => (
            <Rect
              key={room.id}
              id={room.id}
              x={room.position.x}
              y={room.position.y}
              width={room.width}
              height={room.height}
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth={2/scale}
              draggable={activeTool === 'select'}
              onClick={(e) => { e.cancelBubble = true; select([room.id]); }}
            />
          ))}

          {/* Walls */}
          {floor.walls.map(wall => (
            <Line
              key={wall.id}
              id={wall.id}
              points={[wall.startPoint.x, wall.startPoint.y, wall.endPoint.x, wall.endPoint.y]}
              stroke={selectedIds.includes(wall.id) ? "#3b82f6" : "#334155"}
              strokeWidth={wall.thickness}
              lineCap="square"
              draggable={activeTool === 'select'}
              onClick={(e) => { e.cancelBubble = true; select([wall.id]); }}
              onDragEnd={(e) => {
                const node = e.target;
                updateWall(wall.id, {
                  startPoint: { x: wall.startPoint.x + node.x(), y: wall.startPoint.y + node.y() },
                  endPoint: { x: wall.endPoint.x + node.x(), y: wall.endPoint.y + node.y() }
                });
                node.position({x: 0, y: 0});
              }}
            />
          ))}

          {/* Drawing Wall Preview */}
          {isDrawingWall && newWallPoints.length === 2 && (
            <Line
              points={[newWallPoints[0].x, newWallPoints[0].y, newWallPoints[1].x, newWallPoints[1].y]}
              stroke="#94a3b8"
              strokeWidth={0.2}
              dash={[5/scale, 5/scale]}
            />
          )}

          {/* Furniture */}
          {floor.furniture.map(furn => (
            <Rect
              key={furn.id}
              id={furn.id}
              x={furn.position.x}
              y={furn.position.y}
              width={furn.dimensions.width}
              height={furn.dimensions.height}
              rotation={furn.rotation}
              fill="#e0e7ff"
              stroke="#6366f1"
              strokeWidth={2/scale}
              draggable={activeTool === 'select'}
              onClick={(e) => { e.cancelBubble = true; select([furn.id]); }}
              onDragEnd={(e) => {
                updateFurniture(furn.id, { position: { x: e.target.x(), y: e.target.y() } });
              }}
            />
          ))}

          {/* Doors */}
          {floor.doors.map(door => (
            <Group
              key={door.id}
              id={door.id}
              x={door.position.x}
              y={door.position.y}
              rotation={door.rotation || 0}
              draggable={activeTool === 'select'}
              onClick={(e) => { e.cancelBubble = true; select([door.id]); }}
              onDragEnd={(e) => {
                updateDoor(door.id, { position: { x: e.target.x(), y: e.target.y() } });
              }}
            >
              <Rect width={door.width} height={door.height || 0.1} fill="#fb923c" />
            </Group>
          ))}

          {/* Windows */}
          {floor.windows.map(win => (
            <Group
              key={win.id}
              id={win.id}
              x={win.position.x}
              y={win.position.y}
              draggable={activeTool === 'select'}
              onClick={(e) => { e.cancelBubble = true; select([win.id]); }}
              onDragEnd={(e) => {
                updateWindow(win.id, { position: { x: e.target.x(), y: e.target.y() } });
              }}
            >
              <Rect width={win.width} height={0.1} fill="#38bdf8" />
            </Group>
          ))}

          <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => newBox} />
        </Layer>
      </Stage>
    </div>
  );
}
