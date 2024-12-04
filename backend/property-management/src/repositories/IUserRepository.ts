import { Tenant } from "../models/tenant.model";
import { User } from "../models/user.model";

// repositories/IDefectRepository.ts
export interface IUserRepository {
  create(userData: User, isAdmin: boolean): Promise<string>;
  login(token: String): Promise<{userId:string, role: string}>;
}
