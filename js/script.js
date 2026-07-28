"use strict";

const title = document.getElementsByTagName('h1')[0].textContent
// console.log('title: ', title);

const btnStart = document.getElementsByClassName('handler_btn')[0].textContent
const btnReset = document.getElementsByClassName('handler_btn')[1].textContent
console.log('btnStart: ', btnStart);
console.log('btnReset: ', btnReset);

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
    appData.getTitle();
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
    while (true) {
      input = prompt();

      // Для строковых полей: проверяем, что в строке нет «голых» цифр
      if (typeof input === "string") {
        if (/\d/.test(input)) {
          console.log(
            "Ошибка: здесь должен быть текст, а не цифры. Попробуйте ещё.",
          );
          continue;
        }
      }
      // Для числовых полей: проверяем, что ввод можно преобразовать в число
      else if (typeof input === "number") {
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
          // "     oooooIIIIIOOOoo-123",
        ).trim();

        if (!title) {
          alert(
            "Название не может быть пустым. Пожалуйста, введите корректное название.",
          );
          titleStr();
          return;
        } else if (!/\D+/.test(title)) {
          alert("Ошибка: здесь должен быть текст, а не цифры. Попробуйте ещё.");
          titleStr();
          return;
        }
      } while (!appData.isString(title) && appData.isText(title));
      appData.title = title;
    };
    titleStr();

    for (let i = 0; i < 2; i++) {
      let name;
      const nameStr = () => {
        do {
          name = prompt(
            `Какие типы экранов нужно разработать: простые, сложные или интерактивные? Тип ${i + 1} экрана:`,
          ).trim();

          if (!name) {
            alert(
              "Тип экрана не может быть пустым. Пожалуйста, введите корректное название.",
            );
            nameStr();
            return;
          } else if (!/\D+/.test(name)) {
            alert(
              "Ошибка: здесь должен быть текст, а не цифры. Попробуйте ещё.",
            );
            nameStr();
            return;
          }
        } while (!name);
        return name;
      };
      name = nameStr();
      console.log(`Тип ${i + 1} экрана "${name}". Typeof: `, typeof name);

      let price;
      const priceNum = () => {
        do {
          price = prompt(
            `Сколько будет стоить ${i + 1} экран "${name}"?`,
            20000,
          ).trim();
          price = Number(price);
        } while (!appData.isNumber(price));
        return price;
      };
      price = priceNum();
      console.log(
        `Сколько будет стоить ${i + 1} экран "${name}"?: ${price} руб.`,
        typeof price,
      );

      appData.screens.push({
        id: i + 1,
        name: name,
        price: price,
      });

      console.log("appData.screens: ", appData.screens);
    }

    for (let i = 0; i < 2; i++) {
      let name;
      do {
        name = prompt("Какой дополнительный тип услуги нужен?").trim();

        if (!name) {
          alert("Название услуги не может быть пустым.");
        } else if (/\d/.test(name)) {
          alert("Ошибка: название услуги не должно содержать цифры.");
          name = "";
        }
      } while (!name);
      console.log(
        `Какой дополнительный тип услуги нужен: ${name}. Typeof: `,
        typeof name,
      );

      let price;
      do {
        price = +prompt("Сколько это будет стоить?").trim();
        if (!appData.isNumber(price)) {
          alert("Ошибка: цена должна быть числом.");
        }
      } while (!appData.isNumber(price));
      console.log(
        `Стоимость ${i + 1} услуги "${name}: ${price} руб. Typeof `,
        typeof price,
      );

      appData.services.push({ id: i + 1, name: name, price: price });
      console.log("appData.services: ", appData.services);
    }

    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
  },
  addPrices: function () {
    // for (let screen of appData.screens) {
    //   appData.screenPrice += +screen.price;
    // }
    appData.screenPrice = appData.screens.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
    // for (let key of appData.services) {
    //   appData.allServicePrices += +key.price;
    // }
    appData.allServicePrices = appData.services.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
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
            `Как называется ваш проект? ${appData.title}, `,
            typeof appData.title,
          );
        } else {
          console.log(`${key}:  ${appData[key]}`);
        }
      }
    }
    console.log("Typeof array ", Array.isArray(appData.screens));
  },
};

appData.start();
