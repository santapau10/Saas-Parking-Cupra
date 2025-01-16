import { Parking } from "../models/parking.model";
import Payment from "../models/payment.model";


export interface IParkingRepository {
  getParkingById(tenant_id:string, tenant_plan:string,id:string): Promise<Parking>;
  updateParkingCapacity(parkingId: string, newCapacity: number): Promise<void>;
  registerPayment(payment: Payment, tenant_id: string, tenant_plan:string): Promise<void>;
}

