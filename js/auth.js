// Authentication functionality for ShopEase using Firebase
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Initialize ShopEase object if it doesn't exist
if (!window.shopEase) {
    window.shopEase = {};
}

// Initialize authentication
function initializeAuth() {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return;
    }
    
    // Listen for auth state changes
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            getUserData(user.uid).then(userData => {
                if (!userData) {
                    // Create user document if it doesn't exist
                    createUserDocument(user);
                }
                updateAuthUI();
            });
        } else {
            // User is signed out
            updateAuthUI();
        }
    });
    
    setupAuthEventListeners();
}

// Setup event listeners for auth-related buttons and forms
function setupAuthEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Switch between login and register forms
    const switchToRegister = document.getElementById('switch-to-register');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAuthForms('register');
        });
    }
    
    const switchToLogin = document.getElementById('switch-to-login');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAuthForms('login');
        });
    }
    
    // Account form submission
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateUserAccount();
        });
    }

    // Add address form submission
    const addAddressForm = document.getElementById('add-address-form');
    if (addAddressForm) {
        addAddressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const addressData = {
                name: document.getElementById('address-name').value,
                phone: document.getElementById('address-phone').value,
                street: document.getElementById('address-street').value,
                city: document.getElementById('address-city').value,
                state: document.getElementById('address-state').value,
                zip: document.getElementById('address-zip').value,
                country: document.getElementById('address-country').value,
                isDefault: document.getElementById('address-default').checked
            };
            addAddress(addressData);
        });
    }
}

// Toggle between login and register forms
function toggleAuthForms(formToShow) {
    const loginForm = document.getElementById('login-container');
    const registerForm = document.getElementById('register-container');
    
    if (loginForm && registerForm) {
        if (formToShow === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }
}

// Handle user login with Firebase
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    const loginButton = document.querySelector('#login-form button[type="submit"]');
    if (loginButton) {
        loginButton.disabled = true;
        loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
    }
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Close modal if it exists
            const authModal = document.getElementById('auth-modal');
            if (authModal && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(authModal);
                if (modal) modal.hide();
            }
            
            showNotification('Login successful! Welcome back.');
            
            // Redirect if on login page
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                window.location.href = 'home.html';
            }
        })
        .catch((error) => {
            console.error("Login error:", error);
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later';
            }
            
            showAuthError(errorMessage);
        })
        .finally(() => {
            // Reset button state
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = 'Login';
            }
        });
}

// Handle user registration with Firebase
function handleRegistration() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Basic validation
    if (!name || !email || !password) {
        showAuthError('All fields are required');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters long');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAuthError('Invalid email format');
        return;
    }
    
    // Show loading state
    const registerButton = document.querySelector('#register-form button[type="submit"]');
    if (registerButton) {
        registerButton.disabled = true;
        registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';
    }
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Update user profile with name
            return user.updateProfile({
                displayName: name
            }).then(() => {
                // Create user document in Firestore
                return createUserDocument(user, { name });
            });
        })
        .then(() => {
            // Close modal if it exists
            const authModal = document.getElementById('auth-modal');
            if (authModal && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(authModal);
                if (modal) modal.hide();
            }
            
            showNotification('Registration successful! Welcome to ShopEase.');
            
            // Redirect if on register page
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                window.location.href = 'home.html';
            }
        })
        .catch((error) => {
            console.error("Registration error:", error);
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already registered';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }
            
            showAuthError(errorMessage);
        })
        .finally(() => {
            // Reset button state
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = 'Create Account';
            }
        });
}

// Create user document in Firestore
function createUserDocument(user, additionalData = {}) {
    const db = firebase.firestore();
    
    return db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        name: additionalData.name || user.displayName || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        wishlist: [],
        addresses: [],
        orders: []
    }, { merge: true });
}

// Get user data from Firestore
function getUserData(uid) {
    const db = firebase.firestore();
    return db.collection('users').doc(uid).get()
        .then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error("Error getting user data:", error);
            return null;
        });
}

// Handle user logout
function handleLogout() {
    firebase.auth().signOut()
        .then(() => {
            showNotification('You have been logged out');
            
            // Redirect if on account page
            if (window.location.pathname.includes('account.html')) {
                window.location.href = 'home.html';
            } else {
                // Refresh the current page to update any user-specific content
                location.reload();
            }
        })
        .catch((error) => {
            console.error("Logout error:", error);
            showNotification('Error logging out. Please try again.');
        });
}

