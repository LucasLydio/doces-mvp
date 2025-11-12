// public/js/cart.js

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}


window.addToCart = function(product) {
  let cart = getCart();
  const idx = cart.findIndex(p => p.id === product.id);
  if (idx > -1) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  setCart(cart);
  renderCart();
  showToast(`Produto "${product.name}" adicionado ao carrinho!`);
};


function removeFromCart(productId) {
  let cart = getCart().filter(p => p.id !== productId);
  setCart(cart);
  renderCart();
}


function updateQty(productId, delta) {
  let cart = getCart();
    const idx = cart.findIndex(p => p.id === Number(productId));
    if (idx > -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) {
        cart.splice(idx, 1);
    }
    setCart(cart);
    renderCart();
    }
}


function clearCart() {
  setCart([]);
  renderCart();
}


function showToast(msg) {

  let toast = document.createElement('div');
  toast.textContent = msg;
  toast.style = "position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:var(--caramelo,#B67A45);color:#fff;padding:10px 24px;border-radius:8px;z-index:9999;box-shadow:0 2px 8px #0001;font-weight:600;";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1800);
}

function renderCart() {
  const cart = getCart();
  const cartList = document.getElementById('cart-list');
  const cartEmpty = document.getElementById('cart-empty');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryDelivery = document.getElementById('summary-delivery');
  const summaryTotal = document.getElementById('summary-total');
  

  if (!cartList) return;
  let html = `<h2 class="cart-title">Seu carrinho</h2>`;
  
  if (cart.length === 0) {
    cartEmpty && (cartEmpty.style.display = "");
    cartList.innerHTML = html;
    if (summarySubtotal) summarySubtotal.textContent = "R$ 0,00";
    if (summaryDelivery) summaryDelivery.textContent = "R$ 0,00";
    if (summaryTotal) summaryTotal.textContent = "R$ 0,00";
    return;
  }
  cartEmpty && (cartEmpty.style.display = "none");


html += cart.map(p => `
  <div class="cart-product" data-product-id="${p.id}">
    <img class="cart-product-img" src="${p.img_url}" alt="${p.name}">
    <div class="cart-product-info">
      <div class="cart-product-title py-2">${p.name}</div>
      <div class="cart-product-category">${p.category || ''}</div>
      <div class="cart-product-price">R$ ${(p.price).toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
    </div>
    <div class="cart-qty-control">
        <button class="qty-btn decrease" data-product-id="${p.id}" 
        title="Diminuir quantidade" ${p.qty <= 1 ? 'disabled' : ''}>
        <i class="bi bi-dash"></i>
        </button>
        <span class="qty-value">${p.qty}</span>
        <button class="qty-btn increase" id="increase" data-product-id="${p.id}" 
        title="Aumentar quantidade"><i class="bi bi-plus add-btn"></i></button>
    </div>
    <button class="cart-product-remove" data-product-id="${p.id}" 
    title="Remover produto"><i class="bi bi-trash3"></i></button>
  </div>
`).join('');

  cartList.innerHTML = html;

 
  const subtotal = cart.reduce((sum, p) => sum + (p.price * p.qty), 0);
  const delivery = cart.length ? 8.90 : 0; 
  const total = subtotal + delivery;
  summarySubtotal && (summarySubtotal.textContent = `R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}`);
  summaryDelivery && (summaryDelivery.textContent = `R$ ${delivery.toLocaleString('pt-BR', {minimumFractionDigits:2})}`);
  summaryTotal && (summaryTotal.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits:2})}`);
}


window.addEventListener('DOMContentLoaded', () => {
  renderCart();


  const clearBtn = document.getElementById('cart-clear-btn');
  clearBtn && clearBtn.addEventListener('click', clearCart);


//   const finishBtn = document.getElementById('cart-finish-btn');
//   finishBtn && finishBtn.addEventListener('click', () => {
//     alert('Em breve: checkout e pagamento!');
//   });


  const cartList = document.getElementById('cart-list');
  if (cartList) {
    cartList.addEventListener('click', function(e) {

      const btnIncrease = e.target.closest('.qty-btn.increase');
      if (btnIncrease) {
        const pid = btnIncrease.dataset.productId;
        updateQty(pid, 1);
        return;
      }

      const btnDecrease = e.target.closest('.qty-btn.decrease');
      if (btnDecrease) {
        const pid = btnDecrease.dataset.productId;
        updateQty(pid, -1);
        return;
      }

      const btnRemove = e.target.closest('.cart-product-remove');
      if (btnRemove) {
        const pid = btnRemove.dataset.productId;
        removeFromCart(pid);
        return;
      }
    });
  }


    const finishBtn = document.getElementById('cart-finish-btn');
    finishBtn && finishBtn.addEventListener('click', () => {
    
    const cart = getCart();
    
    if (!cart.length) {
        showToast('Seu carrinho está vazio!');
        return;
    }
    
    const donanaNumber = '5562993512201';
    const donanaNumber2 = '5521983398168'; 

    const subtotal = cart.reduce((sum, p) => sum + (p.price * p.qty), 0);
    const delivery = cart.length ? 8.90 : 0;
    const total = subtotal + delivery;

    
    const waLines = [
        '*🍬 Pedido Delícias da Donana* 🥘🧆',
        '',
        'Olá, Donana! Quero fazer um pedido delicioso 😋:',
        '',
        ...cart.map((p, i) => `*${i+1}. ${p.name}*  —  ${p.qty} x R$ ${p.price.toLocaleString('pt-BR', {minimumFractionDigits:2})} = R$ ${(p.qty*p.price).toLocaleString('pt-BR', {minimumFractionDigits:2})}`),
        '',
        `*Subtotal:* R$ ${subtotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}`,
        `*Entrega:* R$ ${delivery.toLocaleString('pt-BR', {minimumFractionDigits:2})}`,
        `*Total:* R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits:2})}`,
        '',
        'Por favor, me envie os detalhes para pagamento 😊',
        'Ansioso(a) para receber essas delícias!',
        '',
        '',
        ];

        const waText = waLines.join('\n');
        const waLink = `https://api.whatsapp.com/send?phone=${donanaNumber}&text=${encodeURIComponent(waText)}`;

        window.open(waLink, '_blank');
    });
});

