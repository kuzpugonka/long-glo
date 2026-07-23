"use strict";

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollback: 10,
  allServicePrices: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  services: [],
  start: function () {
    appData.asking();
    appData.addPrices();
    appData.getTitle(appData.title);
    appData.getFullPrice(appData.screenPrice, appData.allServicePrices);
    appData.getServicePercentPrice(appData.fullPrice);

    appData.logger();
  },
  isNumber: function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  asking: function () {
    appData.title = prompt(
      "Как называется Ваш проект?",
      "     oooooIIIIIOOOoo",
    );

    for (let i = 0; i < 2; i++) {
      let name = prompt(
        "Какие типы экранов нужно разработать: простые, сложные или интерактивные?",
        "простые",
      );
      let price = 0;

      do {
        price = +prompt("Сколько будет стоить данная работа?", 20000).trim();
      } while (!appData.isNumber(price));

      appData.screens.push({ id: i, name: name, price: price }); 
    }

    for (let i = 0; i < 2; i++) {
      let name = prompt(
        "Какой дополнительный тип услуги нужен?",
        "Простые",
      ).trim();
      let price = 0;

      do {
        price = prompt("Сколько это будет стоить?").trim();
      } while (!appData.isNumber(price));

      appData.services.push({ id: i, name: name, price: price });
    }

    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
  },
  addPrices: function () {
    for (let screen of appData.screens) {
      appData.screenPrice += +screen.price;
      console.log("appData.screenPrice: ", appData.screenPrice);
    }
    for (let key of appData.services) {
      appData.allServicePrices += +key.price;
    }
  },
  getTitle: function (a) {
    let trimmedTitle = appData.title.trimStart();
    if (trimmedTitle.length === 0) {
      return "";
    }

    appData.title =
      trimmedTitle.charAt(0).toUpperCase() +
      trimmedTitle.slice(1).toLowerCase();
  },
  getFullPrice: function (a, b) {
    appData.fullPrice = +a + b;
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
    appData.servicePercentPrice = Math.ceil(
      appData.fullPrice - appData.fullPrice * (appData.rollback / 100),
    );
  },

  logger: function () {
    for (let key in appData) {
      console.log(`${appData[key]}: `, appData[key]);
    }
  },
};

appData.start();
