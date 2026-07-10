"use strict";
/*
let title = "строка с названием проекта";
let screens =
  "строка с названиями типов экранов через запятую ('Простые, Сложные, Интерактивные')";
let screenPrice = 5;
let rollback = 15;
let fullPrice = 70000;
let adaptive = true;
const cashback = fullPrice * (rollback / 100);

console.log(typeof title);
console.log(typeof fullPrice);
console.log(typeof adaptive);

console.log(screens.length);
console.log(
  "Стоимость верстки экранов " + screenPrice + " рублей/долларов/гривен/юани",
);
console.log(
  "Стоимость разработки сайта " + fullPrice + " рублей/долларов/гривен/юани",
);
console.log(screens.toLowerCase());
console.log(screens.split(" "));
console.log(
  "Процент отката посреднику за работу " +
    cashback +
    " рублей/долларов/гривен/юани",
);
*/
const title = prompt("Как называется Ваш проект?");
if (title != null) console.log("title: ", title);

const screens = prompt(
  "Какие типы экранов нужно разработать: простые, сложные или интерактивные?",
);
if (screens != null) console.log("screens: ", screens);

const screenPrice = +prompt("Сколько будет стоить данная работа?");
if (screenPrice != null) console.log("screenPrice: ", screenPrice);

const adaptive = confirm("Нужен ли адаптив на сайте?");
if (adaptive != null) console.log("adaptive: ", adaptive);

const service1 = prompt("Какой дополнительный тип услуги нужен?");
if (service1 != null) console.log("service1: ", service1);
const servicePrice1 = +prompt("Сколько это будет стоить?");
if (servicePrice1 != null)
  console.log("servicePrice1: ", servicePrice1 + " руб.");
const service2 = prompt("Какой дополнительный тип услуги нужен?");
if (service2 != null) console.log("service2: ", service2);
const servicePrice2 = +prompt("Сколько это будет стоить?");
if (servicePrice2 != null)
  console.log("servicePrice2: ", servicePrice2 + " руб.");

const fullPrice = screenPrice + servicePrice1 + servicePrice2;
console.log("fullPrice: ", fullPrice + " руб.");

const rollback = 15;
const servicePercentPrice = fullPrice - fullPrice * (rollback / 100);
console.log("servicePercentPrice: ", Math.ceil(servicePercentPrice) + " руб.");

if (fullPrice >= 30000) {
  console.log("Даем скидку в 10%");
} else if (fullPrice >= 15000) {
  console.log("Даем скидку в 5%");
} else if (fullPrice < 15000 && fullPrice > 0) {
  console.log("Скидка не предусмотрена");
} else {
  console.log("Что-то пошло не так");
}
