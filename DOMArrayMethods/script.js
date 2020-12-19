const main = document.querySelector('#main');

const addUserBtn = document.querySelector('#add-user');

const doubleWealthBtn = document.querySelector('#double-wealth');

const millionairesBtn = document.querySelector('#millionaires');

const richestBtn = document.querySelector('#sort-by-richest');

const calWealthBtn = document.querySelector('#calculate-wealth');

let data = [];

// fetch random users & add money props
async function getRandomUser() {
    const response = await fetch('https://randomuser.me/api');

    const data = await response.json();

    console.log(data);

    // access the returned data's results array from the api that contains the name object
    const firstName = data.results[0].name.first;

    const lastName = data.results[0].name.last;
    
    const person = {
        name: `${firstName} ${lastName}`,
        wealth: Math.floor(Math.random() * 1000000)
    }

    console.log(person);

    addData(person);
};

// double people's money (#2 - MAP())
function doubleWealth() {
    // for each iteration inside map(), an object is returned, which's a copy of the person object (using spread operator)
    // this time, the wealth prop is doubled
    data = data.map(person => {return {...person, wealth: person.wealth * 2}});

    updateDOM();
};

// sort people by richest (#3: SORT(COMPARE FUNCTION))
function sortByRichest() {
    data.sort((a, b) => b.wealth - a.wealth); // b - a: descending (richest -> poorest)

    updateDOM();
};

// show millionaires only (#4: FILTER())
function showMillionaires() {
    data = data.filter(person => person.wealth >= 1000000);

    updateDOM();
};

// calculate a person's entire wealth (#5: REDUCE())
function calculateWealth() {
    const total_wealth = data.reduce((accumulator, person) => (accumulator += person.wealth), 0);

    console.log(formatMoney(total_wealth));

    const wealth_element = document.createElement('div');

    wealth_element.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(total_wealth)}</strong></h3>`;

    main.appendChild(wealth_element);
};

function addData(object) {
    data.push(object);

    updateDOM();
};

// defaultData -> if nothing's passed to the func, defaultData is used as its param
function updateDOM(defaultData = data) {
    // with each updateDOM() call, the main section where names & wealth are displayed is cleared
    // so new data can be displayed there
    main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';

    // #1: FOREACH()
    data.forEach(person => {
        const html_element = document.createElement('div');

        html_element.classList.add('person');

        html_element.innerHTML = `<strong>${person.name}</strong> ${formatMoney(person.wealth)}`;

        main.appendChild(html_element);
    });
};

// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
function formatMoney(number) {
    return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

getRandomUser();

getRandomUser();

getRandomUser();

// event handlers
addUserBtn.addEventListener('click', getRandomUser);

doubleWealthBtn.addEventListener('click', doubleWealth);

richestBtn.addEventListener('click', sortByRichest);

millionairesBtn.addEventListener('click', showMillionaires);

calWealthBtn.addEventListener('click', calculateWealth)