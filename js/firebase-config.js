// Firebase configuration for ShopEase
console.log("Loading Firebase configuration");

// Firebase configuration object - use your own Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyDdvHJrS9ZO7YMcSlgUUISMRtbJUE4iFJs",
  authDomain: "shopease-ecommerce-64ce5.firebaseapp.com",
  projectId: "shopease-ecommerce-64ce5",
  storageBucket: "shopease-ecommerce-64ce5.appspot.com",
  messagingSenderId: "125634368784",
  appId: "1:125634368784:web:e3cae2b5be5b13e7d9f143",
  measurementId: "G-JEYXSW5D4X"
};

// Initialize Firebase
try {
  console.log("Initializing Firebase");
  // Prevent duplicate initialization
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Initialize Firebase services
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Set persistence to LOCAL to maintain login state on page refresh
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log("Firebase persistence set to LOCAL");
    })
    .catch(error => {
      console.error("Error setting persistence:", error);
    });
  
  // Set up Google provider
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  
  // Add scopes for additional permissions if needed
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
  
  // Always prompt for account selection
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  console.log("Firebase initialized successfully");
  
  // Make Firebase objects globally available
  window.db = db;
  window.auth = auth;
  window.googleProvider = googleProvider;
  
  // Export as ShopEase namespace
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
  try {
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
  } catch (error) {
    console.error("Error testing database connection:", error);
  }
}

// Export the Firebase configuration
window.firebaseConfig = firebaseConfig; 