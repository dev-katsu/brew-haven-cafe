let cart = [];
let currentItem = { name: '', basePrice: 0, image: '' };
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

document.addEventListener('DOMContentLoaded', () => {
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartModal = document.getElementById('cartModal');

  const openLoginBtn = document.getElementById('openLoginBtn');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const loginModal = document.getElementById('loginModal');

  if (openCartBtn) openCartBtn.addEventListener('click', () => { renderCart(); cartModal.classList.add('active'); });
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

  // Toggle Login modal or Sign Out depending on auth state
  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => {
      if (isLoggedIn) {
        handleLogout();
      } else {
        openAuthModal();
      }
    });
  }

  if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => closeAuthModal());

  // Restore authenticated state if saved in localStorage
  if (isLoggedIn) {
    unlockMemberFeatures();
  }

  // Dynamic Time-of-Day Hero Tagline
  const heroSub = document.getElementById('heroSub');
  if (heroSub) {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      heroSub.innerText = "Start your morning with artisan espresso and warm autumn spices.";
    } else if (hour >= 11 && hour < 17) {
      heroSub.innerText = "Midday pick-me-up, roasted fresh in the heart of Pagsanjan.";
    } else {
      heroSub.innerText = "Unwind tonight with cozy autumn spices and handcrafted brews.";
    }
  }
});

// Central Guard: Ensures the user is logged in before allowing any order action
function requireAuth() {
  if (!isLoggedIn) {
    openAuthModal();
    showToast('Please sign in to place an order.');
    return false;
  }
  return true;
}

function handleOrderClick(name, basePrice, imgSrc, isDrink) {
  if (!requireAuth()) return;

  const descriptions = {
    'Banana Bread Latte': 'Espresso blended with toasted banana, caramel, and cinnamon spice.',
    'Pumpkin Spice Latte': 'Espresso, steamed milk, pumpkin puree, and nutmeg.',
    'French Vanilla Latte': 'Smooth espresso paired with velvety steamed milk and rich vanilla bean.',
    'Signature Espresso': 'Rich double shot Arabica blend with golden crema.',
    'Strawberry Latte': 'Fresh strawberry reduction layered with cold milk and espresso.',
    'Strawberry Matcha': 'Layered premium ceremonial matcha over sweet strawberry milk.',
    'Matcha Latte': 'Smooth and earthy green tea matcha with steamed milk.'
  };

  if (isDrink) {
    openOrderModal(name, basePrice, imgSrc, descriptions[name]);
  } else {
    addToCart(name, basePrice);
  }
}

function openOrderModal(name, basePrice, imgSrc, description) {
  if (!requireAuth()) return;

  currentItem = { name, basePrice, image: imgSrc };
  
  document.getElementById('modalTitle').innerText = name;
  document.getElementById('modalImg').src = imgSrc;
  document.getElementById('modalDesc').innerText = description || "Tailored fresh for you — pick your ideal size below ☕";
  
  document.getElementById('size-12').checked = true;
  updateModalPrice();
  document.getElementById('itemModal').classList.add('active');
}

function closeOrderModal() {
  document.getElementById('itemModal').classList.remove('active');
}

function updateModalPrice() {
  const sizeExtra = parseInt(document.querySelector('input[name="drinkSize"]:checked').value);
  const total = currentItem.basePrice + sizeExtra;
  document.getElementById('modalPriceDisplay').innerText = `₱${total}`;
}

function confirmModalOrder() {
  if (!requireAuth()) return;

  const sizeExtra = parseInt(document.querySelector('input[name="drinkSize"]:checked').value);
  const sizeLabel = sizeExtra === 30 ? 'Large (16oz)' : 'Regular (12oz)';
  const finalPrice = currentItem.basePrice + sizeExtra;
  
  addToCart(`${currentItem.name} (${sizeLabel})`, finalPrice);
  closeOrderModal();
}

function addToCart(name, price) {
  if (!requireAuth()) return;

  cart.push({ name, price });
  document.getElementById('cartBadge').innerText = cart.length;
  showToast(`Added ${name} to cart!`);
}

function renderCart() {
  const cartList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');
  cartList.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = '<li style="color:#d1c2b5; text-align:center; list-style:none;">Your cart is empty.</li>';
    cartTotal.innerText = '₱0';
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; color:#fff; list-style:none;';
    li.innerHTML = `
      <span>${item.name}</span>
      <div>
        <strong style="color:#e2903b; margin-right: 10px;">₱${item.price}</strong>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff5555; cursor:pointer; font-weight:bold;">&times;</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  cartTotal.innerText = `₱${total}`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  document.getElementById('cartBadge').innerText = cart.length;
  renderCart();
}

function switchTab(tab) {
  const signInTab = document.getElementById('signInTab');
  const signUpTab = document.getElementById('signUpTab');
  const authSubmitBtn = document.getElementById('authSubmitBtn');

  if (tab === 'signin') {
    signInTab.classList.add('active');
    signUpTab.classList.remove('active');
    authSubmitBtn.innerText = 'Sign In & Continue';
  } else {
    signUpTab.classList.add('active');
    signInTab.classList.remove('active');
    authSubmitBtn.innerText = 'Create Account';
  }
}

function unlockMemberFeatures() {
  isLoggedIn = true;
  localStorage.setItem('isLoggedIn', 'true');
  const vipMenu = document.getElementById('vipMenu');
  const vipNavLink = document.getElementById('vipNavLink');
  const openLoginBtn = document.getElementById('openLoginBtn');

  if (vipMenu) vipMenu.classList.remove('hidden');
  if (vipNavLink) vipNavLink.classList.remove('hidden');
  if (openLoginBtn) openLoginBtn.innerText = 'Sign Out 🚪';
}

function handleLogout() {
  isLoggedIn = false;
  localStorage.removeItem('isLoggedIn');
  const vipMenu = document.getElementById('vipMenu');
  const vipNavLink = document.getElementById('vipNavLink');
  const openLoginBtn = document.getElementById('openLoginBtn');

  if (vipMenu) vipMenu.classList.add('hidden');
  if (vipNavLink) vipNavLink.classList.add('hidden');
  if (openLoginBtn) openLoginBtn.innerText = 'Sign In';
  showToast('Signed out successfully!');
}

function handleAuthSubmit(event) {
  event.preventDefault();
  closeAuthModal();
  unlockMemberFeatures();
  showToast('Welcome back! VIP Menu Unlocked ✨');
}

function openAuthModal() {
  const modal = document.getElementById('loginModal') || document.getElementById('authModal');
  if (modal) modal.classList.add('active');
}

function closeAuthModal() {
  const loginModal = document.getElementById('loginModal');
  const authModal = document.getElementById('authModal');
  if (loginModal) loginModal.classList.remove('active');
  if (authModal) authModal.classList.remove('active');
}

function handleLogin(event) {
  event.preventDefault();
  closeAuthModal();
  unlockMemberFeatures();
  showToast('Signed in successfully! You can now place orders.');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function scrollToAndHighlight(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Dynamic scroll background lightening
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = Math.min(scrollTop / Math.max(maxScroll, 1), 1);
  
  const r = Math.round(31 + (95 - 31) * scrollRatio);
  const g = Math.round(17 + (55 - 17) * scrollRatio);
  const b = Math.round(9 + (30 - 9) * scrollRatio);

  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
});