// ShopEase Cart Management
console.log('Cart.js loaded. shopEase object:', window.shopEase ? 'exists' : 'does not exist');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart.js DOM loaded. shopEase object:', window.shopEase ? 'exists' : 'does not exist');
    console.log('Products available:', window.products ? window.products.length : 'not available');
    
    // Initialize cart icon functionality for all pages
    initCartIcon();
    
    // Initialize cart page functionality if on cart page
    if (window.location.href.includes('cart.html')) {
        initCartPage();
        
        // Event listener for checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                window.location.href = 'checkout.html';
            });
        }
        
        // Event listener for coupon form
        const applyCouponBtn = document.getElementById('apply-coupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', applyCoupon);
        }
        
        // Event listener for continue shopping button
        const continueShoppingBtn = document.querySelector('.continue-shopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'products.html';
            });
        }
    }
});

// Initialize shopEase global object
window.shopEase = window.shopEase || {};

// Attach cart functions to the shopEase object
window.shopEase.getCart = getCart;
window.shopEase.saveCart = saveCart;
window.shopEase.addToCart = addToCart;
window.shopEase.updateCartCount = updateCartCount;
window.shopEase.removeItemFromCart = removeItemFromCart;
window.shopEase.updateItemQuantity = updateItemQuantity;
window.shopEase.showToast = showToast;
window.shopEase.initCartIcon = initCartIcon;

/**
 * Initialize the cart page, display items, and set up event handlers
 */
function initCartPage() {
    const cart = getCart();
    
    if (cart && cart.items && cart.items.length > 0) {
        displayCartItems(cart.items);
        updateCartSummary(cart);
    } else {
        // Show empty cart message
        const emptyCartMessage = document.getElementById('empty-cart');
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        
        // Hide cart summary
        const cartSummary = document.getElementById('cart-summary');
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
    }
    
    // Load suggested products
    loadSuggestedProducts();
}

/**
 * Display cart items in the cart container
 * @param {Array} items - Array of cart items
 */
function displayCartItems(items) {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    // Show cart summary if hidden
    if (cartSummary) {
        cartSummary.style.display = 'block';
    }
    
    // Hide empty cart message
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    
    // Clear container (but keep the empty cart message)
    const itemsToRemove = cartItemsContainer.querySelectorAll('.cart-item');
    itemsToRemove.forEach(item => item.remove());
    
    // Get the template
    const template = document.querySelector('.cart-template .cart-item');
    if (!template) return;
    
    // Use a default image URL as fallback
    const defaultImageUrl = "https://via.placeholder.com/80x80?text=Product";
    
    // Add each item to the container
    items.forEach(item => {
        const itemElement = template.cloneNode(true);
        
        // Set item image
        const imageElement = itemElement.querySelector('.item-image img');
        if (imageElement) {
            imageElement.src = item.thumbnail || defaultImageUrl;
            imageElement.alt = item.name;
            imageElement.onerror = function() {
                this.onerror = null;
                this.src = defaultImageUrl;
                console.log(`Error loading cart image for ${item.name}, using fallback`);
            };
        }
        
        // Set item name
        const nameElement = itemElement.querySelector('.item-name');
        if (nameElement) {
            nameElement.textContent = item.name;
        }
        
        // Set item color if available
        const colorElement = itemElement.querySelector('.item-color span');
        if (colorElement && item.color) {
            colorElement.textContent = item.color;
        } else if (colorElement) {
            colorElement.parentElement.style.display = 'none';
        }
        
        // Set item size if available
        const sizeElement = itemElement.querySelector('.item-size span');
        if (sizeElement && item.size) {
            sizeElement.textContent = item.size;
        } else if (sizeElement) {
            sizeElement.parentElement.style.display = 'none';
        }
        
        // Set item price
        const currentPriceElement = itemElement.querySelector('.current-price');
        if (currentPriceElement) {
            currentPriceElement.textContent = `$${item.price.toFixed(2)}`;
        }
        
        // Set original price if available
        const originalPriceElement = itemElement.querySelector('.original-price');
        if (originalPriceElement) {
            if (item.originalPrice && item.originalPrice > item.price) {
                originalPriceElement.textContent = `$${item.originalPrice.toFixed(2)}`;
                originalPriceElement.style.display = 'block';
            } else {
                originalPriceElement.style.display = 'none';
            }
        }
        
        // Set item total
        const totalElement = itemElement.querySelector('.item-total');
        if (totalElement) {
            totalElement.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        }
        
        // Set quantity
        const quantityInput = itemElement.querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.value = item.quantity;
            
            // Add event listener for direct input
            quantityInput.addEventListener('change', function() {
                updateItemQuantity(item.id, parseInt(this.value, 10));
            });
        }
        
        // Add event listeners for quantity buttons
        const decreaseBtn = itemElement.querySelector('.decrease');
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', function() {
                if (item.quantity > 1) {
                    updateItemQuantity(item.id, item.quantity - 1);
                }
            });
        }
        
        const increaseBtn = itemElement.querySelector('.increase');
        if (increaseBtn) {
            increaseBtn.addEventListener('click', function() {
                updateItemQuantity(item.id, item.quantity + 1);
            });
        }
        
        // Add event listener for remove button
        const removeBtn = itemElement.querySelector('.remove-item');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                removeItemFromCart(item.id);
            });
        }
        
        // Set data attributes for easy lookup
        itemElement.setAttribute('data-item-id', item.id);
        
        // Append to container
        cartItemsContainer.appendChild(itemElement);
    });
}

