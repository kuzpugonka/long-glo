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
const servicePercentPrice = fullPrice - fullPrice * (rollback / 100);

if (fullPrice >= 30000) {
  console.log("Даем скидку в 10%");
} else if (fullPrice >= 15000 && fullPrice < 30000) {
  console.log("Даем скидку в 5%");
} else if (fullPrice >= 0 && fullPrice < 15000 ) {
  console.log("Скидка не предусмотрена");
} else {
  console.log("Что-то пошло не так");
}


if (title != null) console.log("title: ", title);
if (screens != null) console.log("screens: ", screens);
if (screenPrice != null) console.log("screenPrice: ", screenPrice);
if (adaptive != null) console.log("adaptive: ", adaptive);
if (service1 != null) console.log("service1: ", service1);
if (servicePrice1 != null)
  console.log("servicePrice1: ", servicePrice1 + " руб.");
if (service2 != null) console.log("service2: ", service2);
if (servicePrice2 != null)
  console.log("servicePrice2: ", servicePrice2 + " руб.");
console.log("fullPrice: ", fullPrice + " руб.");
console.log("servicePercentPrice: ", Math.ceil(servicePercentPrice) + " руб.");
