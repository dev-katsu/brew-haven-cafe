let cart = [];
let currentItem = { name: '', basePrice: 0, image: '' };

document.addEventListener('DOMContentLoaded', () => {
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartModal = document.getElementById('cartModal');

  const openLoginBtn = document.getElementById('openLoginBtn');
  const closeLoginBtn = document.getElementById('closeLoginBtn');
  const loginModal = document.getElementById('loginModal');

  if (openCartBtn) openCartBtn.addEventListener('click', () => { renderCart(); cartModal.classList.add('active'); });
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

  if (openLoginBtn) openLoginBtn.addEventListener('click', () => loginModal.classList.add('active'));
  if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginModal.classList.remove('active'));

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

function handleOrderClick(name, basePrice, imgSrc, isDrink) {
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
  const sizeExtra = parseInt(document.querySelector('input[name="drinkSize"]:checked').value);
  const sizeLabel = sizeExtra === 30 ? 'Large (16oz)' : 'Regular (12oz)';
  const finalPrice = currentItem.basePrice + sizeExtra;
  
  addToCart(`${currentItem.name} (${sizeLabel})`, finalPrice);
  closeOrderModal();
}

function addToCart(name, price) {
  cart.push({ name, price });
  document.getElementById('cartBadge').innerText = cart.length;
  showToast(`Added ${name} to cart!`);
}

function renderCart() {
  const cartList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');
  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.style.cssText = 'display:flex; justify-content:space-between; margin-bottom:10px; color:#fff;';
    li.innerHTML = `<span>${item.name}</span><strong style="color:#e2903b; margin-left: auto;">₱${item.price}</strong>`;
    cartList.appendChild(li);
  });

  cartTotal.innerText = `₱${total}`;
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

function handleAuthSubmit(event) {
  event.preventDefault();
  document.getElementById('loginModal').classList.remove('active');
  document.getElementById('vipMenu').classList.remove('hidden');
  document.getElementById('vipNavLink').classList.remove('hidden');
  showToast('Welcome back! VIP Menu Unlocked ✨');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
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
  const scrollRatio = Math.min(scrollTop / maxScroll, 1);
  
  // Transitions from dark espresso rgb(31, 17, 9) to a noticeable warm mocha rgb(95, 55, 30)
  const r = Math.round(31 + (95 - 31) * scrollRatio);
  const g = Math.round(17 + (55 - 17) * scrollRatio);
  const b = Math.round(9 + (30 - 9) * scrollRatio);

  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
});