"use strict";

let title;
let screens;
let screenPrice;
let adaptive;

const rollback = 10;
let allServicePrices;
let fullPrice;
let servicePercentPrice;
let service1;
let service2;

const isNumber = (num) => {
  return !isNaN(parseFloat(num)) && isFinite(num);
};

const asking = () => {
  title = prompt("Как называется Ваш проект?", "     oooooIIIIIOOOoo");
  screens = prompt(
    "Какие типы экранов нужно разработать: простые, сложные или интерактивные?",
    "простые",
  );

  do {
    screenPrice = +prompt("Сколько будет стоить данная работа?", 10000);
  } while (!isNumber(screenPrice));

  adaptive = confirm("Нужен ли адаптив на сайте?");
};

const getTitle = (a) => {
  let trimmedTitle = title.trimStart();
  if (trimmedTitle.length === 0) {
    return "";
  }
  const firstChar = trimmedTitle.charAt(0).toUpperCase();
  const restOfString = trimmedTitle.slice(1).toLowerCase();

  return firstChar + restOfString;
};

const getAllServicePrices = function () {
  let sum = 0;

  for (let i = 0; i < 2; i++) {
    if (i === 0) {
      service1 = prompt("Какой дополнительный тип услуги нужен?", "Простые");
    } else if (i === 1) {
      service2 = prompt("Какой дополнительный тип услуги нужен?", "Сложные");
    }

    sum += +prompt("Сколько это будет стоить?", 2000);
  }

  return sum;
};

function getFullPrice(a, b) {
  return a + b;
}

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

const getServicePercentPrice = () => {
  return Math.ceil(fullPrice - fullPrice * (rollback / 100));
};

const showTypeOf = (variable) => {
  console.log(variable, typeof variable);
};

asking();
title = getTitle(title);
allServicePrices = getAllServicePrices();
fullPrice = getFullPrice(screenPrice, allServicePrices);
servicePercentPrice = getServicePercentPrice(fullPrice);

showTypeOf(title);
showTypeOf(screenPrice);
showTypeOf(adaptive);

console.log(allServicePrices);

console.log(getRollbackMessage(fullPrice));
console.log(typeof title);
console.log(typeof screenPrice);
console.log(typeof adaptive);

console.log(screens.length);
console.log(servicePercentPrice);

console.log(
  `Стоимость верски экранов ${screenPrice} руб.
Стоимость разработки сайта ${servicePercentPrice} руб.`,
);
