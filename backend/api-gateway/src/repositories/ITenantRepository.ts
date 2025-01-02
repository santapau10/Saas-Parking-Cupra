import { Tenant } from "../models/tenant.model";

// repositories/IDefectRepository.ts
export interface ITenantRepository {
  create(name:string, plan:string, theme:string): Promise<string>;
  get(tenantId: string): Promise<any | null>;
  setUid(tenantId: string, uid: string): Promise<void>;
}

