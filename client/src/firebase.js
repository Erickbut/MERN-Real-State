// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-95f86.firebaseapp.com",
    projectId: "mern-estate-95f86",
    storageBucket: "mern-estate-95f86.appspot.com",
    messagingSenderId: "644100697155",
    appId: "1:644100697155:web:f706567162ceb88eb538f6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);