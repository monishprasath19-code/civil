import { CostCategory } from "@/models/cost";
import { defaultRates, RateRecord } from "@/data/costs";

export interface RateSearchParams {
  category?: CostCategory;
  materialId?: string;
  query?: string;
}

export interface CostRateProvider {
  getRate(id: string): Promise<RateRecord | null>;
  getRateByMaterial(materialId: string): Promise<RateRecord | null>;
  searchRates(params: RateSearchParams): Promise<RateRecord[]>;
}

export class LocalCostRateProvider implements CostRateProvider {
  async getRate(id: string): Promise<RateRecord | null> {
    return defaultRates.find(r => r.id === id) || null;
  }

  async getRateByMaterial(materialId: string): Promise<RateRecord | null> {
    return defaultRates.find(r => r.materialId === materialId) || null;
  }

  async searchRates(params: RateSearchParams): Promise<RateRecord[]> {
    let results = [...defaultRates];
    if (params.category) results = results.filter(r => r.category === params.category);
    if (params.materialId) results = results.filter(r => r.materialId === params.materialId);
    if (params.query) {
      const q = params.query.toLowerCase();
      results = results.filter(r => r.description.toLowerCase().includes(q));
    }
    return results;
  }
}

export const costRateService = new LocalCostRateProvider();
