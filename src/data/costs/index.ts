import { CostCategory } from "@/models/cost";

export interface RateRecord {
  id: string;
  category: CostCategory;
  description: string;
  unit: string;
  materialRate: number;
  labourRate: number;
  currency: 'INR' | 'USD';
  materialId?: string; // Links specific material rate
  region?: string;
  lastUpdated: string;
}

export const defaultRates: RateRecord[] = [
  // General Civil/Structure Allowances
  { id: 'rate_rcc', category: 'structure', description: 'RCC works (Concrete, Steel, Formwork)', unit: 'cum', materialRate: 6500, labourRate: 2500, currency: 'INR', lastUpdated: '2026-10-01' },
  { id: 'rate_masonry', category: 'masonry', description: 'Brick Masonry 9" wall', unit: 'sqm', materialRate: 800, labourRate: 350, currency: 'INR', lastUpdated: '2026-10-01' },
  { id: 'rate_plaster_in', category: 'plaster', description: 'Internal Plaster', unit: 'sqm', materialRate: 150, labourRate: 120, currency: 'INR', lastUpdated: '2026-10-01' },
  
  // Specific Material Links
  { id: 'rate_mat_wall_white_plaster', category: 'painting', description: 'White Plaster & Paint', unit: 'sqm', materialRate: 15, labourRate: 80, currency: 'INR', materialId: 'mat_wall_white_plaster', lastUpdated: '2026-10-01' },
  { id: 'rate_mat_wall_warm_beige', category: 'painting', description: 'Warm Beige Paint', unit: 'sqm', materialRate: 18, labourRate: 80, currency: 'INR', materialId: 'mat_wall_warm_beige', lastUpdated: '2026-10-01' },
  { id: 'rate_mat_wall_slate_gray', category: 'painting', description: 'Slate Gray Paint', unit: 'sqm', materialRate: 25, labourRate: 90, currency: 'INR', materialId: 'mat_wall_slate_gray', lastUpdated: '2026-10-01' },

  { id: 'rate_mat_floor_light_oak', category: 'flooring', description: 'Light Oak Flooring Installation', unit: 'sqm', materialRate: 60, labourRate: 20, currency: 'INR', materialId: 'mat_floor_light_oak', lastUpdated: '2026-10-01' },
  { id: 'rate_mat_floor_polished_concrete', category: 'flooring', description: 'Polished Concrete Floor', unit: 'sqm', materialRate: 45, labourRate: 30, currency: 'INR', materialId: 'mat_floor_polished_concrete', lastUpdated: '2026-10-01' },
  { id: 'rate_mat_floor_white_marble', category: 'flooring', description: 'White Marble Laying', unit: 'sqm', materialRate: 120, labourRate: 60, currency: 'INR', materialId: 'mat_floor_white_marble', lastUpdated: '2026-10-01' },
  
  // Doors & Windows
  { id: 'rate_door_single', category: 'doors', description: 'Single Wooden Door', unit: 'nos', materialRate: 8500, labourRate: 1500, currency: 'INR', lastUpdated: '2026-10-01' },
  { id: 'rate_door_double', category: 'doors', description: 'Double Wooden Door', unit: 'nos', materialRate: 16000, labourRate: 2500, currency: 'INR', lastUpdated: '2026-10-01' },
  { id: 'rate_window_casement', category: 'windows', description: 'Casement Window (UPVC)', unit: 'sqm', materialRate: 4500, labourRate: 800, currency: 'INR', lastUpdated: '2026-10-01' },

  // Roof
  { id: 'rate_roof_flat', category: 'structure', description: 'Flat RCC Roof slab allowance', unit: 'sqm', materialRate: 1500, labourRate: 600, currency: 'INR', lastUpdated: '2026-10-01' },
  
  // Exterior
  { id: 'rate_driveway_asphalt', category: 'exterior', description: 'Driveway Asphalt', unit: 'sqm', materialRate: 600, labourRate: 200, currency: 'INR', materialId: 'mat_drive_asphalt', lastUpdated: '2026-10-01' },
  { id: 'rate_compound_wall', category: 'exterior', description: 'Compound Wall (Brick/Block)', unit: 'sqm', materialRate: 1200, labourRate: 450, currency: 'INR', lastUpdated: '2026-10-01' },
  { id: 'rate_gate_sliding', category: 'exterior', description: 'Sliding Gate', unit: 'nos', materialRate: 35000, labourRate: 4500, currency: 'INR', lastUpdated: '2026-10-01' },
  { id: 'rate_tree', category: 'landscape', description: 'Planted Tree (Procurement + Planting)', unit: 'nos', materialRate: 1200, labourRate: 300, currency: 'INR', lastUpdated: '2026-10-01' },
  { id: 'rate_grass', category: 'landscape', description: 'Lawn/Grass laying', unit: 'sqm', materialRate: 150, labourRate: 50, currency: 'INR', lastUpdated: '2026-10-01' },
];
