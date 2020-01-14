document.addEventListener('DOMContentLoaded', () => {

	const search = document.querySelector('.search');
	const cartBtn = document.getElementById('cart');
	const whishlistBtn = document.getElementById('whishlist');
	const cart = document.querySelector('.cart');
	const categoryList = document.querySelector('.category-list');
	const goodsWrapper = document.querySelector('.goods-wrapper');
	const cartCounter = cartBtn.querySelector('.counter');
	const whishlistCounter = whishlistBtn.querySelector('.counter');

	let whishlist = [];

	const loading = () => {
		goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
		</div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`;
	};

	const createCardGoods = (id, title, price, img) => {

		const card = document.createElement('div');
		card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
		card.innerHTML = `<div class="card mx-sm-0">
							<div class="card-img-wrapper">
								<img class="card-img-top" src="${img}" alt="">
								<button class="card-add-wishlist ${whishlist.indexOf(id) + 1 ? 'active' : ''}" 
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


	const renderCard = items => {
		goodsWrapper.textContent = '';
		if (items.length) {
			items.forEach(({ id, title, price, imgMin }) =>
				goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin)));
		} else {
			goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по Вашему запросу. Пожалуйста, попробуйте поискать снова.';
		}
	};


	const randomSort = items => items.sort(() => Math.random() - 0.5);


	const closeCart = event => {
		const target = event.target;
		if (target.classList.contains('cart-close') || target.classList.contains('cart')) {
			cart.style.display = 'none';
		}

	};

	const openCart = () => {

		cart.style.display = 'flex';
	};


	const getGoods = (handler, filter) => {
		loading();
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
		whishlistCounter.textContent = whishlist.length;
	};


	const storageQuery = post => {
		if (post) {
			localStorage.setItem('whishlist', JSON.stringify(whishlist));
		} else {
			whishlist = JSON.parse(localStorage.getItem('whishlist'));
			checkCount();
		}
	};

	const toggleWishList = (id, elem) => {
		if (whishlist.indexOf(id) + 1) {
			whishlist.splice(whishlist.indexOf(id), 1);
			elem.classList.remove('active');
		} else {
			whishlist.push(id);
			elem.classList.add('active');
		}
		checkCount();
		storageQuery(true);
	};


	const handlerGoods = event => {
		const target = event.target;

		if (target.classList.contains('card-add-wishlist')) {
			toggleWishList(target.dataset.goodsId, target);
		}
	};

	const showWishList = () => {
		getGoods(renderCard, goods => goods.filter(good => whishlist.indexOf(good.id) + 1));
	};


	cartBtn.addEventListener('click', openCart);
	cart.addEventListener('click', closeCart);
	categoryList.addEventListener('click', choiceCategory);
	search.addEventListener('submit', searchGoods);
	goodsWrapper.addEventListener('click', handlerGoods);
	whishlistBtn.addEventListener('click', showWishList);

	getGoods(renderCard, randomSort);
	storageQuery();
	console.log(whishlist);
});


// Доп ДЗ 2
// 1) Заменить спиннер загрузки товаров можно взять с сайта https://loading.io/
// 2) Заменить сообщение "мы не нашли товаров по Вашему запросу", на картинку или анимацию

