import { ITenantRepository } from './ITenantRepository';
import FirestoreService from '../services/firestore.service';
import { Tenant } from '../models/tenant.model';
import admin from 'firebase-admin';

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
      const tenant = new Tenant(name, tenantId, plan)

      await this.firestore.collection(this.collectionName).add(tenant);
      return tenantId
    }catch (error) {
      console.error('Error al crear el tenant:', error);
      throw new Error('No se pudo crear el tenant');
    }
  }
}

export default FirebaseTenantRepository;
