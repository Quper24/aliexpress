document.addEventListener('DOMContentLoaded', () => {

	const search = document.querySelector('.search');
	const cartBtn = document.getElementById('cart');
	const wishlistBtn = document.getElementById('wishlist');
	const cart = document.querySelector('.cart');
	const categoryList = document.querySelector('.category-list');
	const goodsWrapper = document.querySelector('.goods-wrapper');
	const cartWrapper = document.querySelector('.cart-wrapper');
	const cartCounter = cartBtn.querySelector('.counter');
	const wishlistCounter = wishlistBtn.querySelector('.counter');

	let wishlist = [];
	let goodsCart = {};

	const loading = () => {
		goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
		</div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`;
	};

	const createCardGoods = (id, title, price, img) => {

		const card = document.createElement('div');
		card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
		card.innerHTML = `<div class="card mx-sm-0">
							<div class="card-img-wrapper">
								<img class="card-img-top" src="${img}" alt="${title}">
								<button class="card-add-wishlist ${wishlist.indexOf(id) + 1 ? 'active' : ''}" 
									data-goods-id="${id}"></button>
							</div>
							<div class="card-body justify-content-between">
								<a href="#" class="card-title">${title}</a>
								<div class="card-price">${price} ₽</div>
								<div>
									<button class="card-add-cart" 
										data-goods-id="${id}">Добавить в корзину</button>
								</div>
							</div>
						</div>`;
		return card;
	};

	const createCartGoods = (id, title, price, img) => {

		const card = document.createElement('div');
		card.className = 'goods';
		card.innerHTML = `<div class="goods-img-wrapper">
							<img class="goods-img" src="${img}" alt="${title}">
						</div>
						<div class="goods-description">
							<h2 class="goods-title">${title}</h2>
							<p class="goods-price">${price} ₽</p>
						</div>
						<div class="goods-price-count">
							<div class="goods-trigger">
								<button class="goods-add-wishlist ${wishlist.indexOf(id) + 1 ? 'active' : ''}"
									data-goods-id="${id}"></button>
								<button class="goods-delete" data-goods-id="${id}"></button>
							</div>
							<div class="goods-count">1</div>
						</div>`;
		return card;
	};

	const renderCard = items => {
		goodsWrapper.textContent = '';
		if (items.length) {
			items.forEach(({ id, title, price, imgMin }) =>
				goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin)));
		} else {
			goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по Вашему запросу. Пожалуйста, попробуйте поискать снова.';
		}
	};

	const renderCart = items => {
		cartWrapper.textContent = '';
		if (items.length) {
			items.forEach(({ id, title, price, imgMin }) =>
				cartWrapper.appendChild(createCartGoods(id, title, price, imgMin)));
		} else {
			cartWrapper.innerHTML = `<div id="cart-empty">
										Ваша корзина пока пуста
									</div>`;
		}
	};

	const randomSort = items => items.sort(() => Math.random() - 0.5);

	const showGoodsCart = goods => goods.filter(good => goodsCart.hasOwnProperty(good.id));

	const closeCart = event => {
		const target = event.target;
		if (target.classList.contains('cart-close') || target.classList.contains('cart')) {
			cart.style.display = 'none';
		}

	};

	const openCart = () => {
		cart.style.display = 'flex';
		getGoods(renderCart, showGoodsCart);
	};

	const getGoods = (handler, filter) => {
		//loading();
		fetch('db/db.json')
			.then(response => response.json())
			.then(filter)
			.then(handler);

	};

	const choiceCategory = event => {

		const target = event.target;

		if (target.classList.contains('category-item')) {
			const category = target.dataset.category;
			getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
		}
	};

	const searchGoods = event => {

		event.preventDefault();
		const input = event.target.elements.searchGoods;

		if (input.value.trim() !== '') {
			const searchString = new RegExp(input.value, 'i');
			getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
		} else {
			search.classList.add('error');
			setTimeout(() => {
				search.classList.remove('error');
			}, 2000);
		}

		input.value = '';

	};

	const checkCount = () => {
		wishlistCounter.textContent = wishlist.length;
		cartCounter.textContent = Object.keys(goodsCart).length;
	};


	const storageQuery = post => {
		if (post) {
			localStorage.setItem('wishlist', JSON.stringify(wishlist));
		} else {
			if (localStorage.getItem('wishlist')) {
				wishlist = JSON.parse(localStorage.getItem('wishlist'));
				checkCount();
			}
		}
	};

	function getCookie(name) {
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	const cookieQuery = post => {
		if (post) {
			document.cookie = `goodsCart=${JSON.stringify(goodsCart)}; max-age=86400e3`;
		} else {
			if (getCookie('goodsCart')) {
				goodsCart = JSON.parse(getCookie('goodsCart'));
				checkCount();
			}
		}
	};

	const toggleWishList = (id, elem) => {
		if (wishlist.indexOf(id) + 1) {
			wishlist.splice(wishlist.indexOf(id), 1);
			elem.classList.remove('active');
		} else {
			wishlist.push(id);
			elem.classList.add('active');
		}
		checkCount();
		storageQuery(true);
	};

	const addCart = id => {
		if (goodsCart[id]) {
			goodsCart[id] += 1;
		} else {
			goodsCart[id] = 1;
		}
		checkCount();
		cookieQuery(true);
		console.log(goodsCart);
	};


	const handlerGoods = event => {
		const target = event.target;

		if (target.classList.contains('card-add-wishlist')) {
			toggleWishList(target.dataset.goodsId, target);
		}

		if (target.classList.contains('card-add-cart')) {
			addCart(target.dataset.goodsId);
		}
	};

	const showWishList = () => {
		getGoods(renderCard, goods => goods.filter(good => wishlist.indexOf(good.id) + 1));
	};


	cartBtn.addEventListener('click', openCart);
	cart.addEventListener('click', closeCart);
	categoryList.addEventListener('click', choiceCategory);
	search.addEventListener('submit', searchGoods);
	goodsWrapper.addEventListener('click', handlerGoods);
	wishlistBtn.addEventListener('click', showWishList);


	getGoods(renderCard, randomSort);
	storageQuery();
	cookieQuery();
});

/*
ДЗ
Основная
Все повторить за мной

Дополнительная, но учитывая все что мы узнали на воркшопе вы сможете сделать, это вывести количество товаров вместо цифры 1

И Дополнительная сложная разобраться со спиннером, чтобы в корзине работал спиннер пока товары загружаются и он никак не влиял на спиннер на странице
вариантов решения много

Что сделаем завтра
выведем сумму товаров, еще не знаю каким способом лучше
Реализуем удаление товаров из корзины
*/