// Update account information
function updateUserAccount() {
    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get form values
    const name = document.getElementById('account-name').value;
    const email = document.getElementById('account-email').value;
    const currentPassword = document.getElementById('account-current-password').value;
    const newPassword = document.getElementById('account-new-password').value;
    const confirmPassword = document.getElementById('account-confirm-password').value;
    
    // Update display name if changed
    let updates = [];
    
    if (name && name !== user.displayName) {
        updates.push(user.updateProfile({ displayName: name })
            .then(() => {
                // Update name in Firestore
                return firebase.firestore().collection('users').doc(user.uid).update({
                    name: name
                });
            }));
    }
    
    // Update email if changed
    if (email && email !== user.email) {
        if (currentPassword) {
            // Re-authenticate user before updating email
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email, 
                currentPassword
            );
            
            updates.push(user.reauthenticateWithCredential(credential)
                .then(() => {
                    return user.updateEmail(email);
                })
                .then(() => {
                    // Update email in Firestore
                    return firebase.firestore().collection('users').doc(user.uid).update({
                        email: email
                    });
                }));
        } else {
            showAuthError('Current password is required to change email');
            return;
        }
    }
    
    // Update password if provided
    if (newPassword) {
        if (newPassword.length < 6) {
            showAuthError('New password must be at least 6 characters long');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showAuthError('New passwords do not match');
            return;
        }
        
        if (currentPassword) {
            // Re-authenticate user before updating password
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email, 
                currentPassword
            );
            
            updates.push(user.reauthenticateWithCredential(credential)
                .then(() => {
                    return user.updatePassword(newPassword);
                }));
        } else {
            showAuthError('Current password is required to change password');
            return;
        }
    }
    
    if (updates.length === 0) {
        showNotification('No changes detected');
        return;
    }
    
    // Show loading state
    const saveButton = document.querySelector('#account-form button[type="submit"]');
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    }
    
    Promise.all(updates)
        .then(() => {
            showNotification('Account information updated successfully');
            
            // Clear password fields
            const passwordFields = document.querySelectorAll('#account-form input[type="password"]');
            passwordFields.forEach(field => {
                field.value = '';
            });
        })
        .catch((error) => {
            console.error("Update account error:", error);
            let errorMessage = 'Failed to update account. Please try again.';
            
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Current password is incorrect';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Please log out and log back in to change your password';
            }
            
            showAuthError(errorMessage);
        })
        .finally(() => {
            // Reset button state
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.textContent = 'Save Changes';
            }
        });
}

// Add an address to user account
function addAddress(address) {
    const user = firebase.auth().currentUser;
    if (!user) return false;
    
    address.id = Date.now().toString();
    const db = firebase.firestore();
    
    return db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                let addresses = userData.addresses || [];
                
                // If this is a default address, remove default from others
                if (address.isDefault) {
                    addresses = addresses.map(a => ({...a, isDefault: false}));
                }
                
                addresses.push(address);
                
                return db.collection('users').doc(user.uid).update({
                    addresses: addresses
                });
            }
        })
        .then(() => {
            showNotification('Address added successfully');
            
            // Close modal if it exists
            const addressModal = document.getElementById('address-modal');
            if (addressModal && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(addressModal);
                if (modal) modal.hide();
            }
            
            // Clear form
            const addAddressForm = document.getElementById('add-address-form');
            if (addAddressForm) {
                addAddressForm.reset();
            }
            
            // Refresh addresses list
            populateAccountPage();
            return true;
        })
        .catch(error => {
            console.error("Error adding address:", error);
            showNotification('Failed to add address. Please try again.');
            return false;
        });
}

// Get addresses for current user
function getUserAddresses() {
    const user = firebase.auth().currentUser;
    if (!user) return Promise.resolve([]);
    
    const db = firebase.firestore();
    
    return db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                return userData.addresses || [];
            } else {
                return [];
            }
        })
        .catch(error => {
            console.error("Error getting addresses:", error);
            return [];
        });
}

// Update UI based on authentication status
function updateAuthUI() {
    const user = firebase.auth().currentUser;
    const isLoggedIn = !!user;
    
    // Update header
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        if (isLoggedIn) {
            authContainer.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-sm dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user"></i> ${user.displayName || 'Account'}
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
            
            // Reattach logout event
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    handleLogout();
                });
            }
        } else {
            authContainer.innerHTML = `
                <a href="#" class="login-btn" data-bs-toggle="modal" data-bs-target="#auth-modal">
                    <i class="fas fa-user"></i> Login
                </a>
            `;
        }
    }
    
    // Update account page if it exists
    populateAccountPage();
}

