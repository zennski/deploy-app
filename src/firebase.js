import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCSRGbD7qWqhg_ib2fEyjzI8YmGSxuxUhw",
  authDomain: "refrigerators-6a3cc.firebaseapp.com",
  projectId: "refrigerators-6a3cc",
  storageBucket: "refrigerators-6a3cc.appspot.com",
  messagingSenderId: "746497477419",
  appId: "1:746497477419:web:3e24c2b0c64d90bfbc136e",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);
