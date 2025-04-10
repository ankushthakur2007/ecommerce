// Authentication functionality for ShopEase using Firebase
document.addEventListener('DOMContentLoaded', function() {
    console.log("Auth.js loaded");
    
    // Wait for Firebase to be loaded
    setTimeout(() => {
        if (typeof firebase !== 'undefined') {
            console.log("Firebase SDK loaded, initializing authentication");
            
            // Handle return from redirect
            handleRedirectResult();
            
            // Initialize auth
            initializeAuth();
            
            // Check if we should redirect to home based on login state
            checkRedirectToHome();
        } else {
            console.error("Firebase SDK not loaded after timeout");
            showError("Firebase initialization failed. Check if Firebase scripts are properly loaded.");
        }
    }, 1000);
});

// Show an error message on the page
function showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.querySelector('.firebase-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'firebase-error';
        errorElement.style.position = 'fixed';
        errorElement.style.top = '0';
        errorElement.style.left = '0';
        errorElement.style.right = '0';
        errorElement.style.padding = '15px';
        errorElement.style.backgroundColor = '#f44336';
        errorElement.style.color = 'white';
        errorElement.style.textAlign = 'center';
        errorElement.style.fontWeight = 'bold';
        errorElement.style.zIndex = '10000';
        document.body.prepend(errorElement);
    }
    
    errorElement.textContent = message;
}

// Handle the return from a redirect sign-in
function handleRedirectResult() {
    try {
        console.log("Checking for redirect result");
        
        firebase.auth().getRedirectResult()
            .then((result) => {
                if (result.user) {
                    // User successfully signed in
                    console.log("Google redirect login successful", result.user);
                    showNotification("Successfully logged in with Google!");
                    
                    // Save user data
                    saveUserToDatabase(result.user)
                        .then(() => {
                            // Redirect to home page
                            redirectToHome();
                        });
                } else {
                    console.log("No redirect result");
                }
            })
            .catch((error) => {
                console.error("Redirect result error:", error);
                
                // Handle specific errors with clearer messages
                let errorMessage;
                
                if (error.code === 'auth/invalid-api-key') {
                    errorMessage = "Invalid Firebase API key. Please make sure your Firebase project is correctly set up.";
                } else if (error.code === 'auth/unauthorized-domain') {
                    errorMessage = "This domain is not authorized in Firebase. Add it in the Firebase Console.";
                } else if (error.code === 'auth/user-disabled') {
                    errorMessage = "This account has been disabled. Please contact support.";
                } else if (error.code === 'auth/user-token-expired') {
                    errorMessage = "Your session has expired. Please sign in again.";
                } else if (error.code === 'auth/web-storage-unsupported') {
                    errorMessage = "Web storage is not supported by your browser. Please enable cookies.";
                } else if (error.code === 'auth/network-request-failed') {
                    errorMessage = "Network error. Please check your internet connection.";
                } else {
                    errorMessage = error.message || "An error occurred during sign-in.";
                }
                
                // Find or create an error element to display the message
                const authError = document.querySelector('.auth-error');
                if (authError) {
                    authError.textContent = errorMessage;
                    authError.style.display = 'block';
                } else {
                    showAuthError(errorMessage);
                }
                
                // Reset any loading buttons
                const googleBtn = document.querySelector('.btn-google');
                if (googleBtn) {
                    googleBtn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo"> Continue with Google';
                    googleBtn.disabled = false;
                }
            });
    } catch (error) {
        console.error("Error handling redirect result:", error);
    }
}

// Check if user is logged in and redirect to home page if on login page
function checkRedirectToHome() {
    // Only redirect if we're on the login page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const user = firebase.auth().currentUser;
        if (user) {
            console.log("User already logged in, redirecting to home page");
            redirectToHome();
        }
    }
}

// Redirect to home page
function redirectToHome() {
    window.location.href = 'home.html';
}

// Initialize ShopEase object if it doesn't exist
if (!window.shopEase) {
    window.shopEase = {};
}

// Initialize authentication
function initializeAuth() {
    try {
        console.log("Initializing Firebase Auth");
        
        // Listen for auth state changes
        firebase.auth().onAuthStateChanged(function(user) {
            console.log("Auth state changed:", user ? "User logged in" : "User logged out");
            
            if (user) {
                // User is signed in
                saveUserToDatabase(user)
                    .then(() => {
                        console.log("User data saved to database");
                        updateAuthUI();
                        
                        // Redirect to home page if on login page
                        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                            console.log("Redirecting to home page");
                            window.location.href = 'home.html';
                        }
                    })
                    .catch(error => {
                        console.error("Error saving user data:", error);
                    });
            } else {
                // User is signed out
                updateAuthUI();
            }
        });
        
        setupAuthEventListeners();
    } catch (error) {
        console.error("Error in initializeAuth:", error);
    }
}

