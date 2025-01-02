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
      const tenantRef = this.firestore.collection(this.collectionName).doc(tenantId);
      const tenantSnapshot = await tenantRef.get();

      if (!tenantSnapshot.exists) {
        console.error(`Tenant with ID ${tenantId} not found.`);
        return null;
      }

      return tenantSnapshot.data();
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      throw new Error('Failed to fetch tenant data');
    }
  }
}

export default FirebaseTenantRepository;
