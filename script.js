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
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.querySelector('.cart-items-list');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Sample cart data (replace with actual data source in real implementation)
    const cart = {};

    function addToCart(event) {
      event.preventDefault();
      const button = event.currentTarget;
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));

      // If item is already in cart, increase quantity
      if (cart[id]) {
        cart[id].quantity += 1;
      } else {
        cart[id] = { name, price, quantity: 1 };
      }

      updateCartDisplay();
    }

    function updateCartDisplay() {
      const cartItemsContainer = document.getElementById('cart-items');
      cartItemsContainer.innerHTML = ''; // Clear existing items

      let total = 0;

      for (const id in cart) {
        const item = cart[id];
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <strong>${item.name}</strong><br>
          Price: sh ${item.price} x ${item.quantity} = <strong>sh ${itemTotal}</strong>
          <button onclick="changeQuantity('${id}', 1)">+</button>
          <button onclick="changeQuantity('${id}', -1)">-</button>
        `;
        cartItemsContainer.appendChild(div);
      }

      document.getElementById('cart-total').innerText = `Total: sh ${total}`;
    }

    function changeQuantity(id, change) {
      if (cart[id]) {
        cart[id].quantity += change;
        if (cart[id].quantity <= 0) {
          delete cart[id];
        }
        updateCartDisplay();
      }
    }
   

    // Render cart items
    function renderCartItems() {
        cartItemsList.innerHTML = '';
        
        cartData.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('data-index', index);
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>sh ${item.price.toLocaleString()}</p>
                    <button class="remove-btn">Remove</button>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn plus">+</button>
                </div>
            `;
            
            cartItemsList.appendChild(cartItem);
        });
        
        updateSummary();
    }

    // Update order summary
    function updateSummary() {
        const subtotal = cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 200 : 0;
        const total = subtotal + shipping;

        document.querySelector('.subtotal').textContent = `sh ${subtotal.toLocaleString()}`;
        document.querySelector('.shipping').textContent = `sh ${shipping.toLocaleString()}`;
        document.querySelector('.total-amount').textContent = `sh ${total.toLocaleString()}`;
    }

    // Event delegation for quantity controls and remove buttons
    cartItemsList.addEventListener('click', (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        const index = cartItem ? parseInt(cartItem.dataset.index) : -1;

        if (index === -1) return;

        if (target.classList.contains('minus')) {
            if (cartData[index].quantity > 1) {
                cartData[index].quantity--;
                renderCartItems();
            }
        } else if (target.classList.contains('plus')) {
            cartData[index].quantity++;
            renderCartItems();
        } else if (target.classList.contains('remove-btn')) {
            cartData.splice(index, 1);
            renderCartItems();
        }
    });

    // Handle manual quantity input
    cartItemsList.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const cartItem = e.target.closest('.cart-item');
            const index = parseInt(cartItem.dataset.index);
            const newQuantity = parseInt(e.target.value) || 1;
            
            cartData[index].quantity = Math.max(1, newQuantity);
            renderCartItems();
        }
    });

    // Checkout button handler
    checkoutBtn.addEventListener('click', () => {
        if (cartData.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Proceeding to checkout...'); // Replace with actual checkout logic
    });

    // Initial render
    renderCartItems();
});