// Populate account page with user data
function populateAccountPage() {
    const accountContainer = document.getElementById('account-container');
    if (!accountContainer) return;
    
    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set form values
    const nameInput = document.getElementById('account-name');
    const emailInput = document.getElementById('account-email');
    
    if (nameInput) nameInput.value = user.displayName || '';
    if (emailInput) emailInput.value = user.email || '';
    
    // Get user data from Firestore
    const db = firebase.firestore();
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                
                // Populate addresses
                const addressesContainer = document.getElementById('addresses-container');
                if (addressesContainer && userData.addresses && userData.addresses.length > 0) {
                    let addressesHTML = '';
                    userData.addresses.forEach(address => {
                        addressesHTML += `
                            <div class="address-card">
                                <h4>${address.name}</h4>
                                <p>${address.street}<br>
                                ${address.city}, ${address.state} ${address.zip}<br>
                                ${address.country}</p>
                                <p>Phone: ${address.phone}</p>
                                ${address.isDefault ? '<span class="badge bg-primary">Default</span>' : ''}
                                <div class="address-actions">
                                    <button class="btn btn-sm btn-primary edit-address" data-address-id="${address.id}">Edit</button>
                                    <button class="btn btn-sm btn-danger delete-address" data-address-id="${address.id}">Delete</button>
                                </div>
                            </div>
                        `;
                    });
                    addressesContainer.innerHTML = addressesHTML;
                    
                    // Add event listeners for address actions
                    setupAddressEventListeners();
                } else if (addressesContainer) {
                    addressesContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-map-marker-alt fa-3x"></i>
                            <p>You haven't added any addresses yet.</p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#address-modal">Add Address</button>
                        </div>
                    `;
                }
                
                // Populate orders
                const ordersContainer = document.getElementById('orders-container');
                if (ordersContainer && userData.orders && userData.orders.length > 0) {
                    let ordersHTML = '';
                    userData.orders.forEach(order => {
                        ordersHTML += `
                            <div class="order-card">
                                <div class="order-header">
                                    <div>
                                        <h4>Order #${order.id}</h4>
                                        <p>Placed on: ${new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div class="order-status">
                                        <span class="badge bg-success">${order.status}</span>
                                    </div>
                                </div>
                                <div class="order-items">
                                    <p><strong>Items:</strong> ${order.items.length}</p>
                                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                                </div>
                                <div class="order-actions">
                                    <button class="btn btn-sm btn-primary view-order" data-order-id="${order.id}">View Details</button>
                                </div>
                            </div>
                        `;
                    });
                    ordersContainer.innerHTML = ordersHTML;
                    
                    // Add event listeners for order actions
                    setupOrderEventListeners();
                } else if (ordersContainer) {
                    ordersContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-shopping-bag fa-3x"></i>
                            <p>You haven't placed any orders yet.</p>
                            <a href="products.html" class="btn btn-primary">Start Shopping</a>
                        </div>
                    `;
                }
                
                // Populate wishlist tab if it exists
                if (window.shopEase && window.shopEase.wishlist) {
                    window.shopEase.wishlist.populateWishlistPage();
                }
            }
        })
        .catch(error => {
            console.error("Error getting user data:", error);
            showNotification('Failed to load account data. Please try again.');
        });
}

// Setup event listeners for address cards
function setupAddressEventListeners() {
    const editButtons = document.querySelectorAll('.edit-address');
    const deleteButtons = document.querySelectorAll('.delete-address');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-address-id');
            editAddress(addressId);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-address-id');
            deleteAddress(addressId);
        });
    });
}

// Delete an address
function deleteAddress(addressId) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const db = firebase.firestore();
    
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const addresses = userData.addresses || [];
                const updatedAddresses = addresses.filter(a => a.id !== addressId);
                
                return db.collection('users').doc(user.uid).update({
                    addresses: updatedAddresses
                });
            }
        })
        .then(() => {
            showNotification('Address deleted successfully');
            populateAccountPage();
        })
        .catch(error => {
            console.error("Error deleting address:", error);
            showNotification('Failed to delete address. Please try again.');
        });
}

