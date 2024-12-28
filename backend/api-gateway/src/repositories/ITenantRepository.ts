import { Tenant } from "../models/tenant.model";

// repositories/IDefectRepository.ts
export interface ITenantRepository {
  create(name:string, plan:string): Promise<string>;
}
