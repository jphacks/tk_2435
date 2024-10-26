// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Firestoreをインポート
import "./slack-capture/content.js"; // content.jsをインポート

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHV5h7w3C9klK3cqcbpUGmwRqz-GrRPcU",
  authDomain: "text-tuning.firebaseapp.com",
  projectId: "text-tuning",
  storageBucket: "text-tuning.appspot.com",
  messagingSenderId: "320652870679",
  appId: "1:320652870679:web:90535517c0a6bf42e24852",
  measurementId: "G-G8N335ZSY7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Firestoreのインスタンスを取得

// Firestoreのインスタンスをエクスポート
export { db };
