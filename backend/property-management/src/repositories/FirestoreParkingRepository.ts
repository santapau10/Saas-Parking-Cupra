import { Parking } from '../models/parking.model';
import FirestoreService from '../services/firestore.service';
import { IParkingRepository } from './IParkingRepository';

class FirestoreParkingRepository implements IParkingRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  private collectionName = process.env.GCP_ENV === 'dev' ? 'parkings-dev' : 'parkings';
  async getAll(): Promise<Parking[]> {
  try {
    const parkingList: Parking[] = [];
    const collectionsSnapshot = await this.firestore.listCollections();

    // Recorre todas las colecciones de nivel superior (e.g., 'free', 'standard')
    for (const tenantPlan of collectionsSnapshot) {
      const tenantsSnapshot = await tenantPlan.get();

      // Recorre los documentos (tenants) dentro de cada colección
      for (const tenantDoc of tenantsSnapshot.docs) {
        const tenantId = tenantDoc.id;

        // Accede a la subcolección `parkings` dentro del tenant
        const parkingsSnapshot = await this.firestore
          .collection(tenantPlan.id)
          .doc(tenantId)
          .collection('parkings')
          .get();

        if (!parkingsSnapshot.empty) {
          const tenantParkings = await Promise.all(
            parkingsSnapshot.docs.map(async (doc) => {
              const data = doc.data();
              const signedImageUrl = data.picture
                ? await FirestoreService.generateSignedUrl(
                    data.picture.replace(
                      `https://storage.googleapis.com/${process.env.GCP_BUCKET}/${tenantDoc}/${tenantId}/parkings`,
                      ''
                    )
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

          parkingList.push(...tenantParkings);
        }
      }
    }

    return parkingList;
  } catch (error) {
    console.error('Error al obtener todos los estacionamientos:', error);
    throw new Error('No se pudieron recuperar los estacionamientos.');
  }
}

  async getAllFromTenant(tenant_id: string, tenant_plan:string): Promise<Parking[]> {
    try {
      const snapshot = await this.firestore
            .collection(tenant_plan) // Selecciona la colección `free` o `standard`
            .doc(tenant_id) // Selecciona el documento del tenant (e.g., `tenant1`)
            .collection('parkings') // Accede a la subcolección `parkings`
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
                data.picture.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/${tenant_plan}/${tenant_id}/${this.collectionName}`, '')
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
  async createParking(parking: Parking, tenant_id: string, plan: string): Promise<string>{
    // const docRef = await this.firestore.collection(`${tenant_id}/${this.collectionName}`).add(parking);
    const plainParking = parking.toPlainObject();
    const docRef = await this.firestore
            .collection(plan) // Colección "free" o "standard"
            .doc(tenant_id) // Documento "tenant1" o "tenant2"
            .collection('parkings') // Subcolección "parkings"
            .add(plainParking); // Documento con los datos del parking
    console.log('Parking created with ID:', docRef.id);
    return docRef.id;
  }
  async getParkingById(tenant_id: string, tenant_plan: string, id:string): Promise<Parking> {
      try {
          // Accede a la subcolección `parkings` dentro de la colección principal y el documento del tenant
          const doc = await this.firestore
              .collection(tenant_plan) // `free` o `standard`
              .doc(tenant_id) // Documento del tenant (ej. `tenant1`)
              .collection('parkings') // Subcolección `parkings`
              .doc(id) // Accede al parking por su ID
              .get();

          // Verificar si el documento existe
          if (!doc.exists) {
              throw new Error(`Parking with ID ${id} not found`);
          }

          // Obtener los datos del parking
          const data = doc.data();
          if (!data) {
              throw new Error(`Invalid data for Parking with ID ${id}`);
          }

          // Retornar el parking como una instancia de la clase Parking
          return new Parking(
              data.name,
              data.location, // Cambié `address` por `location` según tu estructura
              data.barriers,
              data.tenant_id,
              data.capacity,
              data.floors,
              data.pictureUrl, // Cambié `picture` por `pictureUrl`
              data.status
          );
      } catch (error) {
          console.error('Error getting parking by ID:', error);
          throw error;
      }
  }

  async getParkingByName(name: string): Promise<Parking> {
    try {
      // Buscar el documento en la colección tenants donde el uid sea igual a userId
      const snapshot = await this.firestore
        .collection(this.collectionName)
        .where('name', '==', name)
        .limit(1)
        .get();

      // Verificar si se encontró algún documento
      if (snapshot.empty) {
        throw new Error('Parking not found');
      }
      const data = snapshot.docs[0].data();
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
    } catch (error) {
      console.error('Error getting parking:', error);
      throw error;
    }
  }
  async updateParkingCapacity(plan: string, tenant_id: string, parkingId: string, newCapacity: number): Promise<void> {
      try {
          // Accede a la subcolección `parkings` dentro de la colección principal y el documento del tenant
          const parkingRef = this.firestore
              .collection(plan) // `free` o `standard`
              .doc(tenant_id) // Documento del tenant (ej. `tenant1`)
              .collection('parkings') // Subcolección `parkings`
              .doc(parkingId); // Documento del parking por su ID

          // Obtener el documento del parking
          const doc = await parkingRef.get();
          if (!doc.exists) {
              throw new Error(`Parking with ID ${parkingId} not found`);
          }

          // Actualizar la capacidad del parking
          await parkingRef.update({ capacity: newCapacity });
          console.log(`Parking capacity for ${parkingId} updated successfully`);
      } catch (error) {
          console.error('Error updating parking capacity:', error);
          throw error;
      }
  }
  async updateParkingBarriers(tenant_id: string,plan: string, parkingId: string, newBarriers: number): Promise<void> {
    const parkingRef = this.firestore
              .collection(plan) // `free` o `standard`
              .doc(tenant_id) // Documento del tenant (ej. `tenant1`)
              .collection('parkings') // Subcolección `parkings`
              .doc(parkingId); // Documento del parking por su ID


    const doc = await parkingRef.get();
    if (!doc.exists) {
      throw new Error(`Parking with ID ${parkingId} not found`);
    }

    await parkingRef.update({ barriers: newBarriers });
  }
  async updateParkingStatus(tenant_id: string,plan: string, parkingId: string, status: string): Promise<string> {
    const parkingRef = this.firestore
              .collection(plan) // `free` o `standard`
              .doc(tenant_id) // Documento del tenant (ej. `tenant1`)
              .collection('parkings') // Subcolección `parkings`
              .doc(parkingId); // Documento del parking por su ID

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
