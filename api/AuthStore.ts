import { makeAutoObservable, runInAction } from "mobx";
import { auth, firestore } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { User as FullUser } from "./types";

class AuthStore {
  user: null | User = null;
  completeUser: null | FullUser = null;

  constructor() {
    makeAutoObservable(this);

    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  }

  async signIn(email: string, password: string) {
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

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    try {
      const retUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = retUser.user;

      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
        tasksCompleted: 0,
      });

      runInAction(() => {
        this.completeUser = { id: user.uid, firstName, lastName, email, tasksCompleted: 0 };
      });
    } catch (error) {
      console.error(error);
    }
  }

  async loadCompleteUser(userId: string) {
    try {
      const userRef = doc(firestore, "users", userId);
      onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          runInAction(() => {
            this.completeUser = { id: doc.id, ...doc.data()} as FullUser;
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const authStore = new AuthStore();
export default authStore;
