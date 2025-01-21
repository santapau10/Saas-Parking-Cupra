import { ITenantRepository } from './ITenantRepository';
import FirestoreService from '../services/firestore.service';
import { Tenant } from '../models/tenant.model';
import {admin} from '../services/firestore.service';

class FirebaseTenantRepository implements ITenantRepository {
  
  private firestore = FirestoreService.getFirestoreInstance();
  private collectionName = process.env.GCP_ENV === 'dev' ? 'tenants-dev' : 'tenants';

  async create(name:string, plan:string): Promise<string> {
    try {
      const tenantManager = admin.auth().tenantManager();
      const newTenant = await tenantManager.createTenant({
        displayName: name,
        emailSignInConfig: {
          enabled: true, 
          passwordRequired: true,
        },
      });
      const tenantId = newTenant.tenantId;
      const tenant = {
        name: name,
        tenantId: tenantId,
        plan: plan,
        theme: 1
      };
      await this.firestore.collection(this.collectionName).add(tenant);
      return tenantId
    }catch (error) {
      console.error('Error al crear el tenant:', error);
      throw new Error('No se pudo crear el tenant');
    }
  }
  async get(tenantId: string): Promise<any | null> {
    try {
       const querySnapshot = await this.firestore
        .collection(this.collectionName)
        .where('tenantId', '==', tenantId)
        .get();
       if (querySnapshot.empty) {
        return "No document found with tenantId: ${tenantId}";
      }

      const doc = querySnapshot.docs[0];

      return doc.data();
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      throw new Error('Failed to fetch tenant data');
    }
  }
  async setUid(tenantId: string, uid: string): Promise<void> {
    try {
      // Buscar el documento con el campo `tenantId` igual al valor proporcionado
      const querySnapshot = await this.firestore
        .collection(this.collectionName)
        .where('tenantId', '==', tenantId)
        .get();

      if (querySnapshot.empty) {
        throw new Error(`No document found with tenantId: ${tenantId}`);
      }

      // Obtener el primer documento (asumiendo que es único)
      const doc = querySnapshot.docs[0];

      // Actualizar o agregar el campo `uid`
      await doc.ref.set({ uid: uid }, { merge: true });
    } catch (error) {
      console.error('Error setting tenant UID:', error);
      throw new Error('Failed to set tenant UID');
    }
  }
  async setTheme(tenantId: string, theme: number): Promise<void> {
    try {
      const querySnapshot = await this.firestore
        .collection(this.collectionName)
        .where('tenantId', '==', tenantId)
        .get();

      if (querySnapshot.empty) {
        throw new Error(`No document found with tenantId: ${tenantId}`);
      }
      const doc = querySnapshot.docs[0];

      await doc.ref.set({ theme: theme }, { merge: true });
    } catch (error) {
      console.error('Error setting tenant theme:', error);
      throw new Error('Failed to set tenant theme');
    }
  }

}

export default FirebaseTenantRepository;
