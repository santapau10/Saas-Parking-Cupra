import { IUserRepository } from './IUserRepository';
import FirestoreService from '../services/firestore.service';
import { User } from '../models/user.model';
import admin from 'firebase-admin';
class FirestoreUserRepository implements IUserRepository {
  private firestore = FirestoreService.getFirestoreInstance();

  async create(userData: User, isAdmin: boolean): Promise<string> {
    const tenantAuth = admin.auth().tenantManager().authForTenant(userData.tenant_id);
      const existingUser = await tenantAuth.getUserByEmail(userData.email).catch((error) => {
        if (error.code !== 'auth/user-not-found') {
          throw error; 
        }
        return null;
      });
    if (existingUser) {
      throw new Error('Username already exists'); 
    }
     const userRecord = await tenantAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.username,
    })
    const tenant = await this.firestore.collection('tenants').where("tenantId", "==", userData.tenant_id).get();
    
    const customClaims = { role: userData.role, tenantId: userData.tenant_id, plan: tenant.docs[0].data().plan };
    await tenantAuth.setCustomUserClaims(userRecord.uid, customClaims);
    const token = await admin.auth().createCustomToken(userRecord.uid, customClaims);
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);

    return token ;
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
}

export default FirestoreUserRepository;