// Set up event listeners for auth-related elements
function setupAuthEventListeners() {
    try {
        console.log("Setting up auth event listeners");
        
        // Google login button in main login page
        const googleLoginBtn = document.querySelector('.btn-google');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function() {
                handleGoogleLogin();
            });
        }
        
        // Login/Register switch links
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');
        
        if (switchToRegister) {
            switchToRegister.addEventListener('click', function(e) {
                e.preventDefault();
                toggleAuthForms('register');
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                toggleAuthForms('login');
            });
        }
        
        // Handle logout button
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'logout-btn') {
                e.preventDefault();
                handleLogout();
            }
        });
        
        // Close any open auth modals when clicking outside
        const authModals = document.querySelectorAll('.modal');
        authModals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        });
    } catch (error) {
        console.error("Error in setupAuthEventListeners:", error);
    }
}

// Toggle between login and register forms
function toggleAuthForms(formToShow) {
    try {
        const loginContainer = document.getElementById('login-container');
        const registerContainer = document.getElementById('register-container');
        const modalTitle = document.querySelector('.modal-header h2');
        
        if (loginContainer && registerContainer) {
            if (formToShow === 'register') {
                loginContainer.style.display = 'none';
                registerContainer.style.display = 'block';
                if (modalTitle) modalTitle.textContent = 'Create an Account';
            } else {
                loginContainer.style.display = 'block';
                registerContainer.style.display = 'none';
                if (modalTitle) modalTitle.textContent = 'Login to Your Account';
            }
        }
    } catch (error) {
        console.error("Error in toggleAuthForms:", error);
    }
}

// Handle Google login
function handleGoogleLogin() {
    try {
        console.log("Handling Google login");
        
        if (!firebase || !firebase.auth) {
            showAuthError("Firebase authentication is not available. Check your Firebase configuration.");
            return;
        }
        
        // Clear any previous errors
        const authError = document.querySelector('.auth-error');
        if (authError) {
            authError.style.display = 'none';
        }
        
        // Show loading state on button
        const googleBtn = document.querySelector('.btn-google');
        if (googleBtn) {
            const originalText = googleBtn.innerHTML;
            googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            googleBtn.disabled = true;
            
            // Reset button after 10 seconds (in case of silent failure)
            setTimeout(() => {
                googleBtn.innerHTML = originalText;
                googleBtn.disabled = false;
            }, 10000);
        }
        
        // Get the Google provider from the global scope
        const provider = window.googleProvider || new firebase.auth.GoogleAuthProvider();
        
        // Use signInWithRedirect for better mobile compatibility
        firebase.auth().signInWithRedirect(provider)
            .then(() => {
                console.log("Redirecting to Google login...");
                // This promise resolves immediately after redirect initiated
                // Actual auth handling happens in the getRedirectResult listener
            })
            .catch(error => {
                console.error("Error initiating Google sign-in:", error);
                
                // Reset button state
                if (googleBtn) {
                    googleBtn.innerHTML = originalText;
                    googleBtn.disabled = false;
                }
                
                // Show specific error message
                let errorMessage;
                
                switch(error.code) {
                    case 'auth/unauthorized-domain':
                        errorMessage = "This domain is not authorized in Firebase. Add it in the Firebase Console.";
                        break;
                    case 'auth/cancelled-popup-request':
                    case 'auth/popup-closed-by-user':
                        errorMessage = "The sign-in process was cancelled. Please try again.";
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = "The sign-in popup was blocked by your browser. Please allow popups for this site.";
                        break;
                    case 'auth/web-storage-unsupported':
                        errorMessage = "Web storage is not supported by your browser. Please enable cookies.";
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = "Network error. Please check your internet connection.";
                        break;
                    default:
                        errorMessage = error.message || "An error occurred during the Google sign-in process.";
                }
                
                // Find or create an error element to display the message
                const authError = document.querySelector('.auth-error');
                if (authError) {
                    authError.textContent = errorMessage;
                    authError.style.display = 'block';
                } else {
                    showAuthError(errorMessage);
                }
            });
    } catch (error) {
        console.error("Exception in handleGoogleLogin:", error);
        showAuthError("An unexpected error occurred. Please try again later.");
        
        // Reset button state
        const googleBtn = document.querySelector('.btn-google');
        if (googleBtn) {
            googleBtn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo"> Continue with Google';
            googleBtn.disabled = false;
        }
    }
}

