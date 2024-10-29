import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';

const serviceAccount = require('../../keys/cupra-cad-9decce7dcc62.json') as ServiceAccount;

// Inicializa Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exporta la instancia de Firestore
const firestore = admin.firestore();

export default class FirestoreService {
  private static firestoreInstance: FirebaseFirestore.Firestore;
  private static storageInstance: Storage;
  private static bucketName: string = 'cupra-bucket'; // Reemplaza con el nombre de tu bucket

  private constructor() {}

  static getFirestoreInstance(): FirebaseFirestore.Firestore {
    if (!FirestoreService.firestoreInstance) {
      FirestoreService.firestoreInstance = firestore;
    }
    return FirestoreService.firestoreInstance;
  }

  static getStorageInstance(): Storage {
    if (!FirestoreService.storageInstance) {
      FirestoreService.storageInstance = new Storage({
        projectId: serviceAccount.projectId,
        keyFilename: '../backend/keys/cupra-cad-9decce7dcc62.json',
      });
    }
    return FirestoreService.storageInstance;
  }

  static async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const storage = FirestoreService.getStorageInstance();
    const bucket = storage.bucket(FirestoreService.bucketName);
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
      metadata: { contentType: mimeType },
      resumable: false,
    });

    return `https://storage.googleapis.com/${FirestoreService.bucketName}/${fileName}`;
  }

  static async generateSignedUrl(fileName: string): Promise<string> {
    const storage = FirestoreService.getStorageInstance();
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
    };

    try {
      // Asegúrate de usar solo el nombre del archivo, no la URL completa
      const [url] = await storage
        .bucket(FirestoreService.bucketName)
        .file(fileName) // Asegúrate de que 'fileName' sea solo la parte relevante
        .getSignedUrl(options);
      console.log("Esto es", url)
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Could not generate signed URL');
    }
}

}
