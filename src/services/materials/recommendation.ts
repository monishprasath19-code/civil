import { Material, MaterialCategory, MaterialStyle } from "@/models/project";
import { materialService } from "./provider";

export interface RecommendationRequest {
  roomType?: string;
  category: MaterialCategory;
  stylePreference?: MaterialStyle;
  budgetCategory?: 'low' | 'medium' | 'high';
  existingMaterials?: string[];
}

export interface RecommendationResult {
  material: Material;
  score: number;
  matchingFactors: string[];
}

export class MaterialRecommendationEngine {
  async recommend(request: RecommendationRequest): Promise<RecommendationResult[]> {
    // Fetch all materials in the requested category
    const candidates = await materialService.searchMaterials({ category: request.category });
    
    const ranked: RecommendationResult[] = [];

    for (const mat of candidates) {
      let score = 0;
      const factors: string[] = [];

      // 1. Style Match (Heavy weight)
      if (request.stylePreference && mat.style === request.stylePreference) {
        score += 50;
        factors.push(`Matches requested style: ${request.stylePreference}`);
      }

      // 2. Budget Match
      // Arbitrary logic for phase 7 to demonstrate deterministic ranking
      if (request.budgetCategory) {
        if (mat.price) {
          if (request.budgetCategory === 'low' && mat.price < 30) {
            score += 20;
            factors.push('Fits low budget requirement');
          } else if (request.budgetCategory === 'medium' && mat.price >= 30 && mat.price <= 70) {
            score += 20;
            factors.push('Fits medium budget requirement');
          } else if (request.budgetCategory === 'high' && mat.price > 70) {
            score += 20;
            factors.push('Premium material suitable for luxury budget');
          } else {
            score -= 10;
          }
        }
      }

      // 3. Room Type Heuristics
      if (request.roomType) {
        const rt = request.roomType.toLowerCase();
        if (rt.includes('bathroom') || rt.includes('kitchen')) {
          // In a real app we'd check `mat.tags.includes('waterproof')`
          if (mat.category === 'floor' && mat.name.toLowerCase().includes('tile')) {
            score += 30;
            factors.push('Highly suitable for wet areas (Tile/Ceramic)');
          } else if (mat.category === 'floor' && mat.name.toLowerCase().includes('wood')) {
            score -= 20; // Wood in bathroom is risky
          }
        }
      }

      ranked.push({
        material: mat,
        score,
        matchingFactors: factors.length > 0 ? factors : ['Standard suitable option']
      });
    }

    // Sort descending by score
    return ranked.sort((a, b) => b.score - a.score);
  }
}

export const recommendationEngine = new MaterialRecommendationEngine();
