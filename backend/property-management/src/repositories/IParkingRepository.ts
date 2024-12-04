import { Parking } from "../models/parking.model";


export interface IParkingRepository {
  getAll(tenant_id: String): Promise<Parking[]>;
  createParking(parking: Parking): Promise<string>;
}

