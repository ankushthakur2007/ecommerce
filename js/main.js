// Main JavaScript file for general site functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize sticky header
    initStickyHeader();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize animate on scroll
    initAOS();
    
    // Update cart count on page load if shopEase global object exists
    window.shopEase?.updateCartCount();
    
    // Initialize search
    initSearch();
});

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu');
    const overlay = document.querySelector('.overlay');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
        if (overlay) overlay.classList.add('active');
    });
    
    // Close mobile menu
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    // Close menu when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            this.classList.remove('active');
        });
    }
    
    // Submenu toggle
    const hasSubmenu = document.querySelectorAll('.has-submenu');
    
    hasSubmenu.forEach(item => {
        const submenuToggle = item.querySelector('.submenu-toggle');
        if (submenuToggle) {
            submenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.closest('.has-submenu');
                parent.classList.toggle('submenu-open');
                
                // Close other open submenus
                hasSubmenu.forEach(el => {
                    if (el !== parent && el.classList.contains('submenu-open')) {
                        el.classList.remove('submenu-open');
                    }
                });
            });
        }
    });
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 100; // Scroll amount before header becomes sticky
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            header.classList.add('sticky');
            
            // Hide header when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                header.classList.add('hide');
            } else {
                // Scrolling up
                header.classList.remove('hide');
            }
        } else {
            header.classList.remove('sticky', 'hide');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animate on Scroll
function initAOS() {
    // Elements that should animate when they become visible
    const animateElements = document.querySelectorAll('.animate');
    
    if (!animateElements.length) return;
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to add animation classes when elements come into view
    function checkAnimations() {
        animateElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('animated');
                }, delay);
            }
        });
    }
    
    // Check animations on page load
    checkAnimations();
    
    // Check animations on scroll
    window.addEventListener('scroll', checkAnimations);
}

// Search Functionality
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchToggle || !searchForm) return;
    
    // Open search
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchForm.classList.add('active');
        searchOverlay.classList.add('active');
        document.body.classList.add('search-open');
        
        // Focus on search input
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
    });
    
    // Close search
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchForm.classList.remove('active');
            searchOverlay.classList.remove('active');
            document.body.classList.remove('search-open');
        });
    }
    
    // Close search when clicking on overlay
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function() {
            searchForm.classList.remove('active');
            this.classList.remove('active');
            document.body.classList.remove('search-open');
        });
    }
    
    // Search form submission
    searchForm.addEventListener('submit', function(e) {
        if (searchInput && searchInput.value.trim() === '') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Newsletter Subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput) return;
            
            const email = emailInput.value.trim();
            
            // Validate email
            if (email === '') {
                showToast('Please enter your email address', 'error');
                emailInput.focus();
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                emailInput.focus();
                return;
            }
            
            // In a real application, you would submit the email to a server
            // This is just a simulation
            setTimeout(() => {
                showToast('Thank you for subscribing!', 'success');
                emailInput.value = '';
            }, 1000);
        });
    }
});

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
        
        // Auto-hide toast after 5 seconds
        const hideTimeout = setTimeout(() => {
            hideToast(toast);
        }, 5000);
        
        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                clearTimeout(hideTimeout);
                hideToast(toast);
            });
        }
    }, 10);
}

