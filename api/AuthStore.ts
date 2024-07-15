import { makeAutoObservable } from 'mobx';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';

class AuthStore {
  user : null | User = null;

  constructor() {
    makeAutoObservable(this);

    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  }

  async signIn(email:string, password:string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  }

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  async signUp(email:string, password:string) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  }
}

const authStore = new AuthStore();
export default authStore;
