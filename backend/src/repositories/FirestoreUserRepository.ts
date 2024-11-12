import { IUserRepository } from './IUserRepository';
import FirestoreService from '../services/firestore.service';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

class FirestoreUserRepository implements IUserRepository {
  private firestore = FirestoreService.getFirestoreInstance();
  private collectionName = process.env.GCP_ENV === 'dev' ? 'users-dev' : 'users';

  // Create a user with an encrypted password, only if username is unique
  async create(userData: User): Promise<string> {
    // Check if a user with the same username already exists
    const existingUserQuery = await this.firestore.collection(this.collectionName)
      .where('username', '==', userData.username)
      .get();

    if (!existingUserQuery.empty) {
      throw new Error('Username already exists'); // Throw an error if the username is taken
    }

    // Encrypt the password and create the user if username is unique
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const docRef = await this.firestore.collection(this.collectionName).add({
      username: userData.username,
      password: hashedPassword,
    });

    return docRef.id; // Return the new user document ID
  }

  // Login with encrypted password verification
  async login(userData: User): Promise<boolean> {
    const querySnapshot = await this.firestore.collection(this.collectionName)
      .where('username', '==', userData.username)
      .get();

    if (querySnapshot.empty) {
      return false; // User not found
    }

    const userDoc = querySnapshot.docs[0];
    const storedPassword = userDoc.data().password;

    // Compare the password with bcrypt
    const isPasswordMatch = await bcrypt.compare(userData.password, storedPassword);
    return isPasswordMatch;
  }
}

export default FirestoreUserRepository;
