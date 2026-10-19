import { ProjectState } from "@/models/project";
import { costEngine } from "../cost/engine";
import { materialService } from "../materials/provider";

export const aiTools = {
  getProjectSummary: (project: ProjectState) => {
    let builtup = 0;
    project.floors.forEach(f => f.rooms.forEach(r => builtup += r.width * r.height));
    return {
      name: project.name,
      plotArea: project.site.plotArea,
      builtupArea: builtup,
      floors: project.floors.length,
      budget: project.budget.constructionBudget
    };
  },
  
  getCostEstimate: async (project: ProjectState) => {
    // If not stored in state, calculate fresh
    const est = project.costEstimate || await costEngine.generateEstimate(project, { userOverrides: {} });
    return {
      total: est.grandTotal,
      currency: est.currency,
      subtotal: est.subtotal,
      contingency: est.contingency
    };
  },
  
  calculateCostScenario: async (project: ProjectState, overrides: Record<string, { material?: number; labour?: number }>) => {
    const newEst = await costEngine.generateEstimate(project, { userOverrides: overrides });
    const oldEst = project.costEstimate || await costEngine.generateEstimate(project, { userOverrides: {} });
    
    return {
      originalTotal: oldEst.grandTotal,
      newTotal: newEst.grandTotal,
      difference: newEst.grandTotal - oldEst.grandTotal,
      currency: newEst.currency
    };
  },
  
  getMaterialOptions: async (query: string, category?: string) => {
    return await materialService.searchMaterials({ query, category: category as any });
  },

  generateProjectReportData: async (project: ProjectState) => {
    let builtup = 0;
    project.floors.forEach(f => f.rooms.forEach(r => builtup += r.width * r.height));
    const est = project.costEstimate || await costEngine.generateEstimate(project, { userOverrides: {} });

    return {
      overview: {
        name: project.name,
        date: new Date().toISOString(),
        builtupArea: builtup,
      },
      site: project.site,
      requirements: project.requirements,
      floors: project.floors.map(f => ({
        name: f.name,
        rooms: f.rooms.map(r => ({ name: r.name, area: r.width * r.height, mat: r.floorMaterialId }))
      })),
      exterior: project.exterior,
      costSummary: {
        total: est.grandTotal,
        subtotal: est.subtotal,
        contingency: est.contingency,
        lineItemsCount: est.lineItems.length
      }
    };
  }
};
