// repositories/IDefectRepository.ts
export interface IDefectRepository {
  getAll(): Promise<any[]>;
  getByStatus(status: string): Promise<any[]>;
  getByLocation(location: string): Promise<any[]>;
  getById(id: string): Promise<any | null>;
  create(defectData: any): Promise<string>;
  update(id: string, defectData: Partial<any>): Promise<void>;
  delete(id: string): Promise<void>;
}
