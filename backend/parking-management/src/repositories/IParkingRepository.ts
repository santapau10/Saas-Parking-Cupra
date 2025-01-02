import { Parking } from "../models/parking.model";
import Payment from "../models/payment.model";


export interface IParkingRepository {
  getParkingById(id:string): Promise<Parking>;
  updateParkingCapacity(parkingId: string, newCapacity: number): Promise<void>;
  registerPayment(payment: Payment): Promise<void>;
}

