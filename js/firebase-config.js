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

// Replace this with YOUR OWN Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // ← Replace this!
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Validate config before initializing
if (firebaseConfig.apiKey === "YOUR_API_KEY" || firebaseConfig.apiKey.includes("YOUR_")) {
  console.error("⚠️ FIREBASE NOT CONFIGURED ⚠️");
  console.error("You need to replace the Firebase configuration with your own values from the Firebase console.");
  
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
    errorDiv.style.fontWeight = 'bold';
    errorDiv.innerHTML = 'Firebase not configured: You need to add your own Firebase config in js/firebase-config.js';
    document.body.prepend(errorDiv);
  });
} else {
  // Initialize Firebase
  try {
    console.log("Initializing Firebase");
    // Prevent duplicate initialization
    if (typeof firebase !== 'undefined') {
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
          
          // Show the API key error more clearly
          if (error.code === 'auth/invalid-api-key') {
            console.error("Your Firebase API key is invalid. Please make sure you've copied it correctly from the Firebase console.");
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
              errorDiv.innerHTML = 'Invalid Firebase API key: Make sure your Firebase project is properly set up';
              document.body.prepend(errorDiv);
            });
          }
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
    } else {
      console.error("Firebase SDK not loaded. Check your script includes.");
      
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
        errorDiv.innerHTML = 'Firebase SDK not loaded. Check the console for details.';
        document.body.prepend(errorDiv);
      });
    }
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
}

// Export the Firebase configuration
window.firebaseConfig = firebaseConfig; 