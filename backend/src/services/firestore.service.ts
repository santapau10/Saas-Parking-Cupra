import admin from 'firebase-admin';
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import * as dotenv from 'dotenv';

dotenv.config();

// Inicializa Firebase Admin SDK con credenciales predeterminadas de la aplicación
admin.initializeApp({
  credential: applicationDefault(),
});

// Exporta la instancia de Firestore
const firestore = admin.firestore();

export default class FirestoreService {
  private static firestoreInstance: FirebaseFirestore.Firestore;
  private static storageInstance: Storage;
  private static bucketName: string = process.env.BUCKET!; // Reemplaza con el nombre de tu bucket

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
        projectId: process.env.GCP_PROJECT_ID, 
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
  console.log(storage)
  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutos
  };

  try {
    const [url] = await storage
      .bucket(FirestoreService.bucketName)
      .file(fileName)
      .getSignedUrl(options);
    console.log("Signed URL generated:", url);
    return url;
  } catch (error: any) {
    console.error('Error generating signed URL:', error.message, error.code, error.errors);
    throw new Error(`Could not generate signed URL: ${error.message}`);
  }
}

}
