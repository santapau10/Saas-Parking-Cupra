// repositories/DefectRepositoryFactory.ts
import FirestoreUserRepository from './FirestoreUserRepository';
import { IUserRepository } from './IUserRepository';

class UserRepositoryFactory {
  static createRepository(): IUserRepository {
    return new FirestoreUserRepository();
  }
}

export default UserRepositoryFactory;
