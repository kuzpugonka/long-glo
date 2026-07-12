"use strict";

const title = prompt("Как называется Ваш проект?");
const screens = prompt(
  "Какие типы экранов нужно разработать: простые, сложные или интерактивные?",
);
const screenPrice = +prompt("Сколько будет стоить данная работа?");
const adaptive = confirm("Нужен ли адаптив на сайте?");
const service1 = prompt("Какой дополнительный тип услуги нужен?");
const servicePrice1 = +prompt("Сколько это будет стоить?");
const service2 = prompt("Какой дополнительный тип услуги нужен?");
const servicePrice2 = +prompt("Сколько это будет стоить?");
const rollback = 15;
let fullPrice = 0;
let allServicePrices = 0;
let servicePercentPrice = 0;

const getTitle = (a) => {
  let trimmedTitle = title.trimStart();
  if (trimmedTitle.length === 0) {
    return "";
  }
  const firstChar = trimmedTitle.charAt(0).toUpperCase();
  const restOfString = trimmedTitle.slice(1).toLowerCase();

  return firstChar + restOfString;
};
getTitle(title);

const getRollbackMessage = (price) => {
  if (price >= 30000) {
    return "Даем скидку в 10%";
  } else if (price >= 15000 && price < 30000) {
    return "Даем скидку в 5%";
  } else if (price >= 0 && price < 15000) {
    return "Скидка не предусмотрена";
  } else {
    return "Что-то пошло не так";
  }
};

const getAllServicePrices = function (a, b) {
  const sum = a + b;
  return sum;
};

allServicePrices = getAllServicePrices(servicePrice1, servicePrice2);

function getFullPrice(a, b) {
  const sum = a + b;
  return sum;
}
fullPrice = getAllServicePrices(screenPrice, allServicePrices);

const getServicePercentPrice = () => {  
  return Math.ceil(fullPrice - fullPrice * (rollback / 100)); 
}
servicePercentPrice = getServicePercentPrice();

const showTypeOf = (variable) => {
  console.log(variable, typeof variable);
};

showTypeOf(title);
showTypeOf(screenPrice);
showTypeOf(adaptive);

console.log(typeof title);
console.log(typeof fullPrice);
console.log(typeof adaptive);

console.log(screens.length);
console.log("servicePercentPrice: ", servicePercentPrice);

console.log(
  "Стоимость верски экранов " +
    screenPrice +
    " руб. Стоимость разработки сайта " +
    servicePercentPrice +
    " руб.",
);

console.log(getRollbackMessage(fullPrice));
console.log(allServicePrices);
console.log(fullPrice);
console.log(getTitle(title));
console.log(servicePercentPrice);
