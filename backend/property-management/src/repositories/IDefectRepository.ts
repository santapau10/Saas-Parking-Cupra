import { Defect } from "../models/defect.model";

// repositories/IDefectRepository.ts
export interface IDefectRepository {
  getAll(): Promise<any[]>;
  getByStatus(tenant_id: string, tenant_plan: string, parking: string, status:string): Promise<any[]>;
  getFromParking(tenant_id:string, tenant_plan:string, parking:string): Promise<any[]>;
  getById(id: string): Promise<any | null>;
  create(tenant_id:string, tenant_plan:string,defectData: any): Promise<string>;
  update(id: string, defectData: Partial<Defect>): Promise<Defect | null>; // Debe retornar Defect | null
  delete(id: string): Promise<void>;
}

