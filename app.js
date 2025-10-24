// Global State Management
let currentPage = 'home';
let isAdminLoggedIn = false;
let currentFilter = 'all';
let currentProductId = null;
let nextOrderId = 1;

// Sample Products Data
let products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 299,
        category: "Headphones",
        image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop",
        description: "High-fidelity wireless headphones with active noise cancellation and 30-hour battery life. Premium leather ear cushions for all-day comfort."
    },
    {
        id: 2,
        name: "Studio Monitor Speakers",
        price: 449,
        category: "Speakers",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
        description: "Professional-grade studio monitors with flat frequency response. Perfect for music production and critical listening."
    },
    {
        id: 3,
        name: "True Wireless Earbuds",
        price: 179,
        category: "Earbuds",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
        description: "Premium sound quality in a compact design. Water-resistant with 24 hours of total battery life including charging case."
    },
    {
        id: 4,
        name: "Bluetooth Portable Speaker",
        price: 129,
        category: "Speakers",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
        description: "Portable wireless speaker with 360-degree sound. Waterproof design with 12-hour battery life."
    },
    {
        id: 5,
        name: "USB Audio Interface",
        price: 249,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop",
        description: "Professional 2-channel audio interface with studio-quality preamps. Perfect for home recording setups."
    },
    {
        id: 6,
        name: "Studio Microphone",
        price: 199,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop",
        description: "Large-diaphragm condenser microphone for vocals and instruments. Includes shock mount and pop filter."
    },
    {
        id: 7,
        name: "Over-Ear Headphones",
        price: 159,
        category: "Headphones",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop",
        description: "Comfortable over-ear headphones with balanced sound signature. Foldable design with carrying case included."
    },
    {
        id: 8,
        name: "Soundbar System",
        price: 399,
        category: "Speakers",
        image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop",
        description: "Immersive soundbar with wireless subwoofer. Dolby Atmos support for cinematic home theater experience."
    }
];

// Cart and Orders
let cart = [];
let orders = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadFeaturedProducts();
    updateCartBadge();
    navigateToHome();
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Add product form
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    // Edit product form
    const editProductForm = document.getElementById('edit-product-form');
    if (editProductForm) {
        editProductForm.addEventListener('submit', handleEditProduct);
    }
    
    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// Navigation Functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('fade-in');
    }
    
    currentPage = pageId.replace('-page', '');
    
    // Close mobile menu if open
    closeMobileMenu();
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

function navigateToHome() {
    showPage('home-page');
    loadFeaturedProducts();
}

function showProducts() {
    showPage('products-page');
    loadAllProducts();
    updateFilterButtons('all');
}

function showProductDetail(productId) {
    currentProductId = productId;
    showPage('product-detail-page');
    loadProductDetail(productId);
}

function showCart() {
    showPage('cart-page');
    loadCartPage();
}

function showCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    showPage('checkout-page');
    loadCheckoutPage();
}

function showAdmin() {
    if (isAdminLoggedIn) {
        showPage('admin-panel-page');
        loadAdminDashboard();
    } else {
        showPage('admin-login-page');
    }
}

// Product Functions
function loadFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid) return;
    
    // Show first 6 products as featured
    const featuredProducts = products.slice(0, 6);
    grid.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadAllProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => createProductCard(product)).join('');
}

function filterByCategory(category) {
    currentFilter = category;
    showPage('products-page');
    
    const grid = document.getElementById('products-grid');
    const title = document.getElementById('products-title');
    
    if (!grid || !title) return;
    
    const filteredProducts = products.filter(product => product.category === category);
    title.textContent = category;
    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    updateFilterButtons(category);
}

function showAllProducts() {
    currentFilter = 'all';
    const grid = document.getElementById('products-grid');
    const title = document.getElementById('products-title');
    
    if (!grid || !title) return;
    
    title.textContent = 'All Products';
    grid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    updateFilterButtons('all');
}

function updateFilterButtons(activeFilter) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if ((activeFilter === 'all' && btn.textContent === 'All') ||
            btn.textContent === activeFilter) {
            btn.classList.add('active');
        }
    });
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image" onclick="showProductDetail(${product.id})">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop'">
            </div>
            <div class="product-info">
                <h3 class="product-name" onclick="showProductDetail(${product.id})">${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id}, 1)">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

function loadProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const container = document.getElementById('product-detail-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&h=400&fit=crop'">
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <div class="product-detail-price">$${product.price}</div>
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decrementQuantity()">-</button>
                        <input type="number" id="product-quantity" class="quantity-input" value="1" min="1">
                        <button class="quantity-btn" onclick="incrementQuantity()">+</button>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="addToCartFromDetail()">Add to Cart</button>
            </div>
        </div>
    `;
}

function incrementQuantity() {
    const input = document.getElementById('product-quantity');
    if (input) {
        input.value = parseInt(input.value) + 1;
    }
}

function decrementQuantity() {
    const input = document.getElementById('product-quantity');
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCartFromDetail() {
    const input = document.getElementById('product-quantity');
    const quantity = input ? parseInt(input.value) : 1;
    addToCart(currentProductId, quantity);
}

// Cart Functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            product: product
        });
    }
    
    updateCartBadge();
    
    // Show success message
    showSuccessMessage(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartBadge();
    loadCartPage();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartBadge();
            loadCartPage();
        }
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

function loadCartPage() {
    const container = document.getElementById('cart-content');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <button class="btn btn-primary" onclick="showProducts()">Shop Now</button>
            </div>
        `;
        return;
    }
    
    const cartHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.product.image}" alt="${item.product.name}" onerror="this.src='https://images.unsplash.com/photo-1545127398-14699f92334b?w=100&h=100&fit=crop'">
                    </div>
                    <div class="cart-item-info">
                        <h3>${item.product.name}</h3>
                        <div class="cart-item-price">$${item.product.price}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="item-total">$${(item.product.price * item.quantity).toFixed(2)}</div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.productId})">Remove</button>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <div class="cart-total">
                <span>Total: $${getCartTotal().toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <button class="btn btn-secondary" onclick="showProducts()">Continue Shopping</button>
                <button class="btn btn-primary" onclick="showCheckout()">Proceed to Checkout</button>
            </div>
        </div>
    `;
    
    container.innerHTML = cartHTML;
}

// Checkout Functions
function loadCheckoutPage() {
    const itemsContainer = document.getElementById('checkout-items');
    if (!itemsContainer) return;
    
    const itemsHTML = `
        ${cart.map(item => `
            <div class="checkout-item">
                <div>
                    <strong>${item.product.name}</strong><br>
                    <small>Qty: ${item.quantity}</small>
                </div>
                <div>$${(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('')}
        <div class="checkout-item" style="font-weight: bold; font-size: 18px; border-top: 2px solid #E8DCC4; margin-top: 15px; padding-top: 15px;">
            <div>Total:</div>
            <div>$${getCartTotal().toFixed(2)}</div>
        </div>
    `;
    
    itemsContainer.innerHTML = itemsHTML;
}

function handleCheckout(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        id: nextOrderId++,
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        },
        items: [...cart],
        total: getCartTotal(),
        date: new Date().toISOString(),
        status: 'Pending'
    };
    
    orders.push(orderData);
    
    // Clear cart
    cart = [];
    updateCartBadge();
    
    // Show confirmation
    showOrderConfirmation(orderData);
}

function showOrderConfirmation(order) {
    showPage('order-confirmation-page');
    
    const container = document.getElementById('order-details');
    if (!container) return;
    
    container.innerHTML = `
        <div class="order-info">
            <p><strong>Order ID:</strong> #${String(order.id).padStart(4, '0')}</p>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Items:</strong> ${order.items.length} products</p>
        </div>
    `;
}

// Admin Functions
function handleAdminLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const password = formData.get('password');
    
    if (password === 'admin123') {
        isAdminLoggedIn = true;
        showPage('admin-panel-page');
        loadAdminDashboard();
    } else {
        alert('Invalid password!');
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    navigateToHome();
}

function loadAdminDashboard() {
    // Update statistics
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-orders').textContent = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    
    // Load products table
    loadAdminProductsTable();
    
    // Load orders table
    loadAdminOrdersTable();
}

function loadAdminProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-table-img" onerror="this.src='https://images.unsplash.com/photo-1545127398-14699f92334b?w=50&h=50&fit=crop'"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadAdminOrdersTable() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${String(order.id).padStart(4, '0')}</td>
            <td>${order.customer.name}<br><small>${order.customer.email}</small></td>
            <td>${order.items.length} items</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        image: formData.get('image'),
        description: formData.get('description')
    };
    
    products.push(newProduct);
    
    // Reset form
    e.target.reset();
    
    // Reload admin dashboard
    loadAdminDashboard();
    
    showSuccessMessage('Product added successfully!');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill edit form
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-image').value = product.image;
    document.getElementById('edit-product-description').value = product.description;
    
    // Show modal
    document.getElementById('edit-modal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function handleEditProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productId = parseInt(formData.get('id') || document.getElementById('edit-product-id').value);
    
    const product = products.find(p => p.id === productId);
    if (product) {
        product.name = formData.get('name');
        product.price = parseFloat(formData.get('price'));
        product.category = formData.get('category');
        product.image = formData.get('image');
        product.description = formData.get('description');
        
        closeEditModal();
        loadAdminDashboard();
        
        showSuccessMessage('Product updated successfully!');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        loadAdminDashboard();
        
        showSuccessMessage('Product deleted successfully!');
    }
}

// Utility Functions
function showSuccessMessage(message) {
    // Create success message element
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.textContent = message;
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.right = '20px';
    messageEl.style.zIndex = '2000';
    messageEl.style.borderRadius = '8px';
    messageEl.style.padding = '15px 20px';
    messageEl.style.background = '#9CAF88';
    messageEl.style.color = 'white';
    messageEl.style.fontWeight = '600';
    
    document.body.appendChild(messageEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        closeEditModal();
    }
};