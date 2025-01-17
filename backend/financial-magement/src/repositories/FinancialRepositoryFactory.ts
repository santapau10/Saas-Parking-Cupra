
import FirestoreFinancialRepository from './FirestoreFinancialRepository';
import { IFinancialRepository } from './IFinancialRepository';

class FinancialRepositoryFactory {
  static createRepository(): IFinancialRepository {
    return new FirestoreFinancialRepository();
  }
}

export default FinancialRepositoryFactory;
