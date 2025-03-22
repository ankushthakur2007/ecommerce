// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout page
    initializeCheckoutPage();
    
    // Update cart count
    window.shopEase?.updateCartCount();
});

function initializeCheckoutPage() {
    // Get cart from localStorage
    const cart = window.shopEase?.cart || [];
    
    // If cart is empty, redirect to cart page
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Set up checkout steps
    setupCheckoutSteps();
    
    // Display order summary
    updateOrderSummary(cart);
    
    // Set up form validation
    setupFormValidation();
    
    // Set up payment method selection
    setupPaymentMethods();
    
    // Add event listener for place order button
    const placeOrderBtn = document.querySelector('#place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handlePlaceOrder();
        });
    }
}

function setupCheckoutSteps() {
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    const checkoutForms = document.querySelectorAll('.checkout-form');
    
    if (!checkoutSteps.length || !checkoutForms.length) return;
    
    // Show the first form initially
    checkoutForms[0].classList.add('active');
    checkoutSteps[0].classList.add('active');
    
    // Add click event to step links
    checkoutSteps.forEach((step, index) => {
        const stepLink = step.querySelector('.step-link');
        
        if (stepLink) {
            stepLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Only allow clicking on completed steps or the next step
                if (step.classList.contains('completed') || step.classList.contains('active')) {
                    // Hide all forms
                    checkoutForms.forEach(form => form.classList.remove('active'));
                    
                    // Show selected form
                    checkoutForms[index].classList.add('active');
                    
                    // Update active state
                    checkoutSteps.forEach(s => s.classList.remove('active'));
                    step.classList.add('active');
                }
            });
        }
    });
    
    // Add event listeners to next/prev buttons
    const nextButtons = document.querySelectorAll('.btn-next-step');
    const prevButtons = document.querySelectorAll('.btn-prev-step');
    
    nextButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate the current form
            if (validateForm(checkoutForms[index])) {
                // Mark current step as completed
                checkoutSteps[index].classList.add('completed');
                
                // Hide current form
                checkoutForms[index].classList.remove('active');
                
                // Show next form
                checkoutForms[index + 1].classList.add('active');
                
                // Update active state
                checkoutSteps[index].classList.remove('active');
                checkoutSteps[index + 1].classList.add('active');
                
                // Scroll to top
                window.scrollTo(0, 0);
            }
        });
    });
    
    prevButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the current form index (prev button is in the next form)
            const currentIndex = index + 1;
            
            // Hide current form
            checkoutForms[currentIndex].classList.remove('active');
            
            // Show previous form
            checkoutForms[currentIndex - 1].classList.add('active');
            
            // Update active state
            checkoutSteps[currentIndex].classList.remove('active');
            checkoutSteps[currentIndex - 1].classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });
}

function updateOrderSummary(cart) {
    const orderSummary = document.querySelector('.order-summary');
    if (!orderSummary) return;
    
    // Calculate cart totals
    const cartTotal = calculateCartTotal(cart);
    
    // Create order items HTML
    let orderItemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        orderItemsHTML += `
            <div class="order-item">
                <div class="order-item-img">
                    <img src="${item.thumbnail}" alt="${item.name}">
                    <span class="item-quantity">${item.quantity}</span>
                </div>
                <div class="order-item-details">
                    <h4 class="item-name">${item.name}</h4>
                    ${item.color ? `<p class="item-variant">Color: ${item.color}</p>` : ''}
                    ${item.size ? `<p class="item-variant">Size: ${item.size}</p>` : ''}
                </div>
                <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    // Update order summary HTML
    orderSummary.innerHTML = `
        <div class="summary-header">
            <h3>Order Summary</h3>
            <span class="items-count">${cart.length} items</span>
        </div>
        
        <div class="order-items">
            ${orderItemsHTML}
        </div>
        
        <div class="summary-totals">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${cartTotal.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${cartTotal.shipping > 0 ? `$${cartTotal.shipping.toFixed(2)}` : 'Free'}</span>
            </div>
            ${cartTotal.discount > 0 ? `
            <div class="summary-row discount">
                <span>Discount:</span>
                <span>-$${cartTotal.discount.toFixed(2)}</span>
            </div>` : ''}
            <div class="summary-row">
                <span>Tax:</span>
                <span>$${cartTotal.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${cartTotal.total.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="order-buttons mobile-only">
            <button id="place-order-btn-mobile" class="btn btn-primary btn-block">Place Order</button>
        </div>
    `;
    
    // Add event listener for mobile place order button
    const placeOrderBtnMobile = document.querySelector('#place-order-btn-mobile');
    if (placeOrderBtnMobile) {
        placeOrderBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
            handlePlaceOrder();
        });
    }
}

function calculateCartTotal(cart) {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping (free for orders over $50)
    const shipping = subtotal > 50 ? 0 : 5.99;
    
    // Get discount from localStorage (if exists)
    const discount = parseFloat(localStorage.getItem('cartDiscount') || 0);
    
    // Calculate tax (assume 8% tax rate)
    const taxRate = 0.08;
    const tax = (subtotal - discount) * taxRate;
    
    // Calculate total
    const total = subtotal + shipping - discount + tax;
    
    return {
        subtotal,
        shipping,
        discount,
        tax,
        total
    };
}

function setupFormValidation() {
    // Add event listeners to all required inputs
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            // If the input already has the error class, validate on input to provide immediate feedback
            if (this.classList.contains('input-error')) {
                validateInput(this);
            }
        });
    });
    
    // Special handling for email validation
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
        
        emailInput.addEventListener('input', function() {
            if (this.classList.contains('input-error')) {
                validateEmail(this);
            }
        });
    }
    
    // Credit card validation
    const cardNumberInput = document.querySelector('#card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            // Format the card number as the user types
            this.value = formatCardNumber(this.value);
            
            if (this.classList.contains('input-error')) {
                validateCardNumber(this);
            }
        });
        
        cardNumberInput.addEventListener('blur', function() {
            validateCardNumber(this);
        });
    }
    
    const cardExpiryInput = document.querySelector('#card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            // Format the expiry date as MM/YY
            this.value = formatExpiryDate(this.value);
            
            if (this.classList.contains('input-error')) {
                validateExpiryDate(this);
            }
        });
        
        cardExpiryInput.addEventListener('blur', function() {
            validateExpiryDate(this);
        });
    }
    
    const cardCvvInput = document.querySelector('#card-cvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', function() {
            // Limit to 3 or 4 digits
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
            
            if (this.classList.contains('input-error')) {
                validateCvv(this);
            }
        });
        
        cardCvvInput.addEventListener('blur', function() {
            validateCvv(this);
        });
    }
}

function validateForm(form) {
    let isValid = true;
    
    // Validate all required inputs in the form
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    
    requiredInputs.forEach(input => {
        if (input.type === 'email') {
            if (!validateEmail(input)) {
                isValid = false;
            }
        } else if (input.id === 'card-number') {
            if (!validateCardNumber(input)) {
                isValid = false;
            }
        } else if (input.id === 'card-expiry') {
            if (!validateExpiryDate(input)) {
                isValid = false;
            }
        } else if (input.id === 'card-cvv') {
            if (!validateCvv(input)) {
                isValid = false;
            }
        } else {
            if (!validateInput(input)) {
                isValid = false;
            }
        }
    });
    
    // Check if the payment method is selected in the payment form
    if (form.id === 'payment-form') {
        const selectedPaymentMethod = form.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
            showInputError(form.querySelector('.payment-methods'), 'Please select a payment method');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateInput(input) {
    if (input.value.trim() === '') {
        showInputError(input, 'This field is required');
        return false;
    } else {
        clearInputError(input);
        return true;
    }
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (input.value.trim() === '') {
        showInputError(input, 'Email is required');
        return false;
    } else if (!emailRegex.test(input.value)) {
        showInputError(input, 'Please enter a valid email address');
        return false;
    } else {
        clearInputError(input);
        return true;
    }
}

function validateCardNumber(input) {
    // Remove spaces for validation
    const cardNumber = input.value.replace(/\s/g, '');
    
    if (cardNumber === '') {
        showInputError(input, 'Card number is required');
        return false;
    } else if (!/^\d{13,19}$/.test(cardNumber)) {
        showInputError(input, 'Please enter a valid card number');
        return false;
    } else {
        clearInputError(input);
        return true;
    }
}

function validateExpiryDate(input) {
    const expiryDate = input.value.trim();
    
    if (expiryDate === '') {
        showInputError(input, 'Expiry date is required');
        return false;
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showInputError(input, 'Please enter a valid date (MM/YY)');
        return false;
    } else {
        // Check if the date is in the future
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
        const currentMonth = currentDate.getMonth() + 1; // Jan is 0
        
        if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showInputError(input, 'Card is expired');
            return false;
        } else if (parseInt(month) < 1 || parseInt(month) > 12) {
            showInputError(input, 'Month must be between 01 and 12');
            return false;
        } else {
            clearInputError(input);
            return true;
        }
    }
}

function validateCvv(input) {
    const cvv = input.value.trim();
    
    if (cvv === '') {
        showInputError(input, 'Security code is required');
        return false;
    } else if (!/^\d{3,4}$/.test(cvv)) {
        showInputError(input, 'Please enter a valid security code');
        return false;
    } else {
        clearInputError(input);
        return true;
    }
}

function formatCardNumber(value) {
    // Remove all non-digits
    const cardNumber = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formattedValue = '';
    for (let i = 0; i < cardNumber.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += cardNumber[i];
    }
    
    return formattedValue;
}

function formatExpiryDate(value) {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digitsOnly.length <= 2) {
        return digitsOnly;
    } else {
        return `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`;
    }
}

function showInputError(input, message) {
    input.classList.add('input-error');
    
    // Find the error message element or create a new one
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
}

function clearInputError(input) {
    input.classList.remove('input-error');
    
    // Remove the error message if it exists
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
    }
}

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const paymentForms = document.querySelectorAll('.payment-form-content');
    
    if (!paymentMethods.length || !paymentForms.length) return;
    
    // Show the form for the selected payment method
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment forms
            paymentForms.forEach(form => form.classList.remove('active'));
            
            // Show the selected form
            const selectedForm = document.querySelector(`.payment-form-content.${this.value}`);
            if (selectedForm) {
                selectedForm.classList.add('active');
            }
            
            // Clear any error message
            const paymentMethodsContainer = document.querySelector('.payment-methods');
            clearInputError(paymentMethodsContainer);
        });
    });
}

function handlePlaceOrder() {
    // Validate all forms
    const shippingForm = document.getElementById('shipping-form');
    const billingForm = document.getElementById('billing-form');
    const paymentForm = document.getElementById('payment-form');
    
    if (!validateForm(shippingForm)) {
        // Show the shipping form
        showCheckoutForm(0);
        return;
    }
    
    if (!validateForm(billingForm)) {
        // Show the billing form
        showCheckoutForm(1);
        return;
    }
    
    if (!validateForm(paymentForm)) {
        // Show the payment form
        showCheckoutForm(2);
        return;
    }
    
    // If all forms are valid, process the order
    processOrder();
}

function showCheckoutForm(index) {
    const checkoutForms = document.querySelectorAll('.checkout-form');
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    
    if (!checkoutForms.length || !checkoutSteps.length) return;
    
    // Hide all forms
    checkoutForms.forEach(form => form.classList.remove('active'));
    
    // Show the form at the specified index
    checkoutForms[index].classList.add('active');
    
    // Update active state for steps
    checkoutSteps.forEach(step => step.classList.remove('active'));
    checkoutSteps[index].classList.add('active');
    
    // Scroll to the top of the form
    window.scrollTo(0, 0);
}

function processOrder() {
    // Show loading overlay
    showOrderProcessing();
    
    // Simulate processing delay
    setTimeout(function() {
        // Clear cart
        window.shopEase.cart = [];
        window.shopEase.saveCart();
        
        // Clear any applied discount
        localStorage.removeItem('cartDiscount');
        
        // Redirect to success page
        // In a real application, you would submit the order to a server
        // and redirect after receiving a successful response
        window.location.href = 'order-success.html';
    }, 2000);
}

function showOrderProcessing() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'processing-overlay';
    overlay.innerHTML = `
        <div class="processing-content">
            <div class="spinner"></div>
            <h2>Processing your order...</h2>
            <p>Please don't close this page. You'll be redirected once your order is complete.</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(overlay);
    
    // Block scrolling
    document.body.style.overflow = 'hidden';
}

// Initialize shipping address fields from localStorage if available
function initializeAddressFields() {
    const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    
    // Fill in shipping form
    if (savedAddress.firstName) {
        document.getElementById('shipping-first-name').value = savedAddress.firstName;
    }
    
    if (savedAddress.lastName) {
        document.getElementById('shipping-last-name').value = savedAddress.lastName;
    }
    
    if (savedAddress.email) {
        document.getElementById('shipping-email').value = savedAddress.email;
    }
    
    if (savedAddress.address) {
        document.getElementById('shipping-address').value = savedAddress.address;
    }
    
    if (savedAddress.city) {
        document.getElementById('shipping-city').value = savedAddress.city;
    }
    
    if (savedAddress.state) {
        document.getElementById('shipping-state').value = savedAddress.state;
    }
    
    if (savedAddress.zipCode) {
        document.getElementById('shipping-zip').value = savedAddress.zipCode;
    }
    
    if (savedAddress.country) {
        document.getElementById('shipping-country').value = savedAddress.country;
    }
}

// Add Event listener for the "Same as shipping address" checkbox
document.addEventListener('DOMContentLoaded', function() {
    const sameAsShippingCheckbox = document.getElementById('same-as-shipping');
    
    if (sameAsShippingCheckbox) {
        sameAsShippingCheckbox.addEventListener('change', function() {
            const billingAddressFields = document.querySelector('.billing-address-fields');
            
            if (this.checked) {
                // Hide billing address fields
                billingAddressFields.classList.add('hidden');
                
                // Copy shipping address values to billing fields
                copyShippingToBilling();
            } else {
                // Show billing address fields
                billingAddressFields.classList.remove('hidden');
            }
        });
    }
    
    // Initialize address fields
    initializeAddressFields();
});

function copyShippingToBilling() {
    // Get shipping form values
    const shippingFirstName = document.getElementById('shipping-first-name').value;
    const shippingLastName = document.getElementById('shipping-last-name').value;
    const shippingAddress = document.getElementById('shipping-address').value;
    const shippingCity = document.getElementById('shipping-city').value;
    const shippingState = document.getElementById('shipping-state').value;
    const shippingZip = document.getElementById('shipping-zip').value;
    const shippingCountry = document.getElementById('shipping-country').value;
    
    // Set billing form values
    document.getElementById('billing-first-name').value = shippingFirstName;
    document.getElementById('billing-last-name').value = shippingLastName;
    document.getElementById('billing-address').value = shippingAddress;
    document.getElementById('billing-city').value = shippingCity;
    document.getElementById('billing-state').value = shippingState;
    document.getElementById('billing-zip').value = shippingZip;
    document.getElementById('billing-country').value = shippingCountry;
} 