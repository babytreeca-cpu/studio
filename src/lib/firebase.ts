import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBq-wMBP640je4yzXW8PLwRlBH7nP6ln4w",
  authDomain: "reportljsm.firebaseapp.com",
  projectId: "reportljsm",
  storageBucket: "reportljsm.firebasestorage.app",
  messagingSenderId: "228428834313",
  appId: "1:228428834313:web:c70d397d7034efcdc2fad8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);