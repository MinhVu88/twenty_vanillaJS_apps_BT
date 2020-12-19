// function calculate() {
//     // make a GET request to items.json using the fetch api & retrieve the data from the json file
//     fetch('items.json').then(response => response.json()).then(data => document.body.innerHTML = data[0].text);
// }

const currency_1 = document.querySelector('#currency-1');

const currency_2 = document.querySelector('#currency-2');

const amount_1 = document.querySelector('#amount-1');

const amount_2 = document.querySelector('#amount-2');

const xchange_rate = document.querySelector('#rate');

const xchange = document.querySelector('#switch');

// this func fetches exchange rates & use that data to update the dom
function calculate() {
    const c1 = currency_1.value;

    const c2 = currency_2.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${c1}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);

            const rate = data.rates[c2];

            xchange_rate.innerText = `1 ${c1} = ${rate} ${c2}`;

            amount_2.value = (amount_1.value * rate).toFixed(2);
        });
}

// event handlers
currency_1.addEventListener('change', calculate);

currency_2.addEventListener('change', calculate);

amount_1.addEventListener('input', calculate);

amount_2.addEventListener('input', calculate);

xchange.addEventListener('click', () => {
    const temp = currency_1.value; // temp holds the value of currency_1

    currency_1.value = currency_2.value; // currency_1 holds the value of currency_2

    currency_2.value = temp; // currency_2 holds the value of temp/currency_1

    calculate();
});

calculate();