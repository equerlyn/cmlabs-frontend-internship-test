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
const idMeal = getParameterByName('idMeal');

const fetchData = async () => {
    try {
        const idMeal = getParameterByName('idMeal');
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
        return response.data.meals; 
    } catch (error) {
        console.error('Error:', error);
    }
}
const initFood = async () => {
    data = await fetchData();
    const backButton = $('.back-button');
    const category = data[0].strCategory.toLowerCase();
    backButton.attr('href', 'detailCategory.html?category=' + category);
    if (data.length > 0) {
        const meal = data[0];
        const formattedSteps = formattedInstructions(meal.strInstructions);
        const mealImage = document.querySelector('.meal-image');
        mealImage.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="lg:w-92 lg:h-96 rounded-lg shadow-xl">
        `;

        const mealName = document.querySelector('.meal-name');
        mealName.classList.add('lg:text-5xl', 'text-2xl', 'font-bold', 'primary-variant', 'mb-1');
        mealName.innerHTML = `${meal.strMeal}`

        const mealCategoryArea = document.querySelector('.meal-category-area');
        mealCategoryArea.querySelector('.meal-category').innerHTML = meal.strCategory;
        mealCategoryArea.querySelector('.meal-area').innerHTML = meal.strArea;

        const ingredientsList = document.querySelector('.meal-ingredients ul');
        ingredientsList.innerHTML = generateIngredientList(meal);
        ingredientsList.classList.add('list-disc', 'list-inside');

        const mealInstructions = document.querySelector('.meal-instructions ul');
        mealInstructions.classList.add('list-decimal', 'list-inside');

        formattedSteps.split('<br>').map((step, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${step}`;
            mealInstructions.appendChild(listItem);
        });

        const mealSource = document.querySelector('.meal-source div');
        mealSource.innerHTML = `
            <iframe class="w-full h-96" src="${meal.strSource}" allowfullscreen frameborder="0"></iframe>
        `;
    }
};


const generateIngredientList = (meal) => {
    let ingredientList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal['strIngredient' + i];
        const measure = meal['strMeasure' + i];
        
        if (ingredient && measure) {
            ingredientList += `<li>${measure} ${ingredient}</li>`;
        }
    }
    return ingredientList;
};

const formattedInstructions = (instructions) => {
    if (instructions.includes('STEP')) {
        const stepsArray = instructions.split(/\bSTEP \d+\b/).filter(Boolean);
        const trimmedSteps = stepsArray.map(step => step.trim());
        return trimmedSteps.map((step) => `${step}`).join('<br>');
    } else {
        const formatted = instructions.replace(/(\r\n\r\n|\r\n)/g, '<br>').trim();
        return formatted.startsWith('<br>') ? formatted.slice(4) : formatted;
    }
};

initFood();