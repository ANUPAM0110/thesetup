// Initialize Firebase (compat version)
const firebaseConfig = {
  apiKey: "AIzaSyA_NU0Cz5XqDyBQehpYiuTlUjCXFWx4bsM",
  authDomain: "insane-gaming-setup.firebaseapp.com",
  projectId: "insane-gaming-setup",
  storageBucket: "insane-gaming-setup.appspot.com",
  messagingSenderId: "472778417206",
  appId: "1:472778417206:web:b1cca04cf9d19f897c6497",
  measurementId: "G-3KC6TVL9DV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
  // ----- MOBILE MENU -----
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ----- THEME TOGGLE -----
  const toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    
    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

  // ----- SEARCH FUNCTIONALITY -----
  const searchInput = document.getElementById('search-bar');
  const suggestionsBox = document.getElementById('suggestions');
  
  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', debounce(function() {
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
          element: btn.closest('.card')
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
            highlightProduct(product.element);
          });
          suggestionsBox.appendChild(li);
        });
        suggestionsBox.style.display = 'block';
      } else {
        suggestionsBox.style.display = 'none';
      }
    }, 300));

    // Close suggestions when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (e.target !== searchInput) {
        suggestionsBox.style.display = 'none';
      }
    });
  }

  function highlightProduct(card) {
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.outline = '3px solid #007bff';
    setTimeout(() => card.style.outline = '', 1500);
  }

  // ----- CART LOGIC -----
  let cartCount = 0;
  const cartCounter = document.getElementById('cart-count');
  const cart = {};

  function showToast(message, icon = "ℹ️") {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
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
      if (cartCounter) cartCounter.textContent = cartCount;

      // Update cart object
      if (cart[productName]) {
        cart[productName].qty += 1;
      } else {
        cart[productName] = { name: productName, price, qty: 1, image };
      }

      showToast(`${productName} added to cart`, "🛒");
      updateCartDisplay();
    });
  });

  // ----- CART DISPLAY -----
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const cartBox = document.getElementById("cart-box");
  const cartIcon = document.getElementById("cart-icon");
  const cartCloseBtn = document.getElementById("cart-close-btn");

  function updateCartDisplay() {
    if (!cartItemsEl || !cartTotalEl) return;
    
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

    if (cartTotalEl) cartTotalEl.textContent = `Total: ₹${total}`;

    // Add remove item functionality
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        delete cart[name];
        cartCount = Object.keys(cart).length;
        if (cartCounter) cartCounter.textContent = cartCount;
        updateCartDisplay();
        showToast(`${name} removed from cart`, "❌");
      });
    });
  }

  // ----- CHECKOUT -----
  const checkoutBtn = document.getElementById("checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (Object.keys(cart).length === 0) {
        showToast("Your cart is empty!", "🛒");
      } else {
        showToast("Proceeding to checkout...", "✅");
      }
    });
  }

  // ----- CART MODAL -----
  if (cartIcon && cartBox && cartCloseBtn) {
    cartIcon.addEventListener('click', () => {
      updateCartDisplay();
      cartBox.style.display = 'block';
    });

    cartCloseBtn.addEventListener('click', () => {
      cartBox.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === cartBox) {
        cartBox.style.display = 'none';
      }
    });
  }

  // ----- PRODUCT MODAL -----
  const productModal = document.getElementById('product-modal');
  if (productModal) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) return;
        
        const imgSrc = card.querySelector('img').src;
        const productName = card.querySelector('.add-to-cart').dataset.name;
        const price = card.querySelector('.add-to-cart').dataset.price;
        
        document.getElementById('modal-img').src = imgSrc;
        document.getElementById('modal-title').textContent = productName;
        document.getElementById('modal-price').textContent = `₹${price}`;
        
        productModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });

    document.querySelector('#product-modal .close').addEventListener('click', () => {
      productModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
      if (e.target === productModal) {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // ----- CATEGORY FILTER -----
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      const selected = this.value;
      document.querySelectorAll('.card').forEach(card => {
        const category = card.dataset.category;
        card.style.display = selected === 'all' || category === selected ? 'block' : 'none';
      });
    });
  }

  // ----- COMMENTS SYSTEM IMPLEMENTATION -----
  const commentInput = document.getElementById('comment-input');
  const submitComment = document.getElementById('submit-comment');
  const commentsContainer = document.querySelector('.comments-container');
  const loginPrompt = document.querySelector('.login-prompt');
  const charCounter = document.querySelector('.char-counter');

  if (commentInput && submitComment && commentsContainer) {
    const commentsRef = database.ref('comments');

    // Handle auth state
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is logged in
        if (loginPrompt) loginPrompt.style.display = 'none';
        commentInput.disabled = false;
        loadComments();
      } else {
        // User is logged out
        if (loginPrompt) loginPrompt.style.display = 'block';
        commentInput.disabled = true;
      }
    });

    // Submit comment
    submitComment.addEventListener('click', () => {
      const user = auth.currentUser;
      const text = commentInput.value.trim();
      
      if (!user) {
        showToast("Please sign in to comment", "🔒");
        return;
      }
      
      if (text.length === 0) {
        showToast("Comment cannot be empty", "⚠️");
        return;
      }
      
      if (text.length > 250) {
        showToast("Comment too long (max 250 chars)", "⚠️");
        return;
      }
      
      // Push new comment to database
      commentsRef.push({
        text: text,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userEmail: user.email,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        commentInput.value = "";
        if (charCounter) charCounter.textContent = '0/250';
      }).catch(error => {
        console.error("Error posting comment:", error);
        showToast("Failed to post comment", "❌");
      });
    });

    // Character counter
    commentInput.addEventListener('input', function() {
      if (charCounter) charCounter.textContent = `${this.value.length}/250`;
    });

    // Load comments function
    function loadComments() {
      commentsRef.orderByChild('timestamp').on('value', (snapshot) => {
        commentsContainer.innerHTML = '';
        const comments = [];
        
        snapshot.forEach(childSnapshot => {
          const comment = childSnapshot.val();
          comments.push({
            id: childSnapshot.key,
            ...comment
          });
        });
        
        // Display comments in reverse chronological order
        comments.reverse().forEach(comment => {
          const commentEl = document.createElement('div');
          commentEl.className = 'comment';
          commentEl.innerHTML = `
            <div class="comment-header">
              <span class="comment-author">${escapeHtml(comment.userName)}</span>
              <span class="comment-date">${formatDate(comment.timestamp)}</span>
            </div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
          `;
          commentsContainer.appendChild(commentEl);
        });
      });
    }
  }

  // ----- LOGOUT FUNCTIONALITY -----
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await auth.signOut();
        window.location.href = "login2.html";
      } catch (err) {
        console.error("Error logging out:", err);
      }
    });
  }
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function formatDate(timestamp) {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});