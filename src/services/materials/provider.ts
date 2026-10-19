import { Material, MaterialCategory, MaterialStyle } from "@/models/project";
import { defaultMaterials } from "@/data/materials";

export interface MaterialSearchParams {
  category?: MaterialCategory;
  style?: MaterialStyle;
  query?: string;
  maxPrice?: number;
}

export interface MaterialProvider {
  searchMaterials(params: MaterialSearchParams): Promise<Material[]>;
  getMaterial(id: string): Promise<Material | null>;
  getCategories(): Promise<MaterialCategory[]>;
}

export class LocalMaterialProvider implements MaterialProvider {
  async searchMaterials(params: MaterialSearchParams): Promise<Material[]> {
    let results = [...defaultMaterials];

    if (params.category) {
      results = results.filter(m => m.category === params.category);
    }
    
    if (params.style) {
      results = results.filter(m => m.style === params.style);
    }
    
    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter(m => m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
    }

    if (params.maxPrice !== undefined) {
      results = results.filter(m => m.price !== undefined && m.price <= params.maxPrice!);
    }

    return results;
  }

  async getMaterial(id: string): Promise<Material | null> {
    return defaultMaterials.find(m => m.id === id) || null;
  }

  async getCategories(): Promise<MaterialCategory[]> {
    // Return unique categories from fixture
    const cats = new Set(defaultMaterials.map(m => m.category));
    return Array.from(cats);
  }
}

// Export a singleton instance for use across the app
export const materialService = new LocalMaterialProvider();
