export type CostCategory = 
  | 'site' | 'civil' | 'structure' | 'masonry' | 'plaster' 
  | 'flooring' | 'painting' | 'doors' | 'windows' | 'electrical' 
  | 'plumbing' | 'sanitary' | 'kitchen' | 'furniture' 
  | 'exterior' | 'landscape' | 'miscellaneous';

export interface CostLineItem {
  id: string;
  category: CostCategory;
  description: string;
  itemCode?: string;
  unit: string;
  quantity: number;
  netQuantity: number; 
  wastageFactor: number; 
  materialRate: number;
  labourRate: number;
  materialAmount: number;
  labourAmount: number;
  totalAmount: number;
  source: 'geometry' | 'allowance' | 'user';
  materialId?: string;
  roomId?: string;
  floorId?: string;
  confidence: 'high' | 'medium' | 'low' | 'unavailable';
  notes?: string;
  isUserOverridden?: boolean;
}

export interface CostAssumptions {
  pricingSource: string;
  rateDate: string;
  contingencyPercentage: number;
  regionalFactor: number;
  labourAssumptions: string;
  wastageAssumptions: Record<string, number>;
}

export interface CostEstimate {
  id: string;
  projectId: string;
  currency: 'INR' | 'USD';
  generatedAt: string;
  updatedAt: string;
  status: 'draft' | 'final';
  assumptions: CostAssumptions;
  lineItems: CostLineItem[];
  subtotal: number;
  contingency: number;
  grandTotal: number;
  userRates: Record<string, { material?: number; labour?: number }>;
}
