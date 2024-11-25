// repositories/DefectRepositoryFactory.ts
import FirestoreDefectRepository from './FirestoreDefectRepository';
import { IDefectRepository } from './IDefectRepository';

class DefectRepositoryFactory {
  static createRepository(): IDefectRepository {
    return new FirestoreDefectRepository();
  }
}

export default DefectRepositoryFactory;
