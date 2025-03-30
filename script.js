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
function addToCart() {
    const product = {
      id: 1, // Use actual product ID
      name: 'Cement',
      price: 800,
      quantity: 1,
      image: 'your-image.jpg'
    };
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === product.id);
  
  existingItem ? existingItem.quantity++ : cart.push(product);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'cart.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.querySelector('.cart-items');
  const summarySubtotal = document.querySelector('.summary-row:nth-child(1) span:last-child');
  const summaryTotal = document.querySelector('.summary-row.total span:last-child');

  // Render cart items
  function renderCartItems() {
    cartItemsContainer.innerHTML = cart.length > 0 
      ? cart.map((item, index) => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
              <h4>${item.name}</h4>
              <div class="price">sh ${item.price.toLocaleString()}</div>
              <div class="quantity-controls">
                <button class="quantity-btn minus">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                <button class="quantity-btn plus">+</button>
              </div>
              <button class="remove-item">Remove</button>
            </div>
          </div>
        `).join('')
      : `<div class="empty-cart">Your cart is empty</div>`;
    
    addEventListeners();
    updateTotals();
  }

  // Add event listeners
  function addEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', handleQuantityChange);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', handleQuantityInput);
    });

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', handleRemoveItem);
    });
  }

  // Handle quantity button clicks
  function handleQuantityChange(e) {
    const itemElement = this.closest('.cart-item');
    const itemId = itemElement.dataset.id;
    const input = itemElement.querySelector('.quantity-input');
    let quantity = parseInt(input.value);

    if (this.classList.contains('plus')) {
      quantity++;
    } else if (this.classList.contains('minus') && quantity > 1) {
      quantity--;
    }

    input.value = quantity;
    updateCartItem(itemId, quantity);
  }

  // Handle direct input changes
  function handleQuantityInput(e) {
    const itemElement = this.closest('.cart-item');
    const itemId = itemElement.dataset.id;
    let quantity = parseInt(this.value) || 1;
    this.value = Math.max(quantity, 1);
    updateCartItem(itemId, quantity);
  }

  // Handle item removal
  function handleRemoveItem(e) {
    const itemElement = this.closest('.cart-item');
    const itemId = itemElement.dataset.id;
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCartItems();
  }

  // Update cart item quantity
  function updateCartItem(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = newQuantity;
      saveCart();
      updateTotals();
    }
  }

  // Calculate and update totals
  function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    summarySubtotal.textContent = `sh ${subtotal.toLocaleString()}`;
    summaryTotal.textContent = `sh ${total.toLocaleString()}`;
  }

  // Shipping calculation (replace with your logic)
  function calculateShipping(subtotal) {
    return subtotal > 5000 ? 0 : 200; // Example shipping logic
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Initial render
  renderCartItems();
});
