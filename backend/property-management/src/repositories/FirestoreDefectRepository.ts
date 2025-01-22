// repositories/FirestoreDefectRepository.ts

import { IDefectRepository } from './IDefectRepository';
import FirestoreService from '../services/firestore.service';
import { Defect } from '../models/defect.model';

class FirestoreDefectRepository implements IDefectRepository {
  private firestore = FirestoreService.getFirestoreInstance();

  // Determina el nombre de la colección según la variable de entorno GCP_ENV
  private collectionName = process.env.GCP_ENV === 'dev' ? 'defects-dev' : 'defects';

  async getAll(): Promise<any[]> {
    const snapshot = await this.firestore.collection(this.collectionName).get();
    if (snapshot.empty) return [];

    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data.image ? await FirestoreService.generateSignedUrl(data.image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
      return { id: doc.id, ...data, image: imageUrl };
    }));
  }

  async getFromParking(tenant_id: string, tenant_plan: string, parking: string): Promise<any[]> {
    try {
      // Accede a la colección `defects` bajo el tenant correspondiente
      const snapshot = await this.firestore
        .collection(tenant_plan) // Selecciona la colección `free` o `standard`
        .doc(tenant_id) // Selecciona el documento del tenant (e.g., `tenant1`)
        .collection('defects') // Accede a la colección `defects`
        .where('parking', '==', parking) // Filtra por el campo `parking`
        .get();

      if (snapshot.empty) {
        console.log(`No se encontraron defectos para el parking: ${parking}`);
        return [];
      }

      // Mapeo de los resultados
      return await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imageUrl = data.image
            ? await FirestoreService.generateSignedUrl(
                data.image.replace(
                  `https://storage.googleapis.com/${process.env.GCP_BUCKET}/`,
                  ''
                )
              )
            : null;
          return { id: doc.id, ...data, image: imageUrl };
        })
      );
    } catch (error) {
      console.error('Error al obtener defectos del parking:', error);
      throw new Error('No se pudieron recuperar los defectos.');
    }
  }

  
  async getByStatus(tenant_id: string, tenant_plan: string, parking: string, status:string): Promise<any[]> {
    try {
      // Accede a la colección `defects` bajo el tenant correspondiente
      const snapshot = await this.firestore
        .collection(tenant_plan) // Selecciona la colección `free` o `standard`
        .doc(tenant_id) // Selecciona el documento del tenant (e.g., `tenant1`)
        .collection('defects') // Accede a la colección `defects`
        .where('parking', '==', parking) // Filtra por el campo `parking`
        .where('status', '==', status) // Filtra por el campo `status`
        .get();

      if (snapshot.empty) {
        console.log(`No se encontraron defectos para el parking: ${parking}`);
        return [];
      }

      // Mapeo de los resultados
      return await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imageUrl = data.image
            ? await FirestoreService.generateSignedUrl(
                data.image.replace(
                  `https://storage.googleapis.com/${process.env.GCP_BUCKET}/`,
                  ''
                )
              )
            : null;
          return { id: doc.id, ...data, image: imageUrl };
        })
      );
    } catch (error) {
      console.error('Error al obtener defectos del parking:', error);
      throw new Error('No se pudieron recuperar los defectos.');
    }
  }

  

  async getById(id: string): Promise<any | null> {
    const doc = await this.firestore.collection(this.collectionName).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
    return { id: doc.id, ...data, image: imageUrl };
  }

  async create(tenant_id:string, tenant_plan:string, defectData: any): Promise<string> {
    const docRef = await this.firestore
            .collection(tenant_plan) // Colección "free" o "standard"
            .doc(tenant_id) // Documento "tenant1" o "tenant2"
            .collection(this.collectionName) // Subcolección "parkings"
            .add(defectData); // Documento con los datos del parking
    return docRef.id;
  }

  async update(id: string, defectData: Partial<Defect>): Promise<Defect | null> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    await docRef.update(defectData);

    // Recupera el documento actualizado para retornarlo
    const updatedDoc = await docRef.get();
    return updatedDoc.exists
      ? new Defect(
        updatedDoc.data()!.location,
        updatedDoc.data()!.description,
        updatedDoc.data()!.detailedDescription,
        new Date(updatedDoc.data()!.reportingDate),
        updatedDoc.data()!.status,
        updatedDoc.data()!.image,
        updatedDoc.data()!.username
      )
      : null;
  }

  async delete(tenant_id: string, tenant_plan: string, id: string): Promise<void> {
  if (!tenant_id || !tenant_plan || !id) {
    throw new Error('Los parámetros tenant_id, tenant_plan e id son obligatorios.');
  }

  try {
    const docRef = this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection(this.collectionName)
      .doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('El documento no existe, no se puede eliminar.');
    }

    await docRef.delete();
    console.log('Defecto eliminado correctamente:', id);
  } catch (error) {
    console.error('Error al eliminar el defecto del parking:', error);
    throw new Error('No se pudo eliminar el defecto del parking.');
  }
}


  async getTenantPlan(tenant_id: string): Promise<string> {
    const doc = await this.firestore.collection('tenants').where('tenantId', '==', tenant_id).get();
    if (doc.empty) {
      throw new Error(`Tenant with ID ${tenant_id} not found`);
    }
    const data = doc.docs[0].data();
    return data.plan;
  }
}

export default FirestoreDefectRepository;
