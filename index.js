"use strict";

const appData = {
  title: "",
  screens: "",
  screenPrice: 0,
  adaptive: true,
  rollback: 10,
  allServicePrices: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  service1: "",
  service2: "",
  asking: function () {
    appData.title = prompt(
      "Как называется Ваш проект?",
      "     oooooIIIIIOOOoo",
    );
    appData.screens = prompt(
      "Какие типы экранов нужно разработать: простые, сложные или интерактивные?",
      "простые",
    );

    do {
      appData.screenPrice = +prompt(
        "Сколько будет стоить данная работа?",
        20000,
      ).trim();
    } while (!appData.isNumber(appData.screenPrice));

    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
  },
  isNumber: function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  getTitle: function (a) {
    let trimmedTitle = appData.title.trimStart();
    if (trimmedTitle.length === 0) {
      return "";
    }

    return (
      trimmedTitle.charAt(0).toUpperCase() + trimmedTitle.slice(1).toLowerCase()
    );
  },
  getAllServicePrices: function () {
    let sum = 0;
    for (let i = 0; i < 2; i++) {
      let price = 0;
      if (i === 0) {
        appData.service1 = prompt(
          "Какой дополнительный тип услуги нужен?",
          "Простые",
        ).trim();
      } else if (i === 1) {
        appData.service2 = prompt(
          "Какой дополнительный тип услуги нужен?",
          "Сложные",
        ).trim();
      }
      do {
        price = prompt("Сколько это будет стоить?").trim();
      } while (!appData.isNumber(price));
      sum += +price;
    }
    return sum;
  },
  getFullPrice: function (a, b) {
    return +a + b;
  },
  getRollbackMessage: function (price) {
    if (price >= 30000) {
      return "Даем скидку в 10%";
    } else if (price >= 15000 && price < 30000) {
      return "Даем скидку в 5%";
    } else if (price >= 0 && price < 15000) {
      return "Скидка не предусмотрена";
    } else {
      return "Что-то пошло не так";
    }
  },
  getServicePercentPrice: function () {
    return Math.ceil(
      appData.fullPrice - appData.fullPrice * (appData.rollback / 100),
    );
  },
  start: function () {
    appData.asking();
    appData.title = appData.getTitle(appData.title);
    appData.allServicePrices = appData.getAllServicePrices();
    appData.fullPrice = appData.getFullPrice(
      appData.screenPrice,
      appData.allServicePrices,
    );
    appData.servicePercentPrice = appData.getServicePercentPrice(
      appData.fullPrice,
    );
    appData.logger();
  },
  logger: function () {
    for (let key in appData) {
      console.log(appData[key]);
    }
  },
};

appData.start();

/* TODO
1) Перенести все функции в объект (сделать их методами объекта) +

2) Создать в объекте метод start и перенести в него вызов метода asking и
 переопределение свойств. Вне самого объекта запускаем только метод start 
 который в нужном порядке выполнит все действия. +

3) Создать в объекте метод logger который будет выводить в консоль необходимую
 информацию. Данный метод запускаем в самом конце метода start (после того как 
 все расчеты уже были произведены) +

4) Вывести в консоль из метода logger все свойства и методы объекта appData
 с помощью цикла for in +

Таким образом вне объекта теперь должен быть только вызов метода start( ) +

Поправить весь проект, ошибок в консоли быть не должно, а в консоль должна 
выводится необходимая информация!*/ +