/**
 * Update the quantity of an item in the cart
 * @param {string} itemId - ID of the item to update
 * @param {number} newQuantity - New quantity value
 */
function updateItemQuantity(itemId, newQuantity) {
    // Validate quantity
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99;
    
    const cart = getCart();
    
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    // Update quantity
    cart.items[itemIndex].quantity = newQuantity;
    
    // Save updated cart
    saveCart(cart);
    
    // Update display
    const itemElement = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
    if (itemElement) {
        // Update quantity input
        const quantityInput = itemElement.querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.value = newQuantity;
        }
        
        // Update item total
        const totalElement = itemElement.querySelector('.item-total');
        if (totalElement) {
            const price = cart.items[itemIndex].price;
            totalElement.textContent = `$${(price * newQuantity).toFixed(2)}`;
        }
    }
    
    // Update cart summary
    updateCartSummary(cart);
    
    // Update cart count in header
    updateCartCount();
}

/**
 * Remove an item from the cart
 * @param {string} itemId - ID of the item to remove
 */
function removeItemFromCart(itemId) {
    const cart = getCart();
    
    // Filter out the item
    cart.items = cart.items.filter(item => item.id !== itemId);
    
    // Save updated cart
    saveCart(cart);
    
    // Remove item element from DOM
    const itemElement = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
    if (itemElement) {
        itemElement.remove();
    }
    
    // If cart is empty, show empty message
    if (cart.items.length === 0) {
        const emptyCartMessage = document.getElementById('empty-cart');
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        
        // Hide cart summary
        const cartSummary = document.getElementById('cart-summary');
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
    }
    
    // Update cart summary
    updateCartSummary(cart);
    
    // Update cart count in header
    updateCartCount();
}

/**
 * Update the cart summary with current totals
 * @param {Object} cart - The cart object
 */
function updateCartSummary(cart) {
    if (!cart || !cart.items || cart.items.length === 0) return;
    
    // Calculate subtotal
    const subtotal = cart.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0);
    
    // Calculate shipping (free over $50, otherwise $5.99)
    const shipping = subtotal > 50 ? 0 : 5.99;
    
    // Calculate tax (10%)
    const tax = subtotal * 0.1;
    
    // Apply discount if available
    let discount = 0;
    if (cart.coupon) {
        discount = subtotal * (cart.coupon.discount / 100);
    }
    
    // Calculate total
    const total = subtotal + shipping + tax - discount;
    
    // Update summary elements
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    
    // Show/hide discount row
    const discountRow = document.getElementById('discount-row');
    if (discountRow) {
        if (discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('cart-discount').textContent = `-$${discount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    
    // Update total
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

/**
 * Apply a coupon code to the cart
 */
function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponMessage = document.getElementById('coupon-message');
    
    if (!couponInput || !couponMessage) return;
    
    const couponCode = couponInput.value.trim().toUpperCase();
    
    // Simple validation
    if (!couponCode) {
        couponMessage.textContent = 'Please enter a coupon code';
        couponMessage.className = 'coupon-message message-error';
        return;
    }
    
    // Available coupons (in a real app, this would come from a server)
    const availableCoupons = {
        'WELCOME10': { discount: 10, message: '10% discount applied!' },
        'SUMMER20': { discount: 20, message: '20% discount applied!' },
        'FREESHIP': { discount: 0, freeShipping: true, message: 'Free shipping applied!' }
    };
    
    // Check if coupon is valid
    if (availableCoupons[couponCode]) {
        const cart = getCart();
        cart.coupon = {
            code: couponCode,
            discount: availableCoupons[couponCode].discount,
            freeShipping: availableCoupons[couponCode].freeShipping || false
        };
        
        // Save updated cart
        saveCart(cart);
        
        // Update cart summary
        updateCartSummary(cart);
        
        // Show success message
        couponMessage.textContent = availableCoupons[couponCode].message;
        couponMessage.className = 'coupon-message message-success';
    } else {
        // Invalid coupon
        couponMessage.textContent = 'Invalid coupon code';
        couponMessage.className = 'coupon-message message-error';
    }
}

/**
 * Load suggested products in the "You May Also Like" section
 */
function loadSuggestedProducts() {
    const suggestedContainer = document.getElementById('suggested-products');
    if (!suggestedContainer) return;
    
    // Get all products (in a real app, this would be filtered based on user preferences)
    const allProducts = window.products || [];
    
    // Select 4 random products
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    // Clear container
    suggestedContainer.innerHTML = '';
    
    // Add each product
    selected.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.thumbnail}" alt="${product.name}">
                <div class="product-actions">
                    <button class="quick-view" data-id="${product.id}">Quick View</button>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${generateRatingStars(product.rating || 0)}
                    <span class="rating-count">(${product.ratingCount || 0})</span>
                </div>
            </div>
        `;
        
        // Add event listeners
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'), 10);
                console.log("Add to cart clicked for product ID:", productId);
                addToCart(productId, 1);
            });
        }
        
        const quickViewBtn = productCard.querySelector('.quick-view');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', function() {
                window.location.href = `product-details.html?id=${product.id}`;
            });
        }
        
        suggestedContainer.appendChild(productCard);
    });
}

/**
 * Generate HTML for star ratings
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML for star rating
 */
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

/**
 * Get the cart from localStorage
 * @returns {Object} The cart object
 */
function getCart() {
    // Check both storage keys for backward compatibility
    let cartJson = localStorage.getItem('shopease-cart');
    if (!cartJson) {
        // Try the old key and migrate if needed
        cartJson = localStorage.getItem('cart');
        if (cartJson) {
            // Migrate old cart to new format
            try {
                const oldCart = JSON.parse(cartJson);
                // Convert old cart format to new format if needed
                if (Array.isArray(oldCart)) {
                    const newCart = { items: oldCart };
                    localStorage.setItem('shopease-cart', JSON.stringify(newCart));
                    localStorage.removeItem('cart'); // Remove old cart
                    return newCart;
                }
            } catch (e) {
                console.error('Error parsing old cart format:', e);
            }
        }
    }
    
    if (cartJson) {
        try {
            return JSON.parse(cartJson);
        } catch (e) {
            console.error('Error parsing cart from localStorage:', e);
            return { items: [] };
        }
    }
    return { items: [] };
}

/**
 * Save the cart to localStorage
 * @param {Object} cart - The cart object to save
 */
function saveCart(cart) {
    localStorage.setItem('shopease-cart', JSON.stringify(cart));
    // Also update the old format for backward compatibility
    if (Array.isArray(cart)) {
        localStorage.setItem('cart', JSON.stringify(cart));
    } else if (cart && cart.items) {
        localStorage.setItem('cart', JSON.stringify(cart.items));
    }
}

/**
 * Update the cart count in the header
 */
function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = itemCount.toString();
        
        // Also update visual state of the cart icon
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            if (itemCount > 0) {
                cartIcon.classList.add('has-items');
            } else {
                cartIcon.classList.remove('has-items');
            }
        }
    }
}

/**
 * Initialize the cart icon functionality
 * Updates cart count and handles cart icon interactions
 */
function initCartIcon() {
    // Update cart count on page load
    updateCartCount();
    
    // Add event listener to cart icon for mobile
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        // Check if cart has items and add 'has-items' class accordingly
        const cart = getCart();
        if (cart.items && cart.items.length > 0) {
            cartIcon.classList.add('has-items');
        } else {
            cartIcon.classList.remove('has-items');
        }
        
        // Add click event if needed for mobile dropdown
        cartIcon.addEventListener('click', function(e) {
            // Only handle dropdown behavior on mobile if we're not clicking the link directly
            if (window.innerWidth <= 768 && e.target.tagName !== 'A') {
                e.preventDefault();
                cartIcon.classList.toggle('active');
            }
        });
    }
}

/**
 * Add a product to the cart
 * @param {string|number} productId - ID of the product to add
 * @param {number} quantity - Quantity to add
 * @param {string} color - Selected color (optional)
 * @param {string} size - Selected size (optional)
 */
function addToCart(productId, quantity = 1, color = null, size = null) {
    // Convert productId to number if it's a string
    if (typeof productId === 'string') {
        productId = parseInt(productId, 10);
    }
    
    // Find product in the products array
    const product = window.products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }
    
    // Get current cart
    const cart = getCart();
    
    // Check if product is already in cart
    const existingItem = cart.items.find(item => 
        item.id === productId && 
        item.color === color && 
        item.size === size
    );
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
        if (existingItem.quantity > 99) existingItem.quantity = 99;
    } else {
        // Add new item
        cart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            thumbnail: product.thumbnail,
            quantity: quantity,
            color: color,
            size: size
        });
    }
    
    // Log for debugging
    console.log('Product added to cart:', product.name, 'Quantity:', quantity);
    console.log('Cart now has', cart.items.length, 'items');
    
    // Save updated cart
    saveCart(cart);
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showToast(`${product.name} added to cart!`);
    
    // If we're on the cart page, refresh the display
    if (window.location.href.includes('cart.html')) {
        displayCartItems(cart.items);
        updateCartSummary(cart);
    }
    
    return true;
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
