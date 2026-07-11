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
const fullPrice = screenPrice + servicePrice1 + servicePrice2;
const servicePercentPrice = Math.ceil(fullPrice - fullPrice * (rollback / 100));

const showTypeOf = (variable) => {
  console.log(variable, typeof variable);
};

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
  const allServicePrices = a + b;
  return allServicePrices;
};

showTypeOf(title);
showTypeOf(screenPrice);
showTypeOf(adaptive);

console.log(getRollbackMessage(fullPrice));
console.log(getAllServicePrices(servicePrice1, servicePrice2));

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
