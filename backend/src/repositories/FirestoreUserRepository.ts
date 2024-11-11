import { IUserRepository } from './IUserRepository';
import FirestoreService from '../services/firestore.service';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

class FirestoreUserRepository implements IUserRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  private collectionName = process.env.GCP_ENV === 'dev' ? 'users-dev' : 'users';

  // Crear un usuario con contraseña encriptada
  async create(userData: User): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const docRef = await this.firestore.collection(this.collectionName).add({
      username: userData.username,
      password: hashedPassword,
    });
    return docRef.id;
  }

  // Login con verificación de contraseña encriptada
  async login(userData: User): Promise<boolean> {
    const querySnapshot = await this.firestore.collection(this.collectionName)
      .where('username', '==', userData.username)
      .get();

    if (querySnapshot.empty) {
      return false; // Usuario no encontrado
    }

    const userDoc = querySnapshot.docs[0];
    const storedPassword = userDoc.data().password;

    // Compara la contraseña con bcrypt
    const isPasswordMatch = await bcrypt.compare(userData.password, storedPassword);
    return isPasswordMatch;
  }
}

export default FirestoreUserRepository;
