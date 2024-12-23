import { Parking } from "../models/parking.model";


export interface IParkingRepository {
  getAll(tenant_id: String): Promise<Parking[]>;
  createParking(parking: Parking): Promise<string>;
  getParkingById(id:string): Promise<Parking>;
  updateParkingCapacity(parkingId: string, newCapacity: number): Promise<void>;
  updateParkingBarriers(parkingId: string, newBarriers: number): Promise<void>;
}

