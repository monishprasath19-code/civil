import { ProjectState, FloorData, Room, Wall, Door, Window, Dimension, Furniture } from "@/models/project";
import { CostEstimate, CostLineItem, CostAssumptions } from "@/models/cost";
import { costRateService } from "./provider";
import { v4 as uuidv4 } from "uuid";
import { FurnitureRegistry } from "@/components/three/furniture/Registry";

export interface EstimateOptions {
  userOverrides: Record<string, { material?: number; labour?: number }>;
  contingencyPercentage?: number;
  regionalFactor?: number;
}

export class CostEstimationEngine {
  
  private applyRate(baseRate: number, override?: number, factor: number = 1.0): number {
    return (override !== undefined ? override : baseRate) * factor;
  }

  private calculateWastage(qty: number, category: string, assumptions: Record<string, number>): number {
    const factor = assumptions[category] || 0;
    return qty * (1 + factor / 100);
  }

  async generateEstimate(project: ProjectState, options: EstimateOptions): Promise<CostEstimate> {
    const lineItems: CostLineItem[] = [];
    const assumptions: CostAssumptions = {
      pricingSource: 'LocalRateBook 2026',
      rateDate: new Date().toISOString(),
      contingencyPercentage: options.contingencyPercentage ?? 5,
      regionalFactor: options.regionalFactor ?? 1.0,
      labourAssumptions: 'Standard 8-hour shift',
      wastageAssumptions: {
        'flooring': 5,
        'painting': 10,
        'masonry': 5,
        'exterior': 5,
      }
    };

    const regionalFactor = assumptions.regionalFactor;
    const overrides = options.userOverrides || {};

    // Helper to generate a line item
    const createItem = async (
      category: CostLineItem['category'], 
      desc: string, 
      unit: string, 
      qty: number, 
      source: 'geometry' | 'allowance' | 'user',
      materialId?: string,
      roomId?: string,
      floorId?: string,
      rateIdOverride?: string
    ) => {
      
      let rateRecord = rateIdOverride ? await costRateService.getRate(rateIdOverride) : null;
      if (!rateRecord && materialId) {
        rateRecord = await costRateService.getRateByMaterial(materialId);
      }
      
      // Defaults if missing
      const baseMat = rateRecord?.materialRate || 0;
      const baseLab = rateRecord?.labourRate || 0;
      
      const userOvr = (materialId && overrides[materialId]) || (rateRecord && overrides[rateRecord.id]);
      
      const matRate = this.applyRate(baseMat, userOvr?.material, regionalFactor);
      const labRate = this.applyRate(baseLab, userOvr?.labour, regionalFactor);

      const netQty = qty;
      const grossQty = this.calculateWastage(netQty, category, assumptions.wastageAssumptions);

      const confidence = rateRecord ? 'high' : (source === 'allowance' ? 'medium' : 'unavailable');

      lineItems.push({
        id: uuidv4(),
        category,
        description: desc,
        unit,
        quantity: grossQty,
        netQuantity: netQty,
        wastageFactor: (grossQty / netQty - 1) * 100 || 0,
        materialRate: matRate,
        labourRate: labRate,
        materialAmount: matRate * grossQty,
        labourAmount: labRate * grossQty,
        totalAmount: (matRate + labRate) * grossQty,
        source,
        materialId,
        roomId,
        floorId,
        confidence,
        isUserOverridden: !!userOvr
      });
    };

    // 1. FLOORS & ROOMS
    for (const floor of project.floors) {
      
      // Floor Slab (RCC)
      let floorArea = 0;
      for (const room of floor.rooms) {
        floorArea += (room.width * room.height);
      }
      if (floorArea > 0) {
        await createItem('structure', `RCC Slab - ${floor.name}`, 'sqm', floorArea, 'geometry', undefined, undefined, floor.id, 'rate_rcc');
      }

      // Rooms
      for (const room of floor.rooms) {
        const area = room.width * room.height;
        
        // Flooring
        await createItem('flooring', `Flooring - ${room.name}`, 'sqm', area, 'geometry', room.floorMaterialId, room.id, floor.id);
        
        // Ceiling
        await createItem('painting', `Ceiling Paint - ${room.name}`, 'sqm', area, 'geometry', undefined, room.id, floor.id, 'rate_mat_wall_white_plaster');
      }

      // Walls
      for (const wall of floor.walls) {
        const dx = wall.endPoint.x - wall.startPoint.x;
        const dy = wall.endPoint.y - wall.startPoint.y;
        const length = Math.sqrt(dx*dx + dy*dy);
        const area = length * wall.height;
        
        // Masonry
        await createItem('masonry', 'Brick Masonry Wall', 'sqm', area, 'geometry', undefined, undefined, floor.id, 'rate_masonry');
        
        // Internal Plaster & Paint (x2 for both sides ideally, simplified to 1 side external, 1 internal later, but 2 sides here)
        await createItem('plaster', 'Internal Plaster', 'sqm', area * 2, 'geometry', undefined, undefined, floor.id, 'rate_plaster_in');
        await createItem('painting', 'Wall Painting', 'sqm', area * 2, 'geometry', wall.materialId, undefined, floor.id, wall.materialId ? undefined : 'rate_mat_wall_white_plaster');
      }

      // Doors
      for (const door of floor.doors) {
        const rateId = door.type === 'double' ? 'rate_door_double' : 'rate_door_single';
        await createItem('doors', `Door (${door.type})`, 'nos', 1, 'geometry', undefined, undefined, floor.id, rateId);
      }

      // Windows
      for (const win of floor.windows) {
        const area = win.width * win.height;
        await createItem('windows', `Window (${win.type})`, 'sqm', area, 'geometry', undefined, undefined, floor.id, 'rate_window_casement');
      }

      // Furniture
      for (const furn of floor.furniture) {
        const assetDef = FurnitureRegistry[furn.type];
        // For furniture, typically it's an allowance or unit price.
        // If we don't have a rate mapped, it will show unavailable. 
        // We'll just pass the materialId if it exists to see if a rate is bound.
        await createItem('furniture', `${furn.name}`, 'nos', 1, 'geometry', furn.materialId, furn.roomId, floor.id);
      }
    }

    // 2. EXTERIOR / SITE
    if (project.exterior) {
      const ext = project.exterior;
      
      // Roof
      if (ext.showRoof && project.floors.length > 0) {
        // Approximate roof area by top floor footprint
        const topFloor = project.floors[project.floors.length - 1];
        let maxArea = 0;
        topFloor.rooms.forEach(r => maxArea += r.width * r.height);
        // Overhang approximation
        maxArea *= 1.1;
        await createItem('structure', `Roof (${ext.roofType})`, 'sqm', maxArea, 'geometry', ext.roofMaterialId, undefined, undefined, 'rate_roof_flat');
      }

      // Driveway
      if (ext.driveway) {
        const dArea = ext.driveway.width * 8; // 8 was hardcoded length in ExtScene
        await createItem('exterior', 'Driveway', 'sqm', dArea, 'geometry', ext.driveway.materialId, undefined, undefined, 'rate_driveway_asphalt');
      }

      // Gate
      if (ext.gate) {
        await createItem('exterior', 'Main Gate', 'nos', 1, 'geometry', undefined, undefined, undefined, 'rate_gate_sliding');
      }

      // Compound Wall
      if (ext.compoundWall.show) {
        const pLen = project.site.plotLength;
        const pWid = project.site.plotWidth;
        const perimeter = (pLen * 2) + (pWid * 2);
        const wallArea = perimeter * ext.compoundWall.height;
        await createItem('exterior', 'Compound Wall', 'sqm', wallArea, 'geometry', ext.compoundWall.materialId, undefined, undefined, 'rate_compound_wall');
      }

      // Trees
      if (ext.trees.length > 0) {
        await createItem('landscape', 'Trees & Planting', 'nos', ext.trees.length, 'geometry', undefined, undefined, undefined, 'rate_tree');
      }

      // Grass (Plot Area - Builtup)
      const plotArea = project.site.plotWidth * project.site.plotLength;
      let groundBuiltup = 0;
      if (project.floors.length > 0) {
        project.floors[0].rooms.forEach(r => groundBuiltup += r.width * r.height);
      }
      const grassArea = Math.max(0, plotArea - groundBuiltup - (ext.driveway ? ext.driveway.width * 8 : 0));
      if (grassArea > 0) {
        await createItem('landscape', 'Lawn/Grass Area', 'sqm', grassArea, 'allowance', undefined, undefined, undefined, 'rate_grass');
      }
    }

    // Totals
    let subtotal = 0;
    lineItems.forEach(li => subtotal += li.totalAmount);
    
    const contingency = subtotal * (assumptions.contingencyPercentage / 100);
    const grandTotal = subtotal + contingency;

    return {
      id: uuidv4(),
      projectId: project.id,
      currency: 'INR',
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      assumptions,
      lineItems,
      subtotal,
      contingency,
      grandTotal,
      userRates: overrides
    };
  }
}

export const costEngine = new CostEstimationEngine();
