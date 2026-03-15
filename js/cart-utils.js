//ОБЩИЙ ФАЙЛ ДЛЯ ВСЕХ СТРАНИЦ   

function getCart() {
    return JSON.parse(localStorage.getItem('reliquary_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('reliquary_cart', JSON.stringify(cart));
}

function addToCart(name, price, img) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }
    saveCart(cart);
    showToast('✓ ' + name + ' добавлен в корзину');
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

function showToast(msg) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function getProductName(article) {
    // 1. data-name
    if (article.dataset.name) return article.dataset.name;
    // 2. текст первого .center
    const center = article.querySelector('.center:first-child');
    if (center) return center.textContent.trim();
    // 3. ссылка внутри
    const link = article.querySelector('a');
    if (link) return link.textContent.trim();
    // 4. запасной вариант
    return 'Товар';
}

function getProductPrice(article) {
    const priceEl = article.querySelector('.price');
    if (!priceEl) return 0;
    const text = priceEl.cloneNode(true);
    const s = text.querySelector('s');
    if (s) s.remove();
    return parseInt(text.textContent.replace(/\D/g, '')) || 0;
}

//вешаем обработчики на все кнопки "добавить в корзину"
document.addEventListener('DOMContentLoaded', function () {

    //добавляем бейдж к ссылке корзины
    const cartLink = document.querySelector('.nav a[href="cart.html"]');
    if (cartLink) {
        const badge = document.createElement('span');
        badge.id = 'cart-badge';
        cartLink.appendChild(badge);
    }

    updateCartBadge();

    // обработчики кнопок на карточках
    document.querySelectorAll('article button').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const article = btn.closest('article');
            const name = getProductName(article);
            const img = article.querySelector('img') ? article.querySelector('img').src : '';
            const price = getProductPrice(article);
            
            addToCart(name, price, img);
        });
    });

    // кнопка на странице товара
    const btnCart = document.querySelector('.btn-cart');
    if (btnCart) {
        btnCart.addEventListener('click', function () {
            const name = document.querySelector('.product-title') ? document.querySelector('.product-title').textContent.trim() : 'Товар';
            const img = document.getElementById('main-img') ? document.getElementById('main-img').src : '';
            const priceEl = document.querySelector('.price-current');
            const price = priceEl ? parseInt(priceEl.textContent.replace(/\D/g, '')) || 0 : 0;
            addToCart(name, price, img);
        });
    }

});
