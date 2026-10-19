import { z } from 'zod';
import { Material, MaterialCategory, MaterialStyle } from '@/models/project';

export const MaterialSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum([
    'wall', 'floor', 'ceiling', 'roof', 'exterior_wall', 
    'compound_wall', 'driveway', 'door', 'window', 
    'furniture', 'countertop', 'bathroom', 'kitchen', 'landscape'
  ]),
  description: z.string().optional(),
  style: z.enum([
    'Modern', 'Contemporary', 'Minimal', 'Traditional', 
    'Industrial', 'Luxury', 'Rustic', 'Scandinavian', 
    'Tropical', 'Indian Traditional'
  ]).optional(),
  color: z.string().optional(),
  textureUrl: z.string().optional(),
  normalMapUrl: z.string().optional(),
  roughness: z.number().min(0).max(1).optional(),
  metallic: z.number().min(0).max(1).optional(),
  scale: z.number().optional(),
  unit: z.string().optional(),
  manufacturer: z.string().optional(),
  brand: z.string().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
  productUrl: z.string().optional(),
  region: z.string().optional(),
  price: z.number().optional(),
  priceUnit: z.string().optional(),
  availability: z.enum(['in_stock', 'out_of_stock', 'special_order']).optional(),
  tags: z.array(z.string()).optional(),
  thumbnailUrl: z.string().optional(),
});

// A local fixture dataset of materials
export const defaultMaterials: Material[] = [
  // Walls
  {
    id: 'mat_wall_white_plaster',
    name: 'White Plaster',
    category: 'wall',
    style: 'Minimal',
    color: '#fafafa',
    roughness: 0.9,
    metallic: 0.0,
    price: 15,
    priceUnit: 'sqm'
  },
  {
    id: 'mat_wall_warm_beige',
    name: 'Warm Beige Paint',
    category: 'wall',
    style: 'Modern',
    color: '#f5f5dc',
    roughness: 0.85,
    metallic: 0.0,
    price: 18,
    priceUnit: 'sqm'
  },
  {
    id: 'mat_wall_slate_gray',
    name: 'Slate Gray Accent',
    category: 'wall',
    style: 'Industrial',
    color: '#708090',
    roughness: 0.8,
    metallic: 0.0,
    price: 25,
    priceUnit: 'sqm'
  },
  
  // Floors
  {
    id: 'mat_floor_light_oak',
    name: 'Light Oak Hardwood',
    category: 'floor',
    style: 'Scandinavian',
    color: '#d2b48c',
    roughness: 0.4,
    metallic: 0.05,
    price: 60,
    priceUnit: 'sqm'
  },
  {
    id: 'mat_floor_polished_concrete',
    name: 'Polished Concrete',
    category: 'floor',
    style: 'Industrial',
    color: '#a9a9a9',
    roughness: 0.2,
    metallic: 0.1,
    price: 45,
    priceUnit: 'sqm'
  },
  {
    id: 'mat_floor_white_marble',
    name: 'White Carrara Marble',
    category: 'floor',
    style: 'Luxury',
    color: '#fdfdfd',
    roughness: 0.1,
    metallic: 0.05,
    price: 120,
    priceUnit: 'sqm'
  },

  // Exterior
  {
    id: 'mat_ext_stucco',
    name: 'Stucco Plaster',
    category: 'exterior_wall',
    style: 'Traditional',
    color: '#f0ede6',
    roughness: 1.0,
    metallic: 0.0,
    price: 35,
    priceUnit: 'sqm'
  },
  {
    id: 'mat_ext_brick',
    name: 'Red Brick',
    category: 'exterior_wall',
    style: 'Traditional',
    color: '#b22222',
    roughness: 0.9,
    metallic: 0.0,
    price: 55,
    priceUnit: 'sqm'
  },

  // Roof
  {
    id: 'mat_roof_asphalt',
    name: 'Asphalt Shingle',
    category: 'roof',
    style: 'Traditional',
    color: '#2f4f4f',
    roughness: 0.9,
    metallic: 0.0,
    price: 40,
    priceUnit: 'sqm'
  },
  {
    id: 'mat_roof_terracotta',
    name: 'Terracotta Tiles',
    category: 'roof',
    style: 'Indian Traditional',
    color: '#cc4e28',
    roughness: 0.85,
    metallic: 0.0,
    price: 70,
    priceUnit: 'sqm'
  },

  // Driveway
  {
    id: 'mat_drive_asphalt',
    name: 'Driveway Asphalt',
    category: 'driveway',
    style: 'Modern',
    color: '#36454f',
    roughness: 0.95,
    metallic: 0.0,
    price: 30,
    priceUnit: 'sqm'
  },
  {
    id: 'mat_drive_paver',
    name: 'Concrete Pavers',
    category: 'driveway',
    style: 'Traditional',
    color: '#8b8c89',
    roughness: 0.9,
    metallic: 0.0,
    price: 45,
    priceUnit: 'sqm'
  }
];

// Validate our fixture data on load
defaultMaterials.forEach(mat => MaterialSchema.parse(mat));
