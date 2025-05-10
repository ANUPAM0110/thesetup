document.addEventListener('DOMContentLoaded', () => {
    // ----- THEME TOGGLE -----
    const toggleButton = document.getElementById('theme-toggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
const modal = document.getElementById("cart-box");
if (modal) {
    modal.style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-bar');
  const suggestionsBox = document.getElementById('suggestions');
  
  if (!searchInput || !suggestionsBox) {
    console.error("Search elements missing!");
    return;
  }

  searchInput.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    suggestionsBox.innerHTML = '';
    
    if (query.length < 1) {
      suggestionsBox.style.display = 'none';
      return;
    }

    const products = Array.from(document.querySelectorAll('.add-to-cart'))
      .map(btn => ({
        name: btn.dataset.name,
        price: btn.dataset.price,
        element: btn
      }));

    const matches = products.filter(product => 
      product.name.toLowerCase().includes(query)
    );

    if (matches.length) {
      matches.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} (₹${product.price})`;
        li.addEventListener('click', () => {
          searchInput.value = product.name;
          suggestionsBox.style.display = 'none';
          highlightProduct(product.name);
        });
        suggestionsBox.appendChild(li);
      });
      suggestionsBox.style.display = 'block';
    } else {
      suggestionsBox.style.display = 'none';
    }
  });

  // Close suggestions when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (e.target !== searchInput) {
      suggestionsBox.style.display = 'none';
    }
  });
});

function highlightProduct(name) {
  document.querySelectorAll('.card').forEach(card => {
    const cardName = card.querySelector('.add-to-cart').dataset.name;
    if (cardName === name) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.outline = '3px solid #007bff';
      setTimeout(() => card.style.outline = '', 1500);
    }
  });
}
    // ----- CART LOGIC -----
    let cartCount = 0;
    const cartCounter = document.getElementById('cart-count');
    let cartItems = [];
    const cart = {};

    function showToast(productName) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">🛒</span>
            <span><strong>${productName}</strong> added to cart!</span>
        `;
        document.getElementById('toast-container').appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Adding items to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.name;
            const price = parseInt(button.dataset.price);
            const card = button.closest('.card');
            const image = card.querySelector('img').src;

            // Update cart count
            cartCount++;
            cartCounter.textContent = cartCount;

            // Update cart items array
            cartItems.push({ name: productName, price, image });

            // Update cart object
            if (cart[productName]) {
                cart[productName].qty += 1;
            } else {
                cart[productName] = { name: productName, price, qty: 1, image };
            }

            showToast(productName);
            updateCartDisplay();
        });
    });

    // ----- CART DISPLAY -----
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");

    function updateCartDisplay() {
        cartItemsEl.innerHTML = '';
        let total = 0;

        for (let name in cart) {
            const item = cart[name];
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x ${item.qty} = ₹${item.price * item.qty}</p>
                    <button class="remove-item" data-name="${name}">Remove</button>
                </div>
            `;
            cartItemsEl.appendChild(li);
            total += item.price * item.qty;
        }

        cartTotalEl.textContent = `Total: ₹${total}`;

        // Add remove item functionality
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                delete cart[name];
                cartItems = cartItems.filter(item => item.name !== name);
                cartCount = Object.keys(cart).length;
                cartCounter.textContent = cartCount;
                updateCartDisplay();
                showToast('Item removed');
            });
        });
    }

    // ----- CHECKOUT -----
    document.getElementById("checkout").addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
            alert("🛒 Your cart is empty!");
        } else {
            alert("✅ Proceeding to checkout...");
        }
    });

    // ----- CART MODAL -----
    const cartModal = document.getElementById('cart-modal');
    const cartIcon = document.getElementById('cart-icon');
    const cartCloseBtn = document.getElementById('cart-close-btn');

    cartIcon.addEventListener('click', () => {
        updateCartDisplay();
        cartModal.style.display = 'block';
    });

    cartCloseBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // ----- SEARCH BAR AUTOCOMPLETE -----
    const searchInput = document.getElementById('search-bar');
    const suggestionsBox = document.getElementById('suggestions');
    const cards = document.querySelectorAll('.card');

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        suggestionsBox.innerHTML = '';

        if (!query) return;

        document.querySelectorAll('.add-to-cart').forEach(button => {
            const name = button.dataset.name.toLowerCase();
            if (name.includes(query)) {
                const item = document.createElement('li');
                item.textContent = button.dataset.name;
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    searchInput.value = button.dataset.name;
                    suggestionsBox.innerHTML = '';
                    highlightProduct(button.dataset.name);
                });
                suggestionsBox.appendChild(item);
            }
        });
    });

    function highlightProduct(name) {
        cards.forEach(card => {
            if (card.querySelector('button').dataset.name === name) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.outline = '3px solid #007bff';
                setTimeout(() => card.style.outline = '', 1500);
            }
        });
    }

    // ----- PRODUCT MODAL -----
// Get modal element properly
const productModal = document.getElementById('product-modal');

// Open modal function
function openModal(product) {
  // Set product details...
  productModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close modal handlers
document.querySelector('#product-modal .close').addEventListener('click', function() {
  productModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
  if (e.target === productModal) {
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Category filter
document.getElementById('category-filter').addEventListener('change', function() {
  const selected = this.value;
  const cards = document.querySelectorAll('.card'); // Make sure cards are defined
  
  cards.forEach(card => {
    const category = card.dataset.category;
    card.style.display = selected === 'all' || category === selected ? 'block' : 'none';
  });
});

    // ----- FIREBASE AUTH -----
    async function initializeFirebaseAuth() {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
        const { getAuth, signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");

        const firebaseConfig = {
            apiKey: "AIzaSyA_NU0Cz5XqDyBQehpYiuTlUjCXFWx4bsM",
            authDomain: "insane-gaming-setup.firebaseapp.com",
            projectId: "insane-gaming-setup",
            storageBucket: "insane-gaming-setup.appspot.com",
            messagingSenderId: "472778417206",
            appId: "1:472778417206:web:b1cca04cf9d19f897c6497",
            measurementId: "G-3KC6TVL9DV"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const logoutBtn = document.getElementById("logout");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                try {
                    await signOut(auth);
                    window.location.href = "login2.html";
                } catch (err) {
                    console.error("Error logging out:", err);
                }
            });
        }
    }

    initializeFirebaseAuth();
});
/* Add this JavaScript for header scroll effect */
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  document.getElementById("cart-icon").addEventListener("click", () => {
  document.getElementById("cart-box").style.display = "block";
});

document.getElementById("cart-close-btn").addEventListener("click", () => {
  document.getElementById("cart-box").style.display = "none";
});

// Add this to your JavaScript
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't open modal if clicking the "Add to Cart" button
        if (e.target.classList.contains('add-to-cart')) return;
        
        const imgSrc = card.querySelector('img').src;
        const productName = card.querySelector('.add-to-cart').dataset.name;
        const price = card.querySelector('.add-to-cart').dataset.price;
        
        // Populate modal
        document.getElementById('modal-img').src = imgSrc;
        document.getElementById('modal-title').textContent = productName;
        document.getElementById('modal-price').textContent = `₹${price}`;
        
        // Open modal
        document.getElementById('product-modal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});