function hideToast(toast) {
    toast.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Product Quick View
function openQuickView(productId) {
    // Find product in the products array
    const product = window.shopEase?.products.find(p => p.id === productId);
    if (!product) return;
    
    // Create modal content
    const modalContent = `
        <div class="quickview-content">
            <div class="row">
                <div class="col-md-6">
                    <div class="product-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="product-info">
                        <h2 class="product-title">${product.name}</h2>
                        <div class="product-rating">
                            ${generateStars(product.rating)}
                            <span class="rating-count">(${product.reviewCount} reviews)</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice > product.price ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="product-description short">
                            <p>${product.description}</p>
                        </div>
                        <div class="product-action">
                            <button class="btn btn-primary btn-add-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <a href="product-details.html?id=${product.id}" class="btn btn-outline">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create modal
    showModal('Product Quick View', modalContent, 'modal-lg');
    
    // Add event listener for add to cart button
    const addToCartBtn = document.querySelector('.modal .btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            window.shopEase?.addToCart(productId);
            closeModal();
        });
    }
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

// Modal functionality
function showModal(title, content, modalClass = '') {
    // Remove any existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = `modal ${modalClass}`;
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">${title}</h4>
                    <button type="button" class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
        <div class="modal-backdrop"></div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Prevent body scrolling
    document.body.classList.add('modal-open');
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', closeModal);
    }
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Add keyboard event listener for Escape key
    document.addEventListener('keydown', handleEscapeKey);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    
    // Hide modal with animation
    modal.classList.remove('show');
    
    // Remove modal after animation
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
        
        // Allow body scrolling
        if (!document.querySelector('.modal')) {
            document.body.classList.remove('modal-open');
        }
    }, 300);
    
    // Remove keyboard event listener
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Slider functionality
class Slider {
    constructor(sliderSelector, options = {}) {
        this.slider = document.querySelector(sliderSelector);
        if (!this.slider) return;
        
        this.sliderTrack = this.slider.querySelector('.slider-track');
        this.slides = this.slider.querySelectorAll('.slide');
        this.nextBtn = this.slider.querySelector('.slider-next');
        this.prevBtn = this.slider.querySelector('.slider-prev');
        this.dots = this.slider.querySelector('.slider-dots');
        
        this.currentIndex = 0;
        this.slideWidth = 0;
        this.slidesCount = this.slides.length;
        
        this.options = {
            autoplay: options.autoplay || false,
            interval: options.interval || 5000,
            transitionDuration: options.transitionDuration || 400,
            dots: options.dots !== undefined ? options.dots : true,
            arrows: options.arrows !== undefined ? options.arrows : true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (this.slidesCount <= 1) return;
        
        // Set up slider
        this.setupSlider();
        
        // Create dots if enabled
        if (this.options.dots && this.dots) {
            this.createDots();
        }
        
        // Show/hide arrows based on options
        if (!this.options.arrows) {
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            if (this.prevBtn) this.prevBtn.style.display = 'none';
        }
        
        // Add event listeners
        this.addEventListeners();
        
        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    setupSlider() {
        // Calculate slider dimensions
        this.calculateDimensions();
        
        // Set initial position
        this.goToSlide(this.currentIndex);
        
        // Add resize listener
        window.addEventListener('resize', this.onResize.bind(this));
    }
    
    calculateDimensions() {
        // Get slider width
        this.slideWidth = this.slider.offsetWidth;
        
        // Set slides width
        this.slides.forEach(slide => {
            slide.style.width = `${this.slideWidth}px`;
        });
        
        // Set track width
        this.sliderTrack.style.width = `${this.slideWidth * this.slidesCount}px`;
    }
    
    createDots() {
        this.dots.innerHTML = '';
        
        for (let i = 0; i < this.slidesCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            if (i === this.currentIndex) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                
                if (this.options.autoplay) {
                    this.stopAutoplay();
                    this.startAutoplay();
                }
            });
            
            this.dots.appendChild(dot);
        }
    }
    
    updateDots() {
        if (!this.options.dots || !this.dots) return;
        
        const dots = this.dots.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    addEventListeners() {
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                
                if (this.options.autoplay) {
                    this.stopAutoplay();
                    this.startAutoplay();
                }
            });
        }
        
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                
                if (this.options.autoplay) {
                    this.stopAutoplay();
                    this.startAutoplay();
                }
            });
        }
        
        // Touch events for swipe
        this.slider.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        this.slider.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.slider.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
    }
    
    onResize() {
        this.calculateDimensions();
        this.goToSlide(this.currentIndex);
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.slidesCount;
        this.goToSlide(nextIndex);
    }
    
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slidesCount) % this.slidesCount;
        this.goToSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.sliderTrack.style.transition = `transform ${this.options.transitionDuration}ms ease`;
        this.sliderTrack.style.transform = `translateX(${-index * this.slideWidth}px)`;
        this.currentIndex = index;
        
        // Update dots
        this.updateDots();
        
        // Update slide classes
        this.updateSlideClasses();
    }
    
    updateSlideClasses() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('prev', 'active', 'next');
            
            if (index === this.currentIndex) {
                slide.classList.add('active');
            } else if (index === (this.currentIndex - 1 + this.slidesCount) % this.slidesCount) {
                slide.classList.add('prev');
            } else if (index === (this.currentIndex + 1) % this.slidesCount) {
                slide.classList.add('next');
            }
        });
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.options.interval);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    // Touch event handlers for swipe
    onTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.startTime = Date.now();
        
        this.sliderTrack.style.transition = 'none';
        
        if (this.options.autoplay) {
            this.stopAutoplay();
        }
    }
    
    onTouchMove(e) {
        if (!this.isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const diff = this.startX - currentX;
        
        this.sliderTrack.style.transform = `translateX(${-this.currentIndex * this.slideWidth - diff}px)`;
        
        // Prevent vertical scrolling if swiping horizontally
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    }
    
    onTouchEnd(e) {
        if (!this.isDragging) return;
        
        const currentX = e.changedTouches[0].clientX;
        const diff = this.startX - currentX;
        const duration = Date.now() - this.startTime;
        
        // Determine if swipe should trigger slide change
        const threshold = this.slideWidth * 0.2;
        const quickSwipe = duration < 250 && Math.abs(diff) > 30;
        
        if (diff > threshold || (diff > 0 && quickSwipe)) {
            this.next();
        } else if (diff < -threshold || (diff < 0 && quickSwipe)) {
            this.prev();
        } else {
            this.goToSlide(this.currentIndex);
        }
        
        this.isDragging = false;
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
}

// Initialize sliders on page load
document.addEventListener('DOMContentLoaded', function() {
    // Hero slider
    new Slider('.hero-slider', {
        autoplay: true,
        interval: 5000
    });
    
    // Featured products slider
    new Slider('.featured-products-slider', {
        autoplay: false
    });
});

// Make slider class available globally
window.Slider = Slider;

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Fix 100vh issue on mobile
    function setVhProperty() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set the --vh variable when the page loads
    setVhProperty();
    
    // Update the --vh variable when the window is resized
    window.addEventListener('resize', setVhProperty);
});

// Add touch detection
document.documentElement.className += (("ontouchstart" in document.documentElement) ? ' touch' : ' no-touch'); 