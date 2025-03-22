/**
 * Utility functions for the e-commerce website
 */

// Format currency values
function formatCurrency(amount, currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2
    }).format(amount);
}

// Format dates
function formatDate(dateString, format = 'long') {
    const date = new Date(dateString);
    
    if (format === 'long') {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        }).format(date);
    } else if (format === 'short') {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
        }).format(date);
    } else if (format === 'relative') {
        // Return relative time (e.g., "2 days ago")
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        }
    }
    
    return date.toLocaleDateString();
}

// Debounce function to limit function calls
function debounce(func, wait, immediate) {
    let timeout;
    
    return function() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

// Throttle function to limit function calls
function throttle(func, limit) {
    let inThrottle;
    
    return function() {
        const context = this;
        const args = arguments;
        
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Get URL parameters as an object
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queryParams = queryString.split('&');
    
    for (let i = 0; i < queryParams.length; i++) {
        const pair = queryParams[i].split('=');
        
        if (pair[0] && pair[1]) {
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }
    
    return params;
}

// Cookie functions
const Cookies = {
    // Set a cookie
    set: function(name, value, days = 7, path = '/') {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
    },
    
    // Get a cookie
    get: function(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    },
    
    // Delete a cookie
    delete: function(name, path = '/') {
        this.set(name, '', -1, path);
    }
};

// Local Storage wrapper
const Storage = {
    // Set an item
    set: function(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (e) {
            console.error('Error storing item in localStorage:', e);
            return false;
        }
    },
    
    // Get an item
    get: function(key, defaultValue = null) {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return defaultValue;
            }
            return JSON.parse(serializedValue);
        } catch (e) {
            console.error('Error retrieving item from localStorage:', e);
            return defaultValue;
        }
    },
    
    // Remove an item
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing item from localStorage:', e);
            return false;
        }
    },
    
    // Clear all items
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// Form validation
const Validator = {
    // Check if a string is empty
    isEmpty: function(value) {
        return value.trim() === '';
    },
    
    // Check if a value is a valid email
    isEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Check if a value is a valid URL
    isURL: function(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    },
    
    // Check if a value is a valid phone number
    isPhone: function(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    },
    
    // Check if a value is a valid credit card
    isCreditCard: function(cardNumber) {
        // Remove all spaces and dashes
        cardNumber = cardNumber.replace(/[\s-]/g, '');
        
        // Check if it's a valid length and only contains digits
        if (!/^\d{13,19}$/.test(cardNumber)) return false;
        
        // Luhn algorithm (checksum)
        let sum = 0;
        let shouldDouble = false;
        
        // Loop through each digit from right to left
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return sum % 10 === 0;
    },
    
    // Validate form based on rules
    validateForm: function(formData, rules) {
        const errors = {};
        
        for (const field in rules) {
            const value = formData[field] || '';
            const fieldRules = rules[field];
            
            // Required check
            if (fieldRules.required && this.isEmpty(value.toString())) {
                errors[field] = fieldRules.requiredMessage || 'This field is required';
                continue;
            }
            
            // Skip other validations if field is empty and not required
            if (this.isEmpty(value.toString()) && !fieldRules.required) {
                continue;
            }
            
            // Email check
            if (fieldRules.email && !this.isEmail(value)) {
                errors[field] = fieldRules.emailMessage || 'Please enter a valid email address';
                continue;
            }
            
            // URL check
            if (fieldRules.url && !this.isURL(value)) {
                errors[field] = fieldRules.urlMessage || 'Please enter a valid URL';
                continue;
            }
            
            // Phone check
            if (fieldRules.phone && !this.isPhone(value)) {
                errors[field] = fieldRules.phoneMessage || 'Please enter a valid phone number';
                continue;
            }
            
            // Credit card check
            if (fieldRules.creditCard && !this.isCreditCard(value)) {
                errors[field] = fieldRules.creditCardMessage || 'Please enter a valid credit card number';
                continue;
            }
            
            // Min length check
            if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = fieldRules.minLengthMessage || `This field must be at least ${fieldRules.minLength} characters`;
                continue;
            }
            
            // Max length check
            if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = fieldRules.maxLengthMessage || `This field cannot exceed ${fieldRules.maxLength} characters`;
                continue;
            }
            
            // Pattern check
            if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
                errors[field] = fieldRules.patternMessage || 'This field has an invalid format';
                continue;
            }
            
            // Custom validator
            if (fieldRules.validator && typeof fieldRules.validator === 'function') {
                const isValid = fieldRules.validator(value);
                if (!isValid) {
                    errors[field] = fieldRules.validatorMessage || 'This field is invalid';
                    continue;
                }
            }
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }
};

// Generate a random ID
function generateId(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Export utilities
window.ShopUtils = {
    formatCurrency,
    formatDate,
    debounce,
    throttle,
    getUrlParams,
    Cookies,
    Storage,
    Validator,
    generateId,
    truncateText
}; 