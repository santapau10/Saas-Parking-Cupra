import { Parking } from "../models/parking.model";


export interface IParkingRepository {
  // getAll(tenant_id: String): Promise<Parking[]>;
  getAllFromTenant(tenant_id: string, tenant_plan:string): Promise<Parking[]>;
  createParking(parking: Parking, tenant_id: string, plan: string): Promise<string>;
  getParkingById(tenant_id: string, tenant_plan: string, id:string): Promise<Parking>;
  getParkingByName(id:string): Promise<Parking | null>;
  updateParkingCapacity(tier: string, tenant_id: string, parkingId: string, newCapacity: number): Promise<void>;
  updateParkingBarriers(plan: string, tenant_id: string,parkingId: string, newBarriers: number): Promise<void>;
  updateParkingStatus(plan: string, tenant_id: string, parkingId: string, status: string): Promise<string>;
}

