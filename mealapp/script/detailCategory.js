let data = [];

const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
const category = getParameterByName('category');

const fetchData = async () => {
    try {
        const category = getParameterByName('category');
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        return response.data.meals; 
    } catch (error) {
        console.error('Error:', error);
    }
}

const initMeals = async () => {
    data = await fetchData();

    const mealName = document.querySelector('.meal-name');
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    mealName.innerHTML = formattedCategory;

    const currentMeal = document.querySelector('.current-meals');
    currentMeal.classList.add('slide-animation');

    const variantMeals = document.querySelector('.variant-meals');
    data.map((meal) => {
        const card = document.createElement('div');
        card.className = 'card relative grid h-80 w-full max-w-72 flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700 shadow-xl hover:scale-110 transition-all duration-700 slide-animation';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-[url(\'' + meal.strMealThumb + '\')] bg-cover bg-clip-border bg-center text-gray-700 shadow-none';

        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50';
        overlay.setAttribute('data-id-meal', meal.idMeal); // Set data-id-meal attribute here
        imgContainer.appendChild(overlay);

        const content = document.createElement('div');
        content.className = 'relative p-6 px-6 py-14 md:px-12';

        const title = document.createElement('h2');
        title.className = 'mb-6 block text-3xl font-medium leading-[1.5] tracking-normal text-white';
        title.textContent = meal.strMeal;

        content.appendChild(title);
        card.appendChild(imgContainer);
        card.appendChild(content);

        card.addEventListener('click', () => {
            const idMeal = overlay.getAttribute('data-id-meal');
            window.location.href = `detailFood.html?idMeal=${idMeal}`;
        });

        variantMeals.appendChild(card);
    });
};

initMeals();