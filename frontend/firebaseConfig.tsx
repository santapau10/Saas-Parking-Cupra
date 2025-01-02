import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBzDNKYNxJvZJhJGxf3P2Keh2DB-gelLlI",
    authDomain: "cupra-cad.firebaseapp.com",
    projectId: "cupra-cad",
    storageBucket: "cupra-cad.firebasestorage.app",
    messagingSenderId: "965038707682",
    appId: "1:965038707682:web:5678cba49b02dbf4a3dfbb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
