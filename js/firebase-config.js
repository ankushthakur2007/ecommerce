// Firebase configuration for ShopEase
console.log("Loading Firebase configuration");

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBH6kM0FtYhXXEdRZfZ7eH4yJTrW8iUJ8Y",
  authDomain: "shopease-ecommerce.firebaseapp.com",
  projectId: "shopease-ecommerce",
  storageBucket: "shopease-ecommerce.appspot.com",
  messagingSenderId: "347883345672",
  appId: "1:347883345672:web:5e1d9d3a43b77f8c7fc8fe",
  measurementId: "G-9Q8CQCMQNV"
};

// Initialize Firebase
try {
  console.log("Initializing Firebase");
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  
  // Initialize Firestore and Authentication
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  console.log("Firebase initialized successfully");
  
  // Export the auth and db objects
  window.db = db;
  window.firebaseAuth = auth;
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Export the Firebase configuration
window.firebaseConfig = firebaseConfig; 