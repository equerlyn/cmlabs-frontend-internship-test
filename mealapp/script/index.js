const fetchData = async () => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        return response.data.categories;

    } catch (error) {
        console.error('Error:', error);
    }
}

const initCarousel = () => {
    const carouselContainer = document.querySelector('.relative.h-64.overflow-hidden.md\\:h-96');
    const maxImages = 5;
    let imagesAppended = 0;

    while (imagesAppended < maxImages) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('duration-1000', 'ease-in-out');
        carouselItem.setAttribute('data-carousel-item', '');

        const image = document.createElement('img');
        image.src = `./assets/meals${imagesAppended + 1}.jpeg`
        image.classList.add('absolute', 'w-full', 'h-full', 'object-cover');
        image.alt = `meals${imagesAppended + 1}`;

        const overlayText = document.createElement('div');
        overlayText.classList.add('absolute', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2', 'text-white', 'text-center');
        overlayText.innerHTML = `
        <i class='fas fa-pizza-slice' style='font-size:24px'></i>
        <i class='fas fa-hotdog' style='font-size:24px'></i>
        <i class='fas fa-hamburger' style='font-size:24px'></i>
        <i class='fas fa-drumstick-bite' style='font-size:24px'></i>
        <i class='fas fa-bacon' style='font-size:24px'></i>
        <h1 class="text-3xl font-bold mt-1">See All Delicious Food</h1>`

        const brightnessOverlay = document.createElement('div');
        brightnessOverlay.classList.add('absolute', 'inset-0', 'bg-black', 'opacity-50');

        carouselItem.appendChild(image);
        carouselItem.appendChild(brightnessOverlay);
        brightnessOverlay.appendChild(overlayText);
        carouselContainer.appendChild(carouselItem);

        imagesAppended++;
    }

    let currentIndex = 0;
    const carouselItems = document.querySelectorAll('[data-carousel-item]');
    const totalItems = carouselItems.length;

    const prevButton = document.querySelector('[data-carousel-prev]');
    const nextButton = document.querySelector('[data-carousel-next]');
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    const updateCarousel = () => {
        carouselItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.remove('hidden', 'translate-x-full');
            } else {
                item.classList.add('hidden', 'translate-x-full');
            }
        });
    };

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 3000);
}

const fetchCategory = async () => {
    const categories = await fetchData();
    const categoryContainer = document.querySelector('.category-container');
    categories.map((category) => {
        const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <div class="polaroid" data-category="${category.strCategory}">
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <div class="caption">${category.strCategory}</div>
                </div>
            `;

            item.addEventListener('click', () => {
                const category = item.querySelector('.polaroid').getAttribute("data-category").toLocaleLowerCase();
                window.location.href = `detailCategory.html?category=${category}`;
            });
            categoryContainer.appendChild(item);
        });
}

fetchCategory();
initCarousel();