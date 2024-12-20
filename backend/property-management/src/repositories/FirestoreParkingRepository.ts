import { Parking } from '../models/parking.model';
import FirestoreService from '../services/firestore.service';
import { IParkingRepository } from './IParkingRepository';

class FirestoreParkingRepository implements IParkingRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  
  private collectionName = process.env.GCP_ENV === 'dev' ? 'parkings-dev' : 'parkings';
  async getAll(tenant_id: string): Promise<Parking[]> {
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
            signedImageUrl
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
}

export default FirestoreParkingRepository;
