import { IUserRepository } from './IUserRepository';
import FirestoreService from '../services/firestore.service';
import { User } from '../models/user.model';
import admin from 'firebase-admin';
class FirestoreUserRepository implements IUserRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  private collectionName = process.env.GCP_ENV === 'dev' ? 'users-dev' : 'users';

  async create(userData: User, isAdmin: boolean): Promise<{token: string, userId: string}> {
    const tenantAuth = admin.auth().tenantManager().authForTenant(userData.tenant_id);
    console.log("0")
      const existingUser = await tenantAuth.getUserByEmail(userData.email).catch((error) => {
        if (error.code !== 'auth/user-not-found') {
          throw error; 
        }
        return null;
      });
    if (existingUser) {
      console.log("1")
      throw new Error('Username already exists'); 
    }
    const userRecord = await tenantAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.username,
    })
    console.log("2")
    const user = {
        username: userData.username,
        email: userData.email, 
        tenantId: userData.tenant_id,
        role: userData.role,
        uid: userRecord.uid,
    };
    await this.firestore.collection(this.collectionName).add(user);



    const tenant = await this.firestore.collection('tenants').where("tenantId", "==", userData.tenant_id).get();
    
    const customClaims = { role: userData.role, tenantId: userData.tenant_id, plan: tenant.docs[0].data().plan };
    await tenantAuth.setCustomUserClaims(userRecord.uid, customClaims);
    const token = await admin.auth().createCustomToken(userRecord.uid, customClaims);
    return {token: token, userId: userRecord.uid};
  }
  async login(token: string): Promise<{userId:string, role: string}> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return {
        userId: decodedToken.uid,
        role: decodedToken.role || 'user', 
      };
    } catch (error) {
      throw new Error('Token inválido o sesión no válida');
    }
  }
  async getTenant(userId: string): Promise<string> {
    try {
      // Buscar el documento en la colección tenants donde el uid sea igual a userId
      const tenantSnapshot = await this.firestore
        .collection('tenants')
        .where('uid', '==', userId)
        .limit(1)
        .get();

      // Verificar si se encontró algún documento
      if (tenantSnapshot.empty) {
        throw new Error('Tenant not found');
      }

      const tenantDoc = tenantSnapshot.docs[0];
      const tenantData = tenantDoc.data();
      
      return tenantData.tenantId;
    } catch (error) {
      console.error('Error getting tenant:', error);
      throw error;  // Puedes manejar el error de la manera que desees
    }
  }
  async get(userId: string): Promise<any> {
    try {
      // Buscar el documento en la colección users donde el uid sea igual a userId
      const userSnapshot = await this.firestore
        .collection('users')
        .where('uid', '==', userId)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      
      return userData as User;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;  // Puedes manejar el error de la manera que desees
    }
  }
}

export default FirestoreUserRepository;
