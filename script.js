//search bar functionality in materials

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const categories = document.querySelectorAll('.category');

    const filterMaterials = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        categories.forEach(section => {
            const cards = section.querySelectorAll('.card');
            let hasMatches = false;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                card.style.display = isVisible ? 'block' : 'none';
                
                if (isVisible) hasMatches = true;
            });

            // Show/hide entire category section
            section.style.display = hasMatches ? 'block' : 'none';
        });
    };

    searchButton.addEventListener('click', filterMaterials);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterMaterials();
    });
    searchInput.addEventListener('input', filterMaterials);

    // Clear search and show all when empty
    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') {
            categories.forEach(section => {
                section.style.display = 'block';
                section.querySelectorAll('.card').forEach(card => {
                    card.style.display = 'block';
                });
            });
        }
    });
});


// mobile toggle hamburger
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav');
    const searchInput = document.querySelector('.search-bar input');
    const categories = document.querySelectorAll('.category');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Search Functionality
    const filterMaterials = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();

        categories.forEach(section => {
            const cards = section.querySelectorAll('.card');
            let hasMatches = false;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                card.style.display = isVisible ? 'block' : 'none';
                
                if (isVisible) hasMatches = true;
            });

            section.style.display = hasMatches ? 'block' : 'none';
        });
    };

    const resetSearch = () => {
        categories.forEach(section => {
            section.style.display = 'block';
            section.querySelectorAll('.card').forEach(card => {
                card.style.display = 'block';
            });
        });
    };

    // Search Event Listeners
    searchInput.addEventListener('input', (e) => {
        e.target.value === '' ? resetSearch() : filterMaterials();
    });

    document.querySelector('.search-bar button').addEventListener('click', filterMaterials);
    searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && filterMaterials());
});


//Enhanced cart functionality with proper image extraction - NO DESCRIPTIONS
// Cart Management Script - script.js
let cart = JSON.parse(localStorage.getItem('constructionCart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('constructionCart', JSON.stringify(cart));
}

// Extract product data from card with improved image handling - NO DESCRIPTIONS
function extractProductData(cardElement) {
    const nameElement = cardElement.querySelector('h4');
    const costElement = cardElement.querySelector('.cost');
    const button = cardElement.querySelector('.add-to-cart');
    
    // Get the parent card to find the image
    const parentCard = cardElement.closest('.card');
    let imageUrl = '';
    
    // Try multiple methods to get the image
    if (parentCard) {
        // Method 1: Look for img element in the card
        const imgElement = parentCard.querySelector('img');
        if (imgElement) {
            imageUrl = imgElement.src;
        }
        
        // Method 2: Look for background image in card or card-image div
        if (!imageUrl) {
            const cardImage = parentCard.querySelector('.card-image') || parentCard;
            const bgImage = window.getComputedStyle(cardImage).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                // Extract URL from background-image: url("...")
                const urlMatch = bgImage.match(/url\(["']?([^"']*)["']?\)/);
                if (urlMatch) {
                    imageUrl = urlMatch[1];
                }
            }
        }
        
        // Method 3: Check for data-image attribute on button or card
        if (!imageUrl) {
            imageUrl = button?.dataset.image || parentCard.dataset.image || '';
        }
    }
    
    // Extract text content safely - ONLY NAME AND PRICE
    const name = nameElement ? nameElement.textContent.trim() : 'Unknown Product';
    const costText = costElement ? costElement.textContent : '0';
    const price = parseInt(costText.replace(/[^\d]/g, '')) || 0;
    
    // Generate unique ID
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return { 
        id, 
        name, 
        price, 
        image: imageUrl,
        quantity: 1 
    };
}

// Enhanced add to cart function
function addToCart(event) {
    event.preventDefault();
    
    const button = event.target.closest('.add-to-cart');
    if (!button) return;
    
    const cardContent = button.closest('.card-content') || button.closest('.card');
    if (!cardContent) return;
    
    const productData = extractProductData(cardContent);
    
    // Validate product data
    if (!productData.name || productData.price <= 0) {
        showNotification('Error: Invalid product data', true);
        return;
    }
    
    // Check if item exists in cart
    const existingItem = cart.find(item => item.id === productData.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${productData.name} quantity updated in cart`);
    } else {
        cart.push(productData);
        showNotification(`${productData.name} added to cart`);
    }
    
    saveCart();
    updateCartCounter();
    showButtonFeedback(button);
}

// Update cart counter
function updateCartCounter() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Button feedback
function showButtonFeedback(button) {
    const originalText = button.innerHTML;
    const originalBg = button.style.backgroundColor;
    
    button.innerHTML = '✓ Added!';
    button.style.backgroundColor = '#4CAF50';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = originalBg;
        button.disabled = false;
    }, 1500);
}

// Show notification (similar to cart page)
function showNotification(message, isError = false) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        notification.innerHTML = '<span id="notification-message"></span>';
        document.body.appendChild(notification);
        
        // Add basic styles if not present
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1001;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.error {
                background: #FF6B6B;
            }
        `;
        document.head.appendChild(style);
    }
    
    const messageElement = document.getElementById('notification-message');
    messageElement.textContent = message;
    
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Go to cart page
function goToCart() {
    window.location.href = 'Cart.html';
}

// Quick view cart function (optional)
function quickViewCart() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    let cartSummary = 'Cart Contents:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartSummary += `${item.name} x${item.quantity} - sh ${itemTotal.toLocaleString()}\n`;
        total += itemTotal;
    });
    
    cartSummary += `\nTotal: sh ${total.toLocaleString()}`;
    cartSummary += '\n\nGo to cart to complete your order?';
    
    if (confirm(cartSummary)) {
        goToCart();
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Bind add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Bind cart icon click
    const cartIcon = document.querySelector('.cart-icon-header');
    if (cartIcon) {
        cartIcon.addEventListener('click', goToCart);
    }
    
    // Add quick view functionality if cart count is clicked
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.addEventListener('click', quickViewCart);
        cartCount.style.cursor = 'pointer';
    }
    
    // Update counter on page load
    updateCartCounter();
    
    // Debug function - remove in production
    window.debugCart = function() {
        console.log('Current cart:', cart);
        console.log('Cart count:', cart.reduce((total, item) => total + item.quantity, 0));
    };
});

// Hamburger Menu Initialization Function
function initHamburgerMenu() {
    const hamburgerBtn = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav');
    
    if (!hamburgerBtn || !navMenu) {
        console.warn('Hamburger menu elements not found');
        return;
    }
    
    // Toggle hamburger menu
    hamburgerBtn.addEventListener('click', function() {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on nav links (mobile)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Close menu when window is resized to desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
});

// Alternative manual initialization function (if needed)
function startHamburgerMenu() {
    initHamburgerMenu();
}