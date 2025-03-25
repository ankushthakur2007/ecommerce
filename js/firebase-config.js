// Firebase configuration for ShopEase
console.log("Loading Firebase configuration");

/*
IMPORTANT SETUP INSTRUCTIONS:
1. Go to https://console.firebase.google.com/
2. Create a new project (or use an existing one)
3. Add a web app to your project
4. Copy YOUR OWN Firebase config values below
5. In the Firebase console, go to Authentication → Sign-in methods
6. Enable Google as a sign-in provider
7. Add your domain to Authorized domains
8. Go to Firestore Database and create a database in test mode

WARNING: Using API keys from tutorials won't work! You must create your own Firebase project.
*/

// Firebase configuration object with the user's actual Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyCV-p1sCtV0n-jmNejxIUQKmb0Sp74UA_0",
  authDomain: "shopease-a2cbd.firebaseapp.com",
  projectId: "shopease-a2cbd",
  storageBucket: "shopease-a2cbd.firebasestorage.app",
  messagingSenderId: "874930413627",
  appId: "1:874930413627:web:be6089436d7bcde19cbc1e",
  measurementId: "G-GFWLLTJRPZ"
};

// Initialize Firebase
try {
  console.log("Initializing Firebase");
  
  // Initialize Firebase if not already initialized
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  // Initialize Firebase services
  const db = firebase.firestore();
  const auth = firebase.auth();
  
  // Set persistence to LOCAL to maintain login state
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log("Firebase persistence set to LOCAL");
    })
    .catch(error => {
      console.error("Error setting persistence:", error);
    });
  
  // Set up Google provider
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  
  // Add scopes for additional permissions
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
  
  // Test database connection
  db.collection('test').doc('connection')
    .set({
      timestamp: new Date().toISOString(),
      status: 'Connection test successful'
    })
    .then(() => {
      console.log("Database connection successful");
    })
    .catch(error => {
      console.error("Database connection error:", error);
      
      // Display error if Firestore not enabled
      if (error.code === 'permission-denied' || error.code === 'service-unavailable' || 
          error.code === 'resource-exhausted') {
        document.addEventListener('DOMContentLoaded', function() {
          const errorDiv = document.createElement('div');
          errorDiv.style.position = 'fixed';
          errorDiv.style.top = '0';
          errorDiv.style.left = '0';
          errorDiv.style.right = '0';
          errorDiv.style.padding = '20px';
          errorDiv.style.backgroundColor = '#ff9800';
          errorDiv.style.color = 'white';
          errorDiv.style.textAlign = 'center';
          errorDiv.style.zIndex = '10000';
          errorDiv.innerHTML = 'Firebase Database error: Make sure to enable Firestore in your Firebase console';
          document.body.prepend(errorDiv);
        });
      }
    });
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Display error on the page
  document.addEventListener('DOMContentLoaded', function() {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.right = '0';
    errorDiv.style.padding = '20px';
    errorDiv.style.backgroundColor = '#f44336';
    errorDiv.style.color = 'white';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.zIndex = '10000';
    errorDiv.innerHTML = 'Firebase initialization error: ' + error.message;
    document.body.prepend(errorDiv);
  });
}

// Export the Firebase configuration
window.firebaseConfig = firebaseConfig; 