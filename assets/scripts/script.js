// $(document).ready(function() {
//   $('.testimonial-sliders').slick({
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: true,
//     dots: true,
//     infinite: true,
//     speed: 500,
//     fade: true,
//     cssEase: 'linear',
//     prevArrow: '<button type="button" class="slick-prev">←</button>',
//     nextArrow: '<button type="button" class="slick-next">→</button>'
//   });
// });

const menuBtn = document.querySelector(".menu");
const menuLinks = document.getElementById("menuLinks");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");
const addToCartBtns = document.querySelector(".add-to-cart");
const cartDetails = document.querySelector(".cart-details");
const cartCloseBtn = document.querySelector(".close-cart-btn");
const badgeNumber = document.querySelector(".badge-number");

menuBtn.addEventListener("click", () => {
  menuLinks.classList.toggle("action");

  const isOpen = menuLinks.classList.contains("action");

  // Toggle icon visibility
  if (isOpen) {
    menuIcon.style.display = "none";
    closeIcon.style.display = "block";
  } else {
    menuIcon.style.display = "block";
    closeIcon.style.display = "none";
  }
});

// let cartItem = [];

// function addToCart(itemId) {
//   cartItem.push(itemId);
//   updateCartBadge();
// }

// function updateCartBadge() {
//   badgeNumber.textContent = cartItem.length;
// }

// addToCartBtns.addEventListener("click", () => {
//   cartDetails.classList.toggle("active");
// });

// cartCloseBtn.addEventListener("click", () => {
//   cartDetails.classList.remove("active");
// });

// Cart System - Replace your existing cart code with this
// Dynamic Cart System with LocalStorage
// This persists cart data across page reloads

let cartItems = [];

// Initialize cart from localStorage on page load
function initializeCart() {
  const savedCart = localStorage.getItem("scoopybliss_cart");
  if (savedCart) {
    try {
      cartItems = JSON.parse(savedCart);
      updateCartBadge();
      displayCartItems();
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      cartItems = [];
      localStorage.removeItem("scoopybliss_cart");
    }
  }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
  try {
    localStorage.setItem("scoopybliss_cart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

// Add item to cart
function addToCart(itemId) {
  // Find the item from the items array
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    console.error("Item not found:", itemId);
    return;
  }

  // Check if item already exists in cart
  const existingItem = cartItems.find((cartItem) => cartItem.id === itemId);

  if (existingItem) {
    // Item exists, increase quantity
    existingItem.quantity += 1;
  } else {
    // Add new item to cart
    cartItems.push({
      id: item.id,
      image: item.image,
      item_name: item.item_name,
      current_price: item.current_price,
      original_price: item.original_price,
      category: item.category,
      quantity: 1,
    });
  }

  // Save to localStorage
  saveCartToLocalStorage();

  // Update cart display
  updateCartBadge();
  displayCartItems();

  // Show cart automatically when item is added
  const cartDetails = document.querySelector(".cart-details");
  if (cartDetails) {
    cartDetails.classList.add("active");

    // Auto-hide after 3 seconds (optional)
    setTimeout(() => {
      cartDetails.classList.remove("active");
    }, 3000);
  }

  // Show success notification (optional)
  showNotification(`${item.item_name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
  const itemToRemove = cartItems.find((item) => item.id === itemId);
  cartItems = cartItems.filter((item) => item.id !== itemId);

  // Save to localStorage
  saveCartToLocalStorage();

  // Update display
  updateCartBadge();
  displayCartItems();

  if (itemToRemove) {
    showNotification(`${itemToRemove.item_name} removed from cart`);
  }
}

// Increase quantity
function increaseQuantity(itemId) {
  const item = cartItems.find((cartItem) => cartItem.id === itemId);
  if (item) {
    item.quantity += 1;

    // Save to localStorage
    saveCartToLocalStorage();

    // Update display
    updateCartBadge();
    displayCartItems();
  }
}

// Decrease quantity
function decreaseQuantity(itemId) {
  const item = cartItems.find((cartItem) => cartItem.id === itemId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;

      // Save to localStorage
      saveCartToLocalStorage();

      // Update display
      updateCartBadge();
      displayCartItems();
    } else {
      // Remove item if quantity becomes 0
      removeFromCart(itemId);
    }
  }
}

// Clear entire cart
function clearCart() {
  const confirmed = confirm("Are you sure you want to clear your cart?");
  if (confirmed) {
    cartItems = [];

    // Clear localStorage
    localStorage.removeItem("scoopybliss_cart");

    // Update display
    updateCartBadge();
    displayCartItems();

    showNotification("Cart cleared successfully");
  }
}

// Update cart badge number
function updateCartBadge() {
  const badgeNumber = document.querySelector(".badge-number");
  if (badgeNumber) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    badgeNumber.textContent = totalItems;

    // Hide badge if cart is empty
    if (totalItems === 0) {
      badgeNumber.style.display = "none";
    } else {
      badgeNumber.style.display = "block";
    }
  }
}

// Display cart items dynamically
function displayCartItems() {
  const cartDetails = document.querySelector(".cart-details");

  if (!cartDetails) return;

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.current_price * item.quantity;
  }, 0);

  // Calculate savings
  const totalOriginalPrice = cartItems.reduce((sum, item) => {
    return sum + item.original_price * item.quantity;
  }, 0);
  const savings = totalOriginalPrice - totalPrice;

  let cartHTML = `
    <div class="cart-header">
      <h3 class="heading-3">Cart (${cartItems.length})</h3>
      ${
        cartItems.length > 0
          ? '<button class="clear-cart-btn btn" onclick="clearCart()">Clear All</button>'
          : ""
      }
    </div>
    <div class="cart-items-container">
  `;

  if (cartItems.length === 0) {
    cartHTML += `
      <div class="empty-cart">
        <img src="./assets/images/emptyCart.png" alt="Empty Cart" class="empty-cart
        <p class="paragraph-1">🍦 Your cart is empty</p>
        <p class="paragraph-2">Add some delicious treats!</p>
      </div>
    `;
  } else {
    cartItems.forEach((item) => {
      const itemTotal = item.current_price * item.quantity;
      cartHTML += `
        <d
        iv class="cart-item">
          <img src="${item.image}" alt="${item.item_name}" loading="lazy" onerror="this.src='./assets/images/placeholder.png'">
          <div class="cart-item-info">
            <p class="heading-5">${item.item_name}</p>
            <p class="paragraph-1 item-price">₹${item.current_price} × ${item.quantity}</p>
            <p class="paragraph-1 item-total"><strong>₹${itemTotal}</strong></p>
          </div>
          <div class="cart-item-actions">
            <div class="quantity">
              <span class="btn decrease-quantity" onclick="decreaseQuantity('${item.id}')">−</span>
              <span class="quantity-number heading-5">${item.quantity}</span>
              <span class="btn increase-quantity" onclick="increaseQuantity('${item.id}')">+</span>
            </div>
          </div>
          <button class="btn remove-item" onclick="removeFromCart('${item.id}')" title="Remove item">
            &times;
            </button>
        </d>
      `;
    });
  }

  cartHTML += `
    </div>
  `;

  if (cartItems.length > 0) {
    cartHTML += `
      <div class="cart-summary">
        <div class="cart-total">
          <span class="paragraph-1">Subtotal:</span>
          <span class="heading-4">₹${totalPrice}</span>
        </div>
        ${
          savings > 0
            ? `
        <div class="cart-savings">
          <span class="paragraph-2">You save:</span>
          <span class="heading-6 savings-amount">₹${savings}</span>
        </div>
        `
            : ""
        }
      </div>
      <div class="btns">
        <a href="#" class="btn close-cart-btn" onclick="closeCart(event)">
          <span></span>
          Continue Shopping
          <span></span>
        </a>
        <a href="#" class="btn view-cart-btn" onclick="checkout(event)">
          <span></span>
          Checkout
          <span></span>
        </a>
      </div>
    `;
  } else {
    cartHTML += `
      <div class="btns">
        <a href="#" class="btn close-cart-btn" onclick="closeCart(event)">
          <span></span>
          Start Shopping
          <span></span>
        </a>
      </div>
    `;
  }

  cartDetails.innerHTML = cartHTML;
}

// Close cart
function closeCart(event) {
  if (event) event.preventDefault();
  const cartDetails = document.querySelector(".cart-details");
  if (cartDetails) {
    cartDetails.classList.remove("active");
  }
}

// Checkout function
function checkout(event) {
  event.preventDefault();

  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Calculate total
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.current_price * item.quantity;
  }, 0);

  // Create order summary
  let orderSummary = "Order Summary:\n\n";
  cartItems.forEach((item) => {
    orderSummary += `${item.item_name} x${item.quantity} - ₹${
      item.current_price * item.quantity
    }\n`;
  });
  orderSummary += `\nTotal: ₹${totalPrice}`;

  // For now, show an alert
  alert(orderSummary + "\n\nThis will redirect to checkout page.");

  // In a real application, you would:
  // 1. Save order to database
  // 2. Redirect to checkout page
  // window.location.href = 'checkout.html';

  // Optional: Clear cart after checkout
  // cartItems = [];
  // saveCartToLocalStorage();
  // updateCartBadge();
  // displayCartItems();
}

// Show notification (optional enhancement)
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart from localStorage
  initializeCart();

  // Cart toggle
  const addToCartBtn = document.querySelector(".add-to-cart");
  const cartDetails = document.querySelector(".cart-details");

  if (addToCartBtn && cartDetails) {
    addToCartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cartDetails.classList.toggle("active");
    });
  }

  // Close cart when clicking outside
  document.addEventListener("click", (e) => {
    if (cartDetails && addToCartBtn) {
      if (!cartDetails.contains(e.target) && !addToCartBtn.contains(e.target)) {
        cartDetails.classList.remove("active");
      }
    }
  });

  // Prevent cart from closing when clicking inside it
  if (cartDetails) {
    cartDetails.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});
let currentCategory = "all"; // Track current selected category

// Function to display items based on category
function displayItemsByCategory(category = "all") {
  let itemsContainer = document.querySelector(".categories-cards");
  if (!itemsContainer) {
    return;
  }

  // Filter items based on category
  const filteredItems =
    category === "all"
      ? items
      : items.filter((item) => item.category === category);

  // Update current category
  currentCategory = category;

  // Generate HTML
  let innerHTML = "";

  if (filteredItems.length === 0) {
    innerHTML = `
      <div class="no-items-wrapper">
        <img src="./assets/images/noItems.png" alt="No items found" class="no-items-image"/>
        <h3 class="heading-3">No Items Found</h3>
        <p class="paragraph-1">We don't have any items in this category yet. Check back soon!</p>
      </div>
    `;
  } else {
    filteredItems.forEach((item) => {
      innerHTML += `
      <div class="categories-card">
        <img
          src="${item.image}"
          alt="${item.item_name}"
          loading="lazy"
        />
        <div class="categories-info">
          <div class="categories-extra-info">
            <div class="rating">
              <img
                src="./assets/images/fillStar.svg"
                alt="Star Icon"
                loading="lazy"
              />
              <div class="rating-count">
                <span class="paragraph-1">${item.rating.stars} <span class="count">(${item.rating.count})</span></span>
              </div>
            </div>
            <div class="price">
              <span class="current-price paragraph-1">₹${item.current_price}</span>
              <span class="original-price paragraph-1">₹${item.original_price}</span>
              <span class="discount-percentage paragraph-1">(${item.discount_percentage}% OFF)</span>
            </div>
          </div>
          <div class="categories-details">
            <h4 class="heading-4">${item.item_name}</h4>
            <a class="secondary-btn" onclick="addToCart('${item.id}')">
              <img src="./assets/images/addIcon.svg" alt="Add Icon">
            </a>
          </div>
          <p class="paragraph-1">
            ${item.item_description}
          </p> 
        </div>
      </div>`;
    });
  }

  itemsContainer.innerHTML = innerHTML;

  // Update active state on category items
  updateActiveCategoryUI(category);
}

// Function to update active category styling
// Function to update active category styling
function updateActiveCategoryUI(category) {
  const categoryItems = document.querySelectorAll(".category-item");

  categoryItems.forEach((item) => {
    item.classList.remove("active");
    const categoryName = item.querySelector(".heading-4").textContent.trim();

    // Handle both "Show All" and regular categories
    if (category === "all" && categoryName === "Show All") {
      item.classList.add("active");
    } else if (category !== "all" && categoryName === category) {
      item.classList.add("active");
    }
  });
}

// Function to initialize category filters
function initializeCategoryFilters() {
  const categoryItems = document.querySelectorAll(".category-item");

  if (categoryItems.length === 0) {
    console.warn("No category items found. Make sure DOM is loaded.");

    // Display "no items" image in the categories-cards container
    const itemsContainer = document.querySelector(".categories-cards");
    if (itemsContainer) {
      itemsContainer.innerHTML = `
        <div class="no-items-wrapper">
          <img src="./assets/images/noItems.png" alt="No items found" class="no-items-image">
          <p class="paragraph-1">No categories available at the moment.</p>
        </div>
      `;
    }
    return;
  }

  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const categoryName = this.querySelector(".heading-4").textContent.trim();

      // Check if it's "Show All" button
      if (categoryName === "Show All") {
        displayItemsByCategory("all");
      } else {
        displayItemsByCategory(categoryName);
      }
    });
  });

  // Display all items initially
  displayItemsByCategory("all");
}

// Optional: Add a "Show All" button functionality
function showAllCategories() {
  displayItemsByCategory("all");
}

// Call this when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCategoryFilters);
} else {
  // DOM already loaded
  initializeCategoryFilters();
}
