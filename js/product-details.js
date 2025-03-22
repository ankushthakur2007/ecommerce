// Product details page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product details page loaded');
    
    // Initialize page
    initializeProductDetailsPage();
    
    // Update cart count
    window.shopEase?.updateCartCount();
});

// Helper function to ensure we have the shopEase object and products
function ensureShopEase() {
    if (!window.shopEase) {
        window.shopEase = {};
    }
    
    if (!window.shopEase.products && window.products) {
        window.shopEase.products = window.products;
    }
    
    return window.shopEase && window.shopEase.products;
}

function initializeProductDetailsPage() {
    console.log('Initializing product details page');
    
    // Make sure shopEase object exists
    if (!ensureShopEase()) {
        console.error('Products data not available');
        return;
    }
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    console.log('Product ID from URL:', productId);
    
    if (!productId || isNaN(productId)) {
        // If no valid product ID, redirect to products page
        console.log('No valid product ID, redirecting to products page');
        window.location.href = 'products.html';
        return;
    }
    
    // Find product in the products array
    const product = window.shopEase.products.find(p => p.id === productId);
    
    console.log('Product found:', product ? 'Yes' : 'No');
    
    if (!product) {
        // If product not found, redirect to products page
        console.log('Product not found, redirecting to products page');
        window.location.href = 'products.html';
        return;
    }
    
    // Display product details
    displayProductDetails(product);
    
    // Setup related products
    setupRelatedProducts(product);
}

function displayProductDetails(product) {
    // Get main elements
    const productContainer = document.querySelector('.product-details-container');
    if (!productContainer) return;
    
    // Update page title
    document.title = `${product.name} - ShopEase`;
    
    // Update breadcrumbs if present
    const breadcrumbProduct = document.querySelector('.breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
    
    // Set up main product details
    const productGallery = productContainer.querySelector('.product-gallery');
    const productInfo = productContainer.querySelector('.product-info');
    
    if (productGallery) {
        setupProductGallery(productGallery, product);
    }
    
    if (productInfo) {
        setupProductInfo(productInfo, product);
    }
    
    // Set up product content sections
    setupProductContentSections(product);
}

function setupProductGallery(galleryContainer, product) {
    // Use a default image URL as fallback
    const defaultImageUrl = "https://via.placeholder.com/800x800?text=Product+Image";
    const defaultThumbUrl = "https://via.placeholder.com/100x100?text=Thumbnail";
    
    // Create gallery markup with slideshow controls
    let galleryHTML = `
        <div class="gallery-container">
            <div class="main-image-container">
                <button class="gallery-nav prev-image"><i class="fas fa-chevron-left"></i></button>
                <div class="main-image-wrapper">
                    <img src="${product.images[0]}" alt="${product.name}" id="main-product-image" 
                         onerror="this.onerror=null; this.src='${defaultImageUrl}'; console.log('Error loading main image for ${product.name}, using fallback');">
                </div>
                <button class="gallery-nav next-image"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="thumbnail-navigation">
                <div class="thumbnail-container">
    `;
    
    // Add thumbnails
    product.images.forEach((image, index) => {
        galleryHTML += `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${image}" alt="${product.name} - Image ${index + 1}" 
                     onerror="this.onerror=null; this.src='${defaultThumbUrl}'; console.log('Error loading thumbnail ${index + 1} for ${product.name}, using fallback');">
            </div>
        `;
    });
    
    galleryHTML += `
                </div>
            </div>
        </div>
    `;
    
    // Set gallery HTML
    galleryContainer.innerHTML = galleryHTML;
    
    // Track current image index
    let currentImageIndex = 0;
    const totalImages = product.images.length;
    
    // Get navigation elements
    const prevButton = galleryContainer.querySelector('.prev-image');
    const nextButton = galleryContainer.querySelector('.next-image');
    const mainImage = galleryContainer.querySelector('#main-product-image');
    const thumbnailContainer = galleryContainer.querySelector('.thumbnail-container');
    
    // Add event listeners for navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
            updateMainImage(currentImageIndex);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % totalImages;
            updateMainImage(currentImageIndex);
        });
    }
    
    // Add thumbnail click events
    const thumbnails = galleryContainer.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update active thumbnail
            galleryContainer.querySelector('.thumbnail.active')?.classList.remove('active');
            this.classList.add('active');
            
            // Update current index and main image
            currentImageIndex = parseInt(this.dataset.index);
            updateMainImage(currentImageIndex, false); // No animation on direct click
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
            updateMainImage(currentImageIndex);
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % totalImages;
            updateMainImage(currentImageIndex);
        }
    });
    
    // Function to update main image with optional animation
    function updateMainImage(index, animate = true) {
        // Update main image
        if (animate) {
            mainImage.classList.add('fade-out');
            setTimeout(() => {
                mainImage.src = product.images[index];
                mainImage.classList.remove('fade-out');
                mainImage.classList.add('fade-in');
                setTimeout(() => {
                    mainImage.classList.remove('fade-in');
                }, 300);
            }, 300);
        } else {
            mainImage.src = product.images[index];
        }
        
        // Update active thumbnail
        const activeThumbnail = galleryContainer.querySelector(`.thumbnail[data-index="${index}"]`);
        if (activeThumbnail) {
            galleryContainer.querySelector('.thumbnail.active')?.classList.remove('active');
            activeThumbnail.classList.add('active');
            
            // Scroll the thumbnail into view
            activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
}

function setupProductInfo(infoContainer, product) {
    // Calculate discount percentage
    let discountText = '';
    if (product.onSale && product.originalPrice > product.price) {
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        discountText = `<span class="discount-badge">${discount}% OFF</span>`;
    }
    
    // Generate stars for rating
    const stars = generateStars(product.rating);
    
    // Create colors selection HTML
    let colorsHTML = '';
    if (product.colors && product.colors.length > 0) {
        const selectedColor = product.colors[0];
        
        colorsHTML = `
            <div class="product-variant">
                <div class="variant-header">
                    <h4>Color: <span class="selected-color-name">${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</span></h4>
                    <span class="variant-count">${product.colors.length} options</span>
                </div>
                <div class="color-options">
        `;
        
        product.colors.forEach(color => {
            colorsHTML += `
                <div class="color-option ${color === selectedColor ? 'active' : ''}" data-color="${color}">
                    <span class="color-swatch" style="background-color: ${color}"></span>
                    <span class="color-name">${color.charAt(0).toUpperCase() + color.slice(1)}</span>
                </div>
            `;
        });
        
        colorsHTML += `
                </div>
            </div>
        `;
    }
    
    // Create sizes selection HTML
    let sizesHTML = '';
    if (product.sizes && product.sizes.length > 0) {
        const selectedSize = product.sizes[0];
        
        sizesHTML = `
            <div class="product-variant">
                <div class="variant-header">
                    <h4>Size: <span class="selected-size">${selectedSize}</span></h4>
                    <span class="variant-count">${product.sizes.length} options</span>
                </div>
                <div class="size-options">
        `;
        
        product.sizes.forEach(size => {
            sizesHTML += `
                <div class="size-option ${size === selectedSize ? 'active' : ''}" data-size="${size}">${size}</div>
            `;
        });
        
        sizesHTML += `
                </div>
                <a href="#" class="size-guide-link"><i class="fas fa-ruler"></i> Size Guide</a>
            </div>
        `;
    }
    
    // Format availability text
    const availabilityText = product.inStock ? 
        `<span class="in-stock"><i class="fas fa-check-circle"></i> In Stock</span>` : 
        `<span class="out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>`;

    // Add delivery information
    const deliveryHTML = `
        <div class="delivery-info">
            <div class="delivery-option">
                <i class="fas fa-truck"></i>
                <div>
                    <strong>Fast Delivery</strong>
                    <p>Order within 12 hrs and get it by ${getFormattedDeliveryDate(2)}</p>
                </div>
            </div>
            <div class="delivery-option">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>Delivery Location</strong>
                    <p>Deliver to <button id="change-location" class="text-button">Change</button></p>
                </div>
            </div>
        </div>
    `;
    
    // Set info HTML
    infoContainer.innerHTML = `
        <div class="amazon-style-layout">
            <div class="product-header">
                <h1 class="product-title">${product.name}</h1>
                <div class="product-brand">by <a href="products.html?brand=${product.brand}">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</a></div>
                <div class="product-meta">
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <a href="#reviews-content" class="rating-count">${product.reviewCount} ratings</a>
                    </div>
                </div>
            </div>
            
            <div class="product-price-section">
                <div class="product-price">
                    <span class="price-label">Price:</span>
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span> ${discountText}` : ''}
                </div>
                <div class="product-availability">
                    ${availabilityText}
                </div>
            </div>
            
            <div class="product-short-description">
                <p>${product.description}</p>
            </div>
            
            ${deliveryHTML}
            
            ${colorsHTML}
            ${sizesHTML}
            
            <div class="product-variant">
                <h4>Quantity:</h4>
                <div class="quantity-selector">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" min="1" max="10" value="1" class="quantity-input">
                        <button class="quantity-btn increase">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="quantity-limit">
                        <i class="fas fa-info-circle"></i> Limit 10 per order
                    </div>
                </div>
            </div>
            
            <div class="product-actions">
                <button class="btn btn-primary btn-add-to-cart amazon-style-button" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button class="btn btn-secondary btn-buy-now amazon-style-button" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
                <button class="btn btn-outline btn-wishlist">
                    <i class="far fa-heart"></i> Add to Wishlist
                </button>
            </div>
            
            <div class="secure-transaction">
                <i class="fas fa-lock"></i> Secure transaction
            </div>
            
            <div class="product-meta-info">
                <div class="meta-item">
                    <span class="meta-label">SKU:</span>
                    <span class="meta-value">SKU-${product.id.toString().padStart(4, '0')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Category:</span>
                    <span class="meta-value">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Brand:</span>
                    <span class="meta-value">${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Tags:</span>
                    <span class="meta-value">${product.tags.map(tag => `<a href="products.html?search=${tag}">${tag}</a>`).join(', ')}</span>
                </div>
            </div>
        </div>
    `;
    
    // Set up event listeners
    setupProductVariantSelectors(infoContainer, product);
    setupQuantityControl(infoContainer);
    setupAddToCartButton(infoContainer, product);
    setupWishlistButton(infoContainer);
    
    // Set up Buy Now button
    const buyNowBtn = infoContainer.querySelector('.btn-buy-now');
    if (buyNowBtn && product.inStock) {
        buyNowBtn.addEventListener('click', function() {
            const quantity = parseInt(infoContainer.querySelector('.quantity-input').value);
            const selectedColor = infoContainer.querySelector('.color-option.active')?.dataset.color;
            const selectedSize = infoContainer.querySelector('.size-option.active')?.dataset.size;
            
            // Add to cart
            if (window.shopEase && typeof window.shopEase.addToCart === 'function') {
                if (window.shopEase.addToCart(product.id, quantity, selectedColor, selectedSize)) {
                    // Redirect to checkout page
                    window.location.href = 'checkout.html';
                }
            } else {
                console.error("Error: shopEase.addToCart function not available");
                alert("Unable to process your order. Please try again later.");
            }
        });
    }
    
    // Rating click should scroll to reviews section
    const ratingCount = infoContainer.querySelector('.rating-count');
    if (ratingCount) {
        ratingCount.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to the reviews content section
            const reviewsSection = document.getElementById('reviews-content');
            if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

function setupProductVariantSelectors(container, product) {
    // Color selector
    const colorOptions = container.querySelectorAll('.color-option');
    let selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            container.querySelector('.color-option.active')?.classList.remove('active');
            this.classList.add('active');
            selectedColor = this.dataset.color;
            
            // Update selected color display
            const selectedColorDisplay = container.querySelector('.selected-color-name');
            if (selectedColorDisplay) {
                selectedColorDisplay.textContent = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1);
            }
            
            // Trigger a subtle animation on the color selection
            this.classList.add('selected-animation');
            setTimeout(() => {
                this.classList.remove('selected-animation');
            }, 500);
        });
        
        // Set first color as active
        if (option.dataset.color === selectedColor) {
            option.classList.add('active');
        }
    });
    
    // Size selector
    const sizeOptions = container.querySelectorAll('.size-option');
    let selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            container.querySelector('.size-option.active')?.classList.remove('active');
            this.classList.add('active');
            selectedSize = this.dataset.size;
            
            // Update selected size display
            const selectedSizeDisplay = container.querySelector('.selected-size');
            if (selectedSizeDisplay) {
                selectedSizeDisplay.textContent = selectedSize;
            }
            
            // Trigger a subtle animation on size selection
            this.classList.add('selected-animation');
            setTimeout(() => {
                this.classList.remove('selected-animation');
            }, 500);
        });
        
        // Set first size as active
        if (option.dataset.size === selectedSize) {
            option.classList.add('active');
        }
    });
}

function setupQuantityControl(container) {
    const quantityInput = container.querySelector('.quantity-input');
    const decreaseBtn = container.querySelector('.decrease');
    const increaseBtn = container.querySelector('.increase');
    
    if (!quantityInput || !decreaseBtn || !increaseBtn) return;
    
    // Max quantity for this demo
    const MAX_QUANTITY = 10;
    
    // Update button states
    function updateButtonStates() {
        const value = parseInt(quantityInput.value);
        decreaseBtn.disabled = value <= 1;
        increaseBtn.disabled = value >= MAX_QUANTITY;
        
        decreaseBtn.classList.toggle('disabled', value <= 1);
        increaseBtn.classList.toggle('disabled', value >= MAX_QUANTITY);
    }
    
    // Initialize button states
    updateButtonStates();
    
    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
            // Trigger change event to update button states
            quantityInput.dispatchEvent(new Event('change'));
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < MAX_QUANTITY) {
            quantityInput.value = value + 1;
            // Trigger change event to update button states
            quantityInput.dispatchEvent(new Event('change'));
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > MAX_QUANTITY) {
            this.value = MAX_QUANTITY;
        }
        
        updateButtonStates();
        
        // Animate the quantity change
        this.classList.add('quantity-changed');
        setTimeout(() => {
            this.classList.remove('quantity-changed');
        }, 300);
    });
    
    // Number input validation
    quantityInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

function setupAddToCartButton(container, product) {
    const addToCartBtn = container.querySelector('.btn-add-to-cart');
    if (!addToCartBtn || !product.inStock) return;
    
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(container.querySelector('.quantity-input').value);
        const selectedColor = container.querySelector('.color-option.active')?.dataset.color;
        const selectedSize = container.querySelector('.size-option.active')?.dataset.size;
        
        console.log("Product details - Adding to cart:", product.id, "Quantity:", quantity, "Color:", selectedColor, "Size:", selectedSize);
        console.log("shopEase object available:", !!window.shopEase);
        console.log("addToCart function available:", !!(window.shopEase && window.shopEase.addToCart));
        
        // Add to cart
        if (window.shopEase && typeof window.shopEase.addToCart === 'function') {
            window.shopEase.addToCart(product.id, quantity, selectedColor, selectedSize);
        } else {
            console.error("Error: shopEase.addToCart function not available");
            // Show error message to user
            alert("Unable to add item to cart. Please try again later.");
        }
    });
}

function setupWishlistButton(container) {
    const wishlistBtn = container.querySelector('.btn-wishlist');
    if (!wishlistBtn) return;
    
    wishlistBtn.addEventListener('click', function() {
        // Toggle button style
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
        } else {
            this.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        }
        
        // In a real application, you would save the wishlist to storage
        // This is just a UI demonstration
        showMessage(
            this.classList.contains('active') ? 'Added to wishlist!' : 'Removed from wishlist', 
            'success'
        );
    });
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function setupRelatedProducts(currentProduct) {
    const relatedContainer = document.querySelector('#related-products');
    if (!relatedContainer) return;
    
    // Get products in the same category
    const relatedProducts = window.shopEase.products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4); // Get up to 4 related products
    
    // If not enough products in the same category, add some from other categories
    if (relatedProducts.length < 4) {
        const additionalProducts = window.shopEase.products
            .filter(p => p.category !== currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 4 - relatedProducts.length);
        
        relatedProducts.push(...additionalProducts);
    }
    
    // Display related products
    relatedContainer.innerHTML = '';
    relatedProducts.forEach(product => {
        relatedContainer.appendChild(window.shopEase.createProductCard(product));
    });
}

function showMessage(message, type) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(messageElement);
    
    // Show message
    setTimeout(() => {
        messageElement.classList.add('show');
        
        // Hide and remove after delay
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }, 3000);
    }, 10);
}

// Helper function to get a formatted delivery date X days from now
function getFormattedDeliveryDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    
    // Format as "Monday, January 1"
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Make the product gallery sticky on scroll - now disabled
function makeGallerySticky() {
    // Function disabled as requested
    return;
}

function setupProductContentSections(product) {
    console.log('Setting up product content sections for product:', product.id, product.name);
    
    // Instead of creating new elements, we'll work with existing ones
    const descriptionContent = document.getElementById('description-content');
    const specificationsContent = document.getElementById('specifications-content');
    const reviewsContent = document.getElementById('reviews-content');
    
    console.log('Found content sections:', 
        'description:', !!descriptionContent, 
        'specifications:', !!specificationsContent, 
        'reviews:', !!reviewsContent);
    
    if (!descriptionContent || !specificationsContent || !reviewsContent) {
        console.error('Product content sections not found in HTML');
        return;
    }

    // Validate product has the required data
    console.log('Product has detailedDescription:', !!product.detailedDescription);
    console.log('Product has features:', !!product.features, product.features?.length || 0);
    console.log('Product has specifications:', !!product.specifications);
    console.log('Product has reviews:', !!product.reviews, product.reviews?.length || 0);

    // Update description content with product data
    if (descriptionContent) {
        const descriptionContainer = descriptionContent.querySelector('.section-content');
        console.log('Found description container:', !!descriptionContainer);
        
        if (descriptionContainer) {
            // Clear existing content and add new content
            descriptionContainer.innerHTML = '';
            
            // Use detailed description if available, otherwise use regular description
            if (product.detailedDescription) {
                descriptionContainer.innerHTML += product.detailedDescription;
            } else {
                descriptionContainer.innerHTML += `<p>${product.description}</p>`;
            }
            
            // Add features list if available
            if (product.features && product.features.length > 0) {
                const featuresHeader = document.createElement('h3');
                featuresHeader.textContent = 'Key Features';
                descriptionContainer.appendChild(featuresHeader);
                
                const featuresList = document.createElement('ul');
                featuresList.className = 'feature-list';
                
                product.features.forEach(feature => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
                    featuresList.appendChild(listItem);
                });
                
                descriptionContainer.appendChild(featuresList);
            }
        }
    }
    
    // Update specifications content with product data
    if (specificationsContent) {
        const specificationsContainer = specificationsContent.querySelector('.section-content');
        console.log('Found specifications container:', !!specificationsContainer);
        
        if (specificationsContainer && product.specifications) {
            // Use existing specs table if available
            const specsTable = specificationsContainer.querySelector('.specs-table tbody');
            
            if (specsTable) {
                // Clear existing specs
                specsTable.innerHTML = '';
                
                // Add new specs
                for (const [key, value] of Object.entries(product.specifications)) {
                    const formattedKey = key.replace(/([A-Z])/g, ' $1')
                                      .replace(/^./, str => str.toUpperCase());
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <th>${formattedKey}</th>
                        <td><span id="spec-${key}">${value}</span></td>
                    `;
                    specsTable.appendChild(row);
                }
            } else {
                // Create new table if it doesn't exist
                specificationsContainer.innerHTML = generateSpecificationsContent(product);
            }
        }
    }
    
    // Update reviews content with product data
    if (reviewsContent) {
        // Update review count
        const reviewsCount = reviewsContent.querySelector('#reviews-count');
        if (reviewsCount) {
            reviewsCount.textContent = `(${product.reviewCount})`;
        }
        
        // Update average rating and total reviews
        const averageRating = reviewsContent.querySelector('.rating-number');
        if (averageRating) {
            averageRating.textContent = product.rating.toFixed(1);
        }
        
        const totalReviews = reviewsContent.querySelector('.total-reviews');
        if (totalReviews) {
            totalReviews.textContent = `Based on ${product.reviewCount} reviews`;
        }
        
        // Update review list
        const reviewsList = reviewsContent.querySelector('.reviews-list');
        if (reviewsList && product.reviews && product.reviews.length > 0) {
            // Clear existing reviews
            reviewsList.innerHTML = '';
            
            // Add new reviews
            product.reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.className = 'review-item';
                
                reviewItem.innerHTML = `
                    <div class="review-header">
                        <div class="reviewer-info">
                            <img src="https://i.pravatar.cc/50?img=${Math.floor(Math.random() * 70)}" alt="Reviewer" class="reviewer-avatar">
                            <div>
                                <h4>${review.name}</h4>
                                <span class="review-date">${review.date}</span>
                            </div>
                        </div>
                        <div class="review-rating">
                            ${generateStars(review.rating)}
                        </div>
                    </div>
                    <div class="review-content">
                        <h4 class="review-title">${review.title}</h4>
                        <p>${review.content}</p>
                    </div>
                `;
                
                reviewsList.appendChild(reviewItem);
            });
        }
    }
}

function generateSpecificationsContent(product) {
    if (!product.specifications) {
        return '<p>No specifications available for this product.</p>';
    }
    
    let html = '<table class="specs-table"><tbody>';
    
    for (const [key, value] of Object.entries(product.specifications)) {
        const formattedKey = key.replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());
        
        html += '<tr>';
        html += `<th>${formattedKey}</th>`;
        html += `<td>${value}</td>`;
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    return html;
} 