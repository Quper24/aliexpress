document.addEventListener('DOMContentLoaded', () => {

	const search = document.querySelector('.search');
	const cartBtn = document.getElementById('cart');
	const whishlistBtn = document.getElementById('whishlist');
	const cart = document.querySelector('.cart');
	const categoryList = document.querySelector('.category-list');

	const goodsWrapper = document.querySelector('.goods-wrapper');

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
								<button class="card-add-wishlist"></button>
							</div>
							<div class="card-body justify-content-between">
								<a href="#" class="card-title">${title}</a>
								<div class="card-price">${price} ₽</div>
								<div>
									<button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
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
			goodsWrapper.innerHTML = '❌ Извините, мы не нашли товаров по Вашему запросу. Пожалуйста, попробуйте поискать снова.';
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


	cartBtn.addEventListener('click', openCart);
	cart.addEventListener('click', closeCart);
	categoryList.addEventListener('click', choiceCategory);
	search.addEventListener('submit', searchGoods);

	getGoods(renderCard, randomSort);
});



