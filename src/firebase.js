import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your Firebase configuration (replace with your project's config)
const firebaseConfig = {
    apiKey: "AIzaSyDmFaXyRBYC9IEE4NSWzQ9jptbjq7GqKkI",
    authDomain: "churn-prediction-52d2c.firebaseapp.com",
    projectId: "churn-prediction-52d2c",
    databaseURL: "https://churn-prediction-52d2c-default-rtdb.firebaseio.com/",
    storageBucket: "churn-prediction-52d2c.firebasestorage.app",
    messagingSenderId: "914670096924",
    appId: "1:914670096924:web:0cc0c5f5660d3b48d785d9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };