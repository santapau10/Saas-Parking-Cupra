import { Parking } from '../models/parking.model';
import Payment from '../models/payment.model';
import FirestoreService from '../services/firestore.service';
import { IParkingRepository } from './IParkingRepository';

class FirestoreParkingRepository implements IParkingRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  
  private collectionName = process.env.GCP_ENV === 'dev' ? 'parkings-dev' : 'parkings';
  async getParkingById(id: string): Promise<Parking> {
    const doc = await this.firestore.collection(this.collectionName).doc(id).get();

    if (!doc.exists) {
      throw new Error(`Parking with ID ${id} not found`);
    }

    const data = doc.data();
    if (!data) {
      throw new Error(`Invalid data for Parking with ID ${id}`);
    }
    return new Parking(
      data.name,
      data.location,
      data.barriers,
      data.tenant_id,
      data.capacity,
      data.floors,
      data.picture,
      data.status
    );
  }
  async updateParkingCapacity(parkingId: string, newCapacity: number): Promise<void> {
    const parkingRef = this.firestore.collection(this.collectionName).doc(parkingId);

    const doc = await parkingRef.get();
    if (!doc.exists) {
      throw new Error(`Parking with ID ${parkingId} not found`);
    }

    await parkingRef.update({ capacity: newCapacity });
  }
  public async registerPayment(payment: Payment): Promise<void> {
    try {
      const paymentData = {
        parkingId: payment.getParkingId(),
        amount: payment.getAmount(),
        timestamp: new Date().toISOString()
      };

      const result = await this.firestore.collection('parkings').add(paymentData);
      console.log(`Payment registered with ID: ${result.id}`);
    } catch (error) {
      console.error('Error registering payment:', error);
      throw new Error('Failed to register payment');
    }
  }
}

export default FirestoreParkingRepository;
