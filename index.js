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
    appData.getValidInput(appData.title);
    appData.getTitle(appData.title);
    appData.addPrices();
    appData.getFullPrice(appData.screenPrice, appData.allServicePrices);
    appData.getServicePercentPrice(appData.fullPrice);

    appData.logger();
  },
  isNumber: function (num) {
    // Преобразуем в число, отбросив нечисловые символы
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  isString: function (value) {
    const isStr = Object.prototype.toString.call(value) === "[object String]";
    return isStr;
  },
  isText: function (input) {
    // один или более символов, не являющихся цифрами
    const ifSimbolNotNum = /^[^0-9]+$/;
    return ifSimbolNotNum.test(input);
  },
  getValidInput: function (input) {
    // let input;

    while (true) {
      input = prompt();

      // Для строковых полей: проверяем, что в строке нет «голых» цифр
      if (input === "string") {
        if (/\d/.test(input)) {
          console.log(
            "Ошибка: здесь должен быть текст, а не цифры. Попробуйте ещё.",
          );
          continue;
        }
      }
      // Для числовых полей: проверяем, что ввод можно преобразовать в число
      else if (input === "number") {
        if (!/^\d+$/.test(input)) {
          console.log("Ошибка: здесь должно быть число. Попробуйте ещё.");
          continue;
        }
      }

      // Если все проверки пройдены, возвращаем корректное значение
      return input;
    }
  },
  asking: function () {
    const titleStr = () => {
      let title;
      do {
        title = prompt(
          "Как называется Ваш проект?",
          "     oooooIIIIIOOOoo-123",
        ).trim();

        if (title === "") {
          alert(
            "Название не может быть пустым. Пожалуйста, введите корректное название.",
          );
          titleStr();
          return;
        }
      } while (!appData.isString(title) && appData.isText(title));
      appData.title = title;
    };
    titleStr();

    for (let i = 0; i < 2; i++) {
      let name;
      name = prompt(
        "Какие типы экранов нужно разработать: простые, сложные или интерактивные?",
        "простые",
        "сложные",
      );

      let price = 0;
      do {
        price = +prompt(
          "Сколько будет стоить данная работа?",
          20000,
          10000,
        ).trim();
      } while (!appData.isNumber(price));

      appData.screens.push({ id: i, name: name, price: price });
    }

    for (let i = 0; i < 2; i++) {
      let name = prompt(
        "Какой дополнительный тип услуги нужен?",
        "Простые",
        "Сложные",
      ).trim();
      let price = 0;

      do {
        price = prompt("Сколько это будет стоить?", 1000, 2000).trim();
      } while (!appData.isNumber(price));

      appData.services.push({ id: i, name: name, price: price });
    }

    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
  },
  addPrices: function () {
    for (let screen of appData.screens) {
      appData.screenPrice += +screen.price;
    }
    for (let key of appData.services) {
      appData.allServicePrices += +key.price;
    }
  },
  getTitle: function () {
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
      if (typeof appData[key] != "function") {
        if (key === "title") {
          console.log(
            `Название сохранено: ${appData.title}, `,
            typeof appData.title,
          );
        } else {
          console.log(`${key}:  ${appData[key]}`);
        }
      }
    }
  },
};

appData.start();
