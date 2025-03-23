// Firebase configuration for ShopEase
const firebaseConfig = {
  apiKey: "AIzaSyBPGwu2-S5i5nFtcXzDtWIE4QKIkGUzyiM",
  authDomain: "shopease-ecommerce.firebaseapp.com",
  projectId: "shopease-ecommerce",
  storageBucket: "shopease-ecommerce.appspot.com",
  messagingSenderId: "579124567821",
  appId: "1:579124567821:web:a7f80e9c3d9a8fc6b1c8d2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth and firestore for use in other files
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.shopEase = window.shopEase || {};
window.shopEase.firebase = {
  auth,
  db
}; 