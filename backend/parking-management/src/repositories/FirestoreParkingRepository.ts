import { EntryOrExit } from '../models/entry.model';
import { Parking } from '../models/parking.model';
import Payment from '../models/payment.model';
import FirestoreService from '../services/firestore.service';
import { IParkingRepository } from './IParkingRepository';

class FirestoreParkingRepository implements IParkingRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  
  private collectionName = process.env.GCP_ENV === 'dev' ? 'parkings-dev' : 'parkings';
  async getParkingById(tenant_id:string, tenant_plan:string, id: string): Promise<Parking> {
    const doc = await this.firestore
      .collection(tenant_plan) // Selecciona la colección del tenant plan ('free' o 'standard')
      .doc(tenant_id) // Selecciona el documento del tenant
      .collection('parkings') // Accede a la subcolección de parkings
      .where('name', '==', id) // Filtra por el ID del parking
      .get();

    if (doc.empty) {
      throw new Error(`Parking with ID ${id} not found`);
    }

    const data = doc.docs[0].data();
    if (!data) {
      throw new Error(`Invalid data for Parking with ID ${id}`);
    }
    return new Parking(
      data.name,
      data.address,
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
  public async registerPayment(payment: Payment, tenant_id: string, tenant_plan:string): Promise<void> {
    try {
      const paymentData = {
        parkingId: payment.getParkingId(),
        amount: payment.getAmount(),
        timestamp: new Date().toISOString()
      };

      // const result = await this.firestore.collection('parkings').add(paymentData);
      const result = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection('payments')
      .add(paymentData);
      console.log(`Payment registered with ID: ${result.id}`);
    } catch (error) {
      console.error('Error registering payment:', error);
      throw new Error('Failed to register payment');
    }
  }
  public async addEntry(entry: EntryOrExit, tenant_id: string, tenant_plan:string): Promise<void> {
    try {
      const entryData = {
        license_plate: entry.license_plate,
        parking_id: entry.parking_id,
        timestamp: entry.timestamp,
        type: 'entry'
      };

      const result = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection('entries')
      .add(entryData);
      console.log(`Entry registered with ID: ${result.id}`);
    } catch (error) {
      console.error('Error registering entry:', error);
      throw new Error('Failed to register entry');
    }
  }
  public async addExit(exit: EntryOrExit, tenant_id: string, tenant_plan:string): Promise<void> {
    try {
      const exitData = {
        license_plate: exit.license_plate,
        parking_id: exit.parking_id,
        timestamp: exit.timestamp,
        type: 'exit'
      };

      const result = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection('exits')
      .add(exitData);

      console.log(`Exit registered with ID: ${result.id}`);
    } catch (error) {
      console.error('Error registering exit:', error);
      throw new Error('Failed to register exit');
    }
  }
  async findEntryByLicensePlate(license_plate: string, tenant_id: string, tenant_plan:string): Promise<EntryOrExit | null> {
    const snapshot = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection('entries')
      .where('license_plate', '==', license_plate)
      .get();

    if (snapshot.empty) {
      return null; // No se encontró ninguna entrada
    }

    // Obtener el primer documento del resultado y mapearlo a EntryOrExit
    const doc = snapshot.docs[0];
    const data = doc.data();

    return new EntryOrExit(
      data.license_plate,
      data.parking_id,
      data.timestamp,
      data.type
    );
  }
}

export default FirestoreParkingRepository;
