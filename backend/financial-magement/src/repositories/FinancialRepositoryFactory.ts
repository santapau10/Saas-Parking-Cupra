
import FirestoreService from '../services/firestore.service';
import FirestoreFinancialRepository from './FirestoreFinancialRepository';
import { IFinancialRepository } from './IFinancialRepository';

class FinancialRepositoryFactory implements IFinancialRepository {
  private firestore = FirestoreService.getFirestoreInstance();
    
    // Determina el nombre de la colección según la variable de entorno GCP_ENV
    private entriesCollectionName = process.env.GCP_ENV === 'dev' ? 'entries-dev' : 'entries';
    private paymentsCollectionName = process.env.GCP_ENV === 'dev' ? 'payments-dev' : 'payments';
  
    async getEntriesFromParking(tenant_id:string, tenant_plan:string, parking:string): Promise<any[]> {
      const snapshot = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection(this.entriesCollectionName)
      .where('parking_id', '==', parking)
      .get();
      if (snapshot.empty) return [];
      return snapshot.docs.map(doc => doc.data());
    }
    async getEntriesFromTenant(tenant_id:string, tenant_plan:string): Promise<any[]> {
      const snapshot = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection(this.entriesCollectionName)
      .get();
      
      if (snapshot.empty) return [];
      return snapshot.docs.map(doc => doc.data());
    }
    async getPaymentsFromParking(tenant_id:string, tenant_plan:string, parking:string): Promise<any[]> {
      const snapshot = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection(this.paymentsCollectionName)
      .where('parkingId', '==', parking)
      .get();
  
      if (snapshot.empty) return [];
      return snapshot.docs.map(doc => doc.data());
    }
    async getPaymentsFromTenant(tenant_id:string, tenant_plan:string): Promise<any[]> {
      const snapshot = await this.firestore
      .collection(tenant_plan)
      .doc(tenant_id)
      .collection(this.entriesCollectionName)
      .get();
  
      if (snapshot.empty) return [];
      return snapshot.docs.map(doc => doc.data());
    }
  
}

export default FinancialRepositoryFactory;