// Edit an address
function editAddress(addressId) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const db = firebase.firestore();
    
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const addresses = userData.addresses || [];
                const address = addresses.find(a => a.id === addressId);
                
                if (address) {
                    // Populate address modal with current data
                    document.getElementById('address-id').value = address.id;
                    document.getElementById('address-name').value = address.name;
                    document.getElementById('address-phone').value = address.phone;
                    document.getElementById('address-street').value = address.street;
                    document.getElementById('address-city').value = address.city;
                    document.getElementById('address-state').value = address.state;
                    document.getElementById('address-zip').value = address.zip;
                    document.getElementById('address-country').value = address.country;
                    document.getElementById('address-default').checked = address.isDefault;
                    
                    // Change modal title to "Edit Address"
                    const modalTitle = document.querySelector('#address-modal .modal-title');
                    if (modalTitle) {
                        modalTitle.textContent = 'Edit Address';
                    }
                    
                    // Change submit button text to "Update Address"
                    const submitButton = document.querySelector('#add-address-form button[type="submit"]');
                    if (submitButton) {
                        submitButton.textContent = 'Update Address';
                    }
                    
                    // Show the modal
                    const addressModal = document.getElementById('address-modal');
                    if (addressModal && typeof bootstrap !== 'undefined') {
                        const modal = new bootstrap.Modal(addressModal);
                        modal.show();
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error editing address:", error);
            showNotification('Failed to edit address. Please try again.');
        });
}

// Setup event listeners for order cards
function setupOrderEventListeners() {
    const viewButtons = document.querySelectorAll('.view-order');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            viewOrderDetails(orderId);
        });
    });
}

// View order details
function viewOrderDetails(orderId) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const db = firebase.firestore();
    
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const orders = userData.orders || [];
                const order = orders.find(o => o.id === orderId);
                
                if (order) {
                    // Populate order details modal
                    const orderDetailsContainer = document.getElementById('order-details-container');
                    if (orderDetailsContainer) {
                        let itemsHTML = '';
                        order.items.forEach(item => {
                            itemsHTML += `
                                <div class="order-item">
                                    <div class="order-item-image">
                                        <img src="${item.image}" alt="${item.name}">
                                    </div>
                                    <div class="order-item-details">
                                        <h5>${item.name}</h5>
                                        <p class="text-muted">
                                            ${item.color ? `Color: ${item.color}` : ''}
                                            ${item.size ? `Size: ${item.size}` : ''}
                                            ${item.quantity ? `Quantity: ${item.quantity}` : ''}
                                        </p>
                                        <p class="order-item-price">$${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            `;
                        });
                        
                        orderDetailsContainer.innerHTML = `
                            <div class="order-summary">
                                <h4>Order #${order.id}</h4>
                                <p>Placed on: ${new Date(order.date).toLocaleDateString()}</p>
                                <p>Status: <span class="badge bg-success">${order.status}</span></p>
                            </div>
                            <div class="order-address">
                                <h5>Shipping Address</h5>
                                <p>${order.shippingAddress.name}<br>
                                ${order.shippingAddress.street}<br>
                                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
                                ${order.shippingAddress.country}</p>
                                <p>Phone: ${order.shippingAddress.phone}</p>
                            </div>
                            <div class="order-items-list">
                                <h5>Items</h5>
                                ${itemsHTML}
                            </div>
                            <div class="order-total">
                                <div class="d-flex justify-content-between">
                                    <span>Subtotal:</span>
                                    <span>$${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>Shipping:</span>
                                    <span>$${order.shipping.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>Tax:</span>
                                    <span>$${order.tax.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between fw-bold">
                                    <span>Total:</span>
                                    <span>$${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        `;
                        
                        // Show the modal
                        const orderModal = document.getElementById('order-modal');
                        if (orderModal && typeof bootstrap !== 'undefined') {
                            const modal = new bootstrap.Modal(orderModal);
                            modal.show();
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error viewing order details:", error);
            showNotification('Failed to load order details. Please try again.');
        });
}

// Show error message for auth forms
function showAuthError(message) {
    const errorContainer = document.querySelector('.auth-error');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 3000);
    }
}

// Show notification to user
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500);
    }, 3000);
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
    handleLogin,
    handleRegistration,
    handleLogout,
    updateUserAccount,
    addAddress,
    getUserAddresses,
    showNotification
}; 