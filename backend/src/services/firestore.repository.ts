// src/repositories/firestoreDefect.repository.ts

import FirestoreService from './firestore.service';
import { IDefectRepository } from '../repositories/IDefectRepository';
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
  async getByStatus(status: string): Promise<Defect[]> {
    const snapshot = await this.firestore.collection('defects').where('_status', '==', status).get();
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
async getByLocation(location: string): Promise<Defect[]> {
    const snapshot = await this.firestore.collection('defects').where('_location', '==', location).get();
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

  async create(defectData: any): Promise<string> {
      const docRef = await this.firestore.collection('defects').add({
          _object: defectData._object,
          _location: defectData._location,
          _description: defectData._description,
          _detailedDescription: defectData._detailedDescription,
          _reportingDate: defectData._reportingDate,
          _status: defectData._status,
          _image: defectData._image,
      });
      return docRef.id; // return the document ID as a string
  }


  async update(id: string, defectData: Partial<Defect>): Promise<Defect | null> {
      const docRef = this.firestore.collection('defects').doc(id);
      await docRef.update(defectData);
      
      // Retrieve the updated document to return it
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
