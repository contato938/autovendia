export type DemandStatus = 'pending' | 'resolved' | 'ignored';
export type DemandPriority = 'low' | 'medium' | 'high';

export interface ProductDemand {
  id: string;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  lead_id?: string | null;
  product_name: string;
  sku?: string | null;
  status: DemandStatus;
  priority: DemandPriority;
  
  // Joins
  leads?: {
    name: string;
    phone: string;
  } | null;
}
