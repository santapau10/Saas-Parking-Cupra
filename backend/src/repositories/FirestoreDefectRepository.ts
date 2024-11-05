// repositories/FirestoreDefectRepository.ts
import { IDefectRepository } from './IDefectRepository';
import FirestoreService from '../services/firestore.service';
import { Defect } from '../models/defect.model';

class FirestoreDefectRepository implements IDefectRepository {
  private firestore = FirestoreService.getFirestoreInstance();

  async getAll(): Promise<any[]> {
    const snapshot = await this.firestore.collection('defects').get();
    if (snapshot.empty) return [];
    
    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
      return { id: doc.id, ...data, _image: imageUrl };
    }));
  }

  async getByStatus(status: string): Promise<any[]> {
    const snapshot = await this.firestore.collection('defects').where('status', '==', status).get();
    if (snapshot.empty) return [];
    
    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
      return { id: doc.id, ...data, _image: imageUrl };
    }));
  }

  async getByLocation(location: string): Promise<any[]> {
    const snapshot = await this.firestore.collection('defects').where('location', '==', location).get();
    if (snapshot.empty) return [];
    
    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
      return { id: doc.id, ...data, _image: imageUrl };
    }));
  }

  async getById(id: string): Promise<any | null> {
    const doc = await this.firestore.collection('defects').doc(id).get();
    if (!doc.exists) return null;
    
    const data = doc.data()!;
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace(`https://storage.googleapis.com/${process.env.GCP_BUCKET}/`, '')) : null;
    return { id: doc.id, ...data, _image: imageUrl };
  }

  async create(defectData: any): Promise<string> {
    const docRef = await this.firestore.collection('defects').add(defectData);
    return docRef.id;
  }

  async update(id: string, defectData: Partial<Defect>): Promise<Defect | null> {
  const docRef = this.firestore.collection('defects').doc(id);
  await docRef.update(defectData);
  
  // Recupera el documento actualizado para retornarlo
  const updatedDoc = await docRef.get();
  return updatedDoc.exists 
      ? new Defect(
          updatedDoc.data()!._object,
          updatedDoc.data()!._location,
          updatedDoc.data()!._description,
          updatedDoc.data()!._detailedDescription,
          new Date(updatedDoc.data()!._reportingDate),
          updatedDoc.data()!._status,
          updatedDoc.data()!._image
        ) 
      : null;
}


  async delete(id: string): Promise<void> {
    await this.firestore.collection('defects').doc(id).delete();
  }
}

export default FirestoreDefectRepository;
