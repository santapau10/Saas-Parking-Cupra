import { User } from "../models/user.model";

// repositories/IDefectRepository.ts
export interface IUserRepository {
  create(defectData: any): Promise<string>;
  login(defectData: any): Promise<boolean>; 
}

