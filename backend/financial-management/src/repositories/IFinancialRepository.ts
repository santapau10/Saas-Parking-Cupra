

export interface IFinancialRepository {
  getEntriesFromParking(tenant_id:string, tenant_plan:string, parking:string): Promise<any[]>;
  getEntriesFromTenant(tenant_id:string, tenant_plan:string): Promise<any[]>;
  getPaymentsFromParking(tenant_id:string, tenant_plan:string, parking:string): Promise<any[]>;
  getPaymentsFromTenant(tenant_id:string, tenant_plan:string): Promise<any[]>;
}

