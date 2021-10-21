import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClHh38_9bF5igi_UbVd4FvFE73H2ju9Oc",
  authDomain: "trello-clone-3ed23.firebaseapp.com",
  projectId: "trello-clone-3ed23",
  storageBucket: "trello-clone-3ed23.appspot.com",
  messagingSenderId: "808995117037",
  appId: "1:808995117037:web:9264956a2e47294190b9e4",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const provider = new GoogleAuthProvider();
export default firebaseApp;
