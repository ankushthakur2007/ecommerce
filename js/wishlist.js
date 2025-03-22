// Wishlist functionality for ShopEase
document.addEventListener('DOMContentLoaded', function() {
    initializeWishlist();
});

// Initialize ShopEase object if it doesn't exist
if (!window.shopEase) {
    window.shopEase = {};
}

// Initialize wishlist functionality
function initializeWishlist() {
    // Setup wishlist action buttons
    setupWishlistButtons();
    
    // Populate wishlist page if we're on it
    const wishlistContainer = document.getElementById('wishlist-container');
    if (wishlistContainer) {
        populateWishlistPage();
    }
}

// Setup event listeners for wishlist buttons
function setupWishlistButtons() {
    // Add to wishlist buttons
    const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
    
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            if (!window.shopEase.auth || !window.shopEase.auth.isUserLoggedIn()) {
                // Show authentication modal if it exists
                const authModal = document.getElementById('auth-modal');
                if (authModal && typeof bootstrap !== 'undefined') {
                    const modal = new bootstrap.Modal(authModal);
                    modal.show();
                } else {
                    // Redirect to login page
                    window.location.href = 'login.html';
                }
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                addToWishlist(parseInt(productId));
            }
        });
    });
}

// Add a product to the wishlist
function addToWishlist(productId) {
    // Get user data
    const userData = window.shopEase.auth.getFullUserData();
    if (!userData) return;
    
    // Get users array from local storage
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    const userIndex = users.findIndex(u => u.id === userData.id);
    
    if (userIndex === -1) return;
    
    // Initialize wishlist array if it doesn't exist
    if (!users[userIndex].wishlist) {
        users[userIndex].wishlist = [];
    }
    
    // Check if product is already in wishlist
    if (users[userIndex].wishlist.includes(productId)) {
        window.shopEase.auth.showNotification('This product is already in your wishlist');
        return;
    }
    
    // Add product to wishlist
    users[userIndex].wishlist.push(productId);
    
    // Save updated user data
    localStorage.setItem('shopEase_users', JSON.stringify(users));
    
    // Show success notification
    window.shopEase.auth.showNotification('Product added to your wishlist');
    
    // Update wishlist counter if it exists
    updateWishlistCounter();
}

// Remove a product from the wishlist
function removeFromWishlist(productId) {
    // Get user data
    const userData = window.shopEase.auth.getFullUserData();
    if (!userData) return;
    
    // Get users array from local storage
    const users = JSON.parse(localStorage.getItem('shopEase_users'));
    const userIndex = users.findIndex(u => u.id === userData.id);
    
    if (userIndex === -1) return;
    
    // Check if wishlist exists
    if (!users[userIndex].wishlist) return;
    
    // Remove product from wishlist
    users[userIndex].wishlist = users[userIndex].wishlist.filter(id => id !== productId);
    
    // Save updated user data
    localStorage.setItem('shopEase_users', JSON.stringify(users));
    
    // Show success notification
    window.shopEase.auth.showNotification('Product removed from your wishlist');
    
    // Update wishlist counter
    updateWishlistCounter();
    
    // Refresh wishlist page if we're on it
    const wishlistContainer = document.getElementById('wishlist-container');
    if (wishlistContainer) {
        populateWishlistPage();
    }
}

// Check if a product is in the wishlist
function isInWishlist(productId) {
    // Get user data
    const userData = window.shopEase.auth.getFullUserData();
    if (!userData || !userData.wishlist) return false;
    
    return userData.wishlist.includes(productId);
}

// Update wishlist counter in the UI
function updateWishlistCounter() {
    const wishlistCounter = document.querySelector('.wishlist-count');
    if (!wishlistCounter) return;
    
    // Get user data
    const userData = window.shopEase.auth.getFullUserData();
    if (!userData || !userData.wishlist) {
        wishlistCounter.textContent = '0';
        return;
    }
    
    wishlistCounter.textContent = userData.wishlist.length.toString();
}

// Populate wishlist page with products
function populateWishlistPage() {
    const wishlistContainer = document.getElementById('wishlist-container');
    if (!wishlistContainer) return;
    
    // Check if user is logged in
    if (!window.shopEase.auth || !window.shopEase.auth.isUserLoggedIn()) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <div class="empty-icon">
                    <i class="fas fa-heart-broken"></i>
                </div>
                <h3>Your wishlist is empty</h3>
                <p>Please log in to view your wishlist</p>
                <a href="#" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#auth-modal">Login</a>
            </div>
        `;
        return;
    }
    
    // Get user data
    const userData = window.shopEase.auth.getFullUserData();
    if (!userData || !userData.wishlist || userData.wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <div class="empty-icon">
                    <i class="fas fa-heart-broken"></i>
                </div>
                <h3>Your wishlist is empty</h3>
                <p>Add items to your wishlist to save them for later</p>
                <a href="products.html" class="btn btn-primary">Shop Now</a>
            </div>
        `;
        return;
    }
    
    // Get all products
    const products = window.shopEase.products;
    if (!products) {
        wishlistContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
        return;
    }
    
    // Filter products in wishlist
    const wishlistProducts = products.filter(product => userData.wishlist.includes(product.id));
    
    // Generate HTML for wishlist products
    let wishlistHTML = '<div class="wishlist-products">';
    
    wishlistProducts.forEach(product => {
        wishlistHTML += `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    <a href="product-details.html?id=${product.id}">
                        <img src="${product.thumbnail}" alt="${product.name}">
                    </a>
                </div>
                <div class="wishlist-item-info">
                    <h3><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                        <span class="rating-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice > product.price ? 
                          `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                           <span class="discount-tag">${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>` : ''}
                    </div>
                    <div class="product-status">
                        ${product.inStock ? '<span class="in-stock">In Stock</span>' : '<span class="out-of-stock">Out of Stock</span>'}
                    </div>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline-danger remove-from-wishlist" data-product-id="${product.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });
    
    wishlistHTML += '</div>';
    wishlistContainer.innerHTML = wishlistHTML;
    
    // Setup event listeners for action buttons
    setupWishlistPageButtons();
}

// Setup event listeners for buttons on the wishlist page
function setupWishlistPageButtons() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.wishlist-item .add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            if (window.shopEase.cart && window.shopEase.cart.addToCart) {
                window.shopEase.cart.addToCart(productId, 1);
            }
        });
    });
    
    // Remove from wishlist buttons
    const removeButtons = document.querySelectorAll('.wishlist-item .remove-from-wishlist');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            removeFromWishlist(productId);
        });
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let stars = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Export functions for use in other files
window.shopEase.wishlist = {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    updateWishlistCounter,
    populateWishlistPage
}; 