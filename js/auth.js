// Authentication functionality for ShopEase
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Initialize ShopEase object if it doesn't exist
if (!window.shopEase) {
    window.shopEase = {};
}

// Initialize users array in local storage if it doesn't exist
function initializeAuth() {
    if (!localStorage.getItem('shopEase_users')) {
        localStorage.setItem('shopEase_users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('shopEase_currentUser')) {
        localStorage.setItem('shopEase_currentUser', '');
    }
    
    updateAuthUI();
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

// Handle user login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set current user
        localStorage.setItem('shopEase_currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));
        
        // Close modal if it exists
        const authModal = document.getElementById('auth-modal');
        if (authModal && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(authModal);
            if (modal) modal.hide();
        }
        
        // Update UI
        updateAuthUI();
        showNotification('Login successful! Welcome back, ' + user.name);
        
        // Redirect if on login page
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'home.html';
        } else {
            // Refresh the current page to update any user-specific content
            location.reload();
        }
    } else {
        showAuthError('Invalid email or password');
    }
}

// Handle user registration
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
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    if (users.some(u => u.email === email)) {
        showAuthError('Email already registered');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        wishlist: [],
        addresses: [],
        orders: []
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('shopEase_users', JSON.stringify(users));
    
    // Log the user in
    localStorage.setItem('shopEase_currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    }));
    
    // Close modal if it exists
    const authModal = document.getElementById('auth-modal');
    if (authModal && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getInstance(authModal);
        if (modal) modal.hide();
    }
    
    // Update UI
    updateAuthUI();
    showNotification('Registration successful! Welcome, ' + newUser.name);
    
    // Redirect if on register page
    if (window.location.pathname.includes('register.html')) {
        window.location.href = 'home.html';
    } else {
        // Refresh the current page to update any user-specific content
        location.reload();
    }
}

// Handle user logout
function handleLogout() {
    localStorage.setItem('shopEase_currentUser', '');
    updateAuthUI();
    showNotification('You have been logged out');
    
    // Redirect if on account page
    if (window.location.pathname.includes('account.html')) {
        window.location.href = 'home.html';
    } else {
        // Refresh the current page to update any user-specific content
        location.reload();
    }
}

// Update account information
function updateUserAccount() {
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    if (!currentUserStr) {
        window.location.href = 'login.html';
        return;
    }
    
    const currentUser = JSON.parse(currentUserStr);
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        showNotification('Error updating account. Please login again.');
        handleLogout();
        return;
    }
    
    // Get form values
    const name = document.getElementById('account-name').value;
    const email = document.getElementById('account-email').value;
    const currentPassword = document.getElementById('account-current-password').value;
    const newPassword = document.getElementById('account-new-password').value;
    const confirmPassword = document.getElementById('account-confirm-password').value;
    
    // Check current password
    if (currentPassword && currentPassword !== users[userIndex].password) {
        showAuthError('Current password is incorrect');
        return;
    }
    
    // Update name and email
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    
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
        
        users[userIndex].password = newPassword;
    }
    
    // Save updated user data
    localStorage.setItem('shopEase_users', JSON.stringify(users));
    
    // Update current user
    localStorage.setItem('shopEase_currentUser', JSON.stringify({
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email
    }));
    
    showNotification('Account information updated successfully');
    updateAuthUI();
}

// Add an address to user account
function addAddress(address) {
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    if (!currentUserStr) return false;
    
    const currentUser = JSON.parse(currentUserStr);
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return false;
    
    if (!users[userIndex].addresses) {
        users[userIndex].addresses = [];
    }
    
    address.id = Date.now().toString();
    users[userIndex].addresses.push(address);
    
    localStorage.setItem('shopEase_users', JSON.stringify(users));
    return true;
}

// Get addresses for current user
function getUserAddresses() {
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    if (!currentUserStr) return [];
    
    const currentUser = JSON.parse(currentUserStr);
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user || !user.addresses) return [];
    
    return user.addresses;
}

// Update UI based on authentication status
function updateAuthUI() {
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    const isLoggedIn = currentUserStr && currentUserStr !== '';
    
    // Update header
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        if (isLoggedIn) {
            const currentUser = JSON.parse(currentUserStr);
            authContainer.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-sm dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user"></i> ${currentUser.name}
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
    
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    if (!currentUserStr || currentUserStr === '') {
        window.location.href = 'login.html';
        return;
    }
    
    const currentUser = JSON.parse(currentUserStr);
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user) {
        handleLogout();
        return;
    }
    
    // Set form values
    const nameInput = document.getElementById('account-name');
    const emailInput = document.getElementById('account-email');
    
    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
    
    // Populate addresses
    const addressesContainer = document.getElementById('addresses-container');
    if (addressesContainer && user.addresses && user.addresses.length > 0) {
        let addressesHTML = '';
        user.addresses.forEach(address => {
            addressesHTML += `
                <div class="address-card">
                    <h4>${address.name}</h4>
                    <p>${address.street}<br>
                    ${address.city}, ${address.state} ${address.zip}<br>
                    ${address.country}</p>
                    <p>Phone: ${address.phone}</p>
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
    }
    
    // Populate orders
    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer && user.orders && user.orders.length > 0) {
        let ordersHTML = '';
        user.orders.forEach(order => {
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
    }
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
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    return currentUserStr && currentUserStr !== '';
}

// Get current user
function getCurrentUser() {
    if (!isUserLoggedIn()) return null;
    
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    return JSON.parse(currentUserStr);
}

// Get full user data
function getFullUserData() {
    if (!isUserLoggedIn()) return null;
    
    const currentUserStr = localStorage.getItem('shopEase_currentUser');
    const currentUser = JSON.parse(currentUserStr);
    
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    return users.find(u => u.id === currentUser.id);
}

// Export functions for use in other files
window.shopEase.auth = {
    isUserLoggedIn,
    getCurrentUser,
    getFullUserData,
    handleLogin,
    handleRegistration,
    handleLogout,
    updateUserAccount,
    addAddress,
    getUserAddresses,
    showNotification
}; 