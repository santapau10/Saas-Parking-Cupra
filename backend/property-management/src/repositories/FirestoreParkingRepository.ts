import { Parking } from '../models/parking.model';
import FirestoreService from '../services/firestore.service';
import { IParkingRepository } from './IParkingRepository';

class FirestoreParkingRepository implements IParkingRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  private collectionName = process.env.GCP_ENV === 'dev' ? 'parkings-dev' : 'parkings';
  async getAll(): Promise<Parking[]> {
    try {
      const snapshot = await this.firestore
        .collection(this.collectionName)
        .get();

      if (snapshot.empty) {
        console.log(`No se encontraron estacionamientos.`);
        return [];
      }

      const parkingList: Parking[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const signedImageUrl = data.picture
            ? await FirestoreService.generateSignedUrl(
                data.picture.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/${this.collectionName}`, '')
              )
            : '';

          return new Parking(
            data.name,
            data.address,
            data.barriers,
            data.tenant_id,
            data.capacity,
            data.floors,
            signedImageUrl,
            data.status
          );
        })
      );

      return parkingList;
    } catch (error) {
      console.error('Error al obtener los estacionamientos:', error);
      throw new Error('No se pudieron recuperar los estacionamientos.');
    }
  }
  async getAllFromTenant(tenant_id: string): Promise<Parking[]> {
    try {
      const snapshot = await this.firestore
        .collection(this.collectionName)
        .where('tenant_id', '==', tenant_id)
        .get();

      if (snapshot.empty) {
        console.log(`No se encontraron estacionamientos para el tenant_id: ${tenant_id}`);
        return [];
      }

      const parkingList: Parking[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const signedImageUrl = data.picture
            ? await FirestoreService.generateSignedUrl(
                data.picture.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/${this.collectionName}`, '')
              )
            : '';

          return new Parking(
            data.name,
            data.location,
            data.barriers,
            data.tenant_id,
            data.capacity,
            data.floors,
            signedImageUrl,
            data.status
          );
        })
      );

      return parkingList;
    } catch (error) {
      console.error('Error al obtener los estacionamientos:', error);
      throw new Error('No se pudieron recuperar los estacionamientos.');
    }
  }
  async createParking(parking: Parking): Promise<string>{
    const docRef = await this.firestore.collection(this.collectionName).add(parking);
    return docRef.id;
  }
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
  async updateParkingBarriers(parkingId: string, newBarriers: number): Promise<void> {
    const parkingRef = this.firestore.collection(this.collectionName).doc(parkingId);

    const doc = await parkingRef.get();
    if (!doc.exists) {
      throw new Error(`Parking with ID ${parkingId} not found`);
    }

    await parkingRef.update({ capacity: newBarriers });
  }
  async updateParkingStatus(parkingId: string, status: string): Promise<string> {
    const parkingRef = this.firestore.collection(this.collectionName).doc(parkingId);

    const doc = await parkingRef.get();
    if (!doc.exists) {
      throw new Error(`Parking with ID ${parkingId} not found`);
    }
    const newStatus = status === 'closed' ? 'open' : 'closed';
    
    await parkingRef.update({ status: newStatus });
    return newStatus
  }
}

export default FirestoreParkingRepository;