// Save user to database after successful login
function saveUserToDatabase(user) {
    return new Promise((resolve, reject) => {
        try {
            console.log("Saving user to database:", user.uid);
            
            if (!window.db) {
                console.error("Firestore not available");
                // Still resolve to not block authentication flow
                resolve();
                return;
            }
            
            // Reference to the user document
            const userRef = window.db.collection('users').doc(user.uid);
            
            // Prepare user data
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                phoneNumber: user.phoneNumber || '',
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Get the current user data first
            userRef.get()
                .then(doc => {
                    if (doc.exists) {
                        // Update existing user
                        return userRef.update({
                            ...userData,
                            // Don't overwrite these fields if they exist
                            createdAt: doc.data().createdAt,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    } else {
                        // Create new user
                        return userRef.set({
                            ...userData,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            // Initialize empty wishlist and cart arrays
                            wishlist: [],
                            cart: []
                        });
                    }
                })
                .then(() => {
                    console.log("User data saved/updated successfully");
                    resolve();
                })
                .catch(error => {
                    console.error("Error saving user data:", error);
                    // Still resolve to not block authentication flow
                    resolve();
                });
                
        } catch (error) {
            console.error("Exception in saveUserToDatabase:", error);
            // Still resolve to not block authentication flow
            resolve();
        }
    });
}

// Handle logout
function handleLogout() {
    try {
        console.log("Handling logout");
        firebase.auth().signOut()
            .then(() => {
                console.log("User logged out successfully");
                showNotification("You have been logged out successfully.");
                
                // Redirect to login page if on protected page
                const protectedPages = ['account.html', 'orders.html', 'wishlist.html'];
                const currentPage = window.location.pathname.split('/').pop();
                
                if (protectedPages.includes(currentPage)) {
                    window.location.href = 'index.html';
                } else {
                    updateAuthUI();
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
                showAuthError(`Logout failed: ${error.message}`);
            });
    } catch (error) {
        console.error("Error in handleLogout:", error);
    }
}

// Update UI based on authentication status
function updateAuthUI() {
    try {
        const user = firebase.auth().currentUser;
        const isLoggedIn = !!user;
        console.log("Updating UI for auth state:", isLoggedIn ? "logged in" : "logged out");
        
        // Update header
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            if (isLoggedIn) {
                const displayName = user.displayName || 'Account';
                const photoURL = user.photoURL;
                
                authContainer.innerHTML = `
                    <div class="dropdown">
                        <button class="btn btn-sm dropdown-toggle auth-link" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            ${photoURL ? `<img src="${photoURL}" alt="${displayName}" class="user-avatar">` : '<i class="fas fa-user"></i>'} 
                            ${displayName}
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="account.html">My Account</a></li>
                            <li><a class="dropdown-item" href="orders.html">My Orders</a></li>
                            <li><a class="dropdown-item" href="wishlist.html">My Wishlist</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#" id="logout-btn">Logout</a></li>
                        </ul>
                    </div>
                `;
            } else {
                // Check if we're on a page that has an auth-modal
                const hasAuthModal = document.getElementById('auth-modal');
                
                if (hasAuthModal) {
                    // This page has an auth modal, use that
                    authContainer.innerHTML = `
                        <a href="#" class="login-btn" data-bs-toggle="modal" data-bs-target="#auth-modal">
                            <i class="fas fa-user"></i> Login
                        </a>
                    `;
                } else {
                    // No auth modal, redirect to index.html
                    authContainer.innerHTML = `
                        <a href="index.html" class="login-btn">
                            <i class="fas fa-user"></i> Login
                        </a>
                    `;
                }
            }
        }
        
        // Update account page if it exists
        populateAccountPage();
        
        // Update wishlist UI if we're on the wishlist page
        if (typeof updateWishlistUI === 'function') {
            updateWishlistUI();
        }
        
        // Update cart UI if we're on the cart page
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
    } catch (error) {
        console.error("Error in updateAuthUI:", error);
    }
}

// Populate account page with user data
function populateAccountPage() {
    try {
        const accountPage = document.querySelector('.account-page');
        if (!accountPage) return;
        
        const user = firebase.auth().currentUser;
        if (!user) {
            window.location.href = 'index.html';
            return;
        }
        
        // Populate user profile data
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            const nameInput = profileForm.querySelector('#profile-name');
            const emailInput = profileForm.querySelector('#profile-email');
            
            if (nameInput) nameInput.value = user.displayName || '';
            if (emailInput) emailInput.value = user.email || '';
        }
        
        // Get user orders from database
        loadUserOrders();
        
        // Load user addresses if they exist
        loadUserAddresses();
    } catch (error) {
        console.error("Error in populateAccountPage:", error);
    }
}

// Load user orders from database
function loadUserOrders() {
    try {
        const ordersTab = document.getElementById('orders-tab-content');
        if (!ordersTab) return;
        
        const user = firebase.auth().currentUser;
        if (!user) return;
        
        const ordersTable = ordersTab.querySelector('.orders-table tbody');
        if (!ordersTable) return;
        
        const db = window.db || firebase.firestore();
        
        db.collection('orders')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    ordersTable.innerHTML = `
                        <tr>
                            <td colspan="5" class="text-center">You haven't placed any orders yet.</td>
                        </tr>
                    `;
                    return;
                }
                
                let ordersHTML = '';
                snapshot.forEach(doc => {
                    const order = doc.data();
                    const date = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A';
                    
                    ordersHTML += `
                        <tr>
                            <td>#${doc.id.slice(-6)}</td>
                            <td>${date}</td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td><span class="status-${order.status.toLowerCase()}">${order.status}</span></td>
                            <td><button class="btn-view-order" data-order-id="${doc.id}">View</button></td>
                        </tr>
                    `;
                });
                
                ordersTable.innerHTML = ordersHTML;
                
                // Add event listeners to order buttons
                const orderButtons = ordersTable.querySelectorAll('.btn-view-order');
                orderButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const orderId = this.dataset.orderId;
                        viewOrderDetails(orderId);
                    });
                });
            })
            .catch(error => {
                console.error("Error loading orders:", error);
                ordersTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">Error loading orders. Please try again.</td>
                    </tr>
                `;
            });
    } catch (error) {
        console.error("Error in loadUserOrders:", error);
    }
}

// Load user addresses from database
function loadUserAddresses() {
    try {
        const addressesTab = document.getElementById('addresses-tab-content');
        if (!addressesTab) return;
        
        const user = firebase.auth().currentUser;
        if (!user) return;
        
        const addressesList = addressesTab.querySelector('.addresses-list');
        if (!addressesList) return;
        
        const db = window.db || firebase.firestore();
        
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (!doc.exists) return;
                
                const userData = doc.data();
                const addresses = userData.addresses || [];
                
                if (addresses.length === 0) {
                    addressesList.innerHTML = `
                        <div class="empty-addresses">
                            <p>You haven't added any addresses yet.</p>
                        </div>
                    `;
                    return;
                }
                
                let addressesHTML = '';
                addresses.forEach((address, index) => {
                    addressesHTML += `
                        <div class="address-card ${address.isDefault ? 'default' : ''}">
                            ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
                            <h4>${address.fullName}</h4>
                            <p>${address.street}</p>
                            <p>${address.city}, ${address.state} ${address.zip}</p>
                            <p>${address.country}</p>
                            <p>Phone: ${address.phone}</p>
                            <div class="address-actions">
                                <button class="btn-edit-address" data-address-id="${index}">Edit</button>
                                <button class="btn-delete-address" data-address-id="${index}">Delete</button>
                                ${!address.isDefault ? `<button class="btn-set-default" data-address-id="${index}">Set as Default</button>` : ''}
                            </div>
                        </div>
                    `;
                });
                
                addressesList.innerHTML = addressesHTML;
                
                // Add event listeners to address buttons
                setupAddressEventListeners();
            })
            .catch(error => {
                console.error("Error loading addresses:", error);
                addressesList.innerHTML = `
                    <div class="empty-addresses">
                        <p>Error loading addresses. Please try again.</p>
                    </div>
                `;
            });
    } catch (error) {
        console.error("Error in loadUserAddresses:", error);
    }
}

// Show authentication error message
function showAuthError(message) {
    try {
        const errorElements = document.querySelectorAll('.auth-error');
        errorElements.forEach(element => {
            element.textContent = message;
            element.style.display = 'block';
            
            // Hide error after 5 seconds
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        });
    } catch (error) {
        console.error("Error in showAuthError:", error);
    }
}

// Show notification message
function showNotification(message) {
    try {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } catch (error) {
        console.error("Error in showNotification:", error);
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    return !!firebase.auth().currentUser;
}

// Get current user
function getCurrentUser() {
    return firebase.auth().currentUser;
}

// Export functions for use in other files
window.shopEase.auth = {
    isUserLoggedIn,
    getCurrentUser,
    handleLogout,
    updateAuthUI,
    showNotification
}; 