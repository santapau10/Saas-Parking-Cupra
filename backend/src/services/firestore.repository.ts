// src/repositories/firestoreDefect.repository.ts

import FirestoreService from './firestore.service';
import { IDefectRepository } from '../interfaces/defectrepository.interface';
import { Defect } from '../models/defect.model';

export class FirestoreDefectRepository implements IDefectRepository {
  private firestore = FirestoreService.getFirestoreInstance();

  async getAll(): Promise<Defect[]> {
    const snapshot = await this.firestore.collection('defects').get();
    return snapshot.docs.map(doc => new Defect(
      doc.data()._object,
      doc.data()._location,
      doc.data()._description,
      doc.data()._detailedDescription,
      new Date(doc.data()._reportingDate),
      doc.data()._status,
      doc.data()._image
    ));
  }

  async getById(id: string): Promise<Defect | null> {
    const doc = await this.firestore.collection('defects').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return new Defect(data!._object, data!._location, data!._description, data!._detailedDescription, new Date(data!._reportingDate), data!._status, data!._image);
  }

  async create(defect: Defect): Promise<Defect> {
    const docRef = await this.firestore.collection('defects').add({
      _object: defect.object,
      _location: defect.location,
      _description: defect.description,
      _detailedDescription: defect.detailedDescription,
      _reportingDate: defect.reportingDate,
      _status: defect.status,
      _image: defect.image,
    });
    return defect;
  }

  async update(id: string, defectData: Partial<Defect>): Promise<Defect | null> {
    const docRef = this.firestore.collection('defects').doc(id);
    await docRef.update(defectData);
    const updatedDoc = await docRef.get();
    return updatedDoc.exists ? new Defect(updatedDoc.data()!._object, updatedDoc.data()!._location, updatedDoc.data()!._description, updatedDoc.data()!._detailedDescription, new Date(updatedDoc.data()!._reportingDate), updatedDoc.data()!._status, updatedDoc.data()!._image) : null;
  }

  async delete(id: string): Promise<void> {
    await this.firestore.collection('defects').doc(id).delete();
  }
}
