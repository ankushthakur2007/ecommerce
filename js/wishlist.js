// Wishlist functionality for ShopEase using Firebase
document.addEventListener('DOMContentLoaded', function() {
    initializeWishlist();
});

// Initialize ShopEase object if it doesn't exist
if (!window.shopEase) {
    window.shopEase = {};
}

// Initialize wishlist
function initializeWishlist() {
    setupWishlistButtons();
    if (document.getElementById('wishlist-container')) {
        populateWishlistPage();
    }
}

// Set up wishlist buttons
function setupWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    wishlistButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');
        
        // Check if product is in wishlist
        isInWishlist(productId).then(inWishlist => {
            if (inWishlist) {
                button.classList.add('in-wishlist');
                button.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                button.classList.remove('in-wishlist');
                button.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleWishlistItem(productId, button);
        });
    });
}

// Toggle wishlist item
function toggleWishlistItem(productId, button) {
    if (!firebase.auth().currentUser) {
        // Redirect to login page if user is not logged in
        window.location.href = 'index.html';
        return;
    }
    
    isInWishlist(productId).then(inWishlist => {
        if (inWishlist) {
            removeFromWishlist(productId).then(() => {
                button.classList.remove('in-wishlist');
                button.innerHTML = '<i class="far fa-heart"></i>';
                shopEase.auth.showNotification('Product removed from wishlist');
                updateWishlistCounter();
            });
        } else {
            addToWishlist(productId).then(() => {
                button.classList.add('in-wishlist');
                button.innerHTML = '<i class="fas fa-heart"></i>';
                shopEase.auth.showNotification('Product added to wishlist');
                updateWishlistCounter();
            });
        }
    });
}

// Add product to wishlist
function addToWishlist(productId) {
    const user = firebase.auth().currentUser;
    if (!user) return Promise.reject('User not logged in');
    
    const db = firebase.firestore();
    
    return db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                let wishlist = userData.wishlist || [];
                
                // Only add if not already in wishlist
                if (!wishlist.includes(productId)) {
                    wishlist.push(productId);
                    
                    return db.collection('users').doc(user.uid).update({
                        wishlist: wishlist
                    });
                }
                return Promise.resolve();
            }
        });
}

// Remove product from wishlist
function removeFromWishlist(productId) {
    const user = firebase.auth().currentUser;
    if (!user) return Promise.reject('User not logged in');
    
    const db = firebase.firestore();
    
    return db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                let wishlist = userData.wishlist || [];
                
                // Remove product from wishlist
                wishlist = wishlist.filter(id => id !== productId);
                
                return db.collection('users').doc(user.uid).update({
                    wishlist: wishlist
                });
            }
        });
}

// Check if product is in wishlist
function isInWishlist(productId) {
    const user = firebase.auth().currentUser;
    if (!user) return Promise.resolve(false);
    
    const db = firebase.firestore();
    
    return db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const wishlist = userData.wishlist || [];
                return wishlist.includes(productId);
            }
            return false;
        })
        .catch(() => {
            return false;
        });
}

// Get user's wishlist
function getUserWishlist() {
    const user = firebase.auth().currentUser;
    if (!user) return Promise.resolve([]);
    
    const db = firebase.firestore();
    
    return db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                return userData.wishlist || [];
            }
            return [];
        })
        .catch(() => {
            return [];
        });
}

// Update wishlist counter
function updateWishlistCounter() {
    const wishlistCounter = document.querySelector('.wishlist-counter');
    if (!wishlistCounter) return;
    
    getUserWishlist().then(wishlist => {
        const count = wishlist.length;
        wishlistCounter.textContent = count;
        
        if (count > 0) {
            wishlistCounter.style.display = 'block';
        } else {
            wishlistCounter.style.display = 'none';
        }
    });
}

// Populate wishlist page
function populateWishlistPage() {
    const wishlistContainer = document.getElementById('wishlist-container');
    if (!wishlistContainer) return;
    
    if (!firebase.auth().currentUser) {
        wishlistContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart fa-3x"></i>
                <p>Please log in to view your wishlist.</p>
                <a href="index.html" class="btn btn-primary">Login</a>
            </div>
        `;
        return;
    }
    
    getUserWishlist().then(wishlistIds => {
        if (wishlistIds.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart fa-3x"></i>
                    <p>Your wishlist is empty.</p>
                    <a href="products.html" class="btn btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }
        
        // Load product data from database
        const products = window.shopEase.products || [];
        
        let wishlistItems = '';
        let loadedProducts = 0;
        
        wishlistIds.forEach(productId => {
            const product = products.find(p => p.id === productId);
            
            if (product) {
                wishlistItems += `
                    <div class="wishlist-item">
                        <div class="wishlist-item-image">
                            <img src="${product.thumbnail}" alt="${product.name}">
                        </div>
                        <div class="wishlist-item-details">
                            <h4><a href="product-details.html?id=${product.id}">${product.name}</a></h4>
                            <div class="rating">
                                ${generateStarRating(product.rating)}
                                <span class="rating-count">(${product.reviewCount})</span>
                            </div>
                            <div class="price-container">
                                <span class="current-price">$${product.price.toFixed(2)}</span>
                                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="btn btn-primary add-to-cart-from-wishlist" data-product-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-danger remove-from-wishlist" data-product-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                loadedProducts++;
            }
        });
        
        if (loadedProducts === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart fa-3x"></i>
                    <p>Your wishlist is empty.</p>
                    <a href="products.html" class="btn btn-primary">Browse Products</a>
                </div>
            `;
        } else {
            wishlistContainer.innerHTML = wishlistItems;
            
            // Setup remove from wishlist buttons
            setupWishlistPageButtons();
        }
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Set up buttons on wishlist page
function setupWishlistPageButtons() {
    // Remove from wishlist buttons
    const removeButtons = document.querySelectorAll('.remove-from-wishlist');
    removeButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');
        
        button.addEventListener('click', function() {
            removeFromWishlist(productId).then(() => {
                button.closest('.wishlist-item').remove();
                shopEase.auth.showNotification('Product removed from wishlist');
                updateWishlistCounter();
                
                // Check if wishlist is empty
                const wishlistItems = document.querySelectorAll('.wishlist-item');
                if (wishlistItems.length === 0) {
                    document.getElementById('wishlist-container').innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-heart fa-3x"></i>
                            <p>Your wishlist is empty.</p>
                            <a href="products.html" class="btn btn-primary">Browse Products</a>
                        </div>
                    `;
                }
            });
        });
    });
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-from-wishlist');
    addToCartButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');
        
        button.addEventListener('click', function() {
            if (window.shopEase.cart && typeof window.shopEase.cart.addToCart === 'function') {
                window.shopEase.cart.addToCart(productId, 1);
            } else {
                shopEase.auth.showNotification('Cart functionality not available');
            }
        });
    });
}

// Export functions for use in other files
window.shopEase.wishlist = {
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    populateWishlistPage,
    updateWishlistCounter
}; 