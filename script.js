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


//add cart functionality
// Cart Management Script - script.js
let cart = JSON.parse(localStorage.getItem('constructionCart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('constructionCart', JSON.stringify(cart));
}

// Extract product data from card
function extractProductData(cardElement) {
    const nameElement = cardElement.querySelector('h4');
    const descriptionElement = cardElement.querySelector('p');
    const costElement = cardElement.querySelector('.cost');
    const button = cardElement.querySelector('.add-to-cart');
    
    const name = nameElement.textContent.trim();
    const description = descriptionElement.textContent.trim();
    const price = parseInt(costElement.textContent.replace(/[^\d]/g, ''));
    const image = button.dataset.image || '';
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    return { id, name, description, price, image, quantity: 1 };
}

// Add to cart function
function addToCart(event) {
    event.preventDefault();
    
    const button = event.target.closest('.add-to-cart');
    const cardContent = button.closest('.card-content');
    const productData = extractProductData(cardContent);
    
    // Check if item exists in cart
    const existingItem = cart.find(item => item.id === productData.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(productData);
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
    }
}

// Button feedback
function showButtonFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '✓ Added!';
    button.style.backgroundColor = '#4CAF50';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
        button.disabled = false;
    }, 1500);
}

// Go to cart page
function goToCart() {
    window.location.href = 'Cart.html';
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
    
    // Update counter on page load
    updateCartCounter();
});