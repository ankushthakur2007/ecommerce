// Product Database
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        brand: "sony",
        description: "High-quality wireless headphones with noise cancellation technology.",
        detailedDescription: `<p>Experience premium sound quality with our Wireless Bluetooth Headphones. Designed for music lovers who demand the best audio experience, these headphones deliver crisp highs, balanced mids, and deep bass.</p>
                              <p>The active noise cancellation technology blocks out ambient noise, allowing you to focus on your music or calls without distractions. Perfect for travel, commuting, or enjoying your favorite tracks at home.</p>`,
        features: [
            "Advanced noise cancellation technology",
            "Up to 30 hours of battery life",
            "Comfortable over-ear design",
            "High-resolution audio certified",
            "Built-in microphone for calls",
            "Voice assistant compatible"
        ],
        specifications: {
            "dimensions": "7.9 x 6.5 x 3.1 inches",
            "weight": "9.8 ounces",
            "batteryLife": "30 hours",
            "connectivity": "Bluetooth 5.0, 3.5mm audio jack",
            "compatibleDevices": "All Bluetooth devices",
            "noiseReduction": "Active Noise Cancellation",
            "warranty": "1 Year Limited Warranty"
        },
        reviews: [
            {
                name: "John Smith",
                date: "2023-01-15",
                rating: 5,
                title: "Best headphones I've ever owned",
                content: "These headphones exceeded my expectations. The sound quality is incredible, and the noise cancellation works perfectly. I use them every day for work calls and listening to music."
            },
            {
                name: "Emma Johnson",
                date: "2022-12-03",
                rating: 4,
                title: "Great sound, slightly tight fit",
                content: "The sound quality is excellent, and I love the battery life. My only complaint is that they're a bit tight on my head after a few hours of use. Otherwise, they're perfect!"
            },
            {
                name: "David Williams",
                date: "2022-11-20",
                rating: 5,
                title: "Perfect for travel",
                content: "I bought these for a long international flight, and they were a game changer. The noise cancellation blocked out the engine noise, and I could sleep comfortably with them on."
            }
        ],
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.5,
        reviewCount: 124,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["black", "white", "blue"],
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["headphones", "wireless", "audio", "bluetooth"]
    },
    {
        id: 2,
        name: "Premium Smartphone",
        category: "electronics",
        brand: "apple",
        description: "Latest generation smartphone with advanced camera features and long battery life.",
        detailedDescription: `<p>Experience the cutting edge of mobile technology with our Premium Smartphone. This flagship device combines exceptional performance with innovative features designed for tech enthusiasts and everyday users alike.</p>
                              <p>The revolutionary camera system captures stunning photos even in low light conditions, while the powerful processor ensures smooth performance for gaming, multitasking, and more.</p>`,
        features: [
            "6.7-inch Super Retina XDR display",
            "Triple-camera system with Night mode",
            "A15 Bionic chip - fastest smartphone processor",
            "5G capable for ultra-fast downloads",
            "Up to 512GB storage capacity",
            "Water and dust resistant (IP68)"
        ],
        specifications: {
            "dimensions": "5.78 x 2.82 x 0.30 inches",
            "weight": "6.07 ounces",
            "display": "6.7-inch Super Retina XDR",
            "processor": "A15 Bionic chip",
            "storage": "128GB, 256GB, 512GB options",
            "rearCamera": "Triple 12MP Ultra Wide, Wide, and Telephoto",
            "frontCamera": "12MP TrueDepth",
            "batteryLife": "Up to 28 hours video playback",
            "os": "iOS 15",
            "connectivity": "5G, WiFi 6, Bluetooth 5.0, NFC"
        },
        reviews: [
            {
                name: "Michael Brown",
                date: "2023-01-10",
                rating: 5,
                title: "Worth every penny",
                content: "This phone has completely changed how I work and play. The camera quality is phenomenal, and the battery lasts all day even with heavy use. The screen is gorgeous and the performance is lightning fast."
            },
            {
                name: "Sophia Williams",
                date: "2022-12-15",
                rating: 4,
                title: "Great phone, just a few quirks",
                content: "I'm giving 4 stars because while this is an excellent device overall, there are a couple of minor software bugs that need to be fixed. The camera and battery life are exceptional though."
            },
            {
                name: "James Rodriguez",
                date: "2022-11-30",
                rating: 5,
                title: "Best camera on any smartphone",
                content: "As a photography enthusiast, I'm amazed by the quality of photos from this phone. Night mode is particularly impressive. The overall experience is smooth and intuitive."
            }
        ],
        price: 999.99,
        originalPrice: 1099.99,
        rating: 4.8,
        reviewCount: 256,
        isNew: true,
        onSale: true,
        inStock: true,
        colors: ["black", "silver", "gold"],
        thumbnail: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["smartphone", "mobile", "camera", "tech"]
    },
    {
        id: 3,
        name: "Men's Running Shoes",
        category: "clothing",
        brand: "nike",
        description: "Lightweight running shoes with enhanced cushioning for maximum comfort.",
        price: 129.99,
        originalPrice: 149.99,
        rating: 4.3,
        reviewCount: 98,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["black", "gray", "red"],
        sizes: ["S", "M", "L", "XL"],
        thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["shoes", "running", "footwear", "sports"]
    },
    {
        id: 4,
        name: "Women's Designer Handbag",
        category: "clothing",
        brand: "designer",
        description: "Elegant designer handbag made from premium materials.",
        price: 349.99,
        originalPrice: 399.99,
        rating: 4.7,
        reviewCount: 65,
        isNew: true,
        onSale: false,
        inStock: true,
        colors: ["brown", "black", "red"],
        thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["handbag", "fashion", "accessories", "designer"]
    },
    {
        id: 5,
        name: "Smart Fitness Watch",
        category: "electronics",
        brand: "samsung",
        description: "Advanced fitness tracker with heart rate monitoring and GPS.",
        price: 179.99,
        originalPrice: 199.99,
        rating: 4.4,
        reviewCount: 87,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["black", "silver", "rose gold"],
        thumbnail: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["watch", "fitness", "health", "wearable"]
    },
    {
        id: 6,
        name: "Modern Coffee Table",
        category: "home",
        brand: "furniture",
        description: "Stylish coffee table with minimalist design, perfect for modern homes.",
        price: 249.99,
        originalPrice: 299.99,
        rating: 4.2,
        reviewCount: 42,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["walnut", "oak", "white"],
        thumbnail: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1532372576444-dda954194ad0?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["furniture", "table", "living room", "home decor"]
    },
    {
        id: 7,
        name: "Professional DSLR Camera",
        category: "electronics",
        brand: "sony",
        description: "High-end DSLR camera for professional photography.",
        price: 1299.99,
        originalPrice: 1499.99,
        rating: 4.9,
        reviewCount: 112,
        isNew: true,
        onSale: true,
        inStock: true,
        colors: ["black"],
        thumbnail: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1617005082134-45ae5d2417d8?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["camera", "photography", "professional", "tech"]
    },
    {
        id: 8,
        name: "Stainless Steel Kitchen Set",
        category: "home",
        brand: "kitchenware",
        description: "Complete stainless steel cookware set for modern kitchens.",
        detailedDescription: `<p>Elevate your cooking experience with our premium Stainless Steel Kitchen Set. Crafted from high-quality 18/10 stainless steel, this cookware set combines durability with elegant design.</p>
                             <p>Each piece features a tri-ply construction with an aluminum core for even heat distribution and fast heating. The ergonomic handles stay cool during cooking, and the tight-fitting lids lock in moisture and flavor.</p>`,
        features: [
            "Premium 18/10 stainless steel construction",
            "Tri-ply design with aluminum core for even heating",
            "Compatible with all cooktops including induction",
            "Oven safe up to 500°F",
            "Dishwasher safe for easy cleaning",
            "Includes pots, pans, and cooking utensils"
        ],
        specifications: {
            "setIncludes": "10-inch frying pan, 8-inch frying pan, 2-quart saucepan with lid, 3-quart saucepan with lid, 5-quart Dutch oven with lid, 4 cooking utensils",
            "material": "18/10 Stainless Steel with Aluminum Core",
            "dishwasherSafe": "Yes",
            "ovenSafe": "Up to 500°F",
            "inductionCompatible": "Yes",
            "weight": "19.8 pounds",
            "warranty": "Lifetime Limited Warranty"
        },
        reviews: [
            {
                name: "Sarah Johnson",
                date: "2023-02-10",
                rating: 5,
                title: "Professional quality at home",
                content: "I'm amazed by the quality of this set. The pans heat evenly and clean up easily. I feel like a professional chef in my own kitchen now!"
            },
            {
                name: "Michael Chen",
                date: "2023-01-05",
                rating: 4,
                title: "Great set with one minor issue",
                content: "The quality of these pots and pans is excellent. My only complaint is that the largest pot is a bit heavy when full. Otherwise, everything is perfect."
            },
            {
                name: "Jennifer Garcia",
                date: "2022-12-18",
                rating: 5,
                title: "Worth every penny",
                content: "After years of replacing cheap cookware, I finally invested in this set. What a difference! Everything cooks perfectly, and they still look brand new after months of use."
            }
        ],
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.6,
        reviewCount: 75,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["silver"],
        thumbnail: "https://cdn.pixabay.com/photo/2015/12/08/00/26/stainless-steel-1081753_1280.jpg",
        images: [
            "https://cdn.pixabay.com/photo/2015/12/08/00/26/stainless-steel-1081753_1280.jpg",
            "https://cdn.pixabay.com/photo/2014/10/22/16/38/ingredients-498199_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/09/16/11/43/kitchen-942881_1280.jpg"
        ],
        tags: ["kitchen", "cookware", "home", "cooking"]
    },
    {
        id: 9,
        name: "Leather Jacket",
        category: "clothing",
        brand: "designer",
        description: "Premium leather jacket with stylish design and comfortable fit.",
        price: 299.99,
        originalPrice: 349.99,
        rating: 4.5,
        reviewCount: 58,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["black", "brown"],
        sizes: ["S", "M", "L", "XL"],
        thumbnail: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["jacket", "leather", "fashion", "outerwear"]
    },
    {
        id: 10,
        name: "Smart Speaker",
        category: "electronics",
        brand: "amazon",
        description: "Voice-controlled smart speaker with integrated virtual assistant.",
        price: 99.99,
        originalPrice: 129.99,
        rating: 4.3,
        reviewCount: 94,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["black", "white", "gray"],
        thumbnail: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558888401-3cc1de77652d?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512446816042-444d641267d4?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["speaker", "smart home", "voice control", "tech"]
    },
    {
        id: 11,
        name: "Premium Skincare Set",
        category: "beauty",
        brand: "luxury",
        description: "Complete skincare set with cleanser, toner, moisturizer, and serum.",
        price: 149.99,
        originalPrice: 179.99,
        rating: 4.7,
        reviewCount: 63,
        isNew: true,
        onSale: false,
        inStock: true,
        colors: [],
        thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1590393802688-ab3fdbe06a37?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1601049413574-757f0739d3e0?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["skincare", "beauty", "self-care", "facial"]
    },
    {
        id: 12,
        name: "Yoga Mat",
        category: "sports",
        brand: "fitness",
        description: "Non-slip yoga mat with excellent cushioning for comfortable practice.",
        price: 39.99,
        originalPrice: 49.99,
        rating: 4.4,
        reviewCount: 82,
        isNew: false,
        onSale: true,
        inStock: true,
        colors: ["blue", "purple", "green"],
        thumbnail: "https://images.unsplash.com/photo-1558017487-06bf9f82613a?q=80&w=300&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1558017487-06bf9f82613a?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596357395217-80de13130e92?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"
        ],
        tags: ["yoga", "fitness", "exercise", "sports"]
    }
];

// Cart Functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Make products array globally available
window.products = products;

function updateCartCount() {
    // Use the shopEase version of updateCartCount
    if (window.shopEase && window.shopEase.updateCartCount) {
        window.shopEase.updateCartCount();
    } else {
        console.warn('shopEase.updateCartCount function not available');
    }
}

function saveCart() {
    // Use the shopEase version of saveCart
    if (window.shopEase && window.shopEase.saveCart) {
        window.shopEase.saveCart(cart);
    } else {
        console.warn('shopEase.saveCart function not available');
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

function addToCart(productId, quantity = 1, color = null, size = null) {
    // Use the shopEase version of addToCart if available
    if (window.shopEase && window.shopEase.addToCart) {
        return window.shopEase.addToCart(productId, quantity, color, size);
    }
    
    // Fallback to local implementation
    console.warn('shopEase.addToCart function not available, using local implementation');
    
    const product = products.find(p => p.id === productId);
    
    if (!product) return false;
    
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.color === color && 
        item.size === size
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            thumbnail: product.thumbnail,
            quantity,
            color,
            size
        });
    }
    
    // Log the cart to console for debugging
    console.log('Cart after adding item:', cart);
    
    saveCart();
    
    // Show confirmation message
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>${product.name} added to cart</p>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }, 10);
    
    return true;
}

// Product Card Generation
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Calculate discount percentage
    let discountPercentage = '';
    if (product.onSale && product.originalPrice > product.price) {
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        discountPercentage = `${discount}% OFF`;
    }
    
    // Generate stars for rating
    const stars = generateStars(product.rating);
    
    // Use a default image URL as fallback
    const defaultImageUrl = "https://via.placeholder.com/300x300?text=Product+Image";
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.thumbnail}" alt="${product.name}" 
                 onerror="this.onerror=null; this.src='${defaultImageUrl}'; console.log('Error loading image for ${product.name}, using fallback');">
            ${product.isNew ? '<span class="product-badge badge-new">New</span>' : ''}
            ${product.onSale ? '<span class="product-badge badge-sale">Sale</span>' : ''}
            <div class="product-wishlist">
                <i class="far fa-heart"></i>
            </div>
        </div>
        <div class="product-details">
            <span class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
            <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-count">(${product.reviewCount})</span>
            </div>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice > product.price ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-action">
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="btn-icon quick-view" data-id="${product.id}"><i class="fas fa-eye"></i></button>
            </div>
        </div>
    `;
    
    // Add event listeners
    card.querySelector('.add-to-cart').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'), 10);
        console.log("Add to cart clicked for product ID:", productId);
        
        // Use shopEase.addToCart if available
        if (window.shopEase && typeof window.shopEase.addToCart === 'function') {
            window.shopEase.addToCart(productId, 1);
        } else {
            console.warn("Using local addToCart function because shopEase.addToCart is not available");
            addToCart(productId, 1);
        }
    });
    
    card.querySelector('.quick-view').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        // Here you would implement a quick view modal
        window.location.href = `product-details.html?id=${productId}`;
    });
    
    card.querySelector('.product-wishlist').addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.querySelector('i').className = 'fas fa-heart';
        } else {
            this.querySelector('i').className = 'far fa-heart';
        }
    });
    
    return card;
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

// Product Filtering and Sorting
function filterProducts(filters = {}) {
    return products.filter(product => {
        // Filter by category
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(product.category)) {
                return false;
            }
        }
        
        // Filter by brand
        if (filters.brands && filters.brands.length > 0) {
            if (!filters.brands.includes(product.brand)) {
                return false;
            }
        }
        
        // Filter by price range
        if (filters.minPrice !== undefined && product.price < filters.minPrice) {
            return false;
        }
        
        if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
            return false;
        }
        
        // Filter by rating
        if (filters.rating && product.rating < filters.rating) {
            return false;
        }
        
        // Filter by search term
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase();
            const nameMatch = product.name.toLowerCase().includes(searchTerm);
            const descriptionMatch = product.description.toLowerCase().includes(searchTerm);
            const categoryMatch = product.category.toLowerCase().includes(searchTerm);
            const brandMatch = product.brand.toLowerCase().includes(searchTerm);
            const tagsMatch = product.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            if (!(nameMatch || descriptionMatch || categoryMatch || brandMatch || tagsMatch)) {
                return false;
            }
        }
        
        return true;
    });
}

function sortProducts(products, sortOption) {
    const sortedProducts = [...products];
    
    switch (sortOption) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Default sorting (Featured: based on rating and newness)
            sortedProducts.sort((a, b) => {
                const scoreA = (a.rating * 10) + (a.isNew ? 5 : 0);
                const scoreB = (b.rating * 10) + (b.isNew ? 5 : 0);
                return scoreB - scoreA;
            });
    }
    
    return sortedProducts;
}

// Initialize Page Based on URL
function initializePage() {
    // Update cart count
    updateCartCount();
    
    // Check if we're on the product listing page
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        initializeProductsPage();
    }
    
    // Check if we're on the homepage
    const featuredProducts = document.getElementById('featured-products');
    if (featuredProducts) {
        initializeHomePage();
    }
}

function initializeHomePage() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    // Display top 4 products (sorted by rating)
    const topProducts = sortProducts(products, 'default').slice(0, 4);
    
    topProducts.forEach(product => {
        featuredProductsContainer.appendChild(createProductCard(product));
    });
}

function initializeProductsPage() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Initialize filters from URL
    const initialFilters = {};
    if (categoryParam) {
        initialFilters.categories = [categoryParam];
        
        // Check category checkboxes
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    // Display products with initial filters
    displayProducts(initialFilters);
    
    // Set up filter and sort functionality
    setupFiltersAndSort();
}

function displayProducts(filters = {}, sortOption = 'default', page = 1) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Clear existing products
    productsGrid.innerHTML = '';
    
    // Filter and sort products
    let filteredProducts = filterProducts(filters);
    const sortedProducts = sortProducts(filteredProducts, sortOption);
    
    // Pagination
    const productsPerPage = 8;
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
    
    // Update pagination UI
    updatePagination(page, totalPages);
    
    // Display products
    if (paginatedProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products match your criteria. Please try different filters.</div>';
        return;
    }
    
    paginatedProducts.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
}

function updatePagination(currentPage, totalPages) {
    const pageNumbers = document.getElementById('page-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (!pageNumbers || !prevButton || !nextButton) return;
    
    // Update page numbers text
    document.querySelector('.current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
    
    // Update button states
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    
    // Add event listeners to pagination buttons
    prevButton.onclick = function() {
        if (currentPage > 1) {
            const filters = getCurrentFilters();
            const sortOption = document.getElementById('sort-select').value;
            displayProducts(filters, sortOption, currentPage - 1);
        }
    };
    
    nextButton.onclick = function() {
        if (currentPage < totalPages) {
            const filters = getCurrentFilters();
            const sortOption = document.getElementById('sort-select').value;
            displayProducts(filters, sortOption, currentPage + 1);
        }
    };
}

function setupFiltersAndSort() {
    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const filters = getCurrentFilters();
            displayProducts(filters, this.value);
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            const filters = getCurrentFilters();
            filters.search = searchInput.value;
            displayProducts(filters, document.getElementById('sort-select').value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const filters = getCurrentFilters();
                filters.search = searchInput.value;
                displayProducts(filters, document.getElementById('sort-select').value);
            }
        });
    }
    
    // Price range sliders
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    
    if (priceMin && priceMax && priceMinValue && priceMaxValue) {
        priceMin.addEventListener('input', function() {
            priceMinValue.textContent = this.value;
            if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
                priceMax.value = priceMin.value;
                priceMaxValue.textContent = priceMax.value;
            }
        });
        
        priceMax.addEventListener('input', function() {
            priceMaxValue.textContent = this.value;
            if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
                priceMin.value = priceMax.value;
                priceMinValue.textContent = priceMin.value;
            }
        });
    }
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const filters = getCurrentFilters();
            displayProducts(filters, document.getElementById('sort-select').value);
        });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            resetFilters();
            displayProducts({}, document.getElementById('sort-select').value);
        });
    }
}

function getCurrentFilters() {
    const filters = {};
    
    // Category filters
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
    if (categoryCheckboxes.length > 0) {
        filters.categories = Array.from(categoryCheckboxes).map(cb => cb.value);
    }
    
    // Brand filters
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]:checked');
    if (brandCheckboxes.length > 0) {
        filters.brands = Array.from(brandCheckboxes).map(cb => cb.value);
    }
    
    // Price range
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    if (priceMin && priceMax) {
        filters.minPrice = parseInt(priceMin.value);
        filters.maxPrice = parseInt(priceMax.value);
    }
    
    // Rating filter
    const ratingCheckboxes = document.querySelectorAll('input[name="rating"]:checked');
    if (ratingCheckboxes.length > 0) {
        // Get the minimum rating from selected checkboxes
        filters.rating = Math.min(...Array.from(ratingCheckboxes).map(cb => parseInt(cb.value)));
    }
    
    // Search term
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim() !== '') {
        filters.search = searchInput.value;
    }
    
    return filters;
}

function resetFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset price range
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    
    if (priceMin && priceMax && priceMinValue && priceMaxValue) {
        priceMin.value = 0;
        priceMax.value = 1000;
        priceMinValue.textContent = '0';
        priceMaxValue.textContent = '1000';
    }
    
    // Clear search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Run initialization on page load
document.addEventListener('DOMContentLoaded', initializePage);

// Export functions and data for other scripts
window.shopEase = {
    products,
    cart,
    addToCart,
    updateCartCount,
    saveCart,
    createProductCard,
    filterProducts,
    sortProducts
};

// Dispatch event to notify other scripts that products are loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Products loaded:', products.length);
    const event = new Event('productsLoaded');
    window.dispatchEvent(event);
}); 