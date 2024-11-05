import { Defect } from "../models/defect.model";

// repositories/IDefectRepository.ts
export interface IDefectRepository {
  getAll(): Promise<any[]>;
  getByStatus(status: string): Promise<any[]>;
  getByLocation(location: string): Promise<any[]>;
  getById(id: string): Promise<any | null>;
  create(defectData: any): Promise<string>;
  update(id: string, defectData: Partial<Defect>): Promise<Defect | null>; // Debe retornar Defect | null
  delete(id: string): Promise<void>;
}

