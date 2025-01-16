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

  async getFromParking(tenant_id:string, tenant_plan:string, parking: string): Promise<any[]> {
    const snapshot = await this.firestore
            .collection(tenant_plan) // Selecciona la colección `free` o `standard`
            .doc(tenant_id) // Selecciona el documento del tenant (e.g., `tenant1`)
            .collection(this.collectionName) // Accede a la subcolección `parkings`
            .get();
    if (snapshot.empty) return [];

    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data.image ? await FirestoreService.generateSignedUrl(data.image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
      return { id: doc.id, ...data, image: imageUrl };
    }));
  }
  
  async getByStatus(status: string,tenant_id:string): Promise<any[]> {
    const snapshot = await this.firestore.collection(`${tenant_id}/${this.collectionName}`).where('status', '==', status).get();
    if (snapshot.empty) return [];

    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
      return { id: doc.id, ...data, image: imageUrl };
    }));
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

  async delete(id: string): Promise<void> {
    await this.firestore.collection(this.collectionName).doc(id).delete();
  }
}

export default FirestoreDefectRepository;
