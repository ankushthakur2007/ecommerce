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
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Initialize Firebase services
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Set persistence to SESSION
  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      console.log("Firebase persistence set to SESSION");
    })
    .catch(error => {
      console.error("Error setting persistence:", error);
    });
  
  // Enable Google provider specifically
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  console.log("Firebase initialized successfully");
  
  // Export objects to global scope for use in other files
  window.db = db;
  window.auth = auth;
  window.googleProvider = googleProvider;
  
  // Export as shopEase namespace
  window.shopEase = window.shopEase || {};
  window.shopEase.firebase = {
    auth,
    db,
    googleProvider
  };
  
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Test database connection
if (window.db) {
  window.db.collection('test').doc('connection')
    .set({
      timestamp: new Date().toISOString(),
      status: 'Connection test successful'
    })
    .then(() => {
      console.log("Database connection successful");
    })
    .catch(error => {
      console.error("Database connection error:", error);
    });
}

// Export the Firebase configuration
window.firebaseConfig = firebaseConfig; 