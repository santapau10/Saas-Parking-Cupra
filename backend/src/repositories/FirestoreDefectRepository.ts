// repositories/FirestoreDefectRepository.ts
import { IDefectRepository } from './IDefectRepository';
import FirestoreService from '../services/firestore.service';

class FirestoreDefectRepository implements IDefectRepository {
  private firestore = FirestoreService.getFirestoreInstance();

  async getAll(): Promise<any[]> {
    const snapshot = await this.firestore.collection('defects').get();
    if (snapshot.empty) return [];
    
    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace('https://storage.googleapis.com/cupra-bucket/', '')) : null;
      return { id: doc.id, ...data, _image: imageUrl };
    }));
  }

  async getByStatus(status: string): Promise<any[]> {
    const snapshot = await this.firestore.collection('defects').where('status', '==', status).get();
    if (snapshot.empty) return [];
    
    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace('https://storage.googleapis.com/cupra-bucket/', '')) : null;
      return { id: doc.id, ...data, _image: imageUrl };
    }));
  }

  async getByLocation(location: string): Promise<any[]> {
    const snapshot = await this.firestore.collection('defects').where('location', '==', location).get();
    if (snapshot.empty) return [];
    
    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace('https://storage.googleapis.com/cupra-bucket/', '')) : null;
      return { id: doc.id, ...data, _image: imageUrl };
    }));
  }

  async getById(id: string): Promise<any | null> {
    const doc = await this.firestore.collection('defects').doc(id).get();
    if (!doc.exists) return null;
    
    const data = doc.data()!;
      const imageUrl = data._image ? await FirestoreService.generateSignedUrl(data._image.replace('https://storage.googleapis.com/cupra-bucket/', '')) : null;
    return { id: doc.id, ...data, _image: imageUrl };
  }

  async create(defectData: any): Promise<string> {
    const docRef = await this.firestore.collection('defects').add(defectData);
    return docRef.id;
  }

  async update(id: string, defectData: Partial<any>): Promise<void> {
    await this.firestore.collection('defects').doc(id).update(defectData);
  }

  async delete(id: string): Promise<void> {
    await this.firestore.collection('defects').doc(id).delete();
  }
}

export default FirestoreDefectRepository